import { Request, Response } from "express";
import { db } from "../config/db";
import { isValidPath, isValidShortenUrl, isValidUrl } from "../utils/validator";
import { Url } from "../types/Url";
import { generateRandomString } from "../utils/helper";

export const createShortenUrl = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    let { originalUrl, shortenUrl } = req.body;
    const MAX_RETRIES = 5;
    let finalShortenUrl = "";
    let retries = 0;
    let isUnique = false;

    if (!originalUrl) {
      return res
        .status(400)
        .json({ success: false, message: "Original url must be filled!" });
    }

    if (!/^https?:\/\//i.test(originalUrl)) {
      originalUrl = `https://${originalUrl}`;
    }

    if (!isValidUrl(originalUrl)) {
      return res
        .status(400)
        .json({ success: false, message: "The URL is not valid!" });
    }

    if (shortenUrl && shortenUrl.length > 0) {
      if (!isValidShortenUrl(shortenUrl) || shortenUrl.length > 10) {
        return res.status(400).json({
          success: false,
          message: "The shorten URL format is not valid!",
        });
      }

      const existShortenUrl = await db.first().from<Url>("url").where({
        shorten_url: shortenUrl,
      });

      if (existShortenUrl) {
        return res.status(400).json({
          success: false,
          message:
            "The requested short URL is already taken. Please try another one!",
        });
      }

      const url: Url = {
        original_url: originalUrl,
        shorten_url: shortenUrl,
        timestamp: new Date(),
      };

      await db("url").insert(url);

      return res.status(201).json({ success: true, url: url });
    }

    while (!isUnique && retries < MAX_RETRIES) {
      finalShortenUrl = generateRandomString(7);
      const existRandomShortenUrl = await db("url")
        .first()
        .where({ shorten_url: finalShortenUrl });

      if (!existRandomShortenUrl) {
        isUnique = true;
      }
      retries++;
    }

    const url: Url = {
      original_url: originalUrl,
      shorten_url: finalShortenUrl,
      timestamp: new Date(),
    };

    await db("url").insert(url);

    return res.status(201).json({ success: true, url: url });
  } catch (error) {
    console.error("Server error when creating link!" + error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error!" });
  }
};

export const getShortenUrl = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { shortUrl } = req.params;

    const url: Url = await db("url")
      .first("original_url", "shorten_url", "timestamp")
      .where({ shorten_url: shortUrl });

    if (!isValidPath(shortUrl) || !url) {
      return res
        .status(404)
        .json({ success: false, message: "Cannot find your URL!" });
    }
    res.status(302).redirect(url.original_url);
  } catch (error) {
    console.error("Server error when creating link!" + error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error!" });
  }
};
