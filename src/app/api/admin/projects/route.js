import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { id: "desc" },
    });
    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const title = formData.get("title");
    const title_ar = formData.get("title_ar");
    const title_en = formData.get("title_en");
    const category = formData.get("category");
    const technologies = formData.get("technologies");
    const description = formData.get("description");
    const description_ar = formData.get("description_ar");
    const description_en = formData.get("description_en");
    const featured = formData.get("featured") === "true";
    const status = formData.get("status") || "active";
    const image = formData.get("image");

    let imagePath = null;
    if (image && typeof image !== "string" && image.size > 0) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `upload_${Date.now()}_${image.name.replace(/\s+/g, "_")}`;
      const uploadsDir = path.join(process.cwd(), "public/uploads/projects");
      
      // Ensure directory exists
      const fs = require('fs');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const filePath = path.join(uploadsDir, filename);
      await writeFile(filePath, buffer);
      imagePath = `/uploads/projects/${filename}`;
    }

    const project = await prisma.project.create({
      data: {
        title,
        title_ar: title_ar || "",
        title_en: title_en || "",
        category: category || "Web",
        technologies: technologies || "",
        description: description || "",
        description_ar: description_ar || "",
        description_en: description_en || "",
        featured,
        status,
        image: imagePath,
      },
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error("Project Create Error:", error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
