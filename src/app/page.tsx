import { CatGenerator } from "./_components/cat-generator";

export default function Home() {
  return (
    <main className="container mx-auto min-h-screen py-8">
      <div className="flex flex-col items-center gap-8">
        <h1 className="text-4xl font-bold">AI Cat Image Generator</h1>
        <CatGenerator />
      </div>
    </main>
  );
}
