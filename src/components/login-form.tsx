"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { Loader2 } from "lucide-react";
import { signInWithEmailAndPassword } from "firebase/auth";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { loginSchema } from "@/lib/schemas";
import { auth } from "@/lib/firebase";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function LoginForm() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { toast } = useToast();
  const [secretCode, setSecretCode] = useState("");

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof loginSchema>) {
    startTransition(async () => {
      try {
        await signInWithEmailAndPassword(auth, values.email, values.password);
        
        toast({
            title: "Login Successful!",
            description: "Welcome back to Velocity Clash.",
        });

        router.push("/"); // Redirect to home page after successful login

      } catch (error: any) {
        console.error("Login Error: ", error);
        toast({
            variant: "destructive",
            title: "Login Failed",
            description: error.message || "Invalid credentials. Please try again.",
        });
      }
    });
  }

  const handleAdminLogin = () => {
    if (secretCode === "v-clash#admin@123") {
        router.push("/admin");
        toast({
            title: "Admin Access Granted",
            description: "Redirecting to the admin dashboard.",
        });
    } else {
        toast({
            variant: "destructive",
            title: "Access Denied",
            description: "The secret code is incorrect.",
        });
    }
  };

  return (
    <Card className="bg-card/50">
        <CardHeader>
            <CardTitle className="font-headline text-2xl text-primary text-glow-primary">
                Sign In
            </CardTitle>
            <CardDescription>
                Enter your credentials to access your account.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                        <Input type="email" placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                
                <div className="flex justify-between items-center pt-4">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="link" type="button" className="text-muted-foreground hover:text-primary">Admin Gate</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Admin Access</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Enter the secret code to access the admin dashboard.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <Input 
                                type="password"
                                placeholder="Secret Code"
                                value={secretCode}
                                onChange={(e) => setSecretCode(e.target.value)}
                            />
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleAdminLogin} className="bg-accent text-accent-foreground hover:bg-accent/90">Continue</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                    <Button type="submit" disabled={isPending} className="bg-accent text-accent-foreground hover:bg-accent/90">
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Login
                    </Button>
                </div>
            </form>
            </Form>
        </CardContent>
    </Card>
  );
}
