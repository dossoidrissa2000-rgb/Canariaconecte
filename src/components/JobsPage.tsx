import React, { useState, useEffect, useMemo } from "react";
import { MOCK_JOBS } from "../mockData";
import { JobOffer, JobApplication } from "../types";
import { Briefcase, Search, MapPin, Euro, BadgeAlert, Bookmark, Send, AlertTriangle, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { readStoredArray, writeStoredJson, STORAGE_KEYS } from "../utils/storage";
import {
  filterJobs,
  JOB_CATEGORIES,
  SPANISH_LEVELS,
  type JobCategoryFilter,
  type SpanishLevelFilter,
} from "../utils/job-filters";

interface JobsPageProps {
  currentUser: { email: string; fullName: string } | null;
  onNavigateToAuth: () => void;
  showToast: (message: string, type: "success" | "error" | "info") => void;
  savedJobIds: string[];
  toggleSaveJob: (jobId: string) => void;
}

export default function JobsPage({
  currentUser,
  onNavigateToAuth,
  showToast,
  savedJobIds,
  toggleSaveJob
}: JobsPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<JobCategoryFilter>("Tous");
  const [selectedSpanLevel, setSelectedSpanLevel] = useState<SpanishLevelFilter>("Tous");
  const [applyingJob, setApplyingJob] = useState<JobOffer | null>(null);
  
  // Application form fields
  const [phone, setPhone] = useState("");
  const [coverMessage, setCoverMessage] = useState("");
  const [cvOption, setCvOption] = useState("stored"); // 'stored' or 'manual'
  const [uploadedCVName, setUploadedCVName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Simulated Loading state
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  const filteredJobs = useMemo(
    () =>
      filterJobs(MOCK_JOBS, {
        searchQuery,
        category: selectedCategory,
        spanishLevel: selectedSpanLevel,
      }),
    [searchQuery, selectedCategory, selectedSpanLevel]
  );

  const activeFilterCount = [
    searchQuery.trim(),
    selectedCategory !== "Tous",
    selectedSpanLevel !== "Tous",
  ].filter(Boolean).length;

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      showToast("Veuillez vous connecter pour postuler à cette offre.", "error");
      onNavigateToAuth();
      return;
    }

    if (!phone) {
      showToast("Le numéro de téléphone est requis.", "error");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      // Create new application record
      const newApplication: JobApplication = {
        id: `app-${Date.now()}`,
        jobId: applyingJob?.id || "",
        jobTitle: applyingJob?.title || "",
        company: applyingJob?.company || "",
        appliedDate: new Date().toLocaleDateString("fr-FR"),
        status: "En cours",
        cvName: cvOption === "stored" ? "Mon CV IA CanariaConnect" : (uploadedCVName || "CV_Manuel_Importe.pdf")
      };

      // Save to LocalStorage applications
      const list = readStoredArray<JobApplication>(STORAGE_KEYS.APPLICATIONS);
      list.push(newApplication);
      writeStoredJson(STORAGE_KEYS.APPLICATIONS, list);

      setIsSubmitting(false);
      setApplyingJob(null);
      setPhone("");
      setCoverMessage("");
      showToast(`Votre candidature pour "${applyingJob?.title}" a été transmise avec succès !`, "success");
    }, 1200);
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="mb-10 text-center md:text-left">
          <span className="text-xs font-bold text-sky-500 uppercase tracking-widest bg-sky-500/10 px-3 py-1.5 rounded-full dark:text-sky-400">
            Trouvez votre voie
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mt-3 tracking-tight">
            Offres d'Emploi à <span className="bg-gradient-to-r from-sky-500 to-orange-500 bg-clip-text text-transparent">Gran Canaria</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm max-w-2xl leading-relaxed">
            Trouvez des opportunités de travail locales adaptées à votre niveau de langue (espagnol, français, anglais). Enregistrez vos favoris, postulez en direct et suivez vos démarches.
          </p>
        </div>

        {/* Dynamic Filters Bar */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-sky-100/50 dark:border-slate-800 space-y-4 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Search Input Box */}
            <div className="relative">
              <Search className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Ex: Serveur, Électricien, Las Palmas, ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl text-sm border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 dark:text-white"
              />
            </div>

            {/* Category Dropdown */}
            <div className="relative">
              <span className="absolute left-3.5 top-3 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Catégorie</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as JobCategoryFilter)}
                className="w-full pl-3 pr-4 pt-5 pb-1 rounded-xl bg-slate-50 dark:bg-slate-800/80 text-sm border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 dark:text-white cursor-pointer"
              >
                {JOB_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Spanish Requirement Filter */}
            <div className="relative">
              <span className="absolute left-3.5 top-3 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Espagnol Exigé</span>
              <select
                value={selectedSpanLevel}
                onChange={(e) => setSelectedSpanLevel(e.target.value as SpanishLevelFilter)}
                className="w-full pl-3 pr-4 pt-5 pb-1 rounded-xl bg-slate-50 dark:bg-slate-800/80 text-sm border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 dark:text-white cursor-pointer"
              >
                {SPANISH_LEVELS.map((lvl) => (
                  <option key={lvl} value={lvl}>{lvl}</option>
                ))}
              </select>
            </div>

          </div>

          {activeFilterCount > 0 && (
            <p className="text-xs text-sky-600 dark:text-sky-400 font-semibold">
              {filteredJobs.length} offre{filteredJobs.length !== 1 ? "s" : ""} correspondante
              {filteredJobs.length !== 1 ? "s" : ""}
              {activeFilterCount > 1 ? ` · ${activeFilterCount} filtres actifs` : ""}
            </p>
          )}
        </div>

        {/* Core Offers Listing Render */}
        {isLoading ? (
          /* Skeleton Loaders */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 h-56 animate-pulse space-y-4">
                <div className="flex justify-between items-center">
                  <div className="h-6 w-1/3 bg-slate-200 dark:bg-slate-800 rounded"></div>
                  <div className="h-6 w-12 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
                </div>
                <div className="h-4 w-1/2 bg-slate-100 dark:bg-slate-800 rounded"></div>
                <div className="h-4 w-3/4 bg-slate-100 dark:bg-slate-800 rounded"></div>
                <div className="flex space-x-2 pt-4">
                  <div className="h-8 w-16 bg-slate-100 dark:bg-slate-800 rounded"></div>
                  <div className="h-8 w-16 bg-slate-100 dark:bg-slate-800 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredJobs.length === 0 ? (
          /* Empty Search Fallback */
          <div className="bg-white dark:bg-slate-900 border border-sky-100 dark:border-slate-800 rounded-3xl p-12 text-center max-w-md mx-auto shadow-sm">
            <AlertTriangle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Aucune offre trouvée</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Nous n'avons trouvé aucune offre correspondant à vos critères de recherche. Essayez de modifier vos filtres ou écrivez un mot-clé générique.
            </p>
            <button
              onClick={() => { setSearchQuery(""); setSelectedCategory("Tous"); setSelectedSpanLevel("Tous"); }}
              className="mt-6 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs font-semibold cursor-pointer"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          /* Jobs Grid list */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredJobs.map((job) => {
              const isSaved = savedJobIds.includes(job.id);
              return (
                <motion.div
                  key={job.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-850 p-6 flex flex-col justify-between hover:border-sky-300 dark:hover:border-slate-700 transition-all group"
                >
                  <div>
                    {/* Upper Line */}
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <span className="inline-block text-[10px] font-bold text-sky-600 bg-sky-50 dark:text-sky-400 dark:bg-sky-950/40 px-2.5 py-1 rounded-md">
                          {job.category}
                        </span>
                        <span className="ml-2 inline-block text-[10px] font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 dark:text-slate-300 px-2 py-1 rounded-md">
                          {job.type}
                        </span>
                      </div>
                      <button
                        onClick={() => toggleSaveJob(job.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-orange-500 dark:hover:bg-slate-800 hover:bg-slate-50 transition-colors cursor-pointer"
                        title={isSaved ? "Retirer des favoris" : "Enregistrer l'offre"}
                      >
                        <Bookmark className={`w-5 h-5 ${isSaved ? "fill-orange-500 text-orange-500" : ""}`} />
                      </button>
                    </div>

                    {/* Job Details */}
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-sky-500 dark:group-hover:text-sky-400 transition-colors">
                      {job.title}
                    </h2>
                    <p className="text-slate-600 dark:text-slate-300 font-semibold text-xs mt-1">
                      {job.company}
                    </p>

                    {/* Attributes Row */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 py-3.5 border-b border-dashed border-slate-100 dark:border-slate-800 mt-2 text-xs text-slate-500 dark:text-slate-400">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                        <span className="truncate">{job.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Euro className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>{job.salary}</span>
                      </div>
                      <div className="flex items-center space-x-1 col-span-2 md:col-span-1">
                        <BadgeAlert className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span className="truncate" title={`Espagnol requis: ${job.spanishLevel}`}>
                          Espagnol: {job.spanishLevel}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-450 leading-relaxed mt-4 line-clamp-3">
                      {job.description}
                    </p>
                  </div>

                  {/* Actions Area */}
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-50 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                      Publiée {job.postedAt}
                    </span>
                    <button
                      onClick={() => setApplyingJob(job)}
                      className="px-4.5 py-2 bg-gradient-to-r from-sky-500 to-sky-600 text-white text-xs font-bold rounded-lg hover:shadow-md hover:scale-[1.02] transition-all cursor-pointer shadow-sky-500/10"
                    >
                      Postuler Directement
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Applying overlay details modal popup */}
        <AnimatePresence>
          {applyingJob && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-2xl overflow-y-auto max-h-[90vh] shadow-2xl border border-sky-100 dark:border-slate-800"
              >
                
                {/* Modal Header */}
                <div className="relative p-6 bg-gradient-to-r from-sky-50 to-sky-100/30 dark:from-slate-800 dark:to-slate-900 border-b border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => setApplyingJob(null)}
                    className="absolute right-4 top-4 p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 cursor-pointer"
                  >
                    <X className="w-4 h-4 text-slate-500 dark:text-slate-300" />
                  </button>
                  <span className="text-[10px] font-bold text-sky-600 bg-sky-100 dark:text-sky-300 dark:bg-slate-800 px-2 py-0.5 rounded uppercase">
                    {applyingJob.category}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1.5">
                    Postuler pour : {applyingJob.title}
                  </h3>
                  <p className="text-xs text-sky-600 dark:text-sky-400 font-semibold">{applyingJob.company} • {applyingJob.location}</p>
                </div>

                <div className="p-6 space-y-6">
                  {/* Job specifications */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Aperçu du poste</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                      {applyingJob.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Pré-requis obligatoires</h4>
                      <ul className="text-xs text-slate-600 dark:text-slate-300 list-disc pl-4 space-y-1">
                        {applyingJob.requirements.map((req, idx) => (
                          <li key={idx} className="leading-relaxed">{req}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Ce que l'entreprise propose</h4>
                      <ul className="text-xs text-slate-600 dark:text-slate-300 list-disc pl-4 space-y-1">
                        {applyingJob.benefits.map((ben, idx) => (
                          <li key={idx} className="leading-relaxed">{ben}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Submission Form */}
                  <form onSubmit={handleApplySubmit} className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Renseignez vos coordonnées de contact</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Nom Complet</label>
                        <input
                          type="text"
                          disabled
                          value={currentUser?.fullName || "Non connecté"}
                          className="w-full bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-lg text-xs py-2.5 px-3 border border-slate-200 dark:border-slate-700"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Adresse Email</label>
                        <input
                          type="email"
                          disabled
                          value={currentUser?.email || "Non connecté"}
                          className="w-full bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-lg text-xs py-2.5 px-3 border border-slate-200 dark:border-slate-700"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Téléphone (Canarien ou Européen)</label>
                      <input
                        type="tel"
                        required
                        placeholder="Ex: +34 600 000 000 ou 06 12 34 56 78"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-850 text-slate-800 dark:text-slate-100 rounded-lg text-xs py-2.5 px-3 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-sky-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Sélectionner un CV</label>
                      <div className="grid grid-cols-2 gap-3 mb-2">
                        <label className={`flex items-center space-x-2 p-2.5 rounded-lg border text-xs cursor-pointer ${cvOption === "stored" ? "border-sky-500 bg-sky-500/5" : "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850"}`}>
                          <input type="radio" name="cv_opt" checked={cvOption === "stored"} onChange={() => setCvOption("stored")} />
                          <div>
                            <span className="font-bold block text-slate-700 dark:text-slate-200">CV CanariaConnect</span>
                            <span className="text-[10px] text-slate-400">Généré sur la plateforme</span>
                          </div>
                        </label>
                        <label className={`flex items-center space-x-2 p-2.5 rounded-lg border text-xs cursor-pointer ${cvOption === "manual" ? "border-sky-500 bg-sky-500/5" : "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850"}`}>
                          <input type="radio" name="cv_opt" checked={cvOption === "manual"} onChange={() => setCvOption("manual")} />
                          <div>
                            <span className="font-bold block text-slate-700 dark:text-slate-200">Uploader à la main</span>
                            <span className="text-[10px] text-slate-400">Importer un PDF/Word</span>
                          </div>
                        </label>
                      </div>

                      {cvOption === "manual" && (
                        <div className="p-3 bg-slate-50 dark:bg-slate-850 rounded-lg border border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            id="cv-uploader-manual"
                            onChange={(e) => {
                              const files = e.target.files;
                              if (files && files[0]) {
                                setUploadedCVName(files[0].name);
                              }
                            }}
                            className="hidden"
                          />
                          <label htmlFor="cv-uploader-manual" className="px-3 py-1.5 bg-slate-200 dark:bg-slate-700 rounded text-slate-700 dark:text-slate-200 cursor-pointer font-bold shrink-0">
                            Sélectionner un fichier...
                          </label>
                          <span className="text-[11px] text-slate-500 ml-4 truncate">
                            {uploadedCVName || "Aucun fichier sélectionné (PDF, DOC)"}
                          </span>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Message d'accompagnement (Optionnel)</label>
                      <textarea
                        rows={3}
                        placeholder="Expliquez brièvement pourquoi ce poste vous intéresse aux Canaries..."
                        value={coverMessage}
                        onChange={(e) => setCoverMessage(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-850 text-slate-850 dark:text-slate-100 rounded-lg text-xs py-2 px-3 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-sky-500"
                      />
                    </div>

                    {currentUser ? (
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 bg-gradient-to-r from-sky-500 to-sky-600 dark:from-sky-600 dark:to-sky-700 hover:scale-[1.01] transition-transform text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-2 cursor-pointer shadow-indigo-500/10"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-4.5 h-4.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span>Envoi en cours de transmission...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            <span>Transmettre ma candidature maintenant</span>
                          </>
                        )}
                      </button>
                    ) : (
                      <div className="bg-orange-50 dark:bg-orange-950/20 p-4 rounded-xl border border-orange-200 dark:border-orange-900/40 text-center text-xs">
                        <p className="text-orange-700 dark:text-orange-400 font-semibold mb-2">
                          Vous devez être connecté à un compte pour transmettre vos candidatures.
                        </p>
                        <button
                          type="button"
                          onClick={() => { setApplyingJob(null); onNavigateToAuth(); }}
                          className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-bold"
                        >
                          Se connecter ou Créer un compte
                        </button>
                      </div>
                    )}

                  </form>
                </div>

              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
