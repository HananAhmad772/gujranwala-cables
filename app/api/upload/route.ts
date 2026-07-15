import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { requireAuth } from "@/middlewares/auth.middleware";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];

function slugifyFilename(original: string): string {
  const ext = path.extname(original).toLowerCase();
  const base = path.basename(original, ext)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
  const timestamp = Date.now();
  return `${base}-${timestamp}${ext}`;
}

export async function POST(request: NextRequest) {
  // Require auth for uploads
  const authResult = requireAuth(request);
  if (authResult) return authResult;

  try {
    const contentType = request.headers.get("content-type") ?? "";
    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json(
        { success: false, message: "Request must be multipart/form-data" },
        { status: 400 },
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { success: false, message: "No file provided. Include a 'file' field." },
        { status: 400 },
      );
    }

    // Validate type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: `File type '${file.type}' is not allowed. Use JPEG, PNG, WebP, or GIF.` },
        { status: 400 },
      );
    }

    // Validate size
    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { success: false, message: `File exceeds the 5 MB limit (received ${(file.size / 1024 / 1024).toFixed(2)} MB).` },
        { status: 400 },
      );
    }

    // Ensure upload directory exists
    if (!existsSync(UPLOAD_DIR)) {
      await mkdir(UPLOAD_DIR, { recursive: true });
    }

    const filename = slugifyFilename(file.name);
    const filepath = path.join(UPLOAD_DIR, filename);
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filepath, buffer);

    const url = `/uploads/${filename}`;

    return NextResponse.json(
      { success: true, message: "File uploaded successfully", data: { url, filename } },
      { status: 201 },
    );
  } catch (error) {
    console.error("[upload] error:", error);
    return NextResponse.json(
      { success: false, message: "Upload failed due to a server error." },
      { status: 500 },
    );
  }
}
