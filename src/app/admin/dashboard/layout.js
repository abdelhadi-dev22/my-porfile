"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  const navItems = [
    { name: "Overview", href: "/admin/dashboard", icon: "fas fa-home" },
    { name: "Projects", href: "/admin/dashboard/projects", icon: "fas fa-project-diagram" },
    { name: "Skills", href: "/admin/dashboard/skills", icon: "fas fa-tools" },
    { name: "Messages", href: "/admin/dashboard/messages", icon: "fas fa-envelope" },
  ];

  return (
    <div className="admin-layout" style={{ display: "flex", minHeight: "100vh", background: "var(--base-bg)" }}>
      {/* Sidebar */}
      <aside style={{ 
        width: "260px", 
        background: "var(--surface)", 
        borderRight: "1px solid var(--surface-border)",
        padding: "2rem 1rem",
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
        position: "sticky",
        top: 0,
        height: "100vh"
      }}>
        <div className="logo" style={{ padding: "0 1rem" }}>
          <i className="fas fa-user-shield"></i>
          <span>Admin</span>
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {navItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href}
              className={`nav-link ${pathname === item.href ? "active" : ""}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                padding: "0.75rem 1rem",
                borderRadius: "var(--radius-md)",
                textDecoration: "none",
                color: pathname === item.href ? "var(--text-primary)" : "var(--text-secondary)",
                background: pathname === item.href ? "rgba(99, 102, 241, 0.1)" : "transparent",
                transition: "all 0.3s ease"
              }}
            >
              <i className={item.icon} style={{ width: "20px" }}></i>
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        <div style={{ marginTop: "auto" }}>
          <Link href="/" className="btn btn-outline" style={{ width: "100%", fontSize: "0.875rem" }}>
            <i className="fas fa-external-link-alt"></i> View Site
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: "2rem", overflowY: "auto" }}>
        {children}
      </main>
    </div>
  );
}
