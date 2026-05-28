import React, { useState, useEffect } from "react";
import { CVData } from "../types";
import { FileDown, Sparkles, Send, Copy, RotateCcw, Award, Mail, Phone, MapPin, Printer, History, FileText, Check, LayoutTemplate, Palette } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { readStoredJson } from "../utils/storage";

interface AICVGeneratorProps {
  currentUser: { email: string; fullName: string } | null;
  onNavigateToAuth: () => void;
  showToast: (message: string, type: "success" | "error" | "info") => void;
}

export default function AICVGenerator({
  currentUser,
  onNavigateToAuth,
  showToast
}: AICVGeneratorProps) {
  const [fullName, setFullName] = useState(currentUser?.fullName || "");
  const [jobTitle, setJobTitle] = useState("");
  const [email, setEmail] = useState(currentUser?.email || "");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("Las Palmas de Gran Canaria, España");
  
  // Custom Raw Inputs for the AI transformation
  const [summaryInput, setSummaryInput] = useState("");
  const [skillsInput, setSkillsInput] = useState("");
  const [languagesInput, setLanguagesInput] = useState("");
  const [experienceInput, setExperienceInput] = useState("");
  const [educationInput, setEducationInput] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [generatedCV, setGeneratedCV] = useState<CVData | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<"modern" | "classic" | "tropical">("tropical");

  useEffect(() => {
    if (currentUser?.fullName) setFullName(currentUser.fullName);
    if (currentUser?.email) setEmail(currentUser.email);
  }, [currentUser]);

  // Handles submitting the raw text prompts to the server Gemini proxy
  const handleGenerateCV = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !jobTitle || !email || !phone) {
      showToast("Veuillez remplir au moins les coordonnées principales du formulaire.", "error");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/cv/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          jobTitle,
          email,
          phone,
          address,
          summaryInput,
          skillsInput,
          languagesInput,
          experienceInput,
          educationInput
        })
      });

      if (!response.ok) {
        throw new Error("HTTP connection error on Express CV proxy");
      }

      const data = (await response.json()) as CVData & { warnings?: string[] };
      
      setGeneratedCV(data);
      if (data.warnings && data.warnings.includes("API_KEY_MISSING_FALLBACK")) {
        showToast("CV généré à partir du profil type CanariaConnect (Clé API de démonstration).", "info");
      } else {
        showToast("Votre CV a été rédigé et traduit avec succès par l'IA !", "success");
      }

      // Add to localStorage saved CVs history list
      const cvsHistory = readStoredJson<{ id: string; title: string; fullName: string; date: string; data: CVData }[]>("canaria_cv_history", []);
      const list = Array.isArray(cvsHistory) ? cvsHistory : [];
      list.push({
        id: `cv-${Date.now()}`,
        title: data.jobTitle,
        fullName: data.fullName,
        date: new Date().toLocaleDateString("fr-FR"),
        data
      });
      localStorage.setItem("canaria_cv_history", JSON.stringify(list));

    } catch (err: any) {
      console.error(err);
      showToast("La génération a échoué. Veuillez vérifier la connexion au serveur.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const loadDefaults = () => {
    setFullName(currentUser?.fullName || "Karim Belkacem");
    setJobTitle("Aide-Soignant / Accompagnant de Logements");
    setPhone("+34 611 234 567");
    setAddress("Maspalomas, Gran Canaria");
    setSummaryInput("Diplômé d'accompagnement social, j'ai 3 ans d'expérience. Nouvel installé pour étudier les systèmes de soins aux Canaries, je souhaite travailler immédiatement.");
    setSkillsInput("Soin à la personne, hygiène corporelle, écoute active, premiers secours, transferts de sécurité, patience, accompagnement sénior");
    setLanguagesInput("Français : langue maternelle, Espagnol : débutant motivé (A2, en cours d'apprentissage), Anglais : notions touristiques (A2)");
    setExperienceInput("2022 - 2025 : Auxiliaire de vie de nuit chez 'Sécurité & Soin' (Paris) - Prise en charge de 8 patients âgés dépendants. / 2021 : Bénévole à la Croix Rouge Française.");
    setEducationInput("2021 : Diplôme d'Accompagnateur d'Aide Médico-Psychologique (France)");
    showToast("Exemple type chargé dans les formulaires d'apprentissage.", "info");
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-10 transition-colors duration-300 print:bg-white print:py-0">
      
      {/* CSS overrides specifically for paper printing */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-cv-area, #printable-cv-area * {
            visibility: visible;
          }
          #printable-cv-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
            background: white !important;
            color: black !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title Section */}
        <div className="mb-10 text-center md:text-left no-print">
          <span className="text-xs font-bold text-sky-500 uppercase tracking-widest bg-sky-500/10 px-3 py-1.5 rounded-full dark:text-sky-400">
            Assistant de Rédaction
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mt-3 tracking-tight">
            Générateur de <span className="bg-gradient-to-r from-sky-500 via-sky-600 to-orange-500 bg-clip-text text-transparent">CV avec IA</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm max-w-2xl leading-relaxed">
            Saisissez simplement vos compétences brutes en français. L’IA traduit, valorise les compétences et génère un CV idéal à Gran Canaria (adaptations CV espagnol avec détails administratifs locaux).
          </p>
        </div>

        {/* Content Layout: Form column + CV Presentation Preview column */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Structural parameters form */}
          <div className="col-span-1 lg:col-span-5 space-y-6 no-print">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-sky-100/50 dark:border-slate-800">
              
              <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-100 dark:border-slate-800">
                <h2 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center space-x-1.5">
                  <Sparkles className="w-4 h-4 text-orange-500" />
                  <span>Renseigner mon profil</span>
                </h2>
                <button
                  onClick={loadDefaults}
                  className="text-[11px] font-bold text-sky-600 dark:text-sky-400 hover:underline cursor-pointer flex items-center space-x-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Charger un exemple</span>
                </button>
              </div>

              <form onSubmit={handleGenerateCV} className="space-y-4 text-xs">
                
                {/* Identification Blocks */}
                <div className="space-y-3">
                  <h3 className="font-bold text-slate-400 uppercase text-[10px] tracking-widest mb-1">Identité & Contact</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Nom complet</label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-850 p-2 text-slate-800 dark:text-slate-100 rounded-lg border border-slate-250 dark:border-slate-700"
                        placeholder="Ex: Karim Belkacem"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Titre recherché (Canaries)</label>
                      <input
                        type="text"
                        required
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-850 p-2 text-slate-800 dark:text-slate-100 rounded-lg border border-slate-250 dark:border-slate-700"
                        placeholder="Ex: Ayudante de Cocina (Cuisine)"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Adresse email</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-850 p-2 text-slate-800 dark:text-slate-100 rounded-lg border border-slate-250 dark:border-slate-700"
                        placeholder="hola@canariastrabajo.com"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Numéro Téléphone</label>
                      <input
                        type="text"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-850 p-2 text-slate-800 dark:text-slate-100 rounded-lg border border-slate-250 dark:border-slate-700"
                        placeholder="+34 6... ou 06..."
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Adresse de séjour à Gran Canaria</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-850 p-2 text-slate-800 dark:text-slate-100 rounded-lg border border-slate-250 dark:border-slate-700"
                      placeholder="Ex: Calle Triana, Las Palmas de CG"
                    />
                  </div>
                </div>

                {/* Raw blocks of prompt guidance */}
                <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <h3 className="font-bold text-slate-400 uppercase text-[10px] tracking-widest mb-1">Détails professionnels bruts</h3>

                  <div>
                    <label className="block text-slate-600 dark:text-slate-405 font-semibold mb-1">Objectif professionnel / Motivation</label>
                    <textarea
                      rows={2}
                      value={summaryInput}
                      onChange={(e) => setSummaryInput(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-850 p-2 text-slate-800 dark:text-slate-100 rounded-lg border border-slate-250 dark:border-slate-700"
                      placeholder="Ex: Motivé, j'ai travaillé dans le domaine social, cherche un poste stable..."
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 dark:text-slate-405 font-semibold mb-1">Compétences (mots-clés séparés par virgules)</label>
                    <input
                      type="text"
                      value={skillsInput}
                      onChange={(e) => setSkillsInput(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-850 p-2 text-slate-800 dark:text-slate-100 rounded-lg border border-slate-250 dark:border-slate-700"
                      placeholder="Ex: ponctualité, électricité, service bar, ménage"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 dark:text-slate-405 font-semibold mb-1">Langues (Langue: niveau, ...)</label>
                    <input
                      type="text"
                      value={languagesInput}
                      onChange={(e) => setLanguagesInput(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-850 p-2 text-slate-800 dark:text-slate-100 rounded-lg border border-slate-250 dark:border-slate-700"
                      placeholder="Ex: Français: Maternel, Anglais: Intermédiaire, Espagnol: Débutant (A1)"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 dark:text-slate-405 font-semibold mb-1 font-mono">Expériences significatives (Dates, postes, missions)</label>
                    <textarea
                      rows={3}
                      value={experienceInput}
                      onChange={(e) => setExperienceInput(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-850 p-2 text-slate-850 dark:text-slate-100 rounded-lg border border-slate-250 dark:border-slate-700"
                      placeholder="Ex: 2020-2023: Vendeur à Carrefour. Accueil, caisse, mise en rayon."
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 dark:text-slate-405 font-semibold mb-1">Éducation / Liste d'Études</label>
                    <textarea
                      rows={2}
                      value={educationInput}
                      onChange={(e) => setEducationInput(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-850 p-2 text-slate-850 dark:text-slate-100 rounded-lg border border-slate-250 dark:border-slate-700"
                      placeholder="Ex: Baccalauréat d'Électricité, formation de cuisine de quartier..."
                    />
                  </div>
                </div>

                {/* Submissions Action Box */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-gradient-to-r from-sky-500 via-sky-600 to-orange-500 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-2 cursor-pointer mt-4 hover:scale-[1.01] transition-transform shadow-md shadow-sky-500/10"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/25 border-t-white rounded-full animate-spin"></div>
                      <span>Analyse et traduction en cours...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 animate-pulse" />
                      <span>Rédiger mon CV idéal avec CanariaConnect</span>
                    </>
                  )}
                </button>

              </form>
            </div>
          </div>

          {/* RIGHT: Visual Canvas containing generated CV layouts */}
          <div className="col-span-1 lg:col-span-7 space-y-4">
            
            {/* Control Panel (Presets selectors, printable triggers) */}
            {generatedCV && (
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 no-print text-xs">
                
                {/* Visual template selector */}
                <div className="flex items-center space-x-2">
                  <Palette className="w-4.5 h-4.5 text-orange-500" />
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Preset Stylistique:</span>
                  <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                    <button
                      onClick={() => setSelectedPreset("tropical")}
                      className={`px-2.5 py-1 rounded-md font-bold cursor-pointer ${selectedPreset === "tropical" ? "bg-white dark:bg-slate-700 text-sky-600 shadow-sm" : "text-slate-550 h-full"}`}
                    >
                      Tropique
                    </button>
                    <button
                      onClick={() => setSelectedPreset("modern")}
                      className={`px-2.5 py-1 rounded-md font-bold cursor-pointer ${selectedPreset === "modern" ? "bg-white dark:bg-slate-700 text-sky-600 shadow-sm" : "text-slate-550 h-full"}`}
                    >
                      Moderne
                    </button>
                    <button
                      onClick={() => setSelectedPreset("classic")}
                      className={`px-2.5 py-1 rounded-md font-bold cursor-pointer ${selectedPreset === "classic" ? "bg-white dark:bg-slate-700 text-sky-600 shadow-sm" : "text-slate-550 h-full"}`}
                    >
                      Classique
                    </button>
                  </div>
                </div>

                {/* Print Action button */}
                <button
                  onClick={handlePrint}
                  className="flex items-center space-x-1 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Imprimer en PDF physique</span>
                </button>

              </div>
            )}

            {/* Resume Main Core Wrapper */}
            <AnimatePresence mode="wait">
              {generatedCV ? (
                <motion.div
                  key={selectedPreset}
                  initial={{ opacity: 0, scale: 0.99 }}
                  animate={{ opacity: 1, scale: 1 }}
                  id="printable-cv-area"
                  className={`relative p-8 md:p-12 h-auto rounded-3xl transition-all shadow-xl bg-white border ${
                    selectedPreset === "tropical"
                      ? "border-sky-200/50 shadow-sky-500/5"
                      : selectedPreset === "modern"
                      ? "border-slate-200/70"
                      : "border-slate-300 shadow-none border-t-[8px] border-t-slate-800"
                  }`}
                >
                  
                  {/* TROPICAL BRAND STYLING PRESET */}
                  {selectedPreset === "tropical" && (
                    <div className="space-y-6 text-slate-800">
                      
                      {/* Name card and logo */}
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-sky-100 pb-6 gap-4">
                        <div>
                          <h1 className="text-3xl font-extrabold text-sky-850 tracking-tight">{generatedCV.fullName}</h1>
                          <p className="text-lg font-bold text-orange-500">{generatedCV.jobTitle}</p>
                        </div>
                        <div className="text-xs space-y-1 text-slate-500 shrink-0 font-semibold md:text-right">
                          <p className="flex items-center md:justify-end space-x-1.5"><Mail className="w-3.5 h-3.5 text-sky-500" /> <span>{generatedCV.email}</span></p>
                          <p className="flex items-center md:justify-end space-x-1.5"><Phone className="w-3.5 h-3.5 text-sky-500" /> <span>{generatedCV.phone}</span></p>
                          <p className="flex items-center md:justify-end space-x-1.5"><MapPin className="w-3.5 h-3.5 text-orange-500" /> <span>{generatedCV.address}</span></p>
                        </div>
                      </div>

                      {/* Professional summary text */}
                      <p className="text-sm leading-relaxed text-slate-650 italic pl-4 border-l-4 border-l-orange-500 py-1 bg-sky-50/40 p-3 rounded-r-lg">
                        {generatedCV.summary}
                      </p>

                      {/* Main core structures */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-2">
                        
                        {/* LEFT: Experience and studies timeline */}
                        <div className="md:col-span-8 space-y-6">
                          
                          <div className="space-y-4">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-sky-600 border-b border-sky-100 pb-1">Expérience Professionnelle</h3>
                            <div className="relative border-l border-slate-100 ml-2.5 pt-1 space-y-5">
                              {generatedCV.experience.map((exp, idx) => (
                                <div key={idx} className="relative pl-6">
                                  <span className="absolute left-[-5px] top-1.5 w-2.5 h-2.5 rounded-full bg-sky-400 border border-white"></span>
                                  <div className="flex justify-between items-center text-xs">
                                    <h4 className="font-bold text-slate-850 text-[13px]">{exp.role}</h4>
                                    <span className="font-bold text-sky-600 bg-sky-50 px-2.5 py-0.5 rounded text-[10px]">{exp.duration}</span>
                                  </div>
                                  <p className="text-xs font-semibold text-slate-500">{exp.company}</p>
                                  <p className="text-[11px] text-slate-600 mt-1 lines-relaxed leading-normal">{exp.description}</p>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-4">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-sky-600 border-b border-sky-100 pb-1">Éducation & Formation</h3>
                            <div className="space-y-3">
                              {generatedCV.education.map((edu, idx) => (
                                <div key={idx} className="text-xs">
                                  <div className="flex justify-between items-center">
                                    <h4 className="font-bold text-slate-800">{edu.degree}</h4>
                                    <span className="font-semibold text-slate-500">{edu.year}</span>
                                  </div>
                                  <p className="text-xs text-sky-600 font-semibold">{edu.school}</p>
                                  {edu.description && <p className="text-[11px] text-slate-500 mt-0.5">{edu.description}</p>}
                                </div>
                              ))}
                            </div>
                          </div>

                        </div>

                        {/* RIGHT: Skills, Languages catalog */}
                        <div className="md:col-span-4 space-y-6">
                          
                          <div className="space-y-3 bg-sky-50/30 p-4 border border-sky-100/50 rounded-2xl">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-sky-600">Compétences</h3>
                            <div className="flex flex-wrap gap-1.5">
                              {generatedCV.skills.map((sk, idx) => (
                                <span key={idx} className="bg-white px-2.5 py-1 rounded-lg text-[10.5px] border border-sky-100 text-slate-700 font-medium">
                                  {sk}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-3 bg-orange-50/20 p-4 border border-orange-100/30 rounded-2xl">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-orange-600">Langues</h3>
                            <div className="space-y-2">
                              {generatedCV.languages.map((ln, idx) => (
                                <div key={idx} className="text-xs flex justify-between items-center">
                                  <span className="font-bold text-slate-800">{ln.language}</span>
                                  <span className="text-slate-500 text-[11px]">{ln.level}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Extra block referencing CanariaConnect support verification */}
                          <div className="pt-4 border-t border-slate-100 font-mono text-[9px] text-slate-400">
                            <p>CV généré numériquement via CanariaConnect.es</p>
                          </div>

                        </div>

                      </div>

                    </div>
                  )}

                  {/* MODERN CORPORATE PRESET */}
                  {selectedPreset === "modern" && (
                    <div className="space-y-6 text-slate-850">
                      
                      {/* Grid header layout */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pb-6 border-b border-slate-200">
                        <div className="md:col-span-8">
                          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight uppercase">{generatedCV.fullName}</h1>
                          <p className="text-md font-semibold text-sky-600 tracking-wider uppercase mt-1">{generatedCV.jobTitle}</p>
                        </div>
                        <div className="md:col-span-4 text-xs space-y-1 text-slate-500 md:text-right md:pt-2">
                          <p>{generatedCV.email}</p>
                          <p>{generatedCV.phone}</p>
                          <p>{generatedCV.address}</p>
                        </div>
                      </div>

                      <p className="text-xs leading-relaxed text-slate-700">
                        {generatedCV.summary}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-4">
                        
                        <div className="md:col-span-8 space-y-6">
                          
                          <div className="space-y-4">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-l-4 border-sky-500 pl-3.5">Expérience</h3>
                            <div className="space-y-4">
                              {generatedCV.experience.map((exp, idx) => (
                                <div key={idx} className="text-xs space-y-1">
                                  <div className="flex justify-between items-baseline font-bold text-slate-900">
                                    <span>{exp.role}</span>
                                    <span className="text-slate-500 text-[10px]">{exp.duration}</span>
                                  </div>
                                  <p className="text-slate-600 font-medium">{exp.company}</p>
                                  <p className="text-[11.5px] text-slate-600 leading-relaxed pt-1">{exp.description}</p>
                                </div>
                              ))}
                            </div>
                          </div>

                        </div>

                        <div className="md:col-span-4 space-y-6">
                          
                          <div className="space-y-3">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-l-4 border-sky-500 pl-3.5">Compétences</h3>
                            <div className="flex flex-wrap gap-1">
                              {generatedCV.skills.map((sk, idx) => (
                                <span key={idx} className="bg-slate-100 px-2 py-0.5 rounded text-[10px] font-semibold text-slate-800">
                                  {sk}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-3">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-l-4 border-sky-500 pl-3.5">Langues</h3>
                            <div className="space-y-1.5 text-xs">
                              {generatedCV.languages.map((ln, idx) => (
                                <div key={idx} className="flex justify-between font-medium">
                                  <span className="text-slate-800">{ln.language}</span>
                                  <span className="text-slate-500">{ln.level}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-3 pt-4 border-t border-slate-100">
                            <span className="text-xs font-bold uppercase tracking-widest text-slate-900">Éducation</span>
                            {generatedCV.education.map((edu, idx) => (
                              <div key={idx} className="text-[11.5px] leading-tight space-y-0.5">
                                <p className="font-bold text-slate-800">{edu.degree}</p>
                                <p className="text-slate-500">{edu.school} • {edu.year}</p>
                              </div>
                            ))}
                          </div>

                        </div>

                      </div>

                    </div>
                  )}

                  {/* CLASSIC SHIC PRESET */}
                  {selectedPreset === "classic" && (
                    <div className="space-y-6 text-slate-900 font-serif">
                      
                      {/* Classical centered header */}
                      <div className="text-center space-y-2 pb-6 border-b border-slate-300">
                        <h1 className="text-4xl text-slate-950 font-normal tracking-wide">{generatedCV.fullName}</h1>
                        <p className="text-sm font-semibold tracking-wide italic text-slate-600">{generatedCV.jobTitle}</p>
                        <div className="text-xs flex flex-wrap justify-center gap-4 text-slate-500 font-sans font-medium">
                          <span>{generatedCV.email}</span>
                          <span>•</span>
                          <span>{generatedCV.phone}</span>
                          <span>•</span>
                          <span>{generatedCV.address}</span>
                        </div>
                      </div>

                      <p className="text-xs leading-relaxed text-center italic text-slate-750 px-8">
                        "{generatedCV.summary}"
                      </p>

                      <div className="space-y-6">
                        
                        <div className="space-y-3">
                          <h3 className="text-center text-xs font-bold uppercase tracking-widest border-b border-slate-300 pb-1 font-sans">Parcours Professionnel</h3>
                          <div className="space-y-4">
                            {generatedCV.experience.map((exp, idx) => (
                              <div key={idx} className="text-xs space-y-1">
                                <div className="flex justify-between font-bold text-slate-950">
                                  <span>{exp.role} ({exp.company})</span>
                                  <span className="text-slate-500 font-sans text-[10px]">{exp.duration}</span>
                                </div>
                                <p className="text-[11.5px] italic text-slate-705 leading-relaxed pl-1">{exp.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
                          
                          <div className="space-y-2">
                            <h3 className="text-xs font-bold uppercase tracking-widest border-b border-slate-300 pb-1 font-sans">Compétences</h3>
                            <ul className="text-xs list-disc pl-4 space-y-1 text-slate-705">
                              {generatedCV.skills.map((sk, idx) => (
                                <li key={idx}>{sk}</li>
                              ))}
                            </ul>
                          </div>

                          <div className="space-y-2">
                            <h3 className="text-xs font-bold uppercase tracking-widest border-b border-slate-300 pb-1 font-sans">Information & Études</h3>
                            <div className="space-y-2 text-xs">
                              <p className="font-sans"><strong>Langues:</strong> {generatedCV.languages.map((l: any) => `${l.language} (${l.level})`).join(", ")}</p>
                              <div className="space-y-1.5 pt-1">
                                {generatedCV.education.map((edu, idx) => (
                                  <p key={idx} className="text-[11px] leading-relaxed text-slate-700">
                                    <strong>{edu.degree}</strong> ({edu.year}) - {edu.school}
                                  </p>
                                ))}
                              </div>
                            </div>
                          </div>

                        </div>

                      </div>

                    </div>
                  )}

                </motion.div>
              ) : (
                /* Static empty presentation card prompt */
                <div className="bg-white dark:bg-slate-900 border border-dashed border-sky-100 dark:border-slate-800 p-12 text-center rounded-3xl h-full flex flex-col items-center justify-center py-24 shadow-sm no-print">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-400 to-sky-600 flex items-center justify-center text-white mb-6 animate-bounce shadow-lg shadow-sky-500/10">
                    <FileText className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Votre futur CV s'affichera ici</h3>
                  <p className="text-xs text-slate-450 dark:text-slate-400 mt-2 max-w-sm leading-relaxed">
                    Complétez le formulaire de gauche avec vos compétences réelles ou vos motivations puis cliquez sur <strong>"Générer mon CV"</strong>. L'IA rédigera instantanément une mise en page certifiée.
                  </p>
                </div>
              )}
            </AnimatePresence>

          </div>

        </div>

      </div>
    </div>
  );
}
