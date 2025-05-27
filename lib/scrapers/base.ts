import { Browser, Page } from "playwright";
import { Event } from "@prisma/client";

export interface ScraperConfig {
  maxRetries: number;
  retryDelay: number;
  timeout: number;
  userAgent?: string;
}

export interface ScrapedEvent {
  name: string;
  description?: string;
  startDate: Date;
  endDate?: Date;
  location: {
    type: "physical" | "virtual";
    address?: string;
    url?: string;
  };
  host: {
    name: string;
    email?: string;
    website?: string;
  };
  sourceUrl: string;
  platform: string;
  pricing?: {
    type: "free" | "paid";
    amount?: number;
    currency?: string;
  };
  images: string[];
  tags: string[];
  metadata?: Record<string, any>;
}

export abstract class BaseScraper {
  protected browser: Browser | null = null;
  protected config: ScraperConfig;

  constructor(config: Partial<ScraperConfig> = {}) {
    this.config = {
      maxRetries: 3,
      retryDelay: 1000,
      timeout: 30000,
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      ...config,
    };
  }

  abstract getPlatform(): string;
  abstract canHandleUrl(url: string): boolean;
  abstract scrape(url: string): Promise<ScrapedEvent>;

  protected async initializeBrowser(): Promise<void> {
    if (!this.browser) {
      const { chromium } = await import("playwright");
      this.browser = await chromium.launch({
        headless: true,
      });
    }
  }

  protected async createPage(): Promise<Page> {
    await this.initializeBrowser();
    const context = await this.browser!.newContext({
      userAgent: this.config.userAgent,
    });
    return await context.newPage();
  }

  protected async closeBrowser(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  protected async retry<T>(
    operation: () => Promise<T>,
    retries = this.config.maxRetries
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      if (retries > 0) {
        await new Promise((resolve) =>
          setTimeout(resolve, this.config.retryDelay)
        );
        return this.retry(operation, retries - 1);
      }
      throw error;
    }
  }

  protected async extractText(
    page: Page,
    selector: string
  ): Promise<string | null> {
    try {
      const element = await page.$(selector);
      if (!element) return null;
      return await element.textContent();
    } catch {
      return null;
    }
  }

  protected async extractAttribute(
    page: Page,
    selector: string,
    attribute: string
  ): Promise<string | null> {
    try {
      const element = await page.$(selector);
      if (!element) return null;
      return await element.getAttribute(attribute);
    } catch {
      return null;
    }
  }

  protected async extractMultiple(
    page: Page,
    selector: string
  ): Promise<string[]> {
    try {
      const elements = await page.$$(selector);
      return await Promise.all(
        elements.map((el) => el.textContent() || "")
      );
    } catch {
      return [];
    }
  }

  protected async extractImages(
    page: Page,
    selector: string
  ): Promise<string[]> {
    try {
      const elements = await page.$$(selector);
      return await Promise.all(
        elements.map((el) => el.getAttribute("src") || "")
      );
    } catch {
      return [];
    }
  }

  protected async waitForSelector(
    page: Page,
    selector: string,
    timeout = this.config.timeout
  ): Promise<void> {
    await page.waitForSelector(selector, { timeout });
  }

  protected async waitForLoadState(
    page: Page,
    state: "load" | "domcontentloaded" | "networkidle" = "networkidle"
  ): Promise<void> {
    await page.waitForLoadState(state);
  }

  protected async scrollToBottom(page: Page): Promise<void> {
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
  }

  protected async extractDate(
    dateStr: string,
    format?: string
  ): Promise<Date | null> {
    try {
      if (format) {
        // Use date-fns or similar for format parsing
        return new Date(dateStr);
      }
      return new Date(dateStr);
    } catch {
      return null;
    }
  }

  protected async extractPrice(
    priceStr: string
  ): Promise<{ amount: number; currency: string } | null> {
    try {
      const match = priceStr.match(/([0-9,.]+)\s*([A-Z]{3})?/);
      if (!match) return null;

      const amount = parseFloat(match[1].replace(/,/g, ""));
      const currency = match[2] || "USD";

      return { amount, currency };
    } catch {
      return null;
    }
  }

  protected async cleanup(): Promise<void> {
    await this.closeBrowser();
  }
} 