/**
 * French translations for Bongo-Lab (DRC Congo context).
 * @module translations
 */
const translations = {
  app: {
    name: 'Bongo-Lab',
    tagline: 'Simulations de physique pour les écoles secondaires',
  },
  greeting: 'Bonjour, Professeur !',
  nav: {
    home: 'Accueil',
    simulations: 'Simulations',
    about: 'À propos',
    settings: 'Paramètres',
  },
  actions: {
    start: 'Commencer',
    pause: 'Pause',
    reset: 'Réinitialiser',
    back: 'Retour',
    save: 'Enregistrer',
    close: 'Fermer',
  },
  simulations: {
    pendulum: {
      title: 'Pendule Simple',
      description: 'Étudiez le mouvement oscillatoire d\'un pendule et explorez la relation entre la longueur et la période.',
      subject: 'Mécanique',
    },
    inclinedPlane: {
      title: 'Plan Incliné',
      description: 'Analysez les forces sur un objet glissant sur un plan incliné avec ou sans frottement.',
      subject: 'Mécanique',
    },
    circuit: {
      title: 'Circuit Électrique',
      description: 'Construisez des circuits en série et en parallèle pour comprendre la loi d\'Ohm.',
      subject: 'Électricité',
    },
    optics: {
      title: 'Réflexion de la Lumière',
      description: 'Explorez les lois de la réflexion et de la réfraction avec des miroirs et des lentilles.',
      subject: 'Optique',
    },
    lever: {
      title: 'Levier Mécanique',
      description: 'Découvrez le principe du levier et l\'équilibre des moments de forces.',
      subject: 'Mécanique',
    },
  },
  status: {
    developing: 'Simulation en développement...',
    controlsPlaceholder: 'Contrôles à implémenter',
    offline: 'Vous êtes hors connexion. L\'application continue de fonctionner.',
    loading: 'Chargement...',
  },
  errors: {
    generic: 'Une erreur est survenue. Veuillez réessayer.',
    notFound: 'Page non trouvée',
    simulationError: 'Erreur dans la simulation. Veuillez réinitialiser.',
  },
};

export default translations;
