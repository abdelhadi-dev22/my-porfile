"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { lang, changeLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: t("nav_home"), href: "#home" },
    { name: t("nav_about"), href: "#about" },
    { name: t("nav_skills"), href: "#skills" },
    { name: t("nav_portfolio"), href: "#portfolio" },
    { name: t("nav_contact"), href: "#contact" },
  ];

  return (
    <nav className={`navbar ${isScrolled ? "scrolled" : ""}`}>
      <div className="container nav-container">
        <Link href="/" className="logo">
          <i className="fas fa-code"></i>
          <span>Abdelhadi Dev</span>
        </Link>

        <div className={`nav-menu ${isMenuOpen ? "active" : ""}`}>
          <ul className="nav-links">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a 
                  href={link.href} 
                  className="nav-link"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>

          <div className="nav-actions">
            <div className="lang-switcher">
              {["fr", "ar", "en"].map((l) => (
                <button
                  key={l}
                  className={`lang-btn ${lang === l ? "active" : ""}`}
                  onClick={() => changeLanguage(l)}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
            
            <Link href="/admin" className="admin-btn">
              <i className="fas fa-user-shield"></i>
              <span>{lang === "ar" ? "الإدارة" : "Admin"}</span>
            </Link>
          </div>
        </div>

        <button 
          className="menu-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <i className={`fas ${isMenuOpen ? "fa-times" : "fa-bars"}`}></i>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
