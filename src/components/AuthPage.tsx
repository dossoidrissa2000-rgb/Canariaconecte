import React, { useState } from "react";
import { LogIn, UserPlus, Compass, Mail, Key, ShieldCheck } from "lucide-react";
import {
  readStoredArray,
  writeStoredJson,
  persistSession,
  STORAGE_KEYS,
  type UserSession,
} from "../utils/storage";
import {
  hashPassword,
  verifyPassword,
  isValidEmail,
  isValidPassword,
} from "../utils/auth";

interface StoredUser extends UserSession {
  password: string;
}

interface AuthPageProps {
  onLoginSuccess: (user: UserSession) => void;
  showToast: (message: string, type: "success" | "error" | "info") => void;
}

const DEMO_USER: UserSession = {
  email: "demo@canaria.com",
  fullName: "Idrissa Dosso",
  status: "Étudiant",
  phone: "+34 600 123 456",
};

export default function AuthPage({ onLoginSuccess, showToast }: AuthPageProps) {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState("Migrant");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const finishLogin = (user: UserSession, message: string) => {
    persistSession(user);
    onLoginSuccess(user);
    showToast(message, "success");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      showToast("Veuillez remplir votre email et mot de passe.", "error");
      return;
    }

    if (!isValidEmail(normalizedEmail)) {
      showToast("Adresse email invalide.", "error");
      return;
    }

    if (!isValidPassword(password)) {
      showToast("Le mot de passe doit contenir au moins 6 caractères.", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      if (activeTab === "login") {
        if (normalizedEmail === DEMO_USER.email && password === "demo123") {
          finishLogin(DEMO_USER, "Connexion réussie avec le compte d'apprentissage.");
          return;
        }

        const users = readStoredArray<StoredUser>(STORAGE_KEYS.USERS);
        const found = users.find((u) => u.email?.toLowerCase() === normalizedEmail);

        if (!found) {
          showToast("Identifiants incorrects ou compte inexistant.", "error");
          return;
        }

        const passwordOk = await verifyPassword(password, found.password);
        if (!passwordOk) {
          showToast("Identifiants incorrects ou compte inexistant.", "error");
          return;
        }

        if (!found.password.startsWith("sha256:")) {
          const hashed = await hashPassword(password);
          writeStoredJson(
            STORAGE_KEYS.USERS,
            users.map((u) =>
              u.email?.toLowerCase() === normalizedEmail ? { ...u, password: hashed } : u
            )
          );
        }

        finishLogin(
          {
            email: found.email,
            fullName: found.fullName,
            status: found.status,
            phone: found.phone || "",
            bio: found.bio,
          },
          `Heureux de vous revoir, ${found.fullName} !`
        );
        return;
      }

      if (!fullName.trim()) {
        showToast("Le nom complet est obligatoire.", "error");
        return;
      }

      const users = readStoredArray<StoredUser>(STORAGE_KEYS.USERS);
      if (users.some((u) => u.email?.toLowerCase() === normalizedEmail)) {
        showToast("Cette adresse email est déjà enregistrée.", "error");
        return;
      }

      const newUser: StoredUser = {
        email: normalizedEmail,
        password: await hashPassword(password),
        fullName: fullName.trim(),
        phone: phone.trim(),
        status,
      };

      if (!writeStoredJson(STORAGE_KEYS.USERS, [...users, newUser])) {
        showToast("Impossible d'enregistrer le compte. Espace local saturé.", "error");
        return;
      }

      finishLogin(
        {
          email: newUser.email,
          fullName: newUser.fullName,
          status: newUser.status,
          phone: newUser.phone,
        },
        "Votre compte CanariaConnect a été créé ! Bienvenue à Gran Canaria."
      );
    } catch {
      showToast("Une erreur est survenue. Veuillez réessayer.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSimulate = async () => {
    setIsSubmitting(true);
    try {
      const googleUser: UserSession = {
        email: "dossoidrissa2000@gmail.com",
        fullName: "Idrissa Dosso",
        status: "Résident",
        phone: "+34 622 111 222",
        bio: "Développeur Senior passionné d'intégration canarienne.",
      };

      const users = readStoredArray<StoredUser>(STORAGE_KEYS.USERS);
      if (!users.some((u) => u.email === googleUser.email)) {
        writeStoredJson(STORAGE_KEYS.USERS, [
          ...users,
          {
            ...googleUser,
            password: "OAuthManagedGoogleSession",
          },
        ]);
      }

      finishLogin(googleUser, "Authentification réussie via votre compte Google !");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-16 flex items-center justify-center transition-colors duration-300 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-sky-100/50 dark:border-slate-800 shadow-xl space-y-6 relative overflow-hidden">
          <div className="absolute right-[-40px] top-[-40px] w-24 h-24 bg-orange-500/10 dark:bg-orange-500/5 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute left-[-40px] bottom-[-40px] w-24 h-24 bg-sky-500/10 dark:bg-sky-500/5 rounded-full blur-2xl pointer-events-none" />

          <div className="text-center space-y-1">
            <div className="w-12 h-12 bg-gradient-to-tr from-sky-500 to-orange-500 rounded-xl flex items-center justify-center text-white mx-auto shadow-md shadow-sky-500/10">
              <Compass className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white pt-2">CanariaConnect Portal</h2>
            <p className="text-[11px] text-slate-400">Rejoignez la communauté active à Gran Canaria</p>
          </div>

          <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-850 rounded-xl text-xs">
            <button
              type="button"
              onClick={() => {
                setActiveTab("login");
                setEmail("");
                setPassword("");
              }}
              className={`py-2 rounded-lg font-bold cursor-pointer transition-colors flex items-center justify-center space-x-1 ${activeTab === "login" ? "bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-350 shadow-sm" : "text-slate-550 dark:text-slate-400"}`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Se Connecter</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("register");
                setEmail("");
                setPassword("");
              }}
              className={`py-2 rounded-lg font-bold cursor-pointer transition-colors flex items-center justify-center space-x-1 ${activeTab === "register" ? "bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-350 shadow-sm" : "text-slate-550 dark:text-slate-400"}`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Créer un compte</span>
            </button>
          </div>

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
                    className="w-full bg-slate-50 dark:bg-slate-850 text-slate-800 dark:text-slate-100 rounded-xl py-2.5 px-3 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-650 dark:text-slate-400 font-bold mb-1">Téléphone</label>
                    <input
                      type="tel"
                      placeholder="Ex: +34 600 000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-850 text-slate-800 dark:text-slate-100 rounded-xl py-2.5 px-3 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
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
                  autoComplete="email"
                  placeholder="nom@exemple.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 bg-slate-50 dark:bg-slate-850 text-slate-800 dark:text-slate-100 rounded-xl py-2.5 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
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
                  minLength={6}
                  autoComplete={activeTab === "login" ? "current-password" : "new-password"}
                  placeholder="Minimum 6 caractères"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 bg-slate-50 dark:bg-slate-850 text-slate-800 dark:text-slate-100 rounded-xl py-2.5 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-gradient-to-r from-sky-500 to-sky-650 hover:from-sky-600 hover:to-sky-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-1.5 cursor-pointer mt-4 transition-transform hover:scale-[1.01]"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Validation en cours...</span>
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

          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="text-center font-bold text-[10px] uppercase text-slate-400 dark:text-slate-500 tracking-wider">
              ou s'identifier rapidement avec
            </div>

            <button
              type="button"
              onClick={handleGoogleSimulate}
              disabled={isSubmitting}
              className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-750 bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-850 flex items-center justify-center space-x-2 cursor-pointer text-xs font-bold text-slate-700 dark:text-slate-250 transition-colors disabled:opacity-60"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.7 14.8 1 12 1 7.3 1 3.4 3.7 1.5 7.7l3.7 2.9C6.1 7.3 8.8 5 12 5z" />
                <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.7-2.3 3.5l3.6 2.8c2.1-2 3.7-4.9 3.7-8.5z" />
                <path fill="#FBBC05" d="M5.2 10.6c-.2-.6-.3-1.3-.3-2.1s.1-1.5.3-2.1L1.5 3.5C.5 5.4 0 7.6 0 10s.5 4.6 1.5 6.5l3.7-2.9z" />
                <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.6-2.8c-1.1.8-2.6 1.3-4.4 1.3-3.2 0-5.9-2.3-6.8-5.6l-3.7 2.9c1.9 4 5.8 6.7 10.5 6.7z" />
              </svg>
              <span>Se connecter via Google</span>
            </button>
          </div>

          <div className="bg-sky-50 dark:bg-slate-850/50 p-3 rounded-lg border border-sky-100/50 dark:border-slate-800 text-[10.5px] text-slate-500 leading-normal text-center">
            <strong>Compte de test :</strong>
            <br />
            Email: <code className="text-sky-600 dark:text-sky-400">demo@canaria.com</code> / Mot de passe:{" "}
            <code className="text-sky-600 dark:text-sky-400">demo123</code>
          </div>
        </div>
      </div>
    </div>
  );
}
