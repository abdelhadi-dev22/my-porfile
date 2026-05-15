"use client";

import React, { useState, useEffect } from "react";

export default function ProjectsManagement() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  
  const [formData, setFormData] = useState({
    title: "",
    title_ar: "",
    title_en: "",
    category: "Web",
    technologies: "",
    description: "",
    description_ar: "",
    description_en: "",
    featured: false,
    status: "active",
    image: null
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/admin/projects");
      const data = await res.json();
      setProjects(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title || "",
      title_ar: project.title_ar || "",
      title_en: project.title_en || "",
      category: project.category || "Web",
      technologies: project.technologies || "",
      description: project.description || "",
      description_ar: project.description_ar || "",
      description_en: project.description_en || "",
      featured: project.featured || false,
      status: project.status || "active",
      image: null
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      const res = await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
      if (res.ok) fetchProjects();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null) {
        data.append(key, formData[key]);
      }
    });

    const url = editingProject ? `/api/admin/projects/${editingProject.id}` : "/api/admin/projects";
    const method = editingProject ? "PUT" : "POST";

    try {
      const res = await fetch(url, { method, body: data });
      if (res.ok) {
        setIsModalOpen(false);
        setEditingProject(null);
        resetForm();
        fetchProjects();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      title_ar: "",
      title_en: "",
      category: "Web",
      technologies: "",
      description: "",
      description_ar: "",
      description_en: "",
      featured: false,
      status: "active",
      image: null
    });
  };

  return (
    <div className="projects-management animate loaded">
      <div className="section-header" style={{ textAlign: "left", marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <h2 className="section-title">Project Portfolio</h2>
          <p className="section-subtitle" style={{ margin: "0" }}>Showcase your best work and case studies</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setEditingProject(null); resetForm(); setIsModalOpen(true); }}>
          <i className="fas fa-plus"></i> Add New Project
        </button>
      </div>

      {isLoading ? (
        <div className="spinner"></div>
      ) : (
        <div className="portfolio-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))" }}>
          {projects.map(project => (
            <div key={project.id} className="project-card">
              <div className="project-image" style={{ height: "200px" }}>
                <img src={project.image || "/project-placeholder.webp"} alt={project.title} />
                {project.featured && <span className="featured-badge" style={{ top: "10px", right: "10px" }}>Featured</span>}
              </div>
              <div className="project-content">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                  <h3 className="project-title" style={{ fontSize: "1.125rem", margin: 0 }}>{project.title}</h3>
                  <span className="tech-tag" style={{ background: "rgba(99, 102, 241, 0.1)", color: "var(--primary-light)" }}>{project.category}</span>
                </div>
                <p className="project-description" style={{ fontSize: "0.875rem", height: "45px", overflow: "hidden" }}>{project.description}</p>
                <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
                  <button className="btn btn-outline" style={{ flex: 1, padding: "0.6rem", fontSize: "0.875rem" }} onClick={() => handleEdit(project)}>
                    <i className="fas fa-edit"></i> Edit
                  </button>
                  <button 
                    className="btn btn-outline" 
                    style={{ flex: 0.2, padding: "0.6rem", color: "#ef4444", borderColor: "rgba(239, 68, 68, 0.2)" }} 
                    onClick={() => handleDelete(project.id)}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Project Modal */}
      {isModalOpen && (
        <div className="modal active" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div className="modal-content" style={{ maxWidth: "800px", width: "95%", maxHeight: "90vh", overflowY: "auto", position: "relative" }}>
            <div className="modal-header" style={{ marginBottom: "2rem" }}>
              <h3 className="section-title" style={{ fontSize: "1.5rem", margin: 0 }}>{editingProject ? "Update Project" : "Create New Project"}</h3>
              <button className="close-modal" onClick={() => setIsModalOpen(false)} style={{ position: "absolute", top: "1.5rem", right: "1.5rem" }}>&times;</button>
            </div>

            <form onSubmit={handleSubmit} className="contact-form" style={{ background: "transparent", border: "none", padding: 0 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                {/* Basic Info */}
                <div className="form-group">
                  <label className="form-label">Title (Main/FR)</label>
                  <input type="text" className="form-input" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select className="form-select" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                    <option value="Web">Web Development</option>
                    <option value="Mobile">Mobile Apps</option>
                    <option value="Software">Desktop Software</option>
                    <option value="UI/UX">UI/UX Design</option>
                  </select>
                </div>

                {/* Translations */}
                <div className="form-group">
                  <label className="form-label">Title (Arabic)</label>
                  <input type="text" className="form-input" dir="rtl" value={formData.title_ar} onChange={e => setFormData({...formData, title_ar: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Title (English)</label>
                  <input type="text" className="form-input" value={formData.title_en} onChange={e => setFormData({...formData, title_en: e.target.value})} />
                </div>

                <div className="form-group" style={{ gridColumn: "span 2" }}>
                  <label className="form-label">Technologies (Comma separated)</label>
                  <input type="text" className="form-input" placeholder="React, Node.js, MySQL..." value={formData.technologies} onChange={e => setFormData({...formData, technologies: e.target.value})} />
                </div>

                <div className="form-group" style={{ gridColumn: "span 2" }}>
                  <label className="form-label">Main Description</label>
                  <textarea className="form-textarea" style={{ minHeight: "80px" }} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
                </div>

                <div className="form-group">
                  <label className="form-label">Project Image</label>
                  <input type="file" className="form-input" accept="image/*" onChange={e => setFormData({...formData, image: e.target.files[0]})} />
                  {editingProject?.image && !formData.image && (
                    <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "0.5rem" }}>Current: {editingProject.image}</p>
                  )}
                </div>

                <div className="form-group" style={{ display: "flex", alignItems: "center", gap: "1rem", paddingTop: "2rem" }}>
                   <label className="form-label" style={{ margin: 0 }}>
                      <input type="checkbox" checked={formData.featured} onChange={e => setFormData({...formData, featured: e.target.checked})} />
                      <span style={{ marginLeft: "0.5rem" }}>Featured Project</span>
                   </label>
                </div>
              </div>

              <div className="form-footer" style={{ marginTop: "2.5rem" }}>
                <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>
                  <i className="fas fa-save"></i> {editingProject ? "Update Project" : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
