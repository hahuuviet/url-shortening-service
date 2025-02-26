import { Request, Response } from "express";
import {
  ShortenURLPayload,
} from "../models/url.model";
import { create, findByShortened } from "../dao/url.dao";
import { generateUniqueShortenUrl } from "../services/url.service";

export const createShortenUrl = async (
  req: Request<
    unknown,
    unknown,
    { original: string; shortened: string | null }
  >,
  res: Response
): Promise<any> => {
  try {
    const payload = ShortenURLPayload.create(req.body);
    if (!payload) {
      return res.status(400).json({ success: false, message: "Invalid request." });
    }

    let shortenedUrl = payload.getShortenedUrl();
    if (shortenedUrl) {
      const existShortenUrl = await findByShortened(shortenedUrl);
      if (existShortenUrl) {
        return res.status(400).json({
          success: false,
          message:
            "The requested short URL is already taken. Please try another one!",
        });
      }
    } else {
      shortenedUrl = await generateUniqueShortenUrl();

      if (!shortenedUrl) {
        return res.status(500).json({
          success: false,
          message: "Error generating short URL. Please try again later!",
        });
      }
    }

    const finalPayload = ShortenURLPayload.create({
      ...req.body,
      shortened: shortenedUrl,
    });

    if (!finalPayload) {
      return res.status(400).json({ success: false, message: "Invalid URL data." });
    }

    await create(finalPayload);
    return res.status(201).json({ success: true, body: finalPayload });
  } catch (error) {
    console.error("Server error when creating url!" + error);
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

    if (!shortUrl) {
      return res
        .status(404)
        .json({ success: false, message: "Cannot find your URL!" });
    }

    const urlRecord = await findByShortened(shortUrl);

    if (!urlRecord) {
      return res
        .status(404)
        .json({ success: false, message: "Cannot find your URL!" });
    }

    res.status(302).redirect(urlRecord.getOriginalUrl());
  } catch (error) {
    console.error("Server error when creating link!" + error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error!" });
  }
};
