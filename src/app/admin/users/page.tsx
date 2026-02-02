import { db } from "@/lib/firebase";
import type { UserProfile } from "@/lib/types";
import { collection, getDocs } from "firebase/firestore";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getInitials } from "@/lib/utils";
import { UserActions } from "@/components/user-actions";

async function getUsers(): Promise<UserProfile[]> {
  try {
    const usersCol = collection(db, "users");
    const usersSnapshot = await getDocs(usersCol);
    const usersList = usersSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            uid: doc.id,
            gamingName: data.gamingName,
            experience: data.experience,
            gender: data.gender,
            photoUrl: data.photoUrl,
            email: data.email,
        } as UserProfile;
    });
    return usersList;
  } catch (error) {
    console.error("Error fetching users: ", error);
    return [];
  }
}

export default async function AdminPlayersPage() {
    const users = await getUsers();

    return (
        <Card>
            <CardHeader>
                <CardTitle>Players</CardTitle>
                <CardDescription>Manage all registered players.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Player</TableHead>
                            <TableHead>Experience</TableHead>
                            <TableHead className="hidden md:table-cell">Gender</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>
                                <span className="sr-only">Actions</span>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map(user => (
                            <TableRow key={user.uid}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar>
                                            <AvatarImage src={user.photoUrl} alt={user.gamingName} />
                                            <AvatarFallback>{getInitials(user.gamingName)}</AvatarFallback>
                                        </Avatar>
                                        <div className="font-medium">{user.gamingName}</div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline">{user.experience}</Badge>
                                </TableCell>
                                <TableCell className="hidden md:table-cell">{user.gender}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                     <UserActions user={user} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
