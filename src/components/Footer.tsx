import { Compass, HelpCircle, Mail, Phone, MapPin, ExternalLink } from "lucide-react";

interface FooterProps {
  setCurrentPage: (page: string) => void;
}

export default function Footer({ setCurrentPage }: FooterProps) {
  const localServices = [
    { name: "Mairie Las Palmas", url: "https://www.laspalmasgc.es/" },
    { name: "Cita Extraordinaria Extranjería", url: "https://sede.administracionespublicas.gob.es/" },
    { name: "Sécurité Sociale (Import@ss)", url: "https://importass.seg-social.gob.es/" },
    { name: "Service Emploi Canarien (SCE)", url: "https://www3.gobiernodecanarias.org/empleo/sce/" },
  ];

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand Presentation */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setCurrentPage("home")}>
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500 to-orange-500 flex items-center justify-center text-white">
                <Compass className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-sky-400 to-orange-400 bg-clip-text text-transparent">
                CanariaConnect
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Votre copilote digital pour vous installer, étudier, apprendre la langue espagnole et débuter votre carrière professionnelle à Gran Canaria. Ensemble, facilitons l'intégration socio-culturelle.
            </p>
          </div>

          {/* Quick Navigations */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Navigation</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setCurrentPage("emplois")} className="hover:text-amber-400 transition-colors cursor-pointer text-left">
                  Offres d'emploi locales
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage("formations")} className="hover:text-amber-400 transition-colors cursor-pointer text-left">
                  Formations gratuites & Espagnol
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage("cv-generator")} className="hover:text-amber-400 transition-colors cursor-pointer text-left">
                  Générateur de CV IA
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage("aide-admin")} className="hover:text-amber-400 transition-colors cursor-pointer text-left">
                  Dossier NIE, Empadronamiento, Aid
                </button>
              </li>
            </ul>
          </div>

          {/* Official Canarian Links */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Liens Officiels Utiles</h3>
            <ul className="space-y-2 text-xs">
              {localServices.map((service, idx) => (
                <li key={idx}>
                  <a
                    href={service.url}
                    target="_blank"
                    referrerPolicy="no-referrer"
                    className="flex items-center space-x-1 hover:text-amber-400 transition-colors"
                  >
                    <span>{service.name}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details & Localization */}
          <div className="space-y-3 text-xs text-slate-400">
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-2">CanariaConnect GC</h3>
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-orange-500" />
              <span>Las Palmas de Gran Canaria, Îles Canaries</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-sky-400" />
              <span>hola@canariaconnect.example.com</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-emerald-400" />
              <span>+34 928 123 456 (Canarias)</span>
            </div>
          </div>

        </div>

        {/* Bottom Banner */}
        <div className="mt-12 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© 2026 CanariaConnect. Fait avec passion pour accompagner les nouveaux talents à Gran Canaria.</p>
          <div className="flex space-x-4 mt-4 sm:mt-0">
            <span className="hover:text-slate-400 cursor-pointer">Conditions d'Utilisation</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">Politique de Confidentialité</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
