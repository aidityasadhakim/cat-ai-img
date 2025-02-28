"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PromptInput } from "./prompt-input";
import { CatDisplay } from "./cat-display";

export function CatGenerator() {
  const [prompt, setPrompt] = useState("");
  const [searchTrigger, setSearchTrigger] = useState(0);

  const { data: tags } = useQuery({
    queryKey: ["cat-tags"],
    queryFn: async () => {
      const response = await fetch("https://cataas.com/api/tags");
      return response.json();
    },
  });

  const { data: catResponse, isLoading } = useQuery({
    queryKey: ["cat-generation", searchTrigger],
    queryFn: async () => {
      if (!prompt) return null;
      const response = await fetch("/api/search", {
        method: "POST",
        body: JSON.stringify({ prompt }),
      });
      return response.json();
    },
    enabled: !!prompt && searchTrigger > 0,
  });

  const handleSearch = () => {
    setSearchTrigger((prev) => prev + 1);
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-2xl">
      <div className="text-sm text-muted-foreground space-y-6">
        <div>
          <p className="font-medium mb-2">Example searches:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>"Orange cool cat"</li>
            <li>"Angry cat with black and white image"</li>
            <li>"Sleeping cat in blur style"</li>
            <li>"Happy cat saying hello"</li>
          </ul>
        </div>
        <div>
          <p className="font-medium mb-2">Available tags:</p>
          <p className="flex flex-wrap gap-2">
            {tags?.slice(0, 15).map((tag: string) => (
              <span key={tag} className="text-primary">
                #{tag}
              </span>
            ))}
            {tags?.length > 15 && <span>and {tags.length - 15} more...</span>}
          </p>
        </div>
      </div>
      <PromptInput
        value={prompt}
        onChange={setPrompt}
        onSearch={handleSearch}
        isLoading={isLoading}
      />
      <CatDisplay response={catResponse} isLoading={isLoading} />
    </div>
  );
}
