import { useState } from "react";
import { MOCK_TRAININGS } from "../mockData";
import { TrainingCourse } from "../types";
import { GraduationCap, Hourglass, Globe, MapPin, Search, Calendar, ChevronRight, Check, Award, School } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { readStoredJson } from "../utils/storage";

interface TrainingsPageProps {
  currentUser: { email: string; fullName: string } | null;
  onNavigateToAuth: () => void;
  showToast: (message: string, type: "success" | "neutral" | "error" | "info") => void;
}

export default function TrainingsPage({
  currentUser,
  onNavigateToAuth,
  showToast
}: TrainingsPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("Tous");
  const [selectedCourse, setSelectedCourse] = useState<TrainingCourse | null>(null);
  const [enrolling, setEnrolling] = useState<boolean>(false);
  const [selectedLanguageFocus, setSelectedLanguageFocus] = useState<string>("fr"); // support bilingual details toggle!

  const tags = ["Tous", "Español", "Restaurant", "Solar", "Cleaning", "Construction"];

  const filteredTrainings = MOCK_TRAININGS.filter((item) => {
    const matchesKeyword = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.skillsLearnt.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesTag = selectedTag === "Tous" || item.category === selectedTag;

    return matchesKeyword && matchesTag;
  });

  const handleEnrollSubmit = (courseTitle: string) => {
    if (!currentUser) {
      showToast("Veuillez d'abord créer un compte ou vous connecter pour vous inscrire.", "error");
      onNavigateToAuth();
      return;
    }

    setEnrolling(true);

    setTimeout(() => {
      // Save course enrollment inside LocalStorage
      const enrollments = readStoredJson<string[]>("canaria_enrollments", []);
      const list = Array.isArray(enrollments) ? enrollments : [];
      if (!list.includes(courseTitle)) {
        list.push(courseTitle);
        localStorage.setItem("canaria_enrollments", JSON.stringify(list));
      }

      setEnrolling(false);
      setSelectedCourse(null);
      showToast(`Félicitations ! Votre pré-inscription pour "${courseTitle}" a été enregistrée. L'école vous contactera très rapidement.`, "success");
    }, 1100);
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Block */}
        <div className="mb-10 text-center md:text-left">
          <span className="text-xs font-bold text-orange-500 uppercase tracking-widest bg-orange-500/10 px-3 py-1.5 rounded-full dark:text-orange-400">
            Formations d'Avenir
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mt-3 tracking-tight">
            Se Former à <span className="bg-gradient-to-r from-orange-500 via-sky-500 to-sky-600 bg-clip-text text-transparent">Gran Canaria</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm max-w-2xl leading-relaxed">
            Boostez votre employabilité aux Canaries grâce aux cours partenaires gratuits ou certifiés de services sociaux de l'emploi (SCS, Cabildo). Apprenez la langue et les clés des métiers du soleil.
          </p>
        </div>

        {/* Categories Tab Selector with search inputs */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          
          <div className="flex flex-wrap items-center gap-2">
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`py-1.5 px-3.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                  selectedTag === tag
                    ? "bg-slate-900 dark:bg-slate-100 dark:text-slate-900 text-white"
                    : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100"
                }`}
              >
                {tag === "Tous" ? "Toutes les formations" : tag}
              </button>
            ))}
          </div>

          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher une compétence..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-900 rounded-xl text-xs border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500 dark:text-white"
            />
          </div>

        </div>

        {/* Trainings Cards Grid Rendering */}
        {filteredTrainings.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 text-center max-w-xs mx-auto border border-dashed border-slate-200">
            <School className="w-10 h-10 text-slate-400 mx-auto" />
            <p className="text-slate-500 dark:text-slate-400 text-xs font-medium mt-3">Pas de formation correspondante à cette section.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrainings.map((course) => (
              <motion.div
                key={course.id}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  
                  {/* Category Pill Tag */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] uppercase tracking-widest font-bold bg-orange-500/10 text-orange-600 dark:text-orange-400 dark:bg-orange-500/5 px-2.5 py-1 rounded-md">
                      {course.category}
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold flex items-center space-x-1">
                      <Hourglass className="w-3 h-3 text-sky-500" />
                      <span>{course.duration}</span>
                    </span>
                  </div>

                  {/* Course Title */}
                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-amber-500 leading-snug">
                    {course.title}
                  </h3>

                  {/* Main Specifications Row */}
                  <div className="flex items-center space-x-4 text-[11px] text-slate-500 dark:text-slate-400 py-3 border-b border-slate-100/60 dark:border-slate-800/60 mt-2">
                    <div className="flex items-center space-x-1">
                      <Globe className="w-3.5 h-3.5 text-slate-400" />
                      <span>Mode: {course.modality}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-orange-500" />
                      <span className="truncate max-w-[120px]" title={course.location}>{course.location}</span>
                    </div>
                  </div>

                  {/* Short description */}
                  <p className="text-xs text-slate-550 dark:text-slate-400 leading-relaxed mt-4 line-clamp-3">
                    {course.description}
                  </p>

                  {/* Skills preview highlights */}
                  <div className="mt-4 space-y-2">
                    <h4 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Compétences acquises :</h4>
                    <div className="space-y-1.5">
                      {course.skillsLearnt.slice(0, 3).map((skill, index) => (
                        <div key={index} className="flex items-start space-x-1.5 text-xs text-slate-600 dark:text-slate-350">
                          <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span className="leading-tight">{skill}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Footer Course Part */}
                <div className="mt-6 pt-4 border-t border-slate-50 dark:border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center space-x-1 text-[10px] text-slate-400 dark:text-slate-500 leading-relaxed">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Début : {course.startDate}</span>
                  </div>
                  
                  <button
                    onClick={() => setSelectedCourse(course)}
                    className="flex items-center space-x-1 px-3.5 py-2 rounded-lg bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold leading-none cursor-pointer"
                  >
                    <span>Voir programme</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </motion.div>
            ))}
          </div>
        )}

        {/* Detailed course program overlays modal */}
        <AnimatePresence>
          {selectedCourse && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-2xl max-h-[85vh] overflow-y-auto block p-6 shadow-2xl border border-sky-100 dark:border-slate-800"
              >
                {/* Modal Header */}
                <div className="flex justify-between items-start pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
                  <div>
                    <span className="inline-block text-[10px] font-bold text-orange-600 bg-orange-100 dark:bg-slate-800 dark:text-orange-400 px-2 py-0.5 rounded-md uppercase">
                      Formation {selectedCourse.category}
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-2">
                      {selectedCourse.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 flex items-center space-x-2">
                      <span>Organisme / Lieux : <strong>{selectedCourse.location}</strong></span>
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedCourse(null)}
                    className="p-1 px-2 text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 rounded hover:bg-slate-200 cursor-pointer"
                  >
                    Fermer
                  </button>
                </div>

                {/* Modal Body Container */}
                <div className="space-y-6">
                  
                  {/* Dynamic description */}
                  <div className="space-y-2">
                    <h4 className="text-xs uppercase tracking-widest font-bold text-slate-400">Présentation du programme</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed bg-slate-55 bg-indigo-50/10 p-3 rounded-lg border border-indigo-100/10">
                      {selectedCourse.description}
                    </p>
                  </div>

                  {/* Program features breakdown */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-850 p-4 rounded-2xl text-xs">
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Détails pratiques :</span>
                      <div className="space-y-1 text-slate-650 dark:text-slate-300">
                        <p>⏱️ <strong>Durée totale :</strong> {selectedCourse.duration}</p>
                        <p>🏫 <strong>Format :</strong> {selectedCourse.modality}</p>
                        <p>📈 <strong>Niveau d'entrée :</strong> {selectedCourse.difficulty}</p>
                        <p>📅 <strong>Démarrage :</strong> {selectedCourse.startDate}</p>
                      </div>
                    </div>

                    <div className="space-y-2 border-t sm:border-t-0 sm:border-l border-slate-200 dark:border-slate-700 sm:pl-4">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Partenaires Certificateurs :</span>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {selectedCourse.partners.map((pt, idx) => (
                          <span key={idx} className="inline-flex items-center space-x-1 p-1 px-2.5 rounded bg-sky-50 dark:bg-slate-800 border border-sky-100/50 dark:border-slate-700 text-sky-700 dark:text-sky-300 font-medium">
                            <Award className="w-3.5 h-3.5 text-amber-500" />
                            <span>{pt}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Complete detailed lists of skills */}
                  <div className="space-y-2">
                    <h4 className="text-xs uppercase tracking-widest font-bold text-slate-400">Ce que vous allez savoir faire :</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {selectedCourse.skillsLearnt.map((sk, index) => (
                        <div key={index} className="flex items-start space-x-2 bg-slate-50 dark:bg-slate-850/50 p-2.5 rounded-lg border border-slate-100/50 dark:border-slate-800">
                          <span className="w-5 h-5 shrink-0 bg-emerald-500/15 rounded-full flex items-center justify-center">
                            <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          </span>
                          <span className="text-slate-700 dark:text-slate-300">{sk}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action registration buttons */}
                  <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-[11px] text-slate-400 leading-normal text-center sm:text-left max-w-sm">
                      * Les pré-inscriptions à CanariaConnect GC transmettent directement vos données aux formateurs agréés de l'Ayuntamiento.
                    </p>
                    <button
                      onClick={() => handleEnrollSubmit(selectedCourse.title)}
                      disabled={enrolling}
                      className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-650 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-2 cursor-pointer transition-all hover:scale-[1.01]"
                    >
                      {enrolling ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                          <span>Enregistrement...</span>
                        </>
                      ) : (
                        <>
                          <GraduationCap className="w-4 h-4" />
                          <span>Se pré-inscrire à ce cours gratuitement</span>
                        </>
                      )}
                    </button>
                  </div>

                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
