import { Page } from "playwright";
import { BaseScraper, ScrapedEvent } from "./base";

export class EventbriteScraper extends BaseScraper {
  getPlatform(): string {
    return "eventbrite";
  }

  canHandleUrl(url: string): boolean {
    return url.includes("eventbrite.com");
  }

  async scrape(url: string): Promise<ScrapedEvent> {
    const page = await this.createPage();
    try {
      await page.goto(url, { waitUntil: "networkidle" });
      await this.waitForSelector(page, "[data-testid='event-title']");

      const name = await this.extractText(page, "[data-testid='event-title']");
      if (!name) throw new Error("Could not extract event name");

      const description = await this.extractText(
        page,
        "[data-testid='event-description']"
      ) || undefined;

      const startDateStr = await this.extractText(page, "[data-testid='event-date']");
      if (!startDateStr) throw new Error("Could not extract start date");
      const startDate = await this.extractDate(startDateStr);
      if (!startDate) throw new Error("Could not parse start date");

      const endDateStr = await this.extractText(page, "[data-testid='event-end-date']");
      const endDate = endDateStr ? await this.extractDate(endDateStr) : undefined;

      const location = await this.extractLocation(page);
      const host = await this.extractHost(page);
      const pricing = await this.extractPricing(page);
      const images = await this.extractImages(page, "[data-testid='event-image'] img");
      const tags = await this.extractTags(page);

      return {
        name,
        description,
        startDate,
        endDate,
        location,
        host,
        sourceUrl: url,
        platform: this.getPlatform(),
        pricing,
        images,
        tags,
        metadata: {
          scrapedAt: new Date(),
          platform: this.getPlatform(),
        },
      };
    } finally {
      await this.cleanup();
    }
  }

  private async extractLocation(page: Page) {
    const locationType = await this.extractText(
      page,
      "[data-testid='event-location-type']"
    );
    const address = await this.extractText(
      page,
      "[data-testid='event-location-address']"
    );
    const url = await this.extractAttribute(
      page,
      "[data-testid='event-location-url']",
      "href"
    );

    return {
      type: locationType?.toLowerCase().includes("online")
        ? "virtual" as const
        : "physical" as const,
      address: address || undefined,
      url: url || undefined,
    };
  }

  private async extractHost(page: Page) {
    const name = await this.extractText(page, "[data-testid='event-organizer']");
    const website = await this.extractAttribute(
      page,
      "[data-testid='event-organizer-website']",
      "href"
    );

    return {
      name: name || "Unknown",
      website: website || undefined,
    };
  }

  private async extractPricing(page: Page) {
    const priceText = await this.extractText(
      page,
      "[data-testid='event-price']"
    );
    if (!priceText) return undefined;

    if (priceText.toLowerCase().includes("free")) {
      return { type: "free" as const };
    }

    const price = await this.extractPrice(priceText);
    if (!price) return undefined;

    return {
      type: "paid" as const,
      amount: price.amount,
      currency: price.currency,
    };
  }

  private async extractTags(page: Page): Promise<string[]> {
    const tags = await this.extractMultiple(
      page,
      "[data-testid='event-category']"
    );
    return tags.filter(Boolean);
  }
} 