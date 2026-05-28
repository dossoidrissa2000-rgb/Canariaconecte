import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import JobsPage from "./components/JobsPage";
import TrainingsPage from "./components/TrainingsPage";
import AICVGenerator from "./components/AICVGenerator";
import AdminGuidesPage from "./components/AdminGuidesPage";
import AuthPage from "./components/AuthPage";
import UserDashboard from "./components/UserDashboard";

import { Compass, Briefcase, GraduationCap, Landmark, FileText, CheckCircle2, ChevronRight, MessageSquare, Star, Sparkles, Building2, Eye, ShieldAlert, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { readStoredJson } from "./utils/storage";

interface UserSession {
  email: string;
  fullName: string;
  status?: string;
  phone?: string;
  bio?: string;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>("home");
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  
  // Bookmarks State Linked to localStorage
  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);
  
  // Custom Toast notification states
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" | "neutral" } | null>(null);

  // Load visual settings, credentials, and bookmarks on startup mount
  useEffect(() => {
    // 1. Dark mode sync
    const savedTheme = localStorage.getItem("canaria_theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
    }

    // 2. Auth session check
    const session = readStoredJson<UserSession | null>("canaria_session", null);
    if (session?.email && session?.fullName) {
      setCurrentUser(session);
    }

    const savedJobs = readStoredJson<string[]>("canaria_saved_jobs", []);
    if (Array.isArray(savedJobs)) {
      setSavedJobIds(savedJobs);
    }
  }, []);

  useEffect(() => {
    if (currentPage === "dashboard" && !currentUser) {
      setCurrentPage("login");
    }
  }, [currentPage, currentUser]);

  // Update dark mode class on root Html element
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("canaria_theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("canaria_theme", "light");
    }
  }, [darkMode]);

  const showToast = (message: string, type: "success" | "error" | "info" | "neutral" = "info") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const handleLoginSuccess = (user: UserSession) => {
    setCurrentUser(user);
    localStorage.setItem("canaria_session", JSON.stringify(user));
    setCurrentPage("dashboard");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("canaria_session");
    setCurrentPage("home");
    showToast("Vous avez été déconnecté avec succès.", "success");
  };

  const handleUpdateProfile = (updated: { fullName: string; phone: string; status: string; bio: string }) => {
    if (currentUser) {
      const merged = { ...currentUser, ...updated };
      setCurrentUser(merged);
      localStorage.setItem("canaria_session", JSON.stringify(merged));
    }
  };

  const toggleSaveJob = (jobId: string) => {
    let updatedList = [...savedJobIds];
    if (updatedList.includes(jobId)) {
      updatedList = updatedList.filter(id => id !== jobId);
      showToast("Offre d'emploi retirée de vos favoris.", "info");
    } else {
      updatedList.push(jobId);
      showToast("Offre d'emploi sauvegardée dans vos favoris !", "success");
    }
    setSavedJobIds(updatedList);
    localStorage.setItem("canaria_saved_jobs", JSON.stringify(updatedList));
  };

  // Static Local Testimonials dataset
  const TESTIMONIALS = [
    {
      name: "Jean-Phillippe Lambert",
      role: "Étudiant Erasmus à l'ULPGC",
      text: "L'obtention du NIE à Las Palmas me semblait insurmontable. Grâce à la checklist administrative de CanariaConnect, j'ai réuni les pièces exactes et obtenu mon sésame de travail en une seule visite au commissariat. Magique !",
      rating: 5,
      avatar: "👨‍🎓"
    },
    {
      name: "Alejandra Gómez",
      role: "Responsable RH - Sol&Arena Resorts",
      text: "Nous publions régulièrement nos offres de restauration sur CanariaConnect. Les profils de migrants formés et ayant obtenu un CV traduit par leur IA de génération de CV sont impeccablement formatés aux standards espagnols.",
      rating: 5,
      avatar: "👩‍💼"
    },
    {
      name: "Ousmane Diallo",
      role: "Migrant d'Afrique de l'Ouest instruit aux Canaries",
      text: "J'ai suivi la formation d'éco-construction et des cours intensifs d'espagnol suggérés ici. La plateforme simplifie l'insertion socioprofessionnelle avec un respect et un dévouement incroyables.",
      rating: 5,
      avatar: "👷‍♂️"
    }
  ];

  return (
    <div className="bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 min-h-screen flex flex-col justify-between transition-colors duration-300">
      
      {/* Dynamic persistent Header Navbar */}
      <Navbar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main Orchestrator Pages rendering */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          
          {/* HOME PAGE ROUTER */}
          {currentPage === "home" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-20 py-1"
            >
              
              {/* Grand Hero Section with Tropical Startup gradients */}
              <section className="relative overflow-hidden py-16 md:py-24 bg-gradient-to-br from-sky-50 via-white to-orange-50/50 dark:from-slate-900 dark:via-slate-950 dark:to-orange-950/20">
                <div className="absolute right-0 top-1/4 w-96 h-96 bg-sky-400/10 dark:bg-sky-500/5 rounded-full blur-3xl" />
                <div className="absolute left-0 bottom-1/4 w-96 h-96 bg-orange-400/10 dark:bg-orange-600/5 rounded-full blur-3xl" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center md:text-left">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
                    
                    <div className="md:col-span-7 space-y-6">
                      <span className="inline-flex items-center space-x-1 px-3.5 py-1.5 rounded-full bg-orange-500/10 dark:bg-orange-500/5 text-orange-600 dark:text-orange-400 text-xs font-bold leading-none tracking-wider uppercase">
                        <Sparkles className="w-4.5 h-4.5 text-orange-500 mr-1 animate-pulse" />
                        <span>Facilitateur d'intégration canarienne</span>
                      </span>

                      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-950 dark:text-white leading-tight">
                        Votre nouvelle vie à{" "}
                        <span className="bg-gradient-to-r from-sky-500 via-sky-600 to-orange-500 bg-clip-text text-transparent">
                          Gran Canaria
                        </span>{" "}
                        commence ici.
                      </h1>

                      <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl">
                        Un portail unique conçu sur-mesure pour les migrants, étudiants, résidents et expatriés. Trouvez des emplois, accédez à des cours certifiés, maîtrisez l’espagnol, et générez votre CV d'embauche locale en quelques clics grâce à notre IA.
                      </p>

                      <div className="flex flex-col sm:flex-row gap-3 pt-4">
                        <button
                          onClick={() => setCurrentPage("emplois")}
                          className="px-6 py-3.5 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white font-bold rounded-xl text-sm shadow-md shadow-sky-500/10 hover:shadow-lg transition-all text-center cursor-pointer flex items-center justify-center space-x-1"
                        >
                          <Briefcase className="w-5 h-5 shrink-0" />
                          <span>Trouver un emploi</span>
                        </button>
                        <button
                          onClick={() => setCurrentPage("cv-generator")}
                          className="px-6 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 text-slate-700 dark:text-slate-250 font-bold rounded-xl text-sm shadow-sm transition-all text-center cursor-pointer flex items-center justify-center space-x-1"
                        >
                          <Sparkles className="w-5 h-5 text-orange-500 shrink-0" />
                          <span>Créer mon CV alternatif avec l'IA</span>
                        </button>
                      </div>

                      {/* Small Canarian supportive stats line */}
                      <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-100 dark:border-slate-850">
                        <div>
                          <p className="text-lg font-bold text-sky-600 dark:text-sky-400 leading-none">100%</p>
                          <p className="text-[10px] text-slate-400 uppercase mt-1">Îles Canaries</p>
                        </div>
                        <div>
                          <p className="text-lg font-bold text-orange-500 leading-none">Gratuit</p>
                          <p className="text-[10px] text-slate-400 uppercase mt-1">Services sociaux</p>
                        </div>
                        <div>
                          <p className="text-lg font-bold text-emerald-500 leading-none">+500</p>
                          <p className="text-[10px] text-slate-400 uppercase mt-1">Familles aidées</p>
                        </div>
                      </div>

                    </div>

                    {/* Right Hero Image Card Representation */}
                    <div className="md:col-span-5 relative">
                      <div className="absolute inset-0 bg-gradient-to-tr from-sky-500 to-orange-500 rounded-3xl blur-xl opacity-20 pointer-events-none" />
                      
                      <div className="relative bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-3xl shadow-xl space-y-4">
                        <div className="flex items-center space-x-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                          <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center text-white text-md font-bold">
                            🏝️
                          </div>
                          <div>
                            <h3 className="text-xs font-bold text-slate-950 dark:text-white leading-tight">CanariaConnect Solidaire</h3>
                            <p className="text-[10px] text-sky-500 dark:text-orange-400 font-semibold uppercase tracking-wider">Gran Canaria Integration</p>
                          </div>
                        </div>

                        <p className="text-xs text-slate-500 leading-relaxed">
                          "Que vous veniez étudier à l'ULPGC ou commencer une nouvelle vie professionnelle, nous connectons les talents francophones, hispanophones ou anglophones avec les opportunités majeures de l'archipel."
                        </p>

                        <div className="space-y-2 pt-2 text-[10.5px] font-semibold text-slate-600 dark:text-slate-350">
                          <div className="flex items-center space-x-2 bg-slate-50 dark:bg-slate-850 p-2 rounded-lg">
                            <span className="text-emerald-500">✔</span>
                            <span>Aide Administrative au NIE facilitée</span>
                          </div>
                          <div className="flex items-center space-x-2 bg-slate-50 dark:bg-slate-850 p-2 rounded-lg">
                            <span className="text-emerald-500">✔</span>
                            <span>Formations gratuites en Solaire & Restaurant</span>
                          </div>
                        </div>
                      </div>

                    </div>

                  </div>
                </div>
              </section>

              {/* OUR SERVICES SECTION display grid */}
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20" id="services">
                <div className="text-center space-y-2 mb-12">
                  <h2 className="text-xs font-bold uppercase text-orange-500 tracking-wider">Services à Impact Direct</h2>
                  <p className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    Comment pouvons-nous vous accompagner aujourd'hui ?
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  
                  {/* Service 1: Jobs directory */}
                  <div
                    onClick={() => setCurrentPage("emplois")}
                    className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800/80 hover:border-sky-300 dark:hover:border-slate-700 shadow-sm hover:shadow transition-all group cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-slate-850 text-sky-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-sky-500 transition-colors">Offres d'Emplois locales</h3>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                      Recherchez par mot-clé et postulez avec votre profil vers les hôtels, chiringuitos, énergies et services administratifs locaux.
                    </p>
                    <div className="flex items-center space-x-1 text-sky-550 dark:text-sky-400 font-bold mt-4 text-[10.5px]">
                      <span>Découvrir les offres</span>
                      <ChevronRight className="w-4 h-4 shrink-0 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>

                  {/* Service 2: Vocational Trainings */}
                  <div
                    onClick={() => setCurrentPage("formations")}
                    className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800/80 hover:border-sky-300 dark:hover:border-slate-700 shadow-sm hover:shadow transition-all group cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-slate-850 text-orange-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-orange-500 transition-colors">Formations & Espagnol</h3>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                      Maîtrisez l'espagnol A1-B2 et formez-vous gratuitement sur des secteurs canariens très demandeurs : solaire ou gastronomie.
                    </p>
                    <div className="flex items-center space-x-1 text-orange-550 dark:text-orange-400 font-bold mt-4 text-[10.5px]">
                      <span>Voir les cours</span>
                      <ChevronRight className="w-4 h-4 shrink-0 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>

                  {/* Service 3: AI Resume Maker */}
                  <div
                    onClick={() => setCurrentPage("cv-generator")}
                    className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800/80 hover:border-sky-300 dark:hover:border-slate-700 shadow-sm hover:shadow transition-all group cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-slate-850 text-emerald-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors">CV avec Intelligence Artificielle</h3>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                      Générez un CV magnifiquement rédigé et optimisé pour l'Espagne, prêt pour l'exportation PDF papier standard en un instant.
                    </p>
                    <div className="flex items-center space-x-1 text-emerald-550 dark:text-emerald-400 font-bold mt-4 text-[10.5px]">
                      <span>Générer un CV</span>
                      <ChevronRight className="w-4 h-4 shrink-0 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>

                  {/* Service 4: Admin guidance step checklist */}
                  <div
                    onClick={() => setCurrentPage("aide-admin")}
                    className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800/80 hover:border-sky-300 dark:hover:border-slate-700 shadow-sm hover:shadow transition-all group cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-slate-850 text-indigo-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                      <Landmark className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-500 transition-colors">Guides Administratifs</h3>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                      Lisez nos guides interactifs d'obtention de NIE, Empadronamiento et Seguridad Social avec calcul de complétude de dossier.
                    </p>
                    <div className="flex items-center space-x-1 text-indigo-550 dark:text-indigo-400 font-bold mt-4 text-[10.5px]">
                      <span>Accéder aux guides</span>
                      <ChevronRight className="w-4 h-4 shrink-0 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>

                </div>
              </section>

              {/* INTEGRATED PERSISTENT CHECKLIST PROMPT SECTION */}
              <section className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-3xl max-w-7xl mx-auto px-6 py-12 md:p-12 shadow-xl relative overflow-hidden">
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-8 space-y-4">
                    <span className="text-[10px] font-bold text-orange-400 uppercase tracking-widest bg-orange-500/10 px-3 py-1.5 rounded-md">
                      C'est parti
                    </span>
                    <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">Préparez votre dossier d'installation canarienne sans stress</h2>
                    <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                      Utilisez notre module de checklist interactive lié en local. Cochez les documents requis en temps réel (EX-15, passeport certifié, Modelo 790 en banque) et sachez à tout moment si vous êtes prêt à 100% pour vos rendez-vous en commissariat.
                    </p>
                  </div>
                  <div className="lg:col-span-4 lg:text-right">
                    <button
                      onClick={() => setCurrentPage("aide-admin")}
                      className="inline-flex items-center space-x-1 px-5 py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-xl text-xs hover:scale-[1.03] transition-transform cursor-pointer shadow-lg shadow-orange-500/15"
                    >
                      <span>Vérifier mon dossier NIE / Empadronamiento</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </section>

              {/* TESTIMONIALS SECTION CAROUSEL */}
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-sky-50/50 dark:bg-slate-900/30 rounded-3xl border border-sky-100/30 dark:border-slate-800">
                <div className="text-center space-y-2 mb-12">
                  <h2 className="text-xs font-bold uppercase text-sky-600 dark:text-sky-400 tracking-wider">Témoignages & Récits de Réussite</h2>
                  <p className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    Ils se sont installés avec CanariaConnect
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {TESTIMONIALS.map((t, idx) => (
                    <div key={idx} className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-850 shadow-sm hover:scale-[1.01] transition-transform flex flex-col justify-between">
                      <div className="space-y-4">
                        <div className="flex items-center space-x-1.5 text-orange-400">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="w-3.5 h-3.5 fill-current" />
                          ))}
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed italic">
                          "{t.text}"
                        </p>
                      </div>

                      <div className="flex items-center space-x-3 mt-6 pt-4 border-t border-slate-50 dark:border-slate-800">
                        <span className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-lg">
                          {t.avatar}
                        </span>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">{t.name}</h4>
                          <span className="text-[10px] text-slate-400 font-semibold">{t.role}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

            </motion.div>
          )}

          {/* JOBS PAGES */}
          {currentPage === "emplois" && (
            <div className="no-print">
              <JobsPage
                currentUser={currentUser}
                onNavigateToAuth={() => setCurrentPage("login")}
                showToast={showToast}
                savedJobIds={savedJobIds}
                toggleSaveJob={toggleSaveJob}
              />
            </div>
          )}

          {/* TRAININGS PAGES */}
          {currentPage === "formations" && (
            <div className="no-print">
              <TrainingsPage
                currentUser={currentUser}
                onNavigateToAuth={() => setCurrentPage("login")}
                showToast={showToast}
              />
            </div>
          )}

          {/* AI CV CORNER GENERATION VIEW */}
          {currentPage === "cv-generator" && (
            <div>
              <AICVGenerator
                currentUser={currentUser}
                onNavigateToAuth={() => setCurrentPage("login")}
                showToast={showToast}
              />
            </div>
          )}

          {/* DETAILED NIE, EMPADRONAMIENTO MILITARY CHECKLISTS */}
          {currentPage === "aide-admin" && (
            <div className="no-print">
              <AdminGuidesPage showToast={showToast} />
            </div>
          )}

          {/* LOGIN / SIGNUP PORTAL SCREEN */}
          {currentPage === "login" && (
            <div className="no-print">
              <AuthPage onLoginSuccess={handleLoginSuccess} showToast={showToast} />
            </div>
          )}

          {/* SECURE CHRONOLOGICAL USER DASHBBOARD STATS */}
          {currentPage === "dashboard" && currentUser && (
            <div className="no-print">
              <UserDashboard
                currentUser={currentUser}
                onUpdateProfile={handleUpdateProfile}
                showToast={showToast}
                savedJobIds={savedJobIds}
              />
            </div>
          )}

        </AnimatePresence>
      </main>

      {/* Global Toast Alerts Notifications Container */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className={`fixed bottom-6 right-6 z-50 p-4 max-w-sm rounded-2xl shadow-xl flex items-center space-x-3 border text-xs font-bold leading-normal text-white no-print ${
              toast.type === "success"
                ? "bg-emerald-600 border-emerald-500"
                : toast.type === "error"
                ? "bg-red-600 border-red-500"
                : toast.type === "info"
                ? "bg-sky-600 border-sky-500"
                : "bg-slate-800 border-slate-700"
            }`}
          >
            <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center shrink-0">
              {toast.type === "success" ? "✓" : "!"}
            </div>
            <p>{toast.message}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modern footer layout */}
      <Footer setCurrentPage={setCurrentPage} />

    </div>
  );
}
