import { TournamentBracket } from "@/components/tournament-bracket";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { db } from "@/lib/firebase";
import { UserProfile } from "@/lib/types";
import { collection, getDocs } from "firebase/firestore";
import { Shapes } from "lucide-react";

async function getPlayers(): Promise<UserProfile[]> {
  try {
    const usersCol = collection(db, "users");
    const usersSnapshot = await getDocs(usersCol);
    const usersList = usersSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            gamingName: data.gamingName,
            experience: data.experience,
            gender: data.gender,
            photoUrl: data.photoUrl,
            email: data.email,
        } as UserProfile;
    });
    return usersList.filter(u => u.gamingName);
  } catch (error) {
    console.error("Error fetching users: ", error);
    return [];
  }
}

export default async function TournamentPage() {
  const players = await getPlayers();

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
            <div className="flex items-start justify-between gap-4">
                <div>
                    <CardTitle className="flex items-center gap-2 font-headline text-3xl">
                        <Shapes className="h-8 w-8" />
                        Tournament Bracket
                    </CardTitle>
                    <CardDescription>Dynamic single-elimination tournament bracket for your leagues.</CardDescription>
                </div>
            </div>
        </CardHeader>
        <CardContent>
          <TournamentBracket initialPlayers={players} />
        </CardContent>
      </Card>
    </div>
  );
}
