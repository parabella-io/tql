import { useParams } from "@tanstack/react-router";
import { useQuery, useSubscription } from "@tql/client";
import { SidebarProvider } from "@/shared/components/ui/sidebar"
import { myWorkspacesQuery } from "@/api/workspaces";
import { WorkspaceNavbar } from "./navbar"
import { LoadingCenter } from "@/shared/components/loading/loading-center";
import { notificationSubscription } from "@/api/notifications/notifications.subscription";

export const WorkspaceLayout = ({ children }: { children: React.ReactNode }) => {

    const { workspaceId } = useParams({ from: '/app/$workspaceId' });

    const { data: workspaces } = useQuery({
        query: myWorkspacesQuery,
        params: {},
    })

    const { status, subscriptionId, error, lastBatchAt } = useSubscription({
        subscription: notificationSubscription,
        params: {},
    })

    console.log(status, subscriptionId, error, lastBatchAt)

    if (!workspaces) {
        return (
            <LoadingCenter />
        )
    }

    return (
        <SidebarProvider>
            <WorkspaceNavbar workspaces={workspaces} selectedWorkspaceId={workspaceId} />

            <main className="flex-1">
                {children}
            </main>
        </SidebarProvider>
    )
}