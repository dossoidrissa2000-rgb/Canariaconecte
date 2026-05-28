/**
 * CanariaConnect Type Definitions
 */

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  languageLevel?: string; // A1, A2, B1, B2, C1, C2
  status?: string; // Étudiant, Migrant, Expat, Résident, Autre
  bio?: string;
  avatarUrl?: string;
}

export interface JobOffer {
  id: string;
  title: string;
  company: string;
  location: string; // e.g. "Las Palmas", "Maspalomas", "Telde"
  salary: string;
  type: 'Plein temps' | 'Temps partiel' | 'Saisonnier' | 'Stage';
  category: 'Restauration' | 'Bâtiment' | 'Énergie Solaire' | 'Nettoyage' | 'Administration' | 'Tourisme';
  description: string;
  requirements: string[];
  benefits: string[];
  spanishLevel: 'Aucun' | 'Débutant (A1-A2)' | 'Intermédiaire (B1-B2)' | 'Avancé (C1-C1+)';
  postedAt: string;
}

export interface TrainingCourse {
  id: string;
  title: string;
  category: 'Restaurant' | 'Solar' | 'Cleaning' | 'Construction' | 'Español';
  description: string;
  duration: string; // e.g. "120 heures", "4 semaines"
  modality: 'Présentiel' | 'Régional' | 'En ligne' | 'Hybride';
  location: string;
  difficulty: 'Débutant' | 'Intermédiaire' | 'Tous niveaux';
  skillsLearnt: string[];
  startDate: string;
  partners: string[];
  link?: string;
}

export interface CVData {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  address: string;
  summary: string;
  skills: string[];
  languages: { language: string; level: string }[];
  experience: {
    role: string;
    company: string;
    duration: string;
    description: string;
  }[];
  education: {
    degree: string;
    school: string;
    year: string;
    description?: string;
  }[];
}

export interface AdminGuides {
  id: string;
  title: string;
  description: string;
  difficulty: 'Facile' | 'Moyen' | 'Complexe';
  estimatedTime: string;
  steps: {
    title: string;
    desc: string;
    links?: { label: string; url: string }[];
  }[];
  checklist: string[];
}

export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  appliedDate: string;
  status: 'En cours' | 'Entretien' | 'Acceptée' | 'Refusée';
  cvName?: string;
}
