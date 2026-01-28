import Link from 'next/link';
import { Button } from './ui/button';
import { PlusCircle } from 'lucide-react';

export function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center">
                <div className="mr-4 hidden md:flex">
                    <Link href="/" className="mr-6 flex items-center space-x-2">
                        <span className="font-bold sm:inline-block font-headline text-primary text-glow-primary text-lg">Velocity Clash</span>
                    </Link>
                    <nav className="flex items-center space-x-6 text-sm font-medium">
                        <Link href="/" className="transition-colors hover:text-foreground/80 text-foreground/60">Home</Link>
                        <Link href="/matches" className="transition-colors hover:text-foreground/80 text-foreground/60">Matches</Link>
                        <Link href="/leaderboard-page" className="transition-colors hover:text-foreground/80 text-foreground/60">Leaderboard</Link>
                    </nav>
                </div>
                <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                    <Button asChild>
                        <Link href="/add-result"><PlusCircle className="mr-2 h-4 w-4" /> Add Result</Link>
                    </Button>
                </div>
            </div>
        </header>
    )
}
