import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";

import Link from "next/link";

async function getStats() {
  const [projectsCount, skillsCount, messagesCount] = await Promise.all([
    prisma.project.count(),
    prisma.skill.count(),
    prisma.contactMessage.count(),
  ]);

  return { projectsCount, skillsCount, messagesCount };
}

export default async function AdminDashboard() {
  const stats = await getStats();

  return (
    <div className="admin-dashboard container" style={{ paddingTop: "2rem" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3rem" }}>
        <h1 className="section-title">Dashboard</h1>
        <Link href="/" className="btn btn-outline">Back to Site</Link>
      </header>

      <div className="stats-grid" style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
        gap: "2rem" 
      }}>
        <div className="contact-card">
          <div className="contact-icon"><i className="fas fa-project-diagram"></i></div>
          <div className="contact-details">
            <h3>Projects</h3>
            <p>{stats.projectsCount}</p>
            <Link href="/admin/dashboard/projects" className="contact-link">Manage</Link>
          </div>
        </div>

        <div className="contact-card">
          <div className="contact-icon"><i className="fas fa-tools"></i></div>
          <div className="contact-details">
            <h3>Skills</h3>
            <p>{stats.skillsCount}</p>
            <Link href="/admin/dashboard/skills" className="contact-link">Manage</Link>
          </div>
        </div>

        <div className="contact-card">
          <div className="contact-icon"><i className="fas fa-envelope"></i></div>
          <div className="contact-details">
            <h3>Messages</h3>
            <p>{stats.messagesCount}</p>
            <Link href="/admin/dashboard/messages" className="contact-link">View All</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
