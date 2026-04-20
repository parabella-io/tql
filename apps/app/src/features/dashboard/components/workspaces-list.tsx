import { myWorkspacesQuery } from "@/api/workspaces/queries/my-workspaces.query"
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { useQuery } from "@tql/client"
import { Button } from "@/shared/components/ui/button"
import { useNavigate } from "@tanstack/react-router"
import { CreateWorkspaceDialog } from "./dialogs/create-workspace.dialog"
import { DeleteWorkspaceDialog } from "./dialogs/delete-workspace.dialog"
import { useDisclosure } from "@/shared/hooks/use-dialog"

export const WorkspacesList = () => {

    const navigate = useNavigate()

    const createWorkspaceDialog = useDisclosure();

    const { data, isLoading } = useQuery({
        query: myWorkspacesQuery,
        params: {},
    })

    if (isLoading) {
        return <div>Loading...</div>
    }

    const handleGotoWorkspace = (workspaceId: string) => {
        navigate({
            to: '/app/$workspaceId',
            params: {
                workspaceId,
            },
        })
    }

    return (
        <div className="flex flex-col max-w-screen-xl mx-auto">
            <div className="mb-4 ml-auto">
                <Button size="sm" variant="outline" className="ml-auto" onClick={createWorkspaceDialog.onOpen}>
                    Create Workspace
                </Button>

                <CreateWorkspaceDialog open={createWorkspaceDialog.isOpen} onOpenChange={createWorkspaceDialog.onClose} />
            </div>

            <ul className="gap-4 flex flex-col">
                {
                    data?.map((workspace) => (
                        <li key={workspace.id}>

                            <Card className="w-full">
                                <CardHeader>
                                    <CardTitle>{workspace.name}</CardTitle>

                                    <CardDescription>
                                        Workspace
                                    </CardDescription>
                                </CardHeader>

                                <CardFooter className="flex justify-end gap-3">
                                    <CardAction>
                                        <DeleteWorkspaceDialog workspaceId={workspace.id} />
                                    </CardAction>

                                    <CardAction>
                                        <Button size="sm" variant="outline" onClick={() => handleGotoWorkspace(workspace.id)}>
                                            View
                                        </Button>
                                    </CardAction>
                                </CardFooter>
                            </Card>
                        </li>
                    ))
                }
            </ul>
        </div>
    )
}


