import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
  const { id } = await params;
  try {
    const data = await request.json();
    const skill = await prisma.skill.update({
      where: { id: parseInt(id) },
      data: {
        skill_name: data.skill_name,
        proficiency: parseInt(data.proficiency),
        display_order: parseInt(data.display_order),
      },
    });
    return NextResponse.json(skill);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update skill" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  try {
    await prisma.skill.delete({
      where: { id: parseInt(id) },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete skill" }, { status: 500 });
  }
}
