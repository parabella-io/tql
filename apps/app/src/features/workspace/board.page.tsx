
import { SideHeader } from "./components/layout/side-header";
import { WorkspaceLayout } from "./components/layout/layout";
import { TicketList } from "./components/ticket-list/ticket-list";
import { CreateTicketListDialog } from "./components/ticket-list/dialogs/create-ticket-list.dialog";
import { useParams } from "@tanstack/react-router";

export const WorkspaceBoardPage = () => {

    const { workspaceId } = useParams({
        from: '/app/$workspaceId',
    });

    return (
        <WorkspaceLayout>
            <div className="flex-1 flex flex-col h-full w-full">
                <SideHeader>
                    <SideHeader.Title>
                        Board
                    </SideHeader.Title>

                    <SideHeader.Actions>
                        <CreateTicketListDialog workspaceId={workspaceId} />
                    </SideHeader.Actions>
                </SideHeader>

                <TicketList />
            </div>
        </WorkspaceLayout>
    )
}


