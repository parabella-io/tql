import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog"

import { deleteWorkspaceMutation } from "@/api/workspaces/mutations/delete-workspace.mutation"
import { useMutation } from "@parabella-io/tql-client"
import { toast } from "sonner"
import { Button } from "@/shared/components/ui/button"
import { useDisclosure } from "@/shared/hooks/use-dialog"

type DeleteWorkspaceDialogProps = {
    workspaceId: string
}

export const DeleteWorkspaceDialog = ({ workspaceId }: DeleteWorkspaceDialogProps) => {

    const { isOpen, onOpen, onClose } = useDisclosure()

    const deleteWorkspace = useMutation({
        mutation: deleteWorkspaceMutation,
    });

    const handleDeleteWorkspace = async () => {
        try {
            await deleteWorkspace.mutate({
                id: workspaceId
            });
            toast.success('Workspace deleted', { position: 'top-center' });
            onClose()
        } catch (error) {
            toast.error('Failed to delete workspace', { position: 'top-center' });
            throw error;
        }
    }

    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <Button size="sm" variant="destructive" onClick={onOpen}>
                Delete
            </Button>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>

                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your
                        workspace.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel>
                        Cancel
                    </AlertDialogCancel>

                    <AlertDialogAction onClick={handleDeleteWorkspace} disabled={deleteWorkspace.isLoading}>
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}