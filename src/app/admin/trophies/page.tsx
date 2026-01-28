import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Trophy } from "lucide-react";

export default function AdminTrophiesPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-6 w-6" />
                    Trophies
                </CardTitle>
                <CardDescription>Manage game trophies and achievements.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="text-center py-16 text-muted-foreground">
                    <Trophy className="h-12 w-12 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold">Trophy Management Coming Soon</h3>
                    <p>This section will allow you to create, edit, and assign trophies to players.</p>
                </div>
            </CardContent>
        </Card>
    )
}
