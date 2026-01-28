import { ManualMatchForm } from "@/components/manual-match-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { db } from "@/lib/firebase";
import { UserProfile } from "@/lib/types";
import { collection, getDocs } from "firebase/firestore";

async function getUsers(): Promise<UserProfile[]> {
    try {
      const usersCol = collection(db, "users");
      const usersSnapshot = await getDocs(usersCol);
      const usersList = usersSnapshot.docs.map(doc => doc.data() as UserProfile);
      return usersList;
    } catch (error) {
      console.error("Error fetching users: ", error);
      return [];
    }
}

export default async function NewMatchPage() {
  const users = await getUsers();

  return (
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Create Manual Match</CardTitle>
          <CardDescription>Select two players and enter their match results.</CardDescription>
        </CardHeader>
        <CardContent>
          <ManualMatchForm users={users} />
        </CardContent>
      </Card>
  );
}
