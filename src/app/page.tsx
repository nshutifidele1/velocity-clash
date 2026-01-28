import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Trophy, BarChart, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

export default function Home() {
  return (
    <main>
      <section className="relative h-[60vh] flex items-center justify-center text-center text-white overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full z-0">
          <Image
            src="https://i.pinimg.com/736x/5f/2e/20/5f2e20080873abc0deae8d14ff09aba1.jpg"
            alt="Drifting Car"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <div className="relative z-10 container mx-auto px-4">
          <h1 className="font-headline text-5xl md:text-7xl font-bold text-primary text-glow-primary">
            Blur Racing Results
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Speed. Power. Chaos.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8 md:py-16">
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
      </div>
    </main>
  );
}
