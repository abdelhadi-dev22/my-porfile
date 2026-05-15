export const translations = {
  fr: {
    nav_home: "Accueil",
    nav_about: "À propos",
    nav_skills: "Compétences",
    nav_portfolio: "Portfolio",
    nav_contact: "Contact",
    hero_badge: "Disponible pour nouveaux projets",
    hero_title: 'Développeur <span class="hero-highlight">Web & Logiciels</span>',
    hero_desc: "Je transforme vos idées en programmes réels avec des solutions sur mesure et performantes.",
    btn_projects: "Mes Projets",
    btn_contact: "Me Contacter",
    stat_projects: "Projets Terminés",
    stat_clients: "Clients Satisfaits",
    stat_exp: "Années d'expérience",
    about_title: "À propos de moi",
    about_subtitle: "Découvrez mon parcours et ma passion pour le développement",
    about_text_title: "Je suis Abdelhadi, un développeur passionné",
    skills_title: "Mes Compétences",
    portfolio_title: "Mon Portfolio",
    contact_title: "Contactez-moi",
    contact_btn: "Envoyer le message",
    footer_rights: "Tous droits réservés.",
    no_image: "Aucune image",
  },
  ar: {
    nav_home: "الرئيسية",
    nav_about: "من أنا",
    nav_skills: "مهاراتي",
    nav_portfolio: "أعمالي",
    nav_contact: "اتصل بي",
    hero_badge: "متاح للمشاريع الجديدة",
    hero_title: 'مطور <span class="hero-highlight">ويب وبرمجيات</span>',
    hero_desc: "أحول أفكارك إلى برامج حقيقية مع حلول مخصصة وعالية الأداء.",
    btn_projects: "مشاريعي",
    btn_contact: "اتصل بي",
    stat_projects: "مشروع منجز",
    stat_clients: "عملاء راضون",
    stat_exp: "سنوات خبرة",
    about_title: "من أنا",
    about_subtitle: "اكتشف مسيرتي وشغفي بالتطوير",
    about_text_title: "أنا عبد الهادي، مطور شغوف",
    skills_title: "مهاراتي",
    portfolio_title: "أعمالي",
    contact_title: "اتصل بي",
    contact_btn: "إرسال الرسالة",
    footer_rights: "جميع الحقوق محفوظة.",
    no_image: "لا يوجد صورة",
  },
  en: {
    nav_home: "Home",
    nav_about: "About",
    nav_skills: "Skills",
    nav_portfolio: "Portfolio",
    nav_contact: "Contact",
    hero_badge: "Available for new projects",
    hero_title: 'Web & <span class="hero-highlight">Software</span> Developer',
    hero_desc: "I transform your ideas into real programs with tailored and high-performance solutions.",
    btn_projects: "My Projects",
    btn_contact: "Contact Me",
    stat_projects: "Projects Completed",
    stat_clients: "Satisfied Clients",
    stat_exp: "Years of Experience",
    about_title: "About Me",
    about_subtitle: "Explore my journey and passion for development",
    about_text_title: "I am Abdelhadi, a passionate developer",
    skills_title: "My Skills",
    portfolio_title: "My Portfolio",
    contact_title: "Contact me",
    contact_btn: "Send Message",
    footer_rights: "All rights reserved.",
    no_image: "No image",
  },
};

export function getTranslation(key, lang = "fr") {
  return translations[lang]?.[key] || translations["fr"]?.[key] || key;
}

export function getTranslatedField(row, field, lang = "fr") {
  const field_ar = field + "_ar";
  const field_en = field + "_en";
  if (lang === "ar" && row[field_ar]) {
    return row[field_ar];
  }
  if (lang === "en" && row[field_en]) {
    return row[field_en];
  }
  return row[field] || "";
}
