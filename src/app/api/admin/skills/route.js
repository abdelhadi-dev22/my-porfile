import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const skills = await prisma.skill.findMany({
      orderBy: { display_order: "asc" },
    });
    return NextResponse.json(skills);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch skills" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const skill = await prisma.skill.create({
      data: {
        skill_name: data.skill_name,
        proficiency: parseInt(data.proficiency) || 50,
        display_order: parseInt(data.display_order) || 0,
      },
    });
    return NextResponse.json(skill);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create skill" }, { status: 500 });
  }
}
