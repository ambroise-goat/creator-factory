import { createContext, useContext, useState } from "react";

const LanguageContext = createContext();

const translations = {
  en: {
    // Navbar
    nav_dashboard: "Dashboard",
    nav_logout: "Logout",
    nav_join: "Join the Program",

    // Footer
    footer_tagline: "Make Minecraft Videos and Get Paid.",
    footer_join: "Join",

    // Landing — Hero
    hero_title1: "Make Minecraft Videos",
    hero_title2: "and Get Paid",
    hero_subtitle: "Create short videos for our Minecraft servers, share your personalized IP, and earn money based on your performance.",
    hero_cta_join: "Join the Program",
    hero_cta_how: "See How It Works",

    // Landing — How It Works
    how_title: "How It Works",
    how_step1_title: "Claim your IP",
    how_step1_desc: "Register and reserve a personalized subdomain like yourname.blocaria.com. This is your unique link — every player who joins through it is attributed to you.",
    how_step2_title: "Post & Earn",
    how_step2_desc: "Make short-form videos with your IP as the CTA, submit the URLs on your dashboard, and get paid per unique join or per 1k views.",

    // Landing — Videos
    videos_title: "Example Creator Videos",

    // Landing — Servers
    servers_title: "Our Servers",
    servers_learnmore: "Learn more →",

    // Join — Step 1
    join_title: "Join the Program",
    join_subtitle: "Tell us about yourself to get started.",
    join_fullname: "Full name",
    join_email: "Email",
    join_discord: "Discord username",
    join_creator_type: "Creator type",
    join_platform: "Preferred platform",
    join_continue: "Continue",

    // Join — Step 2
    join_claim_title: "Claim Your IP",
    join_claim_subtitle: "Choose a unique prefix for your personalized server IP.",
    join_server: "Server",
    join_prefix: "Your prefix",
    join_check: "Check",
    join_ip_preview: "Your IP will be",
    join_taken: "This IP is already taken. Try another.",
    join_available: "Available!",
    join_claim_btn: "Claim this IP",
    join_back: "← Back",

    // Dashboard
    dash_earnings_label: "Estimated Earnings",
    dash_cap: "Cap:",
    dash_stat_total: "Total Videos Submitted",
    dash_stat_approved: "Approved Videos",
    dash_stat_earnings: "Estimated Earnings ($)",
    dash_submit_title: "Submit a Video",
    dash_server: "Server",
    dash_video_title: "Video title",
    dash_platform_urls: "Platform URLs",
    dash_platform_required: "(at least one required)",
    dash_platform_error: "Please enter at least one platform URL.",
    dash_submit_btn: "Submit Video",
    dash_table_title: "Title",
    dash_table_server: "Server",
    dash_table_platforms: "Platforms",
    dash_table_status: "Status",
    dash_table_views: "Views",
    dash_table_joins: "Joins",
    dash_table_earnings: "Earnings",
    dash_untitled: "Untitled",
    dash_est: "est.",
    dash_tab_brief: "Brief",
    dash_tab_examples: "Examples",
    dash_tab_faq: "FAQ",

    // Dashboard — Brief
    brief_goal_label: "Goal:",
    brief_goal: "Create short-form vertical videos (30–60 seconds) that showcase exciting moments on the server and drive players to join.",
    brief_cta_label: "Required CTA:",
    brief_cta: "Every video must include your personalized IP as a call-to-action, either spoken, shown on-screen, or both. Example: \"Join me at martin.blocaria.com!\"",
    brief_ideas_label: "Content ideas:",
    brief_ideas: "Epic builds, PvP moments, first-time reactions, tutorials, server events, hidden secrets.",
    brief_donot_label: "Do not:",
    brief_donot: "Use offensive language, show exploits/hacks, or include content from other servers.",

    // Dashboard — FAQ
    faq_q1: "When do I get paid?",
    faq_a1: "Payments are processed monthly. Once your videos are approved and earnings are calculated, you'll receive payment via your preferred method.",
    faq_q2: "Who is eligible?",
    faq_a2: "Anyone with a YouTube, TikTok, Instagram, or Snapchat account can join. There's no minimum follower count required.",
    faq_q3: "Is there an earnings cap?",
    faq_a3: "Yes, there is a per-creator earnings cap set by the admin. Check your dashboard for the current cap amount.",

    // Claim IP form
    claim_another: "+ Claim another IP",
    claim_title: "Claim a new server IP",
    claim_already: "Already claimed:",
    claim_server: "Server",
    claim_prefix: "Prefix",
    claim_check: "Check",
    claim_preview: "Preview:",
    claim_taken: "This prefix is already taken.",
    claim_available: "Available!",
    claim_btn: "Claim IP",
    claim_cancel: "Cancel",

    // Server detail
    server_back: "← Back",
    server_cta: "Become a Creator for",
    server_no_desc: "No description available yet.",

    // Admin
    admin_title: "Admin Panel",
    admin_tab_creators: "Creators",
    admin_tab_videos: "Video Review",
    admin_tab_settings: "Settings",
    admin_export_csv: "Export CSV",
    admin_no_creators: "No creators yet.",
    admin_no_videos: "No videos submitted yet.",
    admin_col_name: "Name",
    admin_col_email: "Email",
    admin_col_discord: "Discord",
    admin_col_ip: "IP",
    admin_col_server: "Server",
    admin_col_joined: "Joined",
    admin_col_videos: "Videos",
    admin_col_earnings: "Earnings",
    admin_col_status: "Status",
    admin_col_creator: "Creator",
    admin_col_title: "Title",
    admin_col_links: "Links",
    admin_col_date: "Date",
    admin_col_views: "Views",
    admin_col_joins: "Joins",
    admin_col_actions: "Actions",
    admin_approve: "Approve",
    admin_reject: "Reject",
    admin_confirm: "Confirm",
    admin_cancel: "Cancel",
    admin_monetization: "Monetization",
    admin_rate_join: "Rate per join ($)",
    admin_rate_views: "Rate per 1k views ($)",
    admin_cap: "Earnings cap per creator ($)",
    admin_program_name: "Program name",
    admin_save: "Save Settings",
    admin_saved: "Settings saved!",
    admin_servers_title: "Servers",
    admin_server_name: "Name",
    admin_server_domain: "Domain",
    admin_server_desc_short: "Short description (homepage card)",
    admin_server_desc_long: "Full description (server page)",
    admin_server_add: "+ Add Server",
    admin_server_save: "Save Servers",
    admin_server_saved: "Saved!",
    admin_server_delete: "Delete",
    admin_danger_title: "Danger Zone",
    admin_danger_desc: "Permanently deletes all creators, videos, and resets all data. Cannot be undone.",
    admin_danger_btn: "Reset All Data",
    admin_danger_confirm: "Reset ALL data? This cannot be undone.",
    admin_stat_creators: "Total Creators",
    admin_stat_videos: "Total Videos",
    admin_stat_pending: "Pending Reviews",
    admin_stat_paid: "Total Paid Out",
  },

  fr: {
    // Navbar
    nav_dashboard: "Tableau de bord",
    nav_logout: "Déconnexion",
    nav_join: "Rejoindre le programme",

    // Footer
    footer_tagline: "Crée des vidéos Minecraft et sois payé.",
    footer_join: "Rejoindre",

    // Landing — Hero
    hero_title1: "Crée des vidéos Minecraft",
    hero_title2: "et sois payé",
    hero_subtitle: "Crée des vidéos courtes pour nos serveurs Minecraft, partage ton IP personnalisée, et gagne de l'argent en fonction de tes performances.",
    hero_cta_join: "Rejoindre le programme",
    hero_cta_how: "Comment ça marche",

    // Landing — How It Works
    how_title: "Comment ça marche",
    how_step1_title: "Claim ton IP",
    how_step1_desc: "Inscris-toi et réserve un sous-domaine personnalisé comme tonpseudo.blocaria.com. C'est ton lien unique — chaque joueur qui rejoint via ce lien t'est attribué.",
    how_step2_title: "Poste & Gagne",
    how_step2_desc: "Fais des vidéos courtes avec ton IP en call-to-action, soumets les liens sur ton dashboard, et sois payé par joueur unique ou par 1k vues.",

    // Landing — Videos
    videos_title: "Vidéos de creators",

    // Landing — Servers
    servers_title: "Nos serveurs",
    servers_learnmore: "En savoir plus →",

    // Join — Step 1
    join_title: "Rejoindre le programme",
    join_subtitle: "Dis-nous qui tu es pour commencer.",
    join_fullname: "Nom complet",
    join_email: "Email",
    join_discord: "Pseudo Discord",
    join_creator_type: "Type de creator",
    join_platform: "Plateforme préférée",
    join_continue: "Continuer",

    // Join — Step 2
    join_claim_title: "Claim ton IP",
    join_claim_subtitle: "Choisis un préfixe unique pour ton IP de serveur personnalisée.",
    join_server: "Serveur",
    join_prefix: "Ton préfixe",
    join_check: "Vérifier",
    join_ip_preview: "Ton IP sera",
    join_taken: "Cette IP est déjà prise. Essaies-en une autre.",
    join_available: "Disponible !",
    join_claim_btn: "Claim cette IP",
    join_back: "← Retour",

    // Dashboard
    dash_earnings_label: "Gains estimés",
    dash_cap: "Plafond :",
    dash_stat_total: "Vidéos soumises",
    dash_stat_approved: "Vidéos approuvées",
    dash_stat_earnings: "Gains estimés ($)",
    dash_submit_title: "Soumettre une vidéo",
    dash_server: "Serveur",
    dash_video_title: "Titre de la vidéo",
    dash_platform_urls: "Liens par plateforme",
    dash_platform_required: "(au moins un requis)",
    dash_platform_error: "Merci d'entrer au moins un lien de plateforme.",
    dash_submit_btn: "Soumettre la vidéo",
    dash_table_title: "Titre",
    dash_table_server: "Serveur",
    dash_table_platforms: "Plateformes",
    dash_table_status: "Statut",
    dash_table_views: "Vues",
    dash_table_joins: "Rejoints",
    dash_table_earnings: "Gains",
    dash_untitled: "Sans titre",
    dash_est: "est.",
    dash_tab_brief: "Brief",
    dash_tab_examples: "Exemples",
    dash_tab_faq: "FAQ",

    // Dashboard — Brief
    brief_goal_label: "Objectif :",
    brief_goal: "Crée des vidéos verticales courtes (30–60 secondes) qui montrent des moments forts sur le serveur et donnent envie de rejoindre.",
    brief_cta_label: "CTA obligatoire :",
    brief_cta: "Chaque vidéo doit inclure ton IP personnalisée en call-to-action, à l'oral, à l'écran, ou les deux. Exemple : \"Rejoins-moi sur martin.blocaria.com !\"",
    brief_ideas_label: "Idées de contenu :",
    brief_ideas: "Constructions épiques, moments PvP, premières réactions, tutoriels, événements serveur, secrets cachés.",
    brief_donot_label: "À éviter :",
    brief_donot: "Langage offensant, exploits/hacks, ou contenu provenant d'autres serveurs.",

    // Dashboard — FAQ
    faq_q1: "Quand suis-je payé ?",
    faq_a1: "Les paiements sont traités chaque mois. Une fois tes vidéos approuvées et tes gains calculés, tu seras payé via ta méthode préférée.",
    faq_q2: "Qui peut participer ?",
    faq_a2: "Toute personne ayant un compte YouTube, TikTok, Instagram ou Snapchat peut rejoindre. Aucun minimum d'abonnés requis.",
    faq_q3: "Y a-t-il un plafond de gains ?",
    faq_a3: "Oui, il y a un plafond de gains par creator défini par l'admin. Consulte ton dashboard pour connaître le montant actuel.",

    // Claim IP form
    claim_another: "+ Claim une autre IP",
    claim_title: "Claim une nouvelle IP",
    claim_already: "Déjà claim :",
    claim_server: "Serveur",
    claim_prefix: "Préfixe",
    claim_check: "Vérifier",
    claim_preview: "Aperçu :",
    claim_taken: "Ce préfixe est déjà pris.",
    claim_available: "Disponible !",
    claim_btn: "Claim l'IP",
    claim_cancel: "Annuler",

    // Server detail
    server_back: "← Retour",
    server_cta: "Devenir creator pour",
    server_no_desc: "Aucune description disponible pour l'instant.",

    // Admin
    admin_title: "Panneau Admin",
    admin_tab_creators: "Creators",
    admin_tab_videos: "Revue des vidéos",
    admin_tab_settings: "Paramètres",
    admin_export_csv: "Exporter CSV",
    admin_no_creators: "Aucun creator pour l'instant.",
    admin_no_videos: "Aucune vidéo soumise pour l'instant.",
    admin_col_name: "Nom",
    admin_col_email: "Email",
    admin_col_discord: "Discord",
    admin_col_ip: "IP",
    admin_col_server: "Serveur",
    admin_col_joined: "Inscrit",
    admin_col_videos: "Vidéos",
    admin_col_earnings: "Gains",
    admin_col_status: "Statut",
    admin_col_creator: "Creator",
    admin_col_title: "Titre",
    admin_col_links: "Liens",
    admin_col_date: "Date",
    admin_col_views: "Vues",
    admin_col_joins: "Rejoints",
    admin_col_actions: "Actions",
    admin_approve: "Approuver",
    admin_reject: "Rejeter",
    admin_confirm: "Confirmer",
    admin_cancel: "Annuler",
    admin_monetization: "Monétisation",
    admin_rate_join: "Taux par joueur rejoint ($)",
    admin_rate_views: "Taux par 1k vues ($)",
    admin_cap: "Plafond de gains par creator ($)",
    admin_program_name: "Nom du programme",
    admin_save: "Enregistrer",
    admin_saved: "Enregistré !",
    admin_servers_title: "Serveurs",
    admin_server_name: "Nom",
    admin_server_domain: "Domaine",
    admin_server_desc_short: "Description courte (carte homepage)",
    admin_server_desc_long: "Description complète (page serveur)",
    admin_server_add: "+ Ajouter un serveur",
    admin_server_save: "Enregistrer les serveurs",
    admin_server_saved: "Enregistré !",
    admin_server_delete: "Supprimer",
    admin_danger_title: "Zone dangereuse",
    admin_danger_desc: "Supprime définitivement tous les creators, vidéos et réinitialise toutes les données. Irréversible.",
    admin_danger_btn: "Réinitialiser les données",
    admin_danger_confirm: "Réinitialiser TOUTES les données ? Cette action est irréversible.",
    admin_stat_creators: "Total Creators",
    admin_stat_videos: "Total Vidéos",
    admin_stat_pending: "En attente",
    admin_stat_paid: "Total payé",
  },
};

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(
    () => localStorage.getItem("lang") || "fr"
  );

  const toggle = (l) => {
    setLang(l);
    localStorage.setItem("lang", l);
  };

  return (
    <LanguageContext.Provider value={{ lang, toggle }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useT() {
  const { lang } = useContext(LanguageContext);
  return (key) => translations[lang]?.[key] ?? translations.en[key] ?? key;
}

export function useLang() {
  return useContext(LanguageContext);
}
