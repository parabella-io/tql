import { workspaceMembersQuery } from "@/api/workspaces/queries/workspace-members.query"
import { useMutation, useQuery } from "@tql/client"
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar"
import { ErrorCenter } from "@/shared/components/error/error-center"
import { LoadingCenter } from "@/shared/components/loading/loading-center"
import { Card, CardAction, CardContent, CardFooter } from "@/shared/components/ui/card"
import { WorkspaceMemberEntity } from "node_modules/@tql/api/src/schema"
import { removeWorkspaceMemberMutation } from "@/api/workspaces/mutations/remove-workspace-member.mutation"
import { ConfirmActionDialog } from "@/shared/components/dialogs/ConfirmActionDialog"
import { Button } from "@/shared/components/ui/button"
import { Spinner } from "@/shared/components/ui/spinner"
import { IconTrash } from "@tabler/icons-react"
import { toast } from "sonner"

type MemberListProps = {
    workspaceId: string
}

export const MemberList = ({ workspaceId }: MemberListProps) => {
    const { data: members, error } = useQuery({
        query: workspaceMembersQuery,
        params: {
            workspaceId,
        },
    })

    if (error) {
        return <ErrorCenter message="Failed to load members." />
    }

    if (!members) {
        return <LoadingCenter />
    }

    return (
        <ul className="gap-4 flex flex-col">
            {members.length === 0 ? (
                <li className="py-2 text-muted-foreground">No members found.</li>
            ) : (
                members.map((member: any) => (
                    <MemberItem key={member.id} member={member} />
                ))
            )}
        </ul>
    )
}

type MemberItemProps = {
    member: WorkspaceMemberEntity
}

const MemberItem = ({ member }: MemberItemProps) => {
    const removeMember = useMutation({
        mutation: removeWorkspaceMemberMutation,
    })

    const handleRemoveMember = async (memberId: string) => {
        try {
            await removeMember.mutate({
                workspaceId: member.workspaceId,
                memberId,
            })

            toast.success('Member removed successfully', { position: 'top-center' })
        } catch (error) {
            toast.error('Failed to remove member', { position: 'top-center' })
            throw error;
        }
    }

    return (
        <li key={member.id}>
            <Card >
                <CardContent>
                    <div className="flex items-center gap-3 py-2">
                        <div className="flex flex-col gap-4">
                            {
                                member.isWorkspaceOwner && (
                                    <span className="text-xs text-muted-foreground">Workspace Owner</span>
                                )
                            }
                            <span className="font-large">{member.name}</span>
                            <span className="font-medium">{member.email}</span>
                        </div>
                    </div>

                    {
                        !member.isWorkspaceOwner && (
                            <CardFooter>
                                <CardAction className="ml-auto">
                                    <ConfirmActionDialog
                                        title="Are you sure you want to remove this member?"
                                        confirmButtonText="Remove"
                                        confirmButtonVariant="destructive"
                                        onConfirm={async () => await handleRemoveMember(member.id)}>
                                        <Button variant="destructive" size="sm" disabled={removeMember.isLoading} >
                                            {removeMember.isLoading ? <Spinner /> : <IconTrash />}
                                            Remove
                                        </Button>
                                    </ConfirmActionDialog>
                                </CardAction>
                            </CardFooter>
                        )
                    }
                </CardContent>

            </Card>
        </li>
    )
}
