import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
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

    return NextResponse.json({
      profile,
      skills,
      projects,
    });
  } catch (error) {
    console.error("API Portfolio Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
