import { myWorkspaceInvitesQuery } from "@/api/workspaces/queries/my-workspace-invites.query"
import { ErrorCenter } from "@/shared/components/error/error-center"
import { LoadingCenter } from "@/shared/components/loading/loading-center"
import { Card, CardAction, CardFooter, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { useMutation, useQuery } from "@parabella-io/tql-client"
import { Button } from "@/shared/components/ui/button"
import { WorkspaceMemberInviteEntity } from "node_modules/@tql/api/src/schema"
import { WorkspaceEntity } from "@tql/api"
import { acceptWorkspaceMemberInviteMutation } from "@/api/workspaces/mutations/accept-workspace-member-invite.mutation"
import { declineWorkspaceMemberInviteMutation } from "@/api/workspaces/mutations/decline-workspace-member-invite.mutation"
import { toast } from "sonner"
import { ConfirmActionDialog } from "@/shared/components/dialogs/ConfirmActionDialog"
import { WorkspaceMemberEntity } from "@tql/api"

export const WorkspacesInvitesList = () => {

    const myWorkspaceInvites = useQuery({
        query: myWorkspaceInvitesQuery,
        params: {},
    })


    if (myWorkspaceInvites.error) {
        return <ErrorCenter message="Failed to load workspaces invites." />
    }

    if (!myWorkspaceInvites.data) {
        return <LoadingCenter />
    }

    return (
        <div className="flex flex-col max-w-screen-xl mx-auto">

            <ul className="gap-4 flex flex-col mt-4">
                {
                    myWorkspaceInvites.data?.map((invite) => (
                        <WorkspaceInviteItem key={invite.id} invite={invite} />
                    ))
                }
            </ul>
        </div>
    )
}

type WorkspacesInvitesListProps = {
    invite: WorkspaceMemberInviteEntity & {
        workspace: WorkspaceEntity & {
            owner: WorkspaceMemberEntity
        }
    }
}

const WorkspaceInviteItem = ({ invite }: WorkspacesInvitesListProps) => {

    const acceptInvite = useMutation({
        mutation: acceptWorkspaceMemberInviteMutation,
    })

    const declineInvite = useMutation({
        mutation: declineWorkspaceMemberInviteMutation,
    })

    const handleDeclineInvite = async (inviteId: string) => {
        try {
            await declineInvite.mutate({
                workspaceId: invite.workspaceId,
                inviteId,
            })
            toast.success('Invite declined', { position: 'top-center' })
        } catch (error) {
            toast.error('Failed to decline invite', { position: 'top-center' })
            throw error;
        }
    }

    const handleAcceptInvite = async (inviteId: string) => {
        try {
            await acceptInvite.mutate({
                workspaceId: invite.workspaceId,
                inviteId,
            })
            toast.success('Invite accepted', { position: 'top-center' })
        } catch (error) {
            toast.error('Failed to accept invite', { position: 'top-center' })
            throw error;
        }
    }

    return (
        <li key={invite.id}>

            <Card className="w-full">
                <CardHeader>
                    <CardTitle>{invite.email}</CardTitle>

                    <CardDescription>
                        {invite.workspace.owner?.name} invited you to join {invite.workspace.name}
                    </CardDescription>
                </CardHeader>

                <CardFooter className="flex justify-end gap-3">
                    <CardAction>
                        <ConfirmActionDialog
                            title="Are you sure you want to decline this invite?"
                            confirmButtonText="Decline"
                            confirmButtonVariant="destructive"
                            onConfirm={async () => await handleDeclineInvite(invite.id)}>
                            <Button size="sm" variant="destructive" disabled={declineInvite.isLoading}>
                                Decline
                            </Button>
                        </ConfirmActionDialog>
                    </CardAction>

                    <CardAction>
                        <ConfirmActionDialog
                            title="Are you sure you want to accept this invite?"
                            confirmButtonText="Accept"
                            confirmButtonVariant="outline"
                            onConfirm={async () => await handleAcceptInvite(invite.id)}>
                            <Button size="sm" variant="outline" disabled={acceptInvite.isLoading}>
                                Accept
                            </Button>
                        </ConfirmActionDialog>
                    </CardAction>
                </CardFooter>
            </Card>
        </li>
    )
}