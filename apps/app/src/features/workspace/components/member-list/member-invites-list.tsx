import { useMutation, usePagedQuery } from "@tql/client"
import { ErrorCenter } from "@/shared/components/error/error-center"
import { LoadingCenter } from "@/shared/components/loading/loading-center"
import { Card, CardAction, CardContent, CardFooter } from "@/shared/components/ui/card"
import { workspaceMemberInvitesPagedQuery } from "@/api/workspaces/queries/workspace-member-invites.query"
import { removeInviteWorkspaceMemberMutation } from "@/api/workspaces/mutations/remove-invite-workspace-member.mutation"
import { WorkspaceMemberInviteEntity } from "node_modules/@tql/api/src/schema"
import { Button } from "@/shared/components/ui/button"
import { Spinner } from "@/shared/components/ui/spinner"
import { IconTrash } from "@tabler/icons-react"
import { ConfirmActionDialog } from "@/shared/components/dialogs/ConfirmActionDialog"
import { toast } from "sonner"
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
} from "@/shared/components/ui/pagination"
import { cn } from "@/shared/lib/utils"

type MemberInvitesListProps = {
    workspaceId: string
}

export const MemberInvitesList = ({ workspaceId }: MemberInvitesListProps) => {

    const {
        data: invites,
        error,
        isLoading,
        hasNextPage,
        hasPreviousPage,
        loadNextPage,
        loadPreviousPage,
        reset,
    } = usePagedQuery({
        pagedQuery: workspaceMemberInvitesPagedQuery,
        params: { workspaceId },
    })

    if (error) {
        return <ErrorCenter message="Failed to load invites." />
    }

    if (isLoading && invites.length === 0) {
        return <LoadingCenter />
    }

    return (
        <div className="flex flex-col gap-4">
            <ul className="gap-4 flex flex-col">
                {invites.length === 0 ? (
                    <li className="py-2 text-muted-foreground">No invites found.</li>
                ) : (
                    invites.map((invite: WorkspaceMemberInviteEntity) => (
                        <MemberInviteItem key={invite.id} invite={invite} onRemoved={reset} />
                    ))
                )}
            </ul>
            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            href="#"
                            text="Previous"
                            className={cn((!hasPreviousPage || isLoading) && 'pointer-events-none opacity-50')}
                            onClick={(e) => {
                                e.preventDefault()
                                loadPreviousPage()
                            }}
                        />
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationNext
                            href="#"
                            text="Next"
                            className={cn((!hasNextPage || isLoading) && 'pointer-events-none opacity-50')}
                            onClick={(e) => {
                                e.preventDefault()
                                loadNextPage()
                            }}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    )
}

type MemberInviteItemProps = {
    invite: WorkspaceMemberInviteEntity
    onRemoved: () => void
}

const MemberInviteItem = ({ invite, onRemoved }: MemberInviteItemProps) => {
    const removeInvite = useMutation({
        mutation: removeInviteWorkspaceMemberMutation,
    })

    const handleRemoveInvite = async (inviteId: string) => {
        try {
            await removeInvite.mutate({
                workspaceId: invite.workspaceId,
                inviteId,
            })

            toast.success('Invite removed successfully', { position: 'top-center' })
            onRemoved()
        } catch (error) {
            toast.error('Failed to remove invite', { position: 'top-center' })
            throw error;
        }
    }


    return (
        <li key={invite.id} >
            <Card >
                <CardContent>
                    <div className="flex items-center gap-3 py-2">
                        <div className="flex flex-col">
                            <span className="font-medium">{invite.email}</span>
                        </div>
                    </div>

                    <CardFooter>
                        <CardAction className="ml-auto">
                            <ConfirmActionDialog
                                title="Are you sure you want to remove this invite?"
                                confirmButtonText="Remove"
                                confirmButtonVariant="destructive"
                                onConfirm={async () => await handleRemoveInvite(invite.id)}>
                                <Button variant="destructive" size="sm" disabled={removeInvite.isLoading} >
                                    {removeInvite.isLoading ? <Spinner /> : <IconTrash />}
                                    Remove
                                </Button>
                            </ConfirmActionDialog>
                        </CardAction>
                    </CardFooter>
                </CardContent>
            </Card>
        </li>
    )
}
