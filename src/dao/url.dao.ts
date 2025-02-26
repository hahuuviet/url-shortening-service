import { db } from "../config/db";
import { ShortenURLPayload } from "../models/url.model";

export async function create(payload: ShortenURLPayload): Promise<void> {
  await db("url").insert({
    original_url: payload.getOriginalUrl(),
    shortened: payload.getShortenedUrl(),
    timestamp: payload.getTimestamp(),
  });
}

export async function findByShortened(
  shortened: string
): Promise<ShortenURLPayload | null> {
  const urlRecord = await db.first().from("url").where({
    shortened: shortened,
  });

  return urlRecord ? ShortenURLPayload.create(urlRecord) : null;
}

export async function findByOriginal(
  original: string
): Promise<ShortenURLPayload | null> {
  const urlRecord = await db.first().from("url").where({
    original_url: original,
  });
  if (!urlRecord) {
    return null;
  }

  return new ShortenURLPayload(
    urlRecord.original_url,
    urlRecord.shortened,
    urlRecord.timestamp
  );
}
