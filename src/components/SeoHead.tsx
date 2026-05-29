import { useEffect } from "react";

const SITE_NAME = "CanariaConnect";
const DEFAULT_TITLE = "CanariaConnect — Emplois, formations et intégration à Gran Canaria";
const DEFAULT_DESCRIPTION =
  "CanariaConnect aide migrants, étudiants et résidents à trouver un emploi, se former, obtenir le NIE et générer un CV optimisé pour Gran Canaria.";

interface SeoHeadProps {
  title?: string;
  description?: string;
}

export default function SeoHead({ title, description }: SeoHeadProps) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE;
    const desc = description ?? DEFAULT_DESCRIPTION;

    document.title = fullTitle;

    const setMeta = (name: string, content: string, property = false) => {
      const attr = property ? "property" : "name";
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    setMeta("description", desc);
    setMeta("og:title", fullTitle, true);
    setMeta("og:description", desc, true);
    setMeta("og:type", "website", true);
    setMeta("og:locale", "fr_ES", true);
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", fullTitle);
    setMeta("twitter:description", desc);
  }, [title, description]);

  return null;
}
