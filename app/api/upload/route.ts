import { NextRequest } from "next/server";
import { put } from "@vercel/blob";
import { requireAuth } from "@/middlewares/auth.middleware";
import { successResponse, errorResponse } from "@/lib/response";

const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const runtime = "edge";

function generateBlobPathname(filename: string): string {
  const sanitized = filename
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);

  const ext = filename.includes(".") ? filename.slice(filename.lastIndexOf(".")) : "";
  const unique = crypto.randomUUID().split("-")[0];
  return `products/${unique}-${sanitized}${ext}`;
}

export async function POST(request: NextRequest) {
  const authResult = requireAuth(request);
  if (authResult) return authResult;

  try {
    const contentType = request.headers.get("content-type") ?? "";
    if (!contentType.includes("multipart/form-data")) {
      return errorResponse("Request must be multipart/form-data", 400);
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return errorResponse("No file provided. Include a 'file' field.", 400);
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return errorResponse(`File type '${file.type}' is not allowed. Use JPEG, PNG, or WebP.`, 400);
    }

    if (file.size > MAX_SIZE_BYTES) {
      return errorResponse(`File exceeds the 10 MB limit (received ${(file.size / 1024 / 1024).toFixed(2)} MB).`, 400);
    }

    const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
    if (!blobToken) {
      return errorResponse("Blob storage is not configured on the server (BLOB_READ_WRITE_TOKEN missing).", 500);
    }

    const pathname = generateBlobPathname(file.name);
    const buffer = Buffer.from(await file.arrayBuffer());

    const blob = await put(pathname, buffer, {
      token: blobToken,
      contentType: file.type,
      access: "public",
    });

    return successResponse({ url: blob.url, filename: pathname }, "File uploaded successfully", 201);
  } catch (error) {
    console.error("[upload] error:", error);
    const message = error instanceof Error ? error.message : "Upload failed due to a server error.";
    return errorResponse(message, 500);
  }
}

