"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { getTranslatedField } from "@/lib/i18n";

const About = ({ profile, skills }) => {
  const { lang, t } = useLanguage();

  return (
    <section id="about" className="about">
      <div className="container">
        <div className="section-header animate loaded">
          <h2 className="section-title">{t("about_title")}</h2>
          <p className="section-subtitle">{t("about_subtitle")}</p>
        </div>

        <div className="about-content">
          <div className="about-image animate loaded">
            <div className="avatar">
              <img src={profile?.profile_image || "/avatar.webp"} alt="Abdelhadi" />
            </div>
            <div className="status-badge">
              <span className="status-dot"></span>
              <span>Online & Available</span>
            </div>
          </div>

          <div className="about-details animate loaded">
            <h3 className="about-text-title">{t("about_text_title")}</h3>
            <p className="about-bio">
              {getTranslatedField(profile || {}, "about", lang)}
            </p>

            <div className="skills-grid">
              {skills?.slice(0, 4).map((skill) => (
                <div key={skill.id} className="skill-item">
                  <div className="skill-header">
                    <span className="skill-name">{skill.skill_name}</span>
                    <span className="skill-percent">{skill.proficiency}%</span>
                  </div>
                  <div className="skill-bar">
                    <div 
                      className="skill-progress" 
                      style={{ width: `${skill.proficiency}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="interests">
              <span className="interest-tag"><i className="fas fa-terminal"></i> Code</span>
              <span className="interest-tag"><i className="fas fa-database"></i> Systems</span>
              <span className="interest-tag"><i className="fas fa-mobile-alt"></i> Mobile UI</span>
              <span className="interest-tag"><i className="fas fa-rocket"></i> Performance</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
