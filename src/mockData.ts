import { JobOffer, TrainingCourse, AdminGuides } from "./types";

export const MOCK_JOBS: JobOffer[] = [
  {
    id: "job-1",
    title: "Commis de Cuisine / Ayudante de Cocina",
    company: "Restaurante Las Canteras Boulevard",
    location: "Las Palmas de Gran Canaria",
    salary: "1 450€ - 1 650€ / mois",
    type: "Plein temps",
    category: "Restauration",
    description: "Nous recherchons un commis de cuisine passionné pour assister notre Chef dans la préparation de plats créatifs mêlant gastronomie canarienne et internationale. Poste idéal pour les francophones souhaitant s'insérer rapidement.",
    requirements: [
      "Notions de base en espagnol (un plus, mais non obligatoire)",
      "Capacité à travailler sous pression pendant le service du soir",
      "Ponctualité, rigueur et respect des normes d'hygiène HACCP",
      "Permis de séjour ou NIE de travail en cours d'obtention apprécié"
    ],
    benefits: [
      "Deux jours de repos consécutifs par semaine",
      "Repas fournis durant le service",
      "Possibilité de formation interne aux spécialités canariennes"
    ],
    spanishLevel: "Débutant (A1-A2)",
    postedAt: "Il y a 2 jours"
  },
  {
    id: "job-2",
    title: "Technicien Installateur de Panneaux Solaires",
    company: "CanarySun Energies Solutions",
    location: "Telde",
    salary: "1 800€ - 2 100€ / mois",
    type: "Plein temps",
    category: "Énergie Solaire",
    description: "Dans le cadre de l'expansion solaire sur l'île de Gran Canaria, vous assurez la pose, le branchement et la mise en service d'installations photovoltaïques chez les particuliers et professionnels.",
    requirements: [
      "Expérience similaire en électricité ou plomberie",
      "Bonne condition physique (travail en hauteur)",
      "Permis de conduire B en vigueur pour déplacements d'équipes",
      "Niveau intermédiaire d'espagnol requis pour le contact client"
    ],
    benefits: [
      "Véhicule de fonction partagé",
      "Primes de rendement mensuelles",
      "Équipements de sécurité de haute qualité fournis"
    ],
    spanishLevel: "Intermédiaire (B1-B2)",
    postedAt: "Il y a 3 jours"
  },
  {
    id: "job-3",
    title: "Réceptionniste Trilingue (Français/Anglais/Espagnol)",
    company: "Palmeral Beach Resort & Spa",
    location: "Maspalomas",
    salary: "1 700€ - 1 950€ / mois",
    type: "Plein temps",
    category: "Tourisme",
    description: "Rejoignez l'équipe d'accueil d'un prestigieux complexe hôtelier au sud de Gran Canaria. Vous êtes le premier point de contact pour une clientèle internationale haut de gamme.",
    requirements: [
      "Parfaite maîtrise du Français et de l'Anglais",
      "Niveau d'espagnol suffisant pour gérer l'administration de base (B1+)",
      "Aisance avec les logiciels de réservation (Opera, PMS)",
      "Excellente présentation et esprit de service"
    ],
    benefits: [
      "Bonus en fonction des ventes de prestations de loisirs annexes",
      "Aide au logement pour le premier mois de transition",
      "Accès gratuit à la salle de sport du complexe"
    ],
    spanishLevel: "Intermédiaire (B1-B2)",
    postedAt: "Il y a 1 jour"
  },
  {
    id: "job-4",
    title: "Agent d'Entretien et Nettoyage de Résidences",
    company: "ServiHogar GC",
    location: "San Bartolomé de Tirajana / Playa del Inglés",
    salary: "1 250€ - 1 400€ / mois",
    type: "Temps partiel",
    category: "Nettoyage",
    description: "Recherche plusieurs agents d'entretien pour le nettoyage de bungalows touristiques de standing durant les jours de rotation (principalement mercredis et samedis).",
    requirements: [
      "Minutie, autonomie et discrétion professionnelle",
      "Capacité de déplacement sur la zone touristique sud",
      "Aucun niveau de langue requis spécifiquement si motivation présente"
    ],
    benefits: [
      "Horaires flexibles, idéal pour étudiants",
      "Paiement des heures supplémentaires majorées",
      "Contrat stable avec possibilité d'évolution vers un plein temps"
    ],
    spanishLevel: "Aucun",
    postedAt: "Il y a 5 jours"
  },
  {
    id: "job-5",
    title: "Secrétaire Administratif Bilingue (Accueil Migrants/Étudiants)",
    company: "Asociación Canaria Integra",
    location: "Las Palmas de Gran Canaria",
    salary: "1 500€ / mois",
    type: "Plein temps",
    category: "Administration",
    description: "Soutien logistique et secrétariat de l'association. Vous traitez les demandes d'accompagnement des étudiants étrangers et des nouveaux migrants, tenez à jour la base de données et orientez les dossiers.",
    requirements: [
      "Compétences rédactionnelles claires en Espagnol et Français",
      "Connaissance des démarches de base canariennes (NIE, Empadronamiento)",
      "Sens aigu de la bienveillance sociale et écoute active",
      "Aisance avec les outils bureautiques courants"
    ],
    benefits: [
      "Une atmosphère de travail solidaire, engagée et multiculturelle",
      "Participation aux séminaires locaux de droit des étrangers"
    ],
    spanishLevel: "Avancé (C1-C1+)",
    postedAt: "Il y a 1 semaine"
  },
  {
    id: "job-6",
    title: "Serveur ou Barman (Saisonnier d'été)",
    company: "El Chiringuito de Mogán",
    location: "Puerto de Mogán",
    salary: "1 400€ + d'excellents pourboires",
    type: "Saisonnier",
    category: "Restauration",
    description: "Service de boissons exotiques, cocktails canariens et snacks sur l'un des plus magnifiques ports de l'île. Expérience humaine enrichissante assurée !",
    requirements: [
      "Bonne humeur indéboulonnable et dynamisme",
      "Notions conversationnelles d'espagnol et d'anglais touristiques",
      "Rapidité d'exécution et autonomie opérationnelle"
    ],
    benefits: [
      "Cadre de travail somptueux au bord de l'eau",
      "Tours répartis principalement l'après-midi/soir",
      "Excellente répartition des pourboires collectifs (propina)"
    ],
    spanishLevel: "Débutant (A1-A2)",
    postedAt: "Il y a 4 jours"
  }
];

