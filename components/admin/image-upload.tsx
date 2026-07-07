"use client";

import { ImagePlus, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ImageUpload() {
  return (
    <div className="rounded-lg border border-dashed bg-muted/30 p-6 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-card text-primary shadow-sm">
        <ImagePlus className="h-6 w-6" />
      </div>
      <h3 className="mt-4 text-sm font-semibold">Industrial image upload</h3>
      <p className="mt-1 text-sm text-muted-foreground">UI placeholder for product, brand, and content imagery.</p>
      <Button variant="outline" className="mt-4" type="button">
        <UploadCloud className="h-4 w-4" />
        Select image
      </Button>
    </div>
  );
}
