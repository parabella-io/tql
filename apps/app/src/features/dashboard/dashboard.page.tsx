import { Separator } from "@/shared/components/ui/separator"
import { UserMenu } from "@/shared/components/menu/user-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"
import { WorkspacesList } from "./components/workspaces-list"
import { WorkspacesInvitesList } from "./components/workspaces-invites-list"

export const DashboardPage = () => {
    return (
        <div className="flex flex-col max-w-screen-xl mx-auto">
            <nav className="flex justify-between items-center p-4">
                <div className="ml-auto">
                    <UserMenu />
                </div>
            </nav>

            <Separator className="mb-4" />

            <Tabs defaultValue="workspaces">
                <TabsList>
                    <TabsTrigger value="workspaces">Workspaces</TabsTrigger>

                    <TabsTrigger value="invites">Invites</TabsTrigger>
                </TabsList>

                <TabsContent value="workspaces">
                    <WorkspacesList />
                </TabsContent>

                <TabsContent value="invites">
                    <WorkspacesInvitesList />
                </TabsContent>
            </Tabs>
        </div>
    )
}