export const MOCK_TRAININGS: TrainingCourse[] = [
  {
    id: "train-1",
    title: "Espagnol A1 & Intégration Professionnelle Rapide",
    category: "Español",
    description: "Apprentissage accéléré de la langue espagnole axé sur la vie quotidienne en Espagne, la recherche de logement, la rédaction d'un message professionnel et la réussite d'un entretien d'embauche local.",
    duration: "60 heures (6 semaines)",
    modality: "Hybride",
    location: "Las Palmas de GC / Zoom",
    difficulty: "Débutant",
    skillsLearnt: [
      "Vocabulaire de base canarien (guagua, tenderete, etc.)",
      "Se présenter, décrire son parcours et remplir des formulaires",
      "Négocier un contrat ou louer une colocation d'étudiants",
      "Savoir demander des renseignements administratifs cruciaux"
    ],
    startDate: "Chaque lundi",
    partners: ["Oficina de Empleo de Canarias", "Canarias Integra Association"],
    link: "cours-espagnol"
  },
  {
    id: "train-2",
    title: "Formation d'Auxiliaire de Restauration & Gastronomie Canarienne",
    category: "Restaurant",
    description: "Découvrez les secrets des arts de la table espagnols et la cuisine typique locale : de la cuisson du poulpe aux fameuses sauces 'Mojo'. Un tremplin immédiat pour l'un des secteurs les plus dynamiques de l'archipel.",
    duration: "120 heures (4 semaines intensives)",
    modality: "Présentiel",
    location: "Las Palmas de Gran Canaria (Cuisine centrale d'apprentissage)",
    difficulty: "Tous niveaux",
    skillsLearnt: [
      "Techniques de découpe professionnelles et cuisson",
      "Recettes locales iconiques : Papas Arrugadas, Ropa Vieja, Bienmesabe",
      "Obtention officielle du certificat de manipulateur d'aliments (Carnet de Manipulador)",
      "Gestion des approvisionnements locaux et hygiène HACCP"
    ],
    startDate: "15 Juin 2026",
    partners: ["Escuela de Hostelería de Las Palmas", "Hecansa (Hoteles Escuela de Canarias)"]
  },
  {
    id: "train-3",
    title: "Initiation aux Énergies Solaire Photovoltaïques & Solaires",
    category: "Solar",
    description: "Maîtriser les principes fondamentaux de l'énergie photovoltaïque autonome et raccordée au réseau électrique canarien. Gran Canaria dispose de plus de 300 jours d'ensoleillement annuel, ce qui en fait un eldorado d'emplois verts !",
    duration: "160 heures (8 semaines)",
    modality: "Présentiel",
    location: "Parque Tecnológico de Gran Canaria (Telde)",
    difficulty: "Intermédiaire",
    skillsLearnt: [
      "Lecture de plans d'ingénierie électrique solaire",
      "Câblage en série/parallèle des panneaux solaires",
      "Maintenance technique préventive et curative des onduleurs",
      "Mesure de performance environnementale de l'installation"
    ],
    startDate: "1er Juillet 2026",
    partners: ["Cabildo de Gran Canaria", "EcoCanarias Solaire S.L."]
  },
  {
    id: "train-4",
    title: "Techniques de Nettoyage Professionnel en Hôtellerie & Climatisation",
    category: "Cleaning",
    description: "Formation de haut niveau visant à apprendre les techniques de désinfection industrielle moderne et d'entretien pour les hôtels de standing et l'immense parc de bungalows touristiques canariens.",
    duration: "40 heures (2 semaines)",
    modality: "Régional",
    location: "Maspalomas / Playa del Inglés",
    difficulty: "Tous niveaux",
    skillsLearnt: [
      "Protocoles de nettoyage approfondis des hôtels 4* et 5*",
      "Utilisation sécurisée des produits chimiques professionnels",
      "Ergonomie physique du travail pour éviter les blessures",
      "Rapidité d'exécution et contrôle qualité de la literie"
    ],
    startDate: "Tous les premiers lundis du mois",
    partners: ["Asoc. Hostelería del Sur (Maspalomas)", "Canarian Clean Group"]
  },
  {
    id: "train-5",
    title: "Éco-Construction et Techniques Canariennes du Bâtiment",
    category: "Construction",
    description: "Apprenez les bases de la maçonnerie, du coffrage et des techniques canariennes traditionnelles d'isolation et d'éco-matériaux (pouzzolane, argiles locaux) adaptées aux spécificités environnementales de l'archipel.",
    duration: "200 heures (10 semaines)",
    modality: "Présentiel",
    location: "Gáldar (Plateforme d'éco-apprentissage)",
    difficulty: "Débutant",
    skillsLearnt: [
      "Lecture de plans architecturaux d'éco-villas",
      "Techniques Canariennes de maçonnerie de pierre volcanique décorative",
      "Règles élémentaires de sécurité sur les chantiers espagnols (PRL)",
      "Mise en œuvre des enduits naturels thermorégulateurs"
    ],
    startDate: "10 Septembre 2026",
    partners: ["Cabildo - Instituto de Fomento", "Gáldar Aula de Construcción Sostenible"]
  }
];

