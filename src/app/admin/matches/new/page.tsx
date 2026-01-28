import { db } from "@/lib/firebase";
import type { UserProfile } from "@/lib/types";
import { collection, getDocs } from "firebase/firestore";
import { ManualMatchForm } from "@/components/manual-match-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

async function getPlayers(): Promise<Pick<UserProfile, 'gamingName'>[]> {
  try {
    const usersCol = collection(db, "users");
    const usersSnapshot = await getDocs(usersCol);
    const usersList = usersSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            gamingName: data.gamingName,
        }
    });
    return usersList.filter(u => u.gamingName);
  } catch (error) {
    console.error("Error fetching users: ", error);
    return [];
  }
}


export default async function NewMatchPage() {
  const players = await getPlayers();

  return (
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Create Manual Match</CardTitle>
          <CardDescription>Select two players and enter their match results.</CardDescription>
        </CardHeader>
        <CardContent>
          <ManualMatchForm players={players.map(p => p.gamingName)} />
        </CardContent>
      </Card>
  );
}
