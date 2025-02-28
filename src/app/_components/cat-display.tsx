"use client";

import { CatApiResponse } from "@/lib/types/cat-api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { Download, Loader2 } from "lucide-react";
import { useState } from "react";

interface CatDisplayProps {
  response: CatApiResponse | null;
  isLoading: boolean;
}

export function CatDisplay({ response }: CatDisplayProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  if (!response) return null;

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      const imageResponse = await fetch(response.url);
      const blob = await imageResponse.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "cat-image.jpg";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto p-4 flex flex-col gap-4">
      <div className="relative aspect-square w-full max-w-md">
        <Image
          src={response.url}
          alt="Generated cat"
          fill
          className="object-contain rounded-md"
          sizes="(max-width: 768px) 100vw, 384px"
        />
      </div>
      <Button
        onClick={handleDownload}
        className="w-full"
        disabled={isDownloading}
      >
        {isDownloading ? (
          <Loader2 className="mr-2 size-4 animate-spin" />
        ) : (
          <Download className="mr-2 size-4" />
        )}
        {isDownloading ? "Downloading..." : "Download Image"}
      </Button>
    </Card>
  );
}
