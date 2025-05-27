import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ScrapingQueue } from "@/lib/queue/scraping";
import { PrismaClient } from "@prisma/client";
import { RAGPipeline } from "@/lib/rag/pipeline";

const prisma = new PrismaClient();
const ragPipeline = new RAGPipeline();
const scrapingQueue = new ScrapingQueue(
  process.env.REDIS_URL!,
  prisma,
  ragPipeline
);

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { url } = await req.json();
    if (!url) {
      return NextResponse.json(
        { error: "URL is required" },
        { status: 400 }
      );
    }

    const job = await scrapingQueue.addJob(url, session.user.id);
    
    return NextResponse.json({
      jobId: job.id,
      message: "Scraping job queued successfully",
    });
  } catch (error) {
    console.error("Error queueing scraping job:", error);
    return NextResponse.json(
      { error: "Failed to queue scraping job" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const jobId = searchParams.get("jobId");

    if (!jobId) {
      return NextResponse.json(
        { error: "Job ID is required" },
        { status: 400 }
      );
    }

    const status = await scrapingQueue.getJobStatus(jobId);
    return NextResponse.json(status);
  } catch (error) {
    console.error("Error getting job status:", error);
    return NextResponse.json(
      { error: "Failed to get job status" },
      { status: 500 }
    );
  }
} 