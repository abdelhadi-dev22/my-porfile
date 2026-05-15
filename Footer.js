"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";

const Footer = ({ profile }) => {
  const { lang, t } = useLanguage();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-info">
            <a href="#" className="footer-logo">
              <i className="fas fa-code"></i>
              <span>Abdelhadi Dev</span>
            </a>
            <p className="footer-description">
              {lang === "ar" 
                ? "مطور ويب متخصص في بناء تطبيقات حديثة وقابلة للتطوير باستخدام أحدث التقنيات." 
                : "Web developer specializing in building modern and scalable applications with the latest technologies."}
            </p>
            <div className="social-links">
              <a href={profile?.github} className="social-link"><i className="fab fa-github"></i></a>
              <a href="#" className="social-link"><i className="fab fa-linkedin"></i></a>
              <a href="#" className="social-link"><i className="fab fa-twitter"></i></a>
            </div>
          </div>

          <div className="footer-column">
            <h4 className="footer-title">{lang === "ar" ? "روابط سريعة" : "Quick Links"}</h4>
            <ul className="footer-links">
              <li><a href="#home">{t("nav_home")}</a></li>
              <li><a href="#about">{t("nav_about")}</a></li>
              <li><a href="#portfolio">{t("nav_portfolio")}</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4 className="footer-title">{lang === "ar" ? "قانوني" : "Legal"}</h4>
            <ul className="footer-links">
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Use</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Abdelhadi Dev. {t("footer_rights")}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
