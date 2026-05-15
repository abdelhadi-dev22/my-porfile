"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";

const Hero = ({ profile }) => {
  const { lang, t } = useLanguage();

  return (
    <section id="home" className="hero">
      <div className="container">
        <div className="hero-content">
          <div className="hero-info animate loaded">
            <div className="hero-badge">
              <i className="fas fa-sparkles"></i>
              <span>{t("hero_badge")}</span>
            </div>
            
            <h1 className="hero-title" dangerouslySetInnerHTML={{ __html: t("hero_title") }}></h1>
            
            <p className="hero-description">
              {t("hero_desc")}
            </p>

            <div className="hero-actions">
              <a href="#portfolio" className="btn btn-primary">
                {t("btn_projects")}
              </a>
              <a href="#contact" className="btn btn-outline">
                {t("btn_contact")}
              </a>
            </div>

            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">{profile?.projects_done || 0}+</span>
                <span className="stat-label">{t("stat_projects")}</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{profile?.clients_count || 0}+</span>
                <span className="stat-label">{t("stat_clients")}</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{profile?.years_experience || 0}</span>
                <span className="stat-label">{t("stat_exp")}</span>
              </div>
            </div>
          </div>

          <div className="hero-visual animate loaded">
            <div className="code-window">
              <div className="code-header">
                <span className="code-dot red"></span>
                <span className="code-dot yellow"></span>
                <span className="code-dot green"></span>
                <span className="code-title">Portfolio.js — Abdelhadi Dev</span>
              </div>
              <div className="code-body">
                <pre>
                  <code>{`
const developer = {
  name: "Abdelhadi",
  role: "Full-Stack Developer",
  passion: "Coding",
  motto: "Clean Code, Clean Life",
  skills: [
    "Next.js", "React",
    "Node.js", "MySQL",
    "Prisma", "Express"
  ],
  isAvailable: true
};

function deliverExcellence(project) {
  return developer.skills
    .transform(project.ideas)
    .toAwesome(project.results);
}
                  `}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
