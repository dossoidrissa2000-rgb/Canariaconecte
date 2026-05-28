import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// API helper to get Gemini client lazily to avoid startup crash if no key
let aiClient: GoogleGenAI | null = null;
function getGeminiAI(): GoogleGenAI | null {
  const key = process.env.GEMINI_API_KEY;
  if (!key || key.includes("MY_GEMINI_API_KEY")) {
    console.warn("⚠️ Warning: GEMINI_API_KEY environment variable is not configured.");
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// REST route for active health evaluation
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    apiConfigured: !!process.env.GEMINI_API_KEY && !process.env.GEMINI_API_KEY.includes("MY_GEMINI_API_KEY")
  });
});

// CV Generation endpoint proxying Gemini 3.5
app.post("/api/cv/generate", async (req, res) => {
  try {
    const { fullName, jobTitle, email, phone, address, skillsInput, experienceInput, languagesInput, educationInput, summaryInput } = req.body;

    const ai = getGeminiAI();
    if (!ai) {
      // Return beautiful default simulated translation if no API key is specified
      console.log("Serving high-quality template fallback since GEMINI_API_KEY is not configured.");
      const demoResponse = {
        fullName: fullName || "Jean Dupont",
        jobTitle: jobTitle || "Serveur / Commis de Cuisine",
        email: email || "jean.dupont@example.com",
        phone: phone || "+34 600 000 000",
        address: address || "Las Palmas de Gran Canaria, España",
        summary: `Professionnel dynamique avec expérience dans le secteur du tourisme et de la restauration. Installé à Gran Canaria et motivé pour s'intégrer rapidement dans les structures hôtelières locales de premier plan. Compétences interpersonnelles excellentes.`,
        skills: skillsInput ? skillsInput.split(",").map((s: string) => s.trim()) : ["Service client", "Cuisine internationale", "HACCP certifié", "Travail en équipe", "Flexibilité horaire"],
        languages: languagesInput ? languagesInput.split(",").map((l: string) => {
          const parts = l.split(":");
          return { language: parts[0]?.trim() || "Français", level: parts[1]?.trim() || "Maternel" };
        }) : [
          { language: "Français", level: "Langue maternelle" },
          { language: "Espagnol", level: "Débutant (A1-A2, en apprentissage intensif)" },
          { language: "Anglais", level: "Intermédiaire (B1)" }
        ],
        experience: [
          {
            role: "Serveur Principal / Aide-Cuisine",
            company: "Playa del Inglés Bistro (Simulé)",
            duration: "2024 - Présent (6 mois)",
            description: "Service en table, accueil bilingue des clients, préparation de tapas locales. Gestion des encaissements et respect stricte des normes sanitaires espagnoles."
          },
          {
            role: "Employé de Restauration rapide",
            company: "Le Chalet Gourmand (Paris, France)",
            duration: "2022 - 2024",
            description: "Préparation de plats froids et chauds, approvisionnement des rayons et tenue de caisse. Amélioration de 15% de l'efficacité de service aux heures de pointe."
          }
        ],
        education: [
          {
            degree: "Licence d'Hôtellerie-Restauration (ou équivalence)",
            school: "Lycée Hôtelier de Paris",
            year: "2021",
            description: "Formation complète incluant gestion commerciale, service oenologique et gestion de crise en restauration."
          }
        ],
        warnings: ["API_KEY_MISSING_FALLBACK"]
      };
      return res.json(demoResponse);
    }

    // Build customized professional prompt to format input for Canarian / Spanish labor requirements
    const prompt = `Génère un CV professionnel moderne et parfaitement formaté pour le marché de l'emploi à Gran Canaria (Espagne) à partir des informations fournies par l'utilisateur. 
Traduis et optimise les sections si cela est pertinent pour maximiser les chances d'embauche locale, tout en rédigeant l'essentiel en espagnol ou en français selon la cohérence globale (ajoute des termes clés espagnols comme "NIE en cours", "Disponible para incorporación inmediata", "Carnet de conducir").

Informations brutes soumises:
- Nom Complet: ${fullName}
- Titre Recommandé: ${jobTitle}
- Contact: ${email} | ${phone}
- Localisation: ${address || "Las Palmas de Gran Canaria"}
- Résumé de motivation / Objectif: ${summaryInput}
- Compétences: ${skillsInput}
- Expériences: ${experienceInput}
- Langues: ${languagesInput}
- Éducation: ${educationInput}

Veuillez structurer les informations de façon ultra professionnelle.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        systemInstruction: "Tu es un consultant RH senior expert du marché du travail aux Canaries (Gran Canaria, Espagne). Tu aides les nouveaux arrivants (migrants, étudiants) à transformer leurs profils bruts en CV parfaits, traduits professionnellement, mentionnant de façon élégante les facilités d'intégration espagnoles.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            fullName: { type: Type.STRING },
            jobTitle: { type: Type.STRING },
            email: { type: Type.STRING },
            phone: { type: Type.STRING },
            address: { type: Type.STRING },
            summary: { type: Type.STRING, description: "Un résumé accrocheur en espagnol ou français de 3-4 lignes optimisant le projet professionnel de l'utilisateur à Gran Canaria." },
            skills: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Une liste de 4 à 8 compétences clés adaptées au poste."
            },
            languages: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  language: { type: Type.STRING },
                  level: { type: Type.STRING, description: "e.g. 'Nativo', 'Intermedio (B1/B2)', 'Básico (A1/A2, en progreso)'" }
                },
                required: ["language", "level"]
              }
            },
            experience: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  role: { type: Type.STRING, description: "Intitulé professionnel en Espagnol/Français" },
                  company: { type: Type.STRING },
                  duration: { type: Type.STRING, description: "Période ou durée d'activité commerciale" },
                  description: { type: Type.STRING, description: "Description synthétique d'accomplissements clés" }
                },
                required: ["role", "company", "duration", "description"]
              }
            },
            education: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  degree: { type: Type.STRING },
                  school: { type: Type.STRING },
                  year: { type: Type.STRING },
                  description: { type: Type.STRING }
                },
                required: ["degree", "school", "year"]
              }
            }
          },
          required: ["fullName", "jobTitle", "email", "phone", "address", "summary", "skills", "languages", "experience", "education"]
        }
      }
    });

    const outputText = response.text;
    if (!outputText) {
      throw new Error("No response text received from Gemini server.");
    }

    const parsedCV = JSON.parse(outputText.trim());
    res.json(parsedCV);

  } catch (error: any) {
    console.error("Error generating CV via Gemini:", error);
    res.status(500).json({ error: "Une erreur est survenue lors de la génération avec l'IA. Veuillez réessayer.", details: error.message });
  }
});

// Configure Vite middleware flow or production build serving
async function bootstrap() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("🛠️ Vite Dev Middleware registered on host.");
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 CanariaConnect Host running successfully on http://localhost:${PORT}`);
  });
}

bootstrap();
