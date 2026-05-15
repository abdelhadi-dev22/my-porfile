"use client";

import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

const Contact = ({ profile }) => {
  const { lang, t } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
    website: "", // Honeypot
  });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus({ type: "", message: "" });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setStatus({ type: "success", message: lang === "ar" ? "تم إرسال رسالتك بنجاح!" : "Message sent successfully!" });
        setFormData({ name: "", email: "", phone: "", service: "", message: "", website: "" });
      } else {
        setStatus({ type: "error", message: result.error || "Something went wrong." });
      }
    } catch (error) {
      setStatus({ type: "error", message: "Failed to connect to the server." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="contact" className="contact">
      <div className="container">
        <div className="section-header animate loaded">
          <h2 className="section-title">{t("contact_title")}</h2>
        </div>

        <div className="contact-content">
          <div className="contact-info animate loaded">
            <div className="contact-card">
              <div className="contact-icon"><i className="fas fa-envelope"></i></div>
              <div className="contact-details">
                <h3>Email</h3>
                <p>{profile?.email}</p>
                <a href={`mailto:${profile?.email}`} className="contact-link">Send email</a>
              </div>
            </div>
            <div className="contact-card">
              <div className="contact-icon"><i className="fas fa-phone"></i></div>
              <div className="contact-details">
                <h3>Phone</h3>
                <p>{profile?.phone}</p>
                <a href={`tel:${profile?.phone}`} className="contact-link">Call now</a>
              </div>
            </div>
            <div className="contact-card">
              <div className="contact-icon"><i className="fab fa-whatsapp"></i></div>
              <div className="contact-details">
                <h3>WhatsApp</h3>
                <p>{profile?.whatsapp}</p>
                <a href={`https://wa.me/${profile?.whatsapp?.replace(/\+/g, "")}`} className="contact-link">Chat now</a>
              </div>
            </div>
          </div>

          <form className="contact-form animate loaded" onSubmit={handleSubmit}>
            <div style={{ display: "none" }}>
              <input 
                type="text" 
                name="website" 
                value={formData.website} 
                onChange={handleChange} 
                tabIndex="-1" 
                autoComplete="off" 
              />
            </div>

            <div className="form-group">
              <label className="form-label">{lang === "ar" ? "الاسم الكامل" : "Full Name"}</label>
              <input 
                type="text" 
                name="name" 
                className="form-input" 
                required 
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input 
                type="email" 
                name="email" 
                className="form-input" 
                required 
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Message</label>
              <textarea 
                name="message" 
                className="form-textarea" 
                required 
                value={formData.message}
                onChange={handleChange}
              ></textarea>
            </div>

            {status.message && (
              <div className={`status-message ${status.type}`} style={{ color: status.type === "error" ? "var(--danger)" : "var(--success)", marginBottom: "1rem" }}>
                {status.message}
              </div>
            )}

            <div className="form-footer">
              <button type="submit" className="btn btn-primary" disabled={isLoading}>
                {isLoading ? <div className="spinner"></div> : t("contact_btn")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
