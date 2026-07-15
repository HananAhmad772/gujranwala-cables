"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ImagePlus, Loader2, Trash2, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ImageUploadProps = {
  /** Current image path/URL — controlled by parent */
  value?: string;
  /** Called with the new /uploads/... path after a successful upload, or "" when cleared */
  onChange: (url: string) => void;
  /** Label shown above the upload zone */
  label?: string;
  /** Extra class names for the outer wrapper */
  className?: string;
};

type UploadState = "idle" | "uploading" | "error";

const ACCEPTED = "image/jpeg,image/jpg,image/png,image/webp,image/gif";

export function ImageUpload({ value, onChange, label, className }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [localPreview, setLocalPreview] = useState<string>("");

  // Displayed preview: local blob URL while uploading, then the saved path, otherwise nothing
  const preview = localPreview || value || "";

  async function handleFile(file: File) {
    // Immediate local preview so the user sees the image right away
    const blobUrl = URL.createObjectURL(file);
    setLocalPreview(blobUrl);
    setUploadState("uploading");
    setErrorMsg("");

    const fd = new FormData();
    fd.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd, credentials: "include" });
      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.message || "Upload failed");
      }

      onChange(json.data.url as string);
      setUploadState("idle");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Upload failed");
      setUploadState("error");
      // Revert preview to whatever was there before
      setLocalPreview("");
    } finally {
      // Revoke the blob URL to free memory
      URL.revokeObjectURL(blobUrl);
      setLocalPreview("");
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) void handleFile(file);
    // Reset input so the same file can be re-selected after a clear
    e.target.value = "";
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) void handleFile(file);
  }

  function handleClear() {
    onChange("");
    setLocalPreview("");
    setErrorMsg("");
    setUploadState("idle");
  }

  const isUploading = uploadState === "uploading";

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <p className="text-sm font-medium leading-none">{label}</p>
      )}

      {/* Preview area — shown when there's an image */}
      {preview && (
        <div className="relative w-full overflow-hidden rounded-lg border bg-muted" style={{ aspectRatio: "16/9" }}>
          <Image
            src={preview}
            alt="Upload preview"
            fill
            sizes="(min-width: 768px) 480px, 100vw"
            className="object-contain"
            unoptimized={preview.startsWith("blob:")}
          />
          {/* Uploading overlay */}
          {isUploading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/50 text-white">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="text-xs font-semibold">Uploading…</span>
            </div>
          )}
          {/* Clear button — only when not uploading */}
          {!isUploading && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-md bg-destructive text-destructive-foreground shadow transition hover:bg-destructive/80"
              aria-label="Remove image"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      )}

      {/* Drop zone — shown when there's no image yet */}
      {!preview && (
        <div
          role="button"
          tabIndex={0}
          aria-label="Upload image — click or drag and drop"
          className={cn(
            "flex min-h-36 cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed bg-muted/30 p-6 text-center transition",
            isUploading
              ? "pointer-events-none opacity-60"
              : "hover:border-primary hover:bg-muted/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
          )}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          {isUploading ? (
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-card text-primary shadow-sm">
              <ImagePlus className="h-6 w-6" />
            </div>
          )}
          <div>
            <p className="text-sm font-semibold">
              {isUploading ? "Uploading…" : "Click to upload or drag and drop"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">JPEG, PNG, WebP or GIF · max 5 MB</p>
          </div>
          {!isUploading && (
            <Button variant="outline" size="sm" type="button" tabIndex={-1}>
              <UploadCloud className="h-4 w-4" />
              Select image
            </Button>
          )}
        </div>
      )}

      {/* Change button — shown when an image is already set and not uploading */}
      {preview && !isUploading && (
        <Button
          variant="outline"
          size="sm"
          type="button"
          onClick={() => inputRef.current?.click()}
        >
          <UploadCloud className="h-4 w-4" />
          Replace image
        </Button>
      )}

      {/* Error message */}
      {uploadState === "error" && errorMsg && (
        <p className="text-xs font-medium text-destructive" role="alert">{errorMsg}</p>
      )}

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED}
        className="sr-only"
        onChange={handleInputChange}
        aria-hidden="true"
      />
    </div>
  );
}
