import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isGeminiConfigured } from "../lib/cv-api.js";

export default function handler(_req: VercelRequest, res: VercelResponse) {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    apiConfigured: isGeminiConfigured(),
  });
}
