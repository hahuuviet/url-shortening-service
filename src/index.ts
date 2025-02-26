import express, { Application } from 'express';
import dotenv from 'dotenv';
import urlRoutes from "./routes/url.route"
import { connectDb } from './config/db';
import { getShortenUrl } from './controllers/url.controller';

dotenv.config();

const app: Application = express();
const port = process.env.PORT || 8000;

app.use(express.json())

app.use("/api/v1/url", urlRoutes);

app.get("/:shortUrl", getShortenUrl);

app.listen(port, () => {
  console.log(`Server is Fire at https://localhost:${port}`);
  connectDb()
});