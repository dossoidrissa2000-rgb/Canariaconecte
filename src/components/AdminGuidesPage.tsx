import { useState, useEffect } from "react";
import { MOCK_ADMIN_GUIDES } from "../mockData";
import { AdminGuides } from "../types";
import { Landmark, Compass, Calendar, CheckSquare, Eye, Award, ExternalLink, ChevronDown, Check, FolderOpen, HeartHandshake } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { readStoredJson, writeStoredJson, STORAGE_KEYS } from "../utils/storage";

interface AdminGuidesPageProps {
  showToast: (message: string, type: "success" | "error" | "info") => void;
}

export default function AdminGuidesPage({ showToast }: AdminGuidesPageProps) {
  const [selectedGuideId, setSelectedGuideId] = useState<string>("guide-nie");
  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Load existing administrative checklist checks from localStorage
    setCheckedDocs(readStoredJson<Record<string, boolean>>(STORAGE_KEYS.ADMIN_CHECKLIST, {}));
  }, []);

  const handleToggleDoc = (docName: string) => {
    const updated = {
      ...checkedDocs,
      [docName]: !checkedDocs[docName]
    };
    setCheckedDocs(updated);
    writeStoredJson(STORAGE_KEYS.ADMIN_CHECKLIST, updated);
    
    // Toast notification if checked
    if (updated[docName]) {
      showToast(`Document "${docName}" validé !`, "success");
    }
  };

  const selectedGuide = MOCK_ADMIN_GUIDES.find(g => g.id === selectedGuideId) || MOCK_ADMIN_GUIDES[0];

  // Calculate readiness percentage
  const totalItems = selectedGuide.checklist.length;
  const checkedCount = selectedGuide.checklist.filter(item => checkedDocs[item]).length;
  const percentageReady = totalItems > 0 ? Math.round((checkedCount / totalItems) * 100) : 0;

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Block */}
        <div className="mb-10 text-center md:text-left">
          <span className="text-xs font-bold text-sky-500 uppercase tracking-widest bg-sky-500/10 px-3 py-1.5 rounded-full dark:text-sky-400">
            Intégration Locale
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mt-3 tracking-tight">
            Démarches <span className="bg-gradient-to-r from-sky-500 to-orange-500 bg-clip-text text-transparent">Administratives</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm max-w-2xl leading-relaxed">
            S'installer aux Canaries requiert des étapes précises. Utilisez nos guides interactifs pas-à-pas et assurez-vous d'avoir rassemblé toutes les pièces requises pour vos rendez-vous (Policía Nacional, Ayuntamiento).
          </p>
        </div>

        {/* Core Layout: Grid selection left, Detail content right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Quick buttons selection menu */}
          <div className="col-span-1 lg:col-span-4 space-y-4">
            
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block px-1">étapes d'installation</span>
            
            <div className="flex flex-col space-y-2.5">
              {MOCK_ADMIN_GUIDES.map((guide) => {
                const isSelected = guide.id === selectedGuideId;
                return (
                  <button
                    key={guide.id}
                    onClick={() => setSelectedGuideId(guide.id)}
                    className={`w-full p-4 rounded-2xl text-left border cursor-pointer transition-all ${
                      isSelected
                        ? "bg-white dark:bg-slate-900 border-sky-400 dark:border-sky-500 shadow-md shadow-sky-500/5 text-slate-800 dark:text-white"
                        : "bg-white/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-450 hover:bg-white"
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className={`p-2 rounded-xl ${isSelected ? "bg-sky-500 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500"}`}>
                        <Landmark className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-sky-500 dark:text-sky-400 uppercase tracking-wide block leading-none mb-1">
                          Difficulté : {guide.difficulty}
                        </span>
                        <h3 className="text-xs font-bold line-clamp-1">{guide.title}</h3>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Local Solidary Contacts Cards panel */}
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl p-6 text-white text-xs space-y-4 shadow-lg shadow-orange-500/10">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <HeartHandshake className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-sm font-extrabold uppercase tracking-wide">Urgence administrative et humaine ?</h3>
              <p className="leading-relaxed text-orange-50 opacity-90">
                Plusieurs associations à Las Palmas de Gran Canaria fournissent de l'aide alimentaire, des cours d'espagnol solidaires et un accompagnement juridique bénévole aux migrants et étudiants défavorisés.
              </p>
              <div className="space-y-2 pt-2 text-[11px] font-semibold">
                <p>📍 <strong>Croix-Rouge Las Palmas :</strong> +34 928 290 000</p>
                <p>📍 <strong>CEAR Canarias (Réfugiés) :</strong> +34 928 461 411</p>
                <p>📍 <strong>Cáritas Diocesana de Canarias :</strong> +34 928 251 740</p>
              </div>
            </div>

          </div>

          {/* RIGHT: Selected Guide Complete details & interactive documents checklists */}
          <div className="col-span-1 lg:col-span-8 space-y-6">
            
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedGuide.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-100 dark:border-slate-800 shadow-sm"
              >
                
                {/* Guide Meta block */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-slate-800 px-2.5 py-1 rounded-md mb-2 inline-block">
                      ⏰ {selectedGuide.estimatedTime}
                    </span>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">{selectedGuide.title}</h2>
                  </div>
                  <div className="text-[11px] font-semibold text-slate-500 border border-slate-200 dark:border-slate-800 p-2 rounded-xl text-center bg-slate-50 dark:bg-slate-850 shrink-0">
                    <p className="text-slate-400 dark:text-slate-500 uppercase text-[9px]">votre statut</p>
                    <p className="text-emerald-500 text-xs font-bold mt-0.5">{percentageReady}% Prêt</p>
                  </div>
                </div>

                {/* Guide description text */}
                <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed mt-6 italic">
                  {selectedGuide.description}
                </p>

                {/* PAS-A-PAS (Timeline Steps) */}
                <div className="mt-8 space-y-6">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center space-x-2">
                    <FolderOpen className="w-4 h-4 text-sky-500" />
                    <span>étapes détaillées du traitement</span>
                  </h3>

                  <div className="relative border-l border-sky-100 dark:border-slate-800/80 pl-6 ml-3 space-y-8">
                    {selectedGuide.steps.map((step, idx) => (
                      <div key={idx} className="relative">
                        <span className="absolute left-[-30px] top-1 w-6 h-6 rounded-full bg-sky-500 text-white flex items-center justify-center font-bold text-xs">
                          {idx + 1}
                        </span>
                        
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-normal">
                          {step.title}
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mt-1.5">
                          {step.desc}
                        </p>

                        {/* Interactive support links */}
                        {step.links && step.links.map((link, lIdx) => (
                          <a
                            key={lIdx}
                            href={link.url}
                            target="_blank"
                            referrerPolicy="no-referrer"
                            className="inline-flex items-center space-x-1 mt-2.5 px-3 py-1.5 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-300 font-bold text-[11px] hover:underline"
                          >
                            <span>{link.label}</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>

                {/* THE INTERACTIVE CHECKLIST COMPONENT */}
                <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800 space-y-4">
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-900 dark:text-white tracking-tight">Liste des pièces indispensables (Checklist)</h3>
                      <p className="text-[11px] text-slate-400">Cochez les pièces au fur et à mesure que vous les préparez en dossier physique.</p>
                    </div>
                    {percentageReady === 100 && (
                      <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] uppercase font-bold text-center rounded">
                        Dossier Complet ! 🎉
                      </span>
                    )}
                  </div>

                  {/* Readiness Progress Bar indicator */}
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden relative">
                    <motion.div
                      layout
                      initial={{ width: 0 }}
                      animate={{ width: `${percentageReady}%` }}
                      className="h-full bg-gradient-to-r from-sky-500 to-orange-500"
                    />
                  </div>

                  {/* Checks boxes map */}
                  <div className="space-y-2 pt-2">
                    {selectedGuide.checklist.map((docName, idx) => {
                      const isChecked = !!checkedDocs[docName];
                      return (
                        <div
                          key={idx}
                          onClick={() => handleToggleDoc(docName)}
                          className={`flex items-start space-x-3 p-3 rounded-2xl border text-xs cursor-pointer transition-colors ${
                            isChecked
                              ? "bg-emerald-500/5 dark:bg-emerald-500/5 border-emerald-300 dark:border-emerald-900"
                              : "bg-slate-50 dark:bg-slate-850 border-slate-200 dark:border-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          <div className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 ${isChecked ? "bg-emerald-500 border-emerald-500 text-white" : "border-slate-350 bg-white dark:bg-slate-800"}`}>
                            {isChecked && <Check className="w-3.5 h-3.5" />}
                          </div>
                          <span className={`leading-normal ${isChecked ? "text-emerald-700 dark:text-emerald-300 font-medium" : "text-slate-700 dark:text-slate-300"}`}>
                            {docName}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                </div>

              </motion.div>
            </AnimatePresence>

          </div>

        </div>

      </div>
    </div>
  );
}
