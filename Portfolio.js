"use client";

import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { getTranslatedField } from "@/lib/i18n";

const Portfolio = ({ projects }) => {
  const { lang, t } = useLanguage();
  const [filter, setFilter] = useState("all");

  const categories = ["all", ...new Set(projects?.map(p => p.category).filter(Boolean))];

  const filteredProjects = filter === "all" 
    ? projects 
    : projects.filter(p => p.category === filter);

  return (
    <section id="portfolio" className="portfolio">
      <div className="container">
        <div className="section-header animate loaded">
          <h2 className="section-title">{t("portfolio_title")}</h2>
        </div>

        <div className="portfolio-filters animate loaded">
          {categories.map(cat => (
            <button
              key={cat}
              className={`filter-btn ${filter === cat ? "active" : ""}`}
              onClick={() => setFilter(cat)}
            >
              {cat === "all" ? (lang === "ar" ? "الكل" : "All") : cat}
            </button>
          ))}
        </div>

        <div className="portfolio-grid">
          {filteredProjects?.map((project) => (
            <div key={project.id} className="project-card animate loaded">
              {project.featured && <span className="featured-badge">Featured</span>}
              <div className="project-image">
                <img src={project.image || "/project-placeholder.webp"} alt={project.title} />
                <div className="project-overlay">
                  <a href="#" className="project-view">View Details</a>
                </div>
              </div>
              <div className="project-content">
                <h3 className="project-title">
                  {getTranslatedField(project, "title", lang)}
                </h3>
                <p className="project-description">
                  {getTranslatedField(project, "description", lang)}
                </p>
                <div className="project-tech">
                  {project.technologies?.split(",").map((tech, i) => (
                    <span key={i} className="tech-tag">{tech.trim()}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
