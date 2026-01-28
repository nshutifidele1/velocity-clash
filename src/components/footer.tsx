export function Footer() {
    return (
        <footer className="py-6 md:px-8 md:py-0 border-t border-border/40 bg-background/95 mt-auto">
            <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
                <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
                    Built and designed by Imanzi Lutfy & Nshuti Fidele.
                </p>
                 <p className="text-center text-sm text-muted-foreground">
                    © {new Date().getFullYear()} Velocity Clash. All Rights Reserved.
                </p>
            </div>
        </footer>
    );
}
