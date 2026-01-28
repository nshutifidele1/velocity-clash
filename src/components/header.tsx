'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LogIn, UserPlus, LogOut, User as UserIcon } from 'lucide-react';
import { signOut } from 'firebase/auth';

import { Button } from './ui/button';
import { useUser } from '@/hooks/use-user';
import { auth } from '@/lib/firebase';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { Skeleton } from './ui/skeleton';
import { getInitials } from '@/lib/utils';

export function Header() {
    const { user, profile, loading } = useUser();
    const router = useRouter();
    const pathname = usePathname();

    if (pathname.startsWith('/admin')) {
        return null;
    }

    const handleLogout = async () => {
        await signOut(auth);
        router.push('/');
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center">
                <div className="flex items-center">
                    <Link href="/" className="mr-6 flex items-center space-x-2">
                        <span className="font-bold sm:inline-block font-headline text-primary text-glow-primary text-lg">Velocity Clash</span>
                    </Link>
                </div>

                <nav className="hidden md:flex flex-1 items-center justify-center space-x-6 text-sm font-medium">
                    <Link href="/" className="transition-colors hover:text-foreground/80 text-foreground/60">Home</Link>
                    <Link href="/matches" className="transition-colors hover:text-foreground/80 text-foreground/60">Matches</Link>
                    <Link href="/leaderboard-page" className="transition-colors hover:text-foreground/80 text-foreground/60">Leaderboard</Link>
                </nav>

                <div className="flex flex-1 md:flex-none items-center justify-end space-x-4">
                     {loading ? (
                        <div className="flex items-center space-x-4">
                            <Skeleton className="h-8 w-24" />
                            <Skeleton className="h-8 w-24" />
                        </div>
                     ) : user && profile ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={profile.photoUrl} alt={profile.gamingName} />
                                    <AvatarFallback>{getInitials(profile.gamingName)}</AvatarFallback>
                                </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">{profile.gamingName}</p>
                                    <p className="text-xs leading-none text-muted-foreground">
                                    {profile.email}
                                    </p>
                                </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <UserIcon className="mr-2 h-4 w-4" />
                                    <span>Profile</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleLogout}>
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Log out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                     ) : (
                        <>
                            <Button asChild variant="ghost" size="sm">
                                <Link href="/login"><LogIn className="mr-2 h-4 w-4" /> Login</Link>
                            </Button>
                            <Button asChild size="sm">
                                <Link href="/register"><UserPlus className="mr-2 h-4 w-4" /> Register</Link>
                            </Button>
                        </>
                     )}
                </div>
            </div>
        </header>
    )
}
