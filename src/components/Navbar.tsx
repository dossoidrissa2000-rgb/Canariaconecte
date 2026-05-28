import { useState } from "react";
import { Compass, Menu, X, Sun, Moon, LogIn, User, CircleHelp, Briefcase, GraduationCap, FileCode, Landmark } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface NavbarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  currentUser: { email: string; fullName: string } | null;
  onLogout: () => void;
}

export default function Navbar({
  currentPage,
  setCurrentPage,
  darkMode,
  setDarkMode,
  currentUser,
  onLogout
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: "home", label: "Accueil", icon: Compass },
    { id: "emplois", label: "Emplois", icon: Briefcase },
    { id: "formations", label: "Formations", icon: GraduationCap },
    { id: "cv-generator", label: "CV avec IA", icon: FileCode },
    { id: "aide-admin", label: "Aide Administrative", icon: Landmark },
  ];

  const handleNavClick = (pageId: string) => {
    setCurrentPage(pageId);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-sky-100 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo - Tropical startup styled */}
          <div 
            onClick={() => handleNavClick("home")}
            className="flex items-center space-x-2 cursor-pointer group"
            id="brand-logo-trigger"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 via-sky-600 to-orange-500 flex items-center justify-center text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform duration-200">
              <Compass className="w-6 h-6 animate-spin-slow text-white" />
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-sky-600 via-sky-500 to-orange-500 bg-clip-text text-transparent tracking-tight">
                CanariaConnect
              </span>
              <span className="block text-[9px] font-semibold text-sky-500 dark:text-orange-400 uppercase tracking-widest leading-none">
                Gran Canaria
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-desktop-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-sky-50 dark:bg-slate-800 text-sky-600 dark:text-sky-400 shadow-sm border border-sky-100/50 dark:border-slate-700/50"
                      : "text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"
                      transition={{ type: "spring", stiffness: 350, damping: 35 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* User Status, Theme Toggle, Authentication Options */}
          <div className="hidden lg:flex items-center space-x-3">
            {/* Dark Mode toggle button */}
            <button
              id="theme-toggle-desktop"
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:scale-110 transition-transform duration-100 cursor-pointer"
              title="Changer de thème"
            >
              {darkMode ? <Sun className="w-4 h-4 text-orange-400" /> : <Moon className="w-4 h-4 text-sky-600" />}
            </button>

            {/* Profile/Auth Button */}
            {currentUser ? (
              <div className="flex items-center space-x-2 bg-sky-50/50 dark:bg-slate-800/80 p-1 pr-3 rounded-lg border border-sky-100/50 dark:border-slate-800">
                <button
                  id="nav-to-dashboard-desktop"
                  onClick={() => handleNavClick("dashboard")}
                  className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-400 to-sky-600 flex items-center justify-center text-white text-xs font-bold shadow-sm cursor-pointer"
                >
                  {currentUser.fullName ? currentUser.fullName.substring(0, 2).toUpperCase() : "US"}
                </button>
                <div className="text-left">
                  <span 
                    onClick={() => handleNavClick("dashboard")}
                    className="block text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer hover:underline line-clamp-1 max-w-[120px]"
                  >
                    {currentUser.fullName}
                  </span>
                  <button 
                    onClick={onLogout}
                    className="block text-[10px] text-red-500 dark:text-red-400 font-medium hover:underline cursor-pointer text-left leading-none"
                  >
                    Déconnexion
                  </button>
                </div>
              </div>
            ) : (
              <button
                id="nav-to-auth-desktop"
                onClick={() => handleNavClick("login")}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white text-sm font-semibold rounded-lg shadow-sm shadow-sky-500/10 cursor-pointer transition-all hover:scale-[1.02]"
              >
                <LogIn className="w-4 h-4" />
                <span>Se connecter</span>
              </button>
            )}
          </div>

          {/* Hamburger Menu Mobile */}
          <div className="flex lg:hidden items-center space-x-2">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
            >
              {darkMode ? <Sun className="w-4.5 h-4.5 text-orange-400" /> : <Moon className="w-4.5 h-4.5 text-sky-600" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
              id="mobile-hamburger"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-sky-100 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden"
          >
            <div className="px-2 pt-2 pb-4 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    id={`nav-mobile-${item.id}`}
                    onClick={() => handleNavClick(item.id)}
                    className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                      isActive
                        ? "bg-sky-500 text-white"
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}

              {currentUser ? (
                <>
                  <button
                    id="nav-mobile-dashboard"
                    onClick={() => handleNavClick("dashboard")}
                    className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-base font-medium ${
                      currentPage === "dashboard" ? "bg-sky-500 text-white" : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <User className="w-5 h-5" />
                    <span>Mon Tableau de bord ({currentUser.fullName})</span>
                  </button>
                  <button
                    onClick={() => {
                      onLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center space-x-3 w-full px-4 py-3 text-red-500 dark:text-red-400 rounded-lg text-base font-medium hover:bg-red-50 dark:hover:bg-red-900/10"
                  >
                    <LogIn className="w-5 h-5" />
                    <span>Se déconnecter</span>
                  </button>
                </>
              ) : (
                <button
                  id="nav-mobile-login"
                  onClick={() => handleNavClick("login")}
                  className="flex items-center space-x-3 w-full px-4 py-3 bg-gradient-to-r from-sky-500 to-sky-600 text-white rounded-lg text-base font-semibold"
                >
                  <LogIn className="w-5 h-5" />
                  <span>Se connecter / S'enregistrer</span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
