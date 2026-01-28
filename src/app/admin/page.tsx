
export default function AdminPage() {
  return (
    <main className="container mx-auto px-4 py-8 md:py-16">
      <div className="text-center mb-12">
        <h1 className="font-headline text-5xl md:text-7xl font-bold text-primary text-glow-primary">
          Admin Dashboard
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Welcome, Administrator.
        </p>
      </div>

      <div className="max-w-4xl mx-auto bg-card/50 p-8 rounded-lg">
          <p className="text-center text-xl">This is the admin dashboard. You have special privileges.</p>
          {/* Admin specific components and data can go here */}
      </div>
    </main>
  );
}
