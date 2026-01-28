import { RegisterForm } from "@/components/register-form";

export default function RegisterPage() {
  return (
    <main className="container mx-auto px-4 py-8 md:py-16">
      <div className="text-center mb-12">
        <h1 className="font-headline text-5xl md:text-7xl font-bold text-primary text-glow-primary">
          Join the Race
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Create your Velocity Clash account to start competing.
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
          <RegisterForm />
      </div>
    </main>
  );
}
