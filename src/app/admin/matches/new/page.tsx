import { ManualMatchForm } from "@/components/manual-match-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default async function NewMatchPage() {
  return (
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Create Manual Match</CardTitle>
          <CardDescription>Enter the names and match results for two players.</CardDescription>
        </CardHeader>
        <CardContent>
          <ManualMatchForm />
        </CardContent>
      </Card>
  );
}
