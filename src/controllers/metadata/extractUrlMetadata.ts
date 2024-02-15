import axios from "axios";
import * as cheerio from "cheerio";
import { Request, Response } from "express";

export const extractUrlMetadata = async (req: Request, res: Response) => {
  const { url } = req.query;

  if (typeof url !== "string") {
    return;
  }

  try {
    const response = await axios.get(url);
    const html = response.data;

    const $ = cheerio.load(html);
    const metadata = {
      title:
        $('meta[property="og:title"]').attr("content") || $("title").text(),
      description:
        $('meta[property="og:description"]').attr("content") ||
        $('meta[name="description"]').attr("content"),
      image: $('meta[property="og:image"]').attr("content"),
    };

    res.json(metadata);
  } catch (error) {
    console.error("Error fetching metadata:", error);
    res.status(500).json({ error: "Error fetching metadata" });
  }
};
