"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Rocket } from "lucide-react";

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  isLoading: boolean;
}

export function PromptInput({
  value,
  onChange,
  onSearch,
  isLoading,
}: PromptInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
      onSearch();
    }
  };

  return (
    <div className="flex gap-2">
      <Input
        placeholder="Describe your cat image..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isLoading}
      />
      <Button onClick={onSearch} disabled={!value || isLoading}>
        {isLoading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Rocket className="size-4" />
        )}
      </Button>
    </div>
  );
}
