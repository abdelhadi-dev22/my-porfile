import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";

export async function GET(request, { params }) {
  const { id } = await params;
  try {
    const project = await prisma.project.findUnique({
      where: { id: parseInt(id) },
    });
    if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });
    return NextResponse.json(project);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const { id } = await params;
  try {
    const formData = await request.formData();
    const data = {};
    
    const fields = ["title", "title_ar", "title_en", "category", "technologies", "description", "description_ar", "description_en", "status"];
    fields.forEach(field => {
      if (formData.has(field)) data[field] = formData.get(field);
    });
    
    if (formData.has("featured")) data.featured = formData.get("featured") === "true";

    const image = formData.get("image");
    if (image && typeof image !== "string" && image.size > 0) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `upload_${Date.now()}_${image.name.replace(/\s+/g, "_")}`;
      const uploadsDir = path.join(process.cwd(), "public/uploads/projects");
      
      const fs = require('fs');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const filePath = path.join(uploadsDir, filename);
      await writeFile(filePath, buffer);
      data.image = `/uploads/projects/${filename}`;
    }

    const project = await prisma.project.update({
      where: { id: parseInt(id) },
      data,
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error("Project Update Error:", error);
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  try {
    await prisma.project.delete({
      where: { id: parseInt(id) },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Project Delete Error:", error);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
