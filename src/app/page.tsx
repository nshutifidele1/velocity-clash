import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Trophy, BarChart, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import placeholderData from "@/lib/placeholder-images.json";
import { HeroCarousel } from "@/components/hero-carousel";
import { ScrollAnimator } from "@/components/scroll-animator";

const imanLutfyImage = placeholderData.placeholderImages.find(p => p.id === 'creator-imanzi');
const nshutiFideleImage = placeholderData.placeholderImages.find(p => p.id === 'creator-fidele');


export default function Home() {
  return (
    <main>
      <section className="relative h-[60vh] flex items-center justify-center text-center text-white overflow-hidden">
        <HeroCarousel />
        <div className="absolute inset-0 bg-black/50" />

        <div className="relative z-10 container mx-auto px-4">
          <h1 className="font-headline text-5xl md:text-7xl font-bold text-primary text-glow-primary animate-fade-in-up">
            Blur Racing Results
          </h1>
          <p className="mt-4 text-lg text-muted-foreground animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            Speed. Power. Chaos.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8 md:py-16">
        {/* Introduction Section */}
        <ScrollAnimator>
          <section className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="font-headline text-4xl mb-6 text-accent text-glow-accent">Track Your Rivalry</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Velocity Clash is the ultimate companion app for your split-screen battles in Blur-style arcade racing.
              Stop arguing about who won—settle the score by logging match results, tracking points, and crowning the true champion.
              Our AI commentator even adds a little extra flavor to each showdown!
            </p>
            <div className="grid md:grid-cols-3 gap-8 mb-8">
                <Card className="bg-card/50 text-center transition-all duration-300 ease-in-out hover:scale-105 hover:border-primary/80">
                    <CardHeader>
                        <Trophy className="h-12 w-12 mx-auto text-primary"/>
                        <CardTitle className="font-headline text-2xl text-primary">Log Wins</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">Quickly enter stats for each race to build your match history.</p>
                    </CardContent>
                </Card>
                 <Card className="bg-card/50 text-center transition-all duration-300 ease-in-out hover:scale-105 hover:border-primary/80">
                    <CardHeader>
                        <BarChart className="h-12 w-12 mx-auto text-primary"/>
                        <CardTitle className="font-headline text-2xl text-primary">Climb the Ranks</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">Watch the dynamic leaderboard to see who's dominating the competition.</p>
                    </CardContent>
                </Card>
                 <Card className="bg-card/50 text-center transition-all duration-300 ease-in-out hover:scale-105 hover:border-primary/80">
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
              <Link href="/matches">
                View Matches <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </section>
        </ScrollAnimator>

        {/* Meet the Creators Section */}
        <ScrollAnimator delay={200}>
          <section className="max-w-4xl mx-auto text-center mt-24">
              <h2 className="font-headline text-4xl mb-10 text-accent text-glow-accent">Meet The Visionaries</h2>
              <div className="grid md:grid-cols-2 gap-8">
                  <Card className="bg-card/50 text-center transition-all duration-300 ease-in-out hover:scale-105 hover:border-primary/80 group">
                      <CardContent className="p-6 flex flex-col items-center gap-2">
                        {imanLutfyImage && (
                            <Image
                                src={imanLutfyImage.imageUrl}
                                alt={imanLutfyImage.description}
                                data-ai-hint={imanLutfyImage.imageHint}
                                width={150}
                                height={150}
                                className="rounded-full mx-auto border-4 border-primary/50 group-hover:box-glow-primary transition-shadow duration-300"
                            />
                        )}
                        <div>
                          <h3 className="font-headline text-2xl text-primary mt-4">Imanzi Lutfy</h3>
                          <p className="text-muted-foreground">Co-Creator</p>
                        </div>
                      </CardContent>
                  </Card>
                  <Card className="bg-card/50 text-center transition-all duration-300 ease-in-out hover:scale-105 hover:border-primary/80 group">
                       <CardContent className="p-6 flex flex-col items-center gap-2">
                          {nshutiFideleImage && (
                              <Image
                                  src={nshutiFideleImage.imageUrl}
                                  alt={nshutiFideleImage.description}
                                  data-ai-hint={nshutiFideleImage.imageHint}
                                  width={150}
                                  height={150}
                                  className="rounded-full mx-auto border-4 border-primary/50 group-hover:box-glow-primary transition-shadow duration-300"
                              />
                          )}
                          <div>
                            <h3 className="font-headline text-2xl text-primary mt-4">Nshuti Fidele</h3>
                            <p className="text-muted-foreground">Co-Creator</p>
                          </div>
                      </CardContent>
                  </Card>
              </div>
          </section>
        </ScrollAnimator>
      </div>
    </main>
  );
}
