"use client";

import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { PromptInput } from "./prompt-input";
import { CatDisplay } from "./cat-display";

// Top 20 most common cat tags
const COMMON_CAT_TAGS = [
  "cute",
  "black",
  "white",
  "orange",
  "sleeping",
  "kitten",
  "funny",
  "grumpy",
  "happy",
  "fluffy",
  "tabby",
  "maine coon",
  "siamese",
  "persian",
  "bengal",
  "playful",
  "lazy",
  "sleepy",
  "blue eyes",
  "green eyes",
];

export function CatGenerator() {
  const [prompt, setPrompt] = useState("");
  const [searchTrigger, setSearchTrigger] = useState(0);
  const resultRef = useRef<HTMLDivElement>(null);

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
    enabled: searchTrigger > 0,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 60 * 24,
  });

  // Scroll to result when loading finishes and we have a response
  useEffect(() => {
    if (!isLoading && catResponse && resultRef.current) {
      resultRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [isLoading, catResponse]);

  const handleSearch = () => {
    setSearchTrigger((prev) => prev + 1);
  };

  return (
    <div className="flex flex-col gap-4 sm:gap-6 w-full max-w-2xl px-4 sm:px-0">
      <div className="text-sm text-muted-foreground space-y-4 sm:space-y-6">
        <div>
          <p className="font-medium mb-1.5 sm:mb-2">Example searches:</p>
          <ul className="list-disc list-inside space-y-0.5 sm:space-y-1 text-xs sm:text-sm">
            <li>&quot;Orange cool cat&quot;</li>
            <li>&quot;Angry cat with black and white image&quot;</li>
            <li>&quot;Sleeping cat in blur style&quot;</li>
            <li>&quot;Happy cat saying hello&quot;</li>
            <li>&quot;Angry cat saying Turu DEK in yellow text&quot;</li>
          </ul>
        </div>
        <div>
          <p className="font-medium mb-1.5 sm:mb-2">Popular tags:</p>
          <p className="flex flex-wrap gap-1.5 sm:gap-2 text-xs sm:text-sm">
            {COMMON_CAT_TAGS.map((tag) => (
              <span key={tag} className="text-primary">
                #{tag}
              </span>
            ))}
          </p>

          {COMMON_CAT_TAGS?.length > 15 && (
            <span className="text-xs sm:text-sm mt-1">and more...</span>
          )}
        </div>
      </div>
      <PromptInput
        value={prompt}
        onChange={setPrompt}
        onSearch={handleSearch}
        isLoading={isLoading}
      />
      <div ref={resultRef}>
        <CatDisplay response={catResponse} isLoading={isLoading} />
      </div>
    </div>
  );
}
