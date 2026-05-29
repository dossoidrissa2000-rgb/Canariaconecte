import React, { useState, useEffect } from "react";
import { UserProfile, JobApplication, CVData } from "../types";
import { User, Briefcase, GraduationCap, FileCode, CheckCircle2, Bookmark, AlertCircle, Save } from "lucide-react";
import { readStoredArray, writeStoredJson, STORAGE_KEYS } from "../utils/storage";

interface UserDashboardProps {
  currentUser: { email: string; fullName: string; status?: string; phone?: string; bio?: string } | null;
  onUpdateProfile: (updated: { fullName: string; phone: string; status: string; bio: string }) => void;
  showToast: (message: string, type: "success" | "error" | "info") => void;
  savedJobIds: string[];
}

export default function UserDashboard({
  currentUser,
  onUpdateProfile,
  showToast,
  savedJobIds
}: UserDashboardProps) {
  // Tabs: 'applications' | 'cvs' | 'trainings' | 'profile'
  const [activeTab, setActiveTab] = useState<"applications" | "cvs" | "trainings" | "profile">("applications");
  
  // Profile Form States
  const [fullName, setFullName] = useState(currentUser?.fullName || "");
  const [phone, setPhone] = useState(currentUser?.phone || "");
  const [status, setStatus] = useState(currentUser?.status || "Étudiant");
  const [bio, setBio] = useState(currentUser?.bio || "");
  
  // Storage Lists
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [enrollments, setEnrollments] = useState<string[]>([]);
  const [cvHistory, setCvHistory] = useState<any[]>([]);

  useEffect(() => {
    // Sync storage parameters
    setApplications(readStoredArray<JobApplication>(STORAGE_KEYS.APPLICATIONS));
    setEnrollments(readStoredArray<string>(STORAGE_KEYS.ENROLLMENTS));
    setCvHistory(readStoredArray<{ id: string; title: string; fullName: string; date: string }>(STORAGE_KEYS.CV_HISTORY));
  }, [activeTab]);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName) {
      showToast("Le nom complet est obligatoire.", "error");
      return;
    }
    onUpdateProfile({ fullName, phone, status, bio });
    showToast("Votre profil CanariaConnect a été mis à jour !", "success");
  };

  const handleRemoveApplication = (id: string) => {
    const updated = applications.filter(a => a.id !== id);
    setApplications(updated);
    writeStoredJson(STORAGE_KEYS.APPLICATIONS, updated);
    showToast("Candidature retirée de l'historique.", "info");
  };

  const handleRemoveEnrollment = (title: string) => {
    const updated = enrollments.filter(e => e !== title);
    setEnrollments(updated);
    writeStoredJson(STORAGE_KEYS.ENROLLMENTS, updated);
    showToast("Désinscription de la formation enregistrée.", "info");
  };

  const deleteCVRecord = (id: string) => {
    const updated = cvHistory.filter(c => c.id !== id);
    setCvHistory(updated);
    writeStoredJson(STORAGE_KEYS.CV_HISTORY, updated);
    showToast("CV archivé retiré de la base.", "info");
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Intro banner */}
        <div className="bg-gradient-to-r from-sky-600 to-indigo-700 rounded-3xl p-6 md:p-8 text-white mb-10 shadow-lg shadow-sky-500/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">¡Hola, {currentUser?.fullName}!</h1>
            <p className="text-xs text-sky-100 opacity-90 font-medium">
              Bienvenue dans votre espace d'accompagnement. Suivez vos candidatures et pilotez votre insertion à Gran Canaria.
            </p>
          </div>
          <div className="px-4 py-2 bg-white/10 rounded-xl text-xs font-semibold shrink-0">
            Profil actif : <span className="underline uppercase text-orange-300">{currentUser?.status || "Migrant"}</span>
          </div>
        </div>

        {/* Dashboard numerical stats cards row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex items-center space-x-4">
            <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Candidatures</span>
              <p className="text-xl font-extrabold text-slate-800 dark:text-white leading-tight">{applications.length}</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex items-center space-x-4">
            <div className="p-3 bg-orange-500/10 text-orange-500 rounded-xl">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Formations</span>
              <p className="text-xl font-extrabold text-slate-800 dark:text-white leading-tight">{enrollments.length}</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex items-center space-x-4">
            <div className="p-3 bg-sky-500/10 text-sky-500 rounded-xl">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">CVs générés</span>
              <p className="text-xl font-extrabold text-slate-800 dark:text-white leading-tight">{cvHistory.length}</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex items-center space-x-4">
            <div className="p-3 bg-red-500/10 text-red-500 rounded-xl">
              <Bookmark className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Offres Sauvegardées</span>
              <p className="text-xl font-extrabold text-slate-800 dark:text-white leading-tight">{savedJobIds.length}</p>
            </div>
          </div>

        </div>

        {/* Dynamic section tabs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left panel Selection list */}
          <div className="lg:col-span-3 space-y-2 no-print">
            <span className="text-xs uppercase font-bold text-slate-400 block px-1">Menu Utilisateur</span>
            <div className="flex flex-col space-y-1.5 bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-sky-100/50 dark:border-slate-800 shadow-sm">
              <button
                onClick={() => setActiveTab("applications")}
                className={`w-full py-2 px-3 text-left rounded-lg text-xs font-bold flex items-center space-x-2 cursor-pointer ${activeTab === "applications" ? "bg-sky-500 text-white" : "text-slate-600 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-800"}`}
              >
                <Briefcase className="w-4 h-4" />
                <span>Mes candidatures</span>
              </button>
              <button
                onClick={() => setActiveTab("trainings")}
                className={`w-full py-2 px-3 text-left rounded-lg text-xs font-bold flex items-center space-x-2 cursor-pointer ${activeTab === "trainings" ? "bg-sky-500 text-white" : "text-slate-600 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-800"}`}
              >
                <GraduationCap className="w-4 h-4" />
                <span>Mes formations</span>
              </button>
              <button
                onClick={() => setActiveTab("cvs")}
                className={`w-full py-2 px-3 text-left rounded-lg text-xs font-bold flex items-center space-x-2 cursor-pointer ${activeTab === "cvs" ? "bg-sky-500 text-white" : "text-slate-600 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-800"}`}
              >
                <FileCode className="w-4 h-4" />
                <span>Historique de mes CVs IA</span>
              </button>
              <button
                onClick={() => setActiveTab("profile")}
                className={`w-full py-2 px-3 text-left rounded-lg text-xs font-bold flex items-center space-x-2 cursor-pointer ${activeTab === "profile" ? "bg-sky-500 text-white" : "text-slate-600 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-800"}`}
              >
                <User className="w-4 h-4" />
                <span>Paramètres de mon profil</span>
              </button>
            </div>
          </div>

          {/* Right panel Core content details render */}
          <div className="lg:col-span-9 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-3xl shadow-sm min-h-[400px]">
            
            {/* APPLICATIONS TAB PANEL */}
            {activeTab === "applications" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-base font-extrabold text-slate-900 dark:text-white">Demandes d'Emploi Envoyées</h2>
                  <p className="text-xs text-slate-400 mt-1">Vous retrouverez ci-dessous la liste chronologique de vos candidatures déposées.</p>
                </div>

                {applications.length === 0 ? (
                  <div className="py-12 text-center text-xs space-y-3">
                    <AlertCircle className="w-10 h-10 text-slate-400 mx-auto" />
                    <p className="font-bold text-slate-500">Vous n'avez pas encore postulé à des offres.</p>
                    <p className="text-slate-400 text-[11px]">Rendez-vous dans la page Emplois pour trouver votre poste idéal.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                      <thead>
                        <tr className="border-b border-slate-100 dark:border-slate-800 pb-2 text-slate-400 text-[10px] uppercase font-bold">
                          <th className="py-3">Intitulé du Poste</th>
                          <th className="py-3">Entreprise</th>
                          <th className="py-3">Date d'Envoi</th>
                          <th className="py-3">Document CV utilisé</th>
                          <th className="py-3 text-center">Statut</th>
                          <th className="py-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {applications.map((app) => (
                          <tr key={app.id} className="hover:bg-slate-50/20 dark:hover:bg-slate-850/10 transition-colors">
                            <td className="py-3 font-bold text-slate-850 dark:text-white">{app.jobTitle}</td>
                            <td className="py-3 text-sky-500 font-semibold">{app.company}</td>
                            <td className="py-3 text-[11px] text-slate-400">{app.appliedDate}</td>
                            <td className="py-3 text-[11px] font-mono text-slate-500 truncate max-w-[120px]" title={app.cvName}>{app.cvName || "CV standard"}</td>
                            <td className="py-3 text-center">
                              <span className="inline-block px-2.5 py-1 text-[10px] uppercase font-bold rounded bg-amber-500/10 text-amber-500">
                                {app.status}
                              </span>
                            </td>
                            <td className="py-3 text-right">
                              <button
                                onClick={() => handleRemoveApplication(app.id)}
                                className="text-red-500 hover:text-red-600 font-bold hover:underline cursor-pointer py-1 px-2 hover:bg-red-50 dark:hover:bg-red-950/20 rounded"
                              >
                                Retirer
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* TRAININGS TAB PANEL */}
            {activeTab === "trainings" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-base font-extrabold text-slate-900 dark:text-white">Pré-inscriptions aux Formations</h2>
                  <p className="text-xs text-slate-400 mt-1">Vos pré-enregistrements pour les cours et entraînements intensifs d'espagnol.</p>
                </div>

                {enrollments.length === 0 ? (
                  <div className="py-12 text-center text-xs space-y-2">
                    <GraduationCap className="w-10 h-10 text-slate-400 mx-auto" />
                    <p className="font-bold text-slate-500">Aucun cours choisi actuellement.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {enrollments.map((courseTitle, idx) => (
                      <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-850 rounded-2xl flex items-center justify-between border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center space-x-3">
                          <div className="p-2.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-xl">
                            <GraduationCap className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white">{courseTitle}</h4>
                            <span className="text-[10px] font-medium text-emerald-500 flex items-center space-x-1 mt-0.5">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Enregistré - Confirmation en cours</span>
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleRemoveEnrollment(courseTitle)}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-500 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                        >
                          Se désinscrire
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* CVS GENERATOR HISTORY TAB PANEL */}
            {activeTab === "cvs" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-base font-extrabold text-slate-900 dark:text-white">Vos CV Rédigés par l'IA</h2>
                  <p className="text-xs text-slate-400 mt-1">Retrouvez l'historique complet des curricula générés automatiquement.</p>
                </div>

                {cvHistory.length === 0 ? (
                  <div className="py-12 text-center text-xs space-y-2">
                    <FileCode className="w-10 h-10 text-slate-400 mx-auto animate-pulse" />
                    <p className="font-bold text-slate-500">Aucun historique de CV enregistré.</p>
                    <p className="text-[11px] text-slate-400">Rendez-vous dans la section "CV avec IA" pour générer votre premier document.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {cvHistory.map((cvRecord) => (
                      <div key={cvRecord.id} className="p-4 rounded-2xl border border-sky-100 dark:border-slate-800 space-y-3 flex flex-col justify-between bg-sky-50/10">
                        <div>
                          <div className="flex justify-between items-start text-[10px] text-slate-400">
                            <span>{cvRecord.date}</span>
                            <span className="bg-sky-500/10 text-sky-500 font-bold px-2 py-0.5 rounded text-[9px] uppercase">Généré par IA</span>
                          </div>
                          <h4 className="text-sm font-bold text-slate-850 dark:text-white mt-1.5 line-clamp-1">{cvRecord.title}</h4>
                          <p className="text-xs text-slate-500">Pour : {cvRecord.fullName}</p>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-slate-100/60 dark:border-slate-800">
                          <button
                            onClick={() => deleteCVRecord(cvRecord.id)}
                            className="text-red-500 hover:underline text-[11px] font-bold cursor-pointer"
                          >
                            Désarchiver
                          </button>
                          <span className="text-[10px] text-slate-400 font-mono">ID: {cvRecord.id.substring(0, 8)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* PROFILE MODIFICATIONS TAB PANEL */}
            {activeTab === "profile" && (
              <form onSubmit={handleProfileSave} className="space-y-5 text-xs">
                <div>
                  <h2 className="text-base font-extrabold text-slate-900 dark:text-white">Paramètres Généraux du Profil</h2>
                  <p className="text-xs text-slate-400 mt-1">Ajustez vos informations pour que CanariaConnect personnalise vos propositions.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-655 dark:text-slate-400 font-bold mb-1">Nom Complet</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-850 text-slate-800 dark:text-slate-105 rounded-xl py-2.5 px-3 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-sky-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-655 dark:text-slate-400 font-bold mb-1">Numéro de Téléphone</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-850 text-slate-800 dark:text-slate-105 rounded-xl py-2.5 px-3 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-sky-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-655 dark:text-slate-400 font-bold mb-1">Statut d'Installation Actuel</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-850 text-slate-800 dark:text-slate-105 rounded-xl py-2.5 px-3 border border-slate-200 dark:border-slate-700 cursor-pointer"
                  >
                    <option value="Étudiant">Étudiant national ou étranger</option>
                    <option value="Migrant">Nouveau migrant / Aide d'insertion</option>
                    <option value="Expat">Expatrié / Digital Nomad</option>
                    <option value="Résident">Résident permanent canarien</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-655 dark:text-slate-400 font-bold mb-1">Mini-Biographie (Objectif pro, hobbies, langues parlées)</label>
                  <textarea
                    rows={4}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-850 text-slate-800 dark:text-slate-105 rounded-xl py-2 px-3 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-sky-500"
                    placeholder="Présentez-vous brièvement..."
                  />
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl font-bold flex items-center space-x-1.5 cursor-pointer hover:scale-[1.01] transition-transform shadow-md"
                >
                  <Save className="w-4 h-4" />
                  <span>Sauvegarder les modifications</span>
                </button>
              </form>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
