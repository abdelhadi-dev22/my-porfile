import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Portfolio from "@/components/Portfolio";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

async function getData() {
  const profile = await prisma.profile.findFirst();
  const skills = await prisma.skill.findMany({
    orderBy: [
      { display_order: "asc" },
      { id: "asc" }
    ],
  });
  const projects = await prisma.project.findMany({
    where: { status: "active" },
    orderBy: [
      { featured: "desc" },
      { display_order: "asc" },
      { id: "desc" }
    ],
  });

  return { profile, skills, projects };
}

export default async function Home() {
  const data = await getData();

  return (
    <main>
      <Navbar />
      <Hero profile={data.profile} />
      <About profile={data.profile} skills={data.skills} />
      <Portfolio projects={data.projects} />
      <Contact profile={data.profile} />
      <Footer profile={data.profile} />
      
      {/* Floating WhatsApp Button */}
      <a 
        href={`https://wa.me/${data.profile?.whatsapp?.replace(/\+/g, "")}`} 
        className="whatsapp-float" 
        target="_blank" 
        rel="noopener noreferrer"
      >
        <i className="fab fa-whatsapp"></i>
        <span className="whatsapp-text">WhatsApp Me</span>
      </a>
    </main>
  );
}
