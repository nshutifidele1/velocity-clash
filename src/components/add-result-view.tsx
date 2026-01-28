'use client';

import { useUser } from '@/hooks/use-user';
import { MatchForm } from '@/components/match-form';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { UserPlus, LogIn } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Skeleton } from './ui/skeleton';

export function AddResultView() {
  const { user, loading } = useUser();

  if (loading) {
    return (
        <div className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
                <Card className="w-full bg-transparent border-secondary">
                    <CardHeader>
                        <Skeleton className="h-8 w-32" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                            <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-16" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-16" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                        </div>
                            <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="w-full bg-transparent border-secondary">
                    <CardHeader>
                        <Skeleton className="h-8 w-32" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                            <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-16" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-16" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                        </div>
                            <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    </CardContent>
                </Card>
            </div>
            <Skeleton className="h-16 w-full" />
        </div>
    );
  }

  if (!user) {
    return (
        <Card className="max-w-lg mx-auto bg-card/50 border-primary/40">
            <CardHeader className="text-center items-center">
                <div className="w-16 h-16 mb-4 bg-primary/10 rounded-full flex items-center justify-center border-2 border-primary">
                    <UserPlus className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="font-headline text-3xl text-primary text-glow-primary">
                    Access Denied
                </CardTitle>
                <CardDescription className="text-lg">
                    You must be logged in to enter match results.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center gap-4">
                <Button asChild>
                    <Link href="/login">
                        <LogIn className="mr-2 h-4 w-4" />
                        Login
                    </Link>
                </Button>
                <Button asChild variant="outline">
                    <Link href="/register">
                        <UserPlus className="mr-2 h-4 w-4" />
                        Register
                    </Link>
                </Button>
            </CardContent>
        </Card>
    );
  }

  return <MatchForm />;
}