export const MOCK_ADMIN_GUIDES: AdminGuides[] = [
  {
    id: "guide-nie",
    title: "Obtenir son NIE (Numéro d'Identité d'Étranger)",
    description: "Le NIE est le document obligatoire pour pouvoir travailler, louer un logement à l'année et ouvrir un compte en banque en Espagne. Voici le cheminement exact pour l'obtenir sans stress aux Canaries.",
    difficulty: "Complexe",
    estimatedTime: "2 à 4 semaines de démarche",
    steps: [
      {
        title: "Étape 1 : Obtenir un rendez-vous (Cita Previa)",
        desc: "Il faut se rendre sur le site officiel des administrations espagnoles (Sede Electrónica) et réserver un créneau dans la province de Las Palmas (section Policía/NIE).",
        links: [{ label: "Site Officiel Sede Electrónica", url: "https://sede.administracionespublicas.gob.es/pagina/index/directorio/icpplus" }]
      },
      {
        title: "Étape 2 : Préparer et remplir le formulaire EX-15",
        desc: "Téléchargez le document d'immatriculation officiel EX-15. Remplissez tous les champs en majuscule, cochez la case 'NIE permanent' ou 'NIE temporaire' selon votre besoin de séjour."
      },
      {
        title: "Étape 3 : Payer la taxe administrative Modelo 790 (Código 012)",
        desc: "Remplissez en ligne la taxe Modelo 790, téléchargez-la et rendez-vous dans n'importe quelle banque physique locale (BBVA, Santander, Caixa) pour régler le montant au guichet automatique ou en caisse (environ 9,84 € en 2026). Conservez précieusement le reçu tamponné par la banque."
      },
      {
        title: "Étape 4 : Se présenter au commissariat de police (Policía Nacional)",
        desc: "Le jour de votre rendez-vous, présentez-vous à la Calle Sol à Las Palmas ou au commissariat sud désigné. Munissez-vous de votre passeport ou carte d'identité (+ photocopies), le formulaire EX-15 dument rempli, le reçu papelier de la Taxe 790, et votre justificatif de motif (contrat de travail, admission d'université, lettre associative, etc.)."
      }
    ],
    checklist: [
      "Passeport d'origine en cours de validité (Original + photocopie)",
      "Formulaire EX-15 rempli, imprimé et signé",
      "Taxe Modelo 790 Code 012 payée à la banque avec preuve imprimée",
      "Notification écrite de la Cita Previa (rendez-vous)",
      "Justificatif de la demande (pré-contrat, inscription école espagnole, ou fonds financiers suffisants)"
    ]
  },
  {
    id: "guide-padron",
    title: "S'inscrire à l'Empadronamiento (Enregistrement Municipal)",
    description: "L'Empadronamiento désigne l'inscription sur le registre de la mairie comme habitant de la commune. Cette pièce prouve votre domiciliation géographique régulière et débloque l'accès aux soins gratuits (médical).",
    difficulty: "Facile",
    estimatedTime: "3 à 5 jours",
    steps: [
      {
        title: "Étape 1 : Obtenir un rendez-vous à votre Ayuntamiento local",
        desc: "Selon votre lieu de résidence (Mairie de Las Palmas de Gran Canaria, Mairie de San Bartolomé de Tirajana, Mairie de Gáldar), rendez-vous sur le site de l'ayuntamiento pour obtenir une cita de 'Empadronamiento'."
      },
      {
        title: "Étape 2 : Rassembler les pièces justificatives de logement",
        desc: "Si vous êtes locataire : Amenez votre contrat de location rédigé en espagnol et la dernière quittance de loyer chargée d'électricité ou d'eau. Si vous vivez en colocation ou êtes logé chez un particulier : Amenez l'autorisation écrite (Autorización de empadronamiento) signée par le propriétaire ou colocataire principal avec sa carte d'identité à l'appui."
      },
      {
        title: "Étape 3 : Se rendre au guichet de l'Ayuntamiento",
        desc: "Le fonctionnaire vérifie vos documents et valide immédiatement l'inscription. L'employé municipal vous fournit alors le fameux 'Certificado de Empadronamiento'."
      }
    ],
    checklist: [
      "Passeport original ou carte d'identité",
      "Contrat de location original (+ photocopie) OU autorisation d'hébergement signé par l'hôte d'accueil",
      "La dernière facture d'électricité (factura de luz) de l'adresse visée",
      "Formulaire municipal d'inscription dument complété (disponible sur place ou en ligne)"
    ]
  },
  {
    id: "guide-seg-social",
    title: "S'affilier à la Seguridad Social (Sécurité Sociale espagnole)",
    description: "Nécessaire pour l'accès aux hôpitaux publics de l'archipel canarien et obligatoire pour que votre futur employeur vous déclare légalement aux impôts régionaux canariens (SCS et Trésor Public).",
    difficulty: "Moyen",
    estimatedTime: "1 à 2 jours",
    steps: [
      {
        title: "Étape 1 : Demande de numéro de sécurité sociale d'origine (NUSS)",
        desc: "Vous pouvez faire cette demande en ligne via la plateforme d'importation 'Import@ss' de la Seguridad Social espagnole en vous connectant via Cl@ve ou SMS, ou en prenant un rendez-vous dans l'un des bureaux appelés TGSS (Tesorería General de la Seguridad Social)."
      },
      {
        title: "Étape 2 : Formulaire TA1 & Copie ID",
        desc: "Présentez le formulaire espagnol officiel TA.1 complété. Mentionnez vos coordonnées, NIE de travail et coordonnées postales locales."
      },
      {
        title: "Étape 3 : Demande de la carte de santé locale (Tarjeta Sanitaria - Centro de Salud)",
        desc: "Une fois votre numéro de Seguridad Social obtenu, domiciliez-vous à votre dispensaire de santé du quartier (Centro de Salud de zone) avec votre certificat d'Empadronamiento et votre numéro de Seguridad Social pour obtenir votre carte d'assurance maladie (Tarjeta Sanitaria de Canarias)."
      }
    ],
    checklist: [
      "Document NIE ou justificatif de démarche NIE",
      "Formulaire TA.1 dument instruit et visé",
      "Passeport d'origine en cours de validité",
      "Certificat d'Empadronamiento (datant de moins de 3 mois)",
      "Contrat ou pré-contrat d'embauche s'il est déjà existant"
    ]
  }
];
