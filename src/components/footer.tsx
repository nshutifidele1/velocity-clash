'use client';

import { Github } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Footer() {
    const pathname = usePathname();

    if (pathname.startsWith('/admin')) {
        return null;
    }

    return (
        <footer className="py-8 md:py-12 border-t border-border/40 bg-background/95 mt-auto">
            <div className="container flex flex-col items-center gap-4 text-center">
                <h3 className="font-headline text-xl font-bold text-primary text-glow-primary">Velocity Clash</h3>
                <p className="max-w-md text-balance text-sm leading-loose text-muted-foreground">
                    Built and designed with passion by Imanzi Lutfy & Nshuti Fidele.
                </p>
                <div className="flex gap-4">
                     <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                        <Github className="h-5 w-5" />
                        <span className="sr-only">GitHub</span>
                     </Link>
                </div>
                <p className="text-center text-xs text-muted-foreground/60 mt-4">
                    © {new Date().getFullYear()} Velocity Clash. All Rights Reserved.
                </p>
            </div>
        </footer>
    );
}
