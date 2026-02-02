import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import type { UserProfile } from "@/lib/types";
import { DirectMatchForm } from "@/components/direct-match-form";
import { PlusCircle } from "lucide-react";

async function getUsers(): Promise<UserProfile[]> {
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

export default async function NewMatchPage() {
    const players = await getUsers();

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-3xl flex items-center gap-2">
                    <PlusCircle className="h-8 w-8" />
                    Add New Match Result
                </CardTitle>
                <CardDescription>Directly enter the stats for a completed match that was not scheduled.</CardDescription>
            </CardHeader>
            <CardContent>
                <DirectMatchForm players={players} />
            </CardContent>
        </Card>
    );
}
