"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { Loader2 } from "lucide-react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { registerSchema } from "@/lib/schemas";
import { auth, db } from "@/lib/firebase";

export function RegisterForm() {
  const [step, setStep] = useState(1);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      gamingName: "",
      experience: "Beginner",
      photoUrl: "",
      gender: "Prefer not to say",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { trigger } = form;

  const goToNext = async () => {
    const fields: ("gamingName" | "experience" | "photoUrl" | "gender")[] = ["gamingName", "experience", "gender"];
    if (form.getValues("photoUrl")) {
        fields.push("photoUrl");
    }
    const isValid = await trigger(fields);
    if (isValid) {
      setStep(2);
    }
  };

  const goToPrev = () => setStep(1);

  function onSubmit(values: z.infer<typeof registerSchema>) {
    startTransition(async () => {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
        const user = userCredential.user;

        await setDoc(doc(db, "users", user.uid), {
          gamingName: values.gamingName,
          experience: values.experience,
          gender: values.gender,
          photoUrl: values.photoUrl,
          email: values.email,
        });

        toast({
            title: "Account Created!",
            description: "Welcome to Velocity Clash. You've been successfully registered.",
        });

        router.push("/"); // Redirect to home page after successful registration

      } catch (error: any) {
        console.error("Registration Error: ", error);
        toast({
            variant: "destructive",
            title: "Registration Failed",
            description: error.message || "An unknown error occurred. Please try again.",
        });
      }
    });
  }

  return (
    <Card className="bg-card/50">
        <CardHeader>
            <CardTitle className="font-headline text-2xl text-primary text-glow-primary">
                Step {step} of 2: {step === 1 ? 'Profile Details' : 'Account Credentials'}
            </CardTitle>
            <CardDescription>
                {step === 1 ? 'Tell us a bit about yourself.' : 'Secure your account.'}
            </CardDescription>
        </CardHeader>
        <CardContent>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {step === 1 && (
                <>
                    <FormField
                    control={form.control}
                    name="gamingName"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Gaming Name</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., VelocityViper" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="experience"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Experience Level</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select your racing experience" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                <SelectItem value="Beginner">Beginner</SelectItem>
                                <SelectItem value="Intermediate">Intermediate</SelectItem>
                                <SelectItem value="Pro">Pro</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="photoUrl"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Photo URL</FormLabel>
                        <FormControl>
                            <Input placeholder="https://example.com/your-avatar.png" {...field} />
                        </FormControl>
                        <FormDescription>Link to a profile picture or avatar.</FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                        <FormItem className="space-y-3">
                        <FormLabel>Gender</FormLabel>
                        <FormControl>
                            <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                            >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl><RadioGroupItem value="Male" /></FormControl>
                                <FormLabel className="font-normal">Male</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl><RadioGroupItem value="Female" /></FormControl>
                                <FormLabel className="font-normal">Female</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl><RadioGroupItem value="Other" /></FormControl>
                                <FormLabel className="font-normal">Other</FormLabel>
                            </FormItem>
                             <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl><RadioGroupItem value="Prefer not to say" /></FormControl>
                                <FormLabel className="font-normal">Prefer not to say</FormLabel>
                            </FormItem>
                            </RadioGroup>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </>
                )}

                {step === 2 && (
                <>
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
                     <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </>
                )}
                
                <div className="flex justify-between items-center pt-4">
                    {step === 1 ? (
                        <div />
                    ) : (
                        <Button type="button" variant="outline" onClick={goToPrev} disabled={isPending}>
                            Back
                        </Button>
                    )}
                    {step === 1 ? (
                        <Button type="button" onClick={goToNext}>
                            Next
                        </Button>
                    ) : (
                         <Button type="submit" disabled={isPending} className="bg-accent text-accent-foreground hover:bg-accent/90">
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create Account
                        </Button>
                    )}
                </div>
            </form>
            </Form>
        </CardContent>
    </Card>
  );
}
