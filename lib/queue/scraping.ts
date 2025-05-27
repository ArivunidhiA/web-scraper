import { Queue, Worker, Job } from "bullmq";
import { Redis } from "ioredis";
import { EventbriteScraper } from "../scrapers/eventbrite";
import { BaseScraper } from "../scrapers/base";
import { PrismaClient } from "@prisma/client";
import { RAGPipeline } from "../rag/pipeline";

interface ScrapingJobData {
  url: string;
  userId: string;
}

interface ScrapingJobResult {
  eventId: string;
  status: "success" | "error";
  error?: string;
}

export class ScrapingQueue {
  private queue: Queue<ScrapingJobData, ScrapingJobResult>;
  private worker: Worker<ScrapingJobData, ScrapingJobResult>;
  private prisma: PrismaClient;
  private ragPipeline: RAGPipeline;
  private scrapers: BaseScraper[];

  constructor(
    redisUrl: string,
    prisma: PrismaClient,
    ragPipeline: RAGPipeline
  ) {
    const connection = new Redis(redisUrl);

    this.queue = new Queue<ScrapingJobData, ScrapingJobResult>("scraping", {
      connection,
    });

    this.worker = new Worker<ScrapingJobData, ScrapingJobResult>(
      "scraping",
      async (job) => this.processJob(job),
      { connection }
    );

    this.prisma = prisma;
    this.ragPipeline = ragPipeline;
    this.scrapers = [new EventbriteScraper()];

    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    this.worker.on("completed", (job) => {
      console.log(`Job ${job.id} completed successfully`);
    });

    this.worker.on("failed", (job, error) => {
      console.error(`Job ${job?.id} failed:`, error);
    });
  }

  async addJob(url: string, userId: string): Promise<Job<ScrapingJobData, ScrapingJobResult>> {
    return this.queue.add("scrape", { url, userId });
  }

  private async processJob(
    job: Job<ScrapingJobData, ScrapingJobResult>
  ): Promise<ScrapingJobResult> {
    const { url, userId } = job.data;

    try {
      // Find appropriate scraper
      const scraper = this.scrapers.find((s) => s.canHandleUrl(url));
      if (!scraper) {
        throw new Error(`No scraper available for URL: ${url}`);
      }

      // Scrape event data
      const scrapedEvent = await scraper.scrape(url);

      // Store in database
      const event = await this.prisma.event.create({
        data: {
          ...scrapedEvent,
          userId,
        },
      });

      // Process with RAG pipeline
      await this.ragPipeline.processDocument(
        {
          ...event,
          type: "event",
        },
        "event"
      );

      return {
        eventId: event.id,
        status: "success",
      };
    } catch (error) {
      console.error(`Error processing job ${job.id}:`, error);
      return {
        eventId: "",
        status: "error",
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  async getJobStatus(jobId: string): Promise<{
    status: "completed" | "failed" | "active" | "waiting";
    result?: ScrapingJobResult;
    error?: string;
  }> {
    const job = await this.queue.getJob(jobId);
    if (!job) {
      throw new Error(`Job ${jobId} not found`);
    }

    const state = await job.getState();
    const result = job.returnvalue;

    return {
      status: state,
      result: result,
      error: job.failedReason,
    };
  }

  async cleanup() {
    await this.queue.close();
    await this.worker.close();
  }
} 