import type { CVData } from "../types";

export interface CvGeneratePayload {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  address?: string;
  summaryInput?: string;
  skillsInput?: string;
  languagesInput?: string;
  experienceInput?: string;
  educationInput?: string;
}

export type CvGenerateResult = CVData & { warnings?: string[] };

function isCvData(value: unknown): value is CvGenerateResult {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.fullName === "string" &&
    typeof v.jobTitle === "string" &&
    Array.isArray(v.skills) &&
    Array.isArray(v.experience)
  );
}

export async function requestCvGeneration(
  payload: CvGeneratePayload
): Promise<CvGenerateResult> {
  const response = await fetch("/api/cv/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  let body: unknown = null;
  try {
    body = await response.json();
  } catch {
    body = null;
  }

  if (!response.ok) {
    const err =
      body &&
      typeof body === "object" &&
      "error" in body &&
      typeof (body as { error: string }).error === "string"
        ? (body as { error: string }).error
        : `Erreur serveur (${response.status})`;
    throw new Error(err);
  }

  if (!isCvData(body)) {
    throw new Error("Réponse CV invalide du serveur.");
  }

  return body;
}
