import express from "express";
import { createShortenUrl, getShortenUrl } from "../controllers/url.controller";

const router = express.Router();

router.post("/create", createShortenUrl);

export default router;