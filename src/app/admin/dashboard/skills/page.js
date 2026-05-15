"use client";

import React, { useState, useEffect } from "react";

export default function SkillsManagement() {
  const [skills, setSkills] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingSkill, setEditingSkill] = useState(null);
  const [newSkill, setNewSkill] = useState({ skill_name: "", proficiency: 80, display_order: 0 });

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const res = await fetch("/api/admin/skills");
      const data = await res.json();
      setSkills(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSkill),
      });
      if (res.ok) {
        setNewSkill({ skill_name: "", proficiency: 80, display_order: 0 });
        fetchSkills();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/admin/skills/${editingSkill.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingSkill),
      });
      if (res.ok) {
        setEditingSkill(null);
        fetchSkills();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteSkill = async (id) => {
    if (!confirm("Are you sure you want to delete this skill?")) return;
    try {
      const res = await fetch(`/api/admin/skills/${id}`, { method: "DELETE" });
      if (res.ok) fetchSkills();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="skills-management animate loaded">
      <div className="section-header" style={{ textAlign: "left", marginBottom: "2rem" }}>
        <h2 className="section-title">Technical Skills</h2>
        <p className="section-subtitle" style={{ margin: "0" }}>Manage your expertise and proficiency levels</p>
      </div>
      
      <div className="admin-grid" style={{ display: "grid", gridTemplateColumns: "1fr 350px", gap: "2rem" }}>
        {/* Skills List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {isLoading ? (
            <div className="spinner"></div>
          ) : (
            skills.map(skill => (
              <div key={skill.id} className="contact-card" style={{ 
                display: "flex", 
                flexDirection: "column", 
                gap: "1rem", 
                background: "var(--surface)",
                padding: "1.25rem",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--surface-border)"
              }}>
                {editingSkill?.id === skill.id ? (
                  <form onSubmit={handleUpdate} style={{ display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "flex-end" }}>
                    <div style={{ flex: 2 }}>
                      <label className="form-label" style={{ fontSize: "0.75rem" }}>Skill Name</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={editingSkill.skill_name}
                        onChange={(e) => setEditingSkill({...editingSkill, skill_name: e.target.value})}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label className="form-label" style={{ fontSize: "0.75rem" }}>Proficiency (%)</label>
                      <input 
                        type="number" 
                        className="form-input" 
                        value={editingSkill.proficiency}
                        onChange={(e) => setEditingSkill({...editingSkill, proficiency: e.target.value})}
                      />
                    </div>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button type="submit" className="btn btn-primary" style={{ padding: "0.75rem" }}><i className="fas fa-check"></i></button>
                      <button type="button" className="btn btn-outline" style={{ padding: "0.75rem" }} onClick={() => setEditingSkill(null)}><i className="fas fa-times"></i></button>
                    </div>
                  </form>
                ) : (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", fontWeight: "600" }}>
                        <span>{skill.skill_name}</span>
                        <span style={{ color: "var(--primary-light)" }}>{skill.proficiency}%</span>
                      </div>
                      <div className="skill-bar">
                        <div className="skill-progress" style={{ width: `${skill.proficiency}%` }}></div>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "0.5rem", marginLeft: "2rem" }}>
                      <button 
                        onClick={() => setEditingSkill(skill)} 
                        style={{ color: "var(--text-secondary)", border: "1px solid var(--surface-border)", background: "rgba(255,255,255,0.03)", padding: "0.5rem", borderRadius: "8px", cursor: "pointer" }}
                      >
                        <i className="fas fa-pen"></i>
                      </button>
                      <button 
                        onClick={() => deleteSkill(skill.id)} 
                        style={{ color: "#ef4444", border: "1px solid var(--surface-border)", background: "rgba(255,255,255,0.03)", padding: "0.5rem", borderRadius: "8px", cursor: "pointer" }}
                      >
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Add Skill Sidebar */}
        <div style={{ position: "sticky", top: "2rem", height: "fit-content" }}>
          <form onSubmit={handleAdd} className="contact-form" style={{ padding: "2rem", borderRadius: "var(--radius-lg)" }}>
            <h3 style={{ marginBottom: "1.5rem", fontSize: "1.25rem" }}>Add New Skill</h3>
            
            <div className="form-group">
              <label className="form-label">Skill Name</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. React.js"
                value={newSkill.skill_name}
                onChange={(e) => setNewSkill({...newSkill, skill_name: e.target.value})}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Proficiency ({newSkill.proficiency}%)</label>
              <input 
                type="range" 
                className="form-input" 
                style={{ padding: 0, height: "10px" }}
                min="0" max="100"
                value={newSkill.proficiency}
                onChange={(e) => setNewSkill({...newSkill, proficiency: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Order</label>
              <input 
                type="number" 
                className="form-input" 
                value={newSkill.display_order}
                onChange={(e) => setNewSkill({...newSkill, display_order: e.target.value})}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "1rem" }}>
              <i className="fas fa-plus"></i> Add Skill
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
