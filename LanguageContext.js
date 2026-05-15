"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { translations } from "@/lib/i18n";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState("fr");
  const [dir, setDir] = useState("ltr");

  useEffect(() => {
    const savedLang = localStorage.getItem("lang") || "fr";
    setLang(savedLang);
    setDir(savedLang === "ar" ? "rtl" : "ltr");
    document.documentElement.lang = savedLang;
    document.documentElement.dir = savedLang === "ar" ? "rtl" : "ltr";
  }, []);

  const changeLanguage = (newLang) => {
    setLang(newLang);
    const newDir = newLang === "ar" ? "rtl" : "ltr";
    setDir(newDir);
    localStorage.setItem("lang", newLang);
    document.documentElement.lang = newLang;
    document.documentElement.dir = newDir;
  };

  const t = (key) => {
    return translations[lang]?.[key] || translations["fr"]?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, dir, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
