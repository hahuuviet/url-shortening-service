import { isValidShortenUrl, isValidUrl } from "../utils/validator";

export class OriginalUrl {
  private readonly url: string;
  private constructor(url: string) {
    this.url = url;
  }

  static create(url: string): OriginalUrl | null {
    if (!url || !isValidUrl(url)) {
      return null;
    }
    
    if (!/^https?:\/\//i.test(url)) {
      url = `https://${url}`;
    }

    return new OriginalUrl(url);
  }

  getOriginalURL(): string {
    return this.url;
  }
}

export class ShortenUrl {
  private readonly url: string | null;

  private constructor(url: string | null) {
    this.url = url;
  }

  static create(url: string | null): ShortenUrl | null {
    if (!url || url.length === 0) {
      return new ShortenUrl(null);
    }
    if (!isValidShortenUrl(url) || url.length > 10){
        return null
    }

    return new ShortenUrl(url);
  }

  getShortenedURL(): string | null {
    return this.url;
  }
}

export class ShortenURLPayload {
  private readonly originalUrl: OriginalUrl;
  private readonly shortenUrl: ShortenUrl | null;
  private readonly timestamp: Date;

  constructor(originalUrl: OriginalUrl, shortenUrl: ShortenUrl | null, timestamp?: Date) {
    this.originalUrl = originalUrl;
    this.shortenUrl = shortenUrl;
    this.timestamp = timestamp || new Date();
  }

  static create(requestBody: any): ShortenURLPayload | null {
    if (!requestBody || typeof requestBody !== "object") {
      return null;
    }

    const { original_url, shortened } = requestBody;

    const originalUrl = OriginalUrl.create(original_url);
    const shortenUrl = shortened ? ShortenUrl.create(shortened) : null;

    if (!originalUrl) {
      return null;
    }

    return new ShortenURLPayload(originalUrl, shortenUrl);
  }

  getOriginalUrl(): string {
    return this.originalUrl.getOriginalURL();
  }

  getShortenedUrl(): string | null {
    return this.shortenUrl?.getShortenedURL() || null;
  }

  getTimestamp(): Date {
    return this.timestamp;
  }
}
