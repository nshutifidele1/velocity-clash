import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Trophy, BarChart, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8 md:py-16">
      <div className="text-center mb-12">
        <h1 className="font-headline text-5xl md:text-7xl font-bold text-primary text-glow-primary">
          Blur Racing Results
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Speed. Power. Chaos.
        </p>
      </div>

      {/* Hero Section with Video */}
      <section className="mb-16">
        <div className="aspect-video max-w-2xl mx-auto rounded-lg overflow-hidden border-2 border-primary box-glow-primary">
          <iframe
            src="https://assets.pinterest.com/ext/embed.html?id=47358233578143592"
            height="100%"
            width="100%"
            frameBorder="0"
            scrolling="no"
            allowFullScreen
            title="Drifting Car Video"
            style={{ width: '100%', height: '100%' }}
          ></iframe>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="max-w-4xl mx-auto text-center mb-16">
        <h2 className="font-headline text-4xl mb-6 text-accent text-glow-accent">Track Your Rivalry</h2>
        <p className="text-lg text-muted-foreground mb-8">
          Velocity Clash is the ultimate companion app for your split-screen battles in Blur-style arcade racing.
          Stop arguing about who won—settle the score by logging match results, tracking points, and crowning the true champion.
          Our AI commentator even adds a little extra flavor to each showdown!
        </p>
        <div className="grid md:grid-cols-3 gap-8 mb-8">
            <Card className="bg-card/50 text-center">
                <CardHeader>
                    <Trophy className="h-12 w-12 mx-auto text-primary"/>
                    <CardTitle className="font-headline text-2xl text-primary">Log Wins</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Quickly enter stats for each race to build your match history.</p>
                </CardContent>
            </Card>
             <Card className="bg-card/50 text-center">
                <CardHeader>
                    <BarChart className="h-12 w-12 mx-auto text-primary"/>
                    <CardTitle className="font-headline text-2xl text-primary">Climb the Ranks</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Watch the dynamic leaderboard to see who's dominating the competition.</p>
                </CardContent>
            </Card>
             <Card className="bg-card/50 text-center">
                <CardHeader>
                    <Award className="h-12 w-12 mx-auto text-primary"/>
                    <CardTitle className="font-headline text-2xl text-primary">Earn Titles</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Gain performance badges like "Most Shooter" and "Fastest Driver" for your achievements.</p>
                </CardContent>
            </Card>
        </div>
        <Button asChild size="lg" className="font-headline text-xl">
          <Link href="/add-result">
            Start a Match <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </section>
    </main>
  );
}
