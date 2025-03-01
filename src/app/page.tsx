import { CatGenerator } from "./_components/cat-generator";

export default function Home() {
  return (
    <main className="container mx-auto min-h-screen py-8">
      <div className="flex flex-col items-center gap-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">AI Cat Image Finder</h1>
          <p className="text-muted-foreground max-w-2xl">
            This project uses AI to understand your requests and find the
            perfect cat image from{" "}
            <a
              href="https://cataas.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Cat as a Service (CATAAS)
            </a>
            . While it doesn&apos;t generate images using AI, it intelligently
            matches your descriptions with existing cat photos using LLM-powered
            tool calling.
          </p>
        </div>
        <CatGenerator />
      </div>
    </main>
  );
}
