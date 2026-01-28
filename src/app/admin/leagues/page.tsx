import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Shapes } from "lucide-react";

export default function AdminLeaguesPage() {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Shapes className="h-6 w-6" />
                            Leagues & Categories
                        </CardTitle>
                        <CardDescription>Manage racing leagues and event categories.</CardDescription>
                    </div>
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Create New League
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-center py-16 text-muted-foreground">
                    <Shapes className="h-12 w-12 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold">League Management Coming Soon</h3>
                    <p>This section will allow you to create and manage different racing leagues or categories for matches.</p>
                </div>
            </CardContent>
        </Card>
    )
}
