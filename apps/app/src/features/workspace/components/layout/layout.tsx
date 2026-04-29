import { useParams } from "@tanstack/react-router";
import { useQuery } from "@tql/client";
import { SidebarProvider } from "@/shared/components/ui/sidebar"
import { myWorkspacesQuery } from "@/api/workspaces";
import { WorkspaceNavbar } from "./navbar"
import { LoadingCenter } from "@/shared/components/loading/loading-center";

export const WorkspaceLayout = ({ children }: { children: React.ReactNode }) => {

    const { workspaceId } = useParams({ from: '/app/$workspaceId' });

    const { data: workspaces } = useQuery({
        query: myWorkspacesQuery,
        params: {},
    });

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