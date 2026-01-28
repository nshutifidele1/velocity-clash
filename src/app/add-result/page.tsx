import { AddResultView } from "@/components/add-result-view";

export default function AddResultPage() {
  return (
    <main className="container mx-auto px-4 py-8 md:py-16">
      <div className="text-center mb-12">
        <h1 className="font-headline text-5xl md:text-7xl font-bold text-primary text-glow-primary">
          Enter Match Stats
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Record the results of your latest race.
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
          <AddResultView />
      </div>
    </main>
  );
}
