import React, { useState } from "react";
import { LogIn, UserPlus, Compass, HelpCircle, Mail, Key, ShieldCheck, HelpCircle as GoogleIcon } from "lucide-react";
import { motion } from "motion/react";

interface AuthPageProps {
  onLoginSuccess: (user: { email: string; fullName: string; status?: string; phone?: string; bio?: string }) => void;
  showToast: (message: string, type: "success" | "error" | "info") => void;
}

export default function AuthPage({ onLoginSuccess, showToast }: AuthPageProps) {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Registration fields
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState("Migrant"); // "Étudiant" | "Migrant" | "Résident"
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Submit handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast("Veuillez remplir votre email et mot de passe.", "error");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      if (activeTab === "login") {
        // Retrieve local directory of users to authenticate
        const users = JSON.parse(localStorage.getItem("canaria_users") || "[]");
        const found = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
        
        if (found) {
          onLoginSuccess({
            email: found.email,
            fullName: found.fullName,
            status: found.status,
            phone: found.phone || ""
          });
          showToast(`Heureux de vous revoir, ${found.fullName} !`, "success");
        } else {
          // Check for default demo logins
          if (email.toLowerCase() === "demo@canaria.com" && password === "demo123") {
            const demoUser = { email: "demo@canaria.com", fullName: "Idrissa Dosso", status: "Étudiant", phone: "+34 600 123 456" };
            onLoginSuccess(demoUser);
            showToast("Connexion réussie avec le compte d'apprentissage.", "success");
            setIsSubmitting(false);
            return;
          }
          showToast("Identifiants incorrects ou compte inexistant.", "error");
        }
      } else {
        // Signup pathway
        if (!fullName) {
          showToast("Le nom complet est obligatoire.", "error");
          setIsSubmitting(false);
          return;
        }

        const users = JSON.parse(localStorage.getItem("canaria_users") || "[]");
        const exists = users.some((u: any) => u.email.toLowerCase() === email.toLowerCase());

        if (exists) {
          showToast("Cette adresse email est déjà enregistrée.", "error");
          setIsSubmitting(false);
          return;
        }

        const newUser = { email, password, fullName, phone, status };
        users.push(newUser);
        localStorage.setItem("canaria_users", JSON.stringify(users));

        onLoginSuccess({ email, fullName, status, phone });
        showToast("Votre compte CanariaConnect a été créé ! Bienvenue à Gran Canaria.", "success");
      }
      setIsSubmitting(false);
    }, 900);
  };

  // Google Login simulated helper
  const handleGoogleSimulate = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const googleUser = {
        email: "dossoidrissa2000@gmail.com",
        fullName: "Idrissa Dosso",
        status: "Résident",
        phone: "+34 622 111 222",
        bio: "Développeur Senior passionné d'intégration canarienne."
      };
      
      // Save user reference
      const users = JSON.parse(localStorage.getItem("canaria_users") || "[]");
      if (!users.some((u: any) => u.email === googleUser.email)) {
        users.push({ ...googleUser, password: "OAuthManagedGoogleSession" });
        localStorage.setItem("canaria_users", JSON.stringify(users));
      }

      onLoginSuccess(googleUser);
      showToast("Authentification réussie via votre compte Google !", "success");
      setIsSubmitting(false);
    }, 700);
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-16 flex items-center justify-center transition-colors duration-300">
      <div className="max-w-md w-full px-4">
        
        {/* Portal block wrapper */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-sky-100/50 dark:border-slate-800 shadow-xl space-y-6 relative overflow-hidden">
          
          {/* Decorative sunset glow circle inside login screen */}
          <div className="absolute right-[-40px] top-[-40px] w-24 h-24 bg-orange-500/10 dark:bg-orange-500/5 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute left-[-40px] bottom-[-40px] w-24 h-24 bg-sky-500/10 dark:bg-sky-500/5 rounded-full blur-2xl pointer-events-none" />

          {/* Icon Brand display header */}
          <div className="text-center space-y-1">
            <div className="w-12 h-12 bg-gradient-to-tr from-sky-500 to-orange-500 rounded-xl flex items-center justify-center text-white mx-auto shadow-md shadow-sky-500/10">
              <Compass className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white pt-2">CanariaConnect Portal</h2>
            <p className="text-[11px] text-slate-400">Rejoignez la communauté active à Gran Canaria</p>
          </div>

          {/* Sliding Tabs selector triggers */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-850 rounded-xl text-xs">
            <button
              onClick={() => { setActiveTab("login"); setEmail(""); setPassword(""); }}
              className={`py-2 rounded-lg font-bold cursor-pointer transition-colors flex items-center justify-center space-x-1 ${activeTab === "login" ? "bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-350 shadow-sm" : "text-slate-550 dark:text-slate-400"}`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Se Connecter</span>
            </button>
            <button
              onClick={() => { setActiveTab("register"); setEmail(""); setPassword(""); }}
              className={`py-2 rounded-lg font-bold cursor-pointer transition-colors flex items-center justify-center space-x-1 ${activeTab === "register" ? "bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-350 shadow-sm" : "text-slate-550 dark:text-slate-400"}`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Créer un compte</span>
            </button>
          </div>

          {/* Auth form input values */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            
            {activeTab === "register" && (
              <>
                <div>
                  <label className="block text-slate-650 dark:text-slate-400 font-bold mb-1">Nom Complet</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Idrissa Dosso"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-850 text-slate-800 dark:text-slate-100 rounded-xl py-2.5 px-3 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-650 dark:text-slate-400 font-bold mb-1">Téléphone</label>
                    <input
                      type="tel"
                      placeholder="Ex: +34 600 000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-850 text-slate-800 dark:text-slate-100 rounded-xl py-2.5 px-3 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-sky-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-650 dark:text-slate-400 font-bold mb-1">Votre Profil</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-850 text-[11px] text-slate-800 dark:text-slate-100 rounded-xl py-2.5 px-2.5 border border-slate-200 dark:border-slate-700 cursor-pointer"
                    >
                      <option value="Migrant">Migrant</option>
                      <option value="Étudiant">Étudiant</option>
                      <option value="Résident">Résident local</option>
                      <option value="Expat">Expat / Digital Nomad</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-slate-655 dark:text-slate-400 font-bold mb-1">Adresse Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  placeholder="nom@exemple.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 bg-slate-50 dark:bg-slate-850 text-slate-800 dark:text-slate-100 rounded-xl py-2.5 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-655 dark:text-slate-400 font-bold mb-1">Mot de passe</label>
              <div className="relative">
                <Key className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  placeholder="Minimum 6 caractères"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 bg-slate-50 dark:bg-slate-850 text-slate-800 dark:text-slate-100 rounded-xl py-2.5 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-gradient-to-r from-sky-500 to-sky-650 hover:bg-sky-600 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-1.5 cursor-pointer mt-4 transition-transform hover:scale-[1.01]"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  <span>Validation au registre...</span>
                </>
              ) : activeTab === "login" ? (
                <>
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Accéder à mon espace sécurisé</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>S'enregistrer sur Gran Canaria</span>
                </>
              )}
            </button>

          </form>

          {/* Divider and Google auth triggers */}
          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="text-center font-bold text-[10px] uppercase text-slate-400 dark:text-slate-500 tracking-wider">
              ou s'identifier rapidement avec
            </div>
            
            <button
              onClick={handleGoogleSimulate}
              disabled={isSubmitting}
              className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-750 bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-850 flex items-center justify-center space-x-2 cursor-pointer text-xs font-bold text-slate-700 dark:text-slate-250 transition-colors"
            >
              {/* Simple stylized SVG for google */}
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.7 14.8 1 12 1 7.3 1 3.4 3.7 1.5 7.7l3.7 2.9C6.1 7.3 8.8 5 12 5z" />
                <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.7-2.3 3.5l3.6 2.8c2.1-2 3.7-4.9 3.7-8.5z" />
                <path fill="#FBBC05" d="M5.2 10.6c-.2-.6-.3-1.3-.3-2.1s.1-1.5.3-2.1L1.5 3.5C.5 5.4 0 7.6 0 10s.5 4.6 1.5 6.5l3.7-2.9z" />
                <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.6-2.8c-1.1.8-2.6 1.3-4.4 1.3-3.2 0-5.9-2.3-6.8-5.6l-3.7 2.9c1.9 4 5.8 6.7 10.5 6.7z" />
              </svg>
              <span>Se connecter via Google</span>
            </button>
          </div>

          <div className="bg-sky-50 dark:bg-slate-850/50 p-3 rounded-lg border border-sky-100/50 dark:border-slate-800 text-[10.5px] text-slate-500 leading-normal text-center">
            💡 <strong>Compte de test pré-installé :</strong><br />
            Email: <code>demo@canaria.com</code> / Passe: <code>demo123</code>
          </div>

        </div>

      </div>
    </div>
  );
}
