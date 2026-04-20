
import { IconChevronDown, IconPlus } from "@tabler/icons-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "../ui/dropdown-menu"
import { Button } from "../ui/button"
import { WorkspaceEntity } from "@tql/api";
import { CreateWorkspaceDialog } from "@/features/dashboard/components/dialogs/create-workspace.dialog";
import { useDisclosure } from "@/shared/hooks/use-dialog";
import { Link } from "@tanstack/react-router";

type WorkspacesMenuProps = {
    workspaces: WorkspaceEntity[];
    selectedWorkspaceId: string;
}

export const WorkspacesMenu = ({ workspaces, selectedWorkspaceId }: WorkspacesMenuProps) => {

    const workspaceMenuDialog = useDisclosure();

    const selectedWorkspace = workspaces.find(workspace => workspace.id === selectedWorkspaceId);

    const otherWorkspaces = workspaces.filter(workspace => workspace.id !== selectedWorkspaceId);

    if (!selectedWorkspace) {
        throw new Error('Selected workspace not found');
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size='lg'>
                        <span className="truncate font-medium">{selectedWorkspace.name}</span>

                        <IconChevronDown className="ml-auto size-4" />
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                    className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                    side={"right"}
                    align="end"
                    sideOffset={4}
                >
                    {
                        otherWorkspaces.length > 0 && (
                            <>
                                <DropdownMenuLabel>
                                    Workspaces
                                </DropdownMenuLabel>

                                {otherWorkspaces.map(workspace => (
                                    <DropdownMenuItem key={workspace.id} asChild>
                                        <Link to={`/app/${workspace.id}`}>
                                            {workspace.name}
                                        </Link>
                                    </DropdownMenuItem>
                                ))}

                                <DropdownMenuSeparator />
                            </>
                        )
                    }

                    <DropdownMenuItem onSelect={workspaceMenuDialog.onOpen}>
                        <IconPlus />
                        Create Workspace
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <CreateWorkspaceDialog open={workspaceMenuDialog.isOpen} onOpenChange={workspaceMenuDialog.onClose} />
        </>
    )
}
