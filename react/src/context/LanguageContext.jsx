import { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(localStorage.getItem("language") || "fr");
  const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem("darkMode") === "true");

  useEffect(() => {
    localStorage.setItem("language", language);
    document.documentElement.lang = language;
    
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", isDarkMode);
  }, [language, isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const translations = {
    fr: {
      // Page d'accueil
      welcome: "Bienvenue au Cinéma Cloud",
      welcome_subtitle: "Votre destination cinéma préférée",
      discover: "Découvrez",
      latest_movies: "Les derniers films",
      see_all_movies: "Voir tous les films",
      coming_soon: "Prochainement",
      special_offers: "Offres spéciales",
      discount_message: "Profitez de 20% de réduction le mardi !",
      book_now: "Réserver maintenant",
      
      // Films
      movies_available: "Films à l'affiche",
      minutes: "min",
      details: "Détails",
      book: "Réserver",
      login_to_book: "Connectez-vous pour réserver",
      loading: "Chargement",
      
      // Navigation
      home: "Accueil",
      films: "Films",
      my_reservations: "Mes réservations",
      admin_dashboard: "Tableau de bord Admin",
      profile: "Profil",
      login: "Connexion",
      signup: "Inscription",
      logout: "Déconnexion",
      dark_mode: "Mode sombre",
      language: "Langue",
      
      // Authentification
      email: "Email",
      password: "Mot de passe",
      confirm_password: "Confirmer le mot de passe",
      forgot_password: "Mot de passe oublié ?",
      no_account: "Vous n'avez pas de compte ?",
      create_account: "Créer un compte",
      already_account: "Vous avez déjà un compte ?",
      connect: "Se connecter",
      username: "Nom d'utilisateur",
      
      // Messages
      login_success: "Connexion réussie !",
      login_error: "Email ou mot de passe incorrect",
      signup_success: "Inscription réussie !",
      signup_error: "Erreur lors de l'inscription",
      required_field: "Ce champ est requis",
      password_match: "Les mots de passe ne correspondent pas",
      
      // Détails du film
      release_date: "Date de sortie",
      duration: "Durée",
      genre: "Genre",
      director: "Réalisateur",
      cast: "Casting",
      synopsis: "Synopsis",
      book_ticket: "Réserver un billet",
      
      // Réservation
      reservation_title: "Réserver pour",
      select_date: "Sélectionner une date",
      select_time: "Sélectionner une heure",
      select_seats: "Sélectionner des places",
      seat: "Place",
      seats: "Places",
      price: "Prix",
      total: "Total",
      confirm_reservation: "Confirmer la réservation",
      seats_available: "Places disponibles",
      selected: "Sélectionné",
      reserved: "Réservé",
      screen: "Écran",
      row: "Rangée",
      
      // Confirmation de réservation
      reservation_confirmed: "Réservation confirmée !",
      reservation_details: "Détails de la réservation",
      movie: "Film",
      date_time: "Date et heure",
      seat_numbers: "Numéros de siège",
      reservation_id: "Identifiant de réservation",
      print_ticket: "Imprimer le billet",
      back_to_movies: "Retour aux films",
      
      // Mes réservations
      my_reservations_title: "Mes réservations",
      no_reservations: "Vous n'avez pas encore de réservations",
      upcoming: "À venir",
      past: "Passées",
      cancel_reservation: "Annuler la réservation",
      canceled: "Annulée",
    },
    en: {
      // Home page
      welcome: "Welcome to Cinema Cloud",
      welcome_subtitle: "Your favorite cinema destination",
      discover: "Discover",
      latest_movies: "Latest Movies",
      see_all_movies: "See all movies",
      coming_soon: "Coming Soon",
      special_offers: "Special Offers",
      discount_message: "Enjoy 20% off on Tuesdays!",
      book_now: "Book Now",
      
      // Movies
      movies_available: "Movies Now Showing",
      minutes: "min",
      details: "Details",
      book: "Book",
      login_to_book: "Login to book",
      loading: "Loading",
      
      // Navigation
      home: "Home",
      films: "Movies",
      my_reservations: "My Reservations",
      admin_dashboard: "Admin Dashboard",
      profile: "Profile",
      login: "Login",
      signup: "Sign Up",
      logout: "Logout",
      dark_mode: "Dark Mode",
      language: "Language",
      
      // Authentication
      email: "Email",
      password: "Password",
      confirm_password: "Confirm Password",
      forgot_password: "Forgot password?",
      no_account: "Don't have an account?",
      create_account: "Create account",
      already_account: "Already have an account?",
      connect: "Connect",
      username: "Username",
      
      // Messages
      login_success: "Login successful!",
      login_error: "Email or password incorrect",
      signup_success: "Sign up successful!",
      signup_error: "Error during sign up",
      required_field: "This field is required",
      password_match: "Passwords do not match",
      
      // Movie details
      release_date: "Release Date",
      duration: "Duration",
      genre: "Genre",
      director: "Director",
      cast: "Cast",
      synopsis: "Synopsis",
      book_ticket: "Book a ticket",
      
      // Reservation
      reservation_title: "Book for",
      select_date: "Select a date",
      select_time: "Select a time",
      select_seats: "Select seats",
      seat: "Seat",
      seats: "Seats",
      price: "Price",
      total: "Total",
      confirm_reservation: "Confirm Reservation",
      seats_available: "Seats available",
      selected: "Selected",
      reserved: "Reserved",
      screen: "Screen",
      row: "Row",
      
      // Reservation confirmation
      reservation_confirmed: "Reservation Confirmed!",
      reservation_details: "Reservation Details",
      movie: "Movie",
      date_time: "Date & Time",
      seat_numbers: "Seat Numbers",
      reservation_id: "Reservation ID",
      print_ticket: "Print Ticket",
      back_to_movies: "Back to Movies",
      
      // My reservations
      my_reservations_title: "My Reservations",
      no_reservations: "You do not have any reservations yet",
      upcoming: "Upcoming",
      past: "Past",
      cancel_reservation: "Cancel Reservation",
      canceled: "Canceled",
    }
  };

  const t = (key) => {
    // Split the key by dots and traverse the translations object
    const keys = key.split('.');
    let value = translations[language];
    
    for (const k of keys) {
      // If the value is undefined (meaning the key doesn't exist), return the key
      if (!value || typeof value !== 'object') {
        return key;
      }
      value = value[k];
    }
    
    return value || key;
  };

  const changeLanguage = (lang) => {
    setLanguage(lang);
  };

  return (
    <LanguageContext.Provider value={{ language, t, changeLanguage, isDarkMode, toggleDarkMode }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
} 