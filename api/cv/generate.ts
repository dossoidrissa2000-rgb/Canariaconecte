import type { VercelRequest, VercelResponse } from "@vercel/node";
import { generateCv, type CvGenerateInput } from "../../lib/cv-api.js";

export const config = {
  maxDuration: 30,
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = (req.body ?? {}) as CvGenerateInput;
    const result = await generateCv(body);
    return res.status(200).json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Error generating CV via Gemini:", error);
    return res.status(500).json({
      error: "Une erreur est survenue lors de la génération avec l'IA. Veuillez réessayer.",
      details: message,
    });
  }
}
