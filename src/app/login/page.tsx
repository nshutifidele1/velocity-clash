import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <main className="container mx-auto px-4 py-8 md:py-16">
      <div className="text-center mb-12">
        <h1 className="font-headline text-5xl md:text-7xl font-bold text-primary text-glow-primary">
          Welcome Back
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Sign in to your Velocity Clash account.
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
          <LoginForm />
      </div>
    </main>
  );
}
