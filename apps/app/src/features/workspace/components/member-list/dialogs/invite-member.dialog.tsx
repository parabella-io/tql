import { inviteWorkspaceMemberMutation } from "@/api/workspaces/mutations/invite-workspace-member.mutation"
import { useAppForm } from "@/shared/components/form/form.hook"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/components/ui/dialog"
import { FieldGroup } from "@/shared/components/ui/field"
import { useDisclosure } from "@/shared/hooks/use-dialog"
import { useMutation } from "@parabella-io/tql-client"
import { toast } from "sonner"
import z from "zod"

type InviteMemberDialogProps = {
    workspaceId: string
    children: React.ReactNode
}

const InviteMemberFormSchema = z.object({
    email: z.email('Invalid email address'),
})

export const InviteMemberDialog = ({ workspaceId, children }: InviteMemberDialogProps) => {
    const { isOpen, onOpen, onClose } = useDisclosure()

    const inviteMember = useMutation({
        mutation: inviteWorkspaceMemberMutation,
    })

    const form = useAppForm({
        defaultValues: {
            email: '',
        },
        validators: {
            onChange: InviteMemberFormSchema,
        },
        onSubmit: async ({ value }) => {
            try {
                await inviteMember.mutate({
                    workspaceId,
                    email: value.email,
                })
                toast.success('Member invited successfully', { position: 'top-center' })
                onClose();
            } catch (error) {
                toast.error('Failed to invite member', { position: 'top-center' })
            }
        },
    })

    const handleOpenChange = () => {
        if (isOpen) {
            form.reset();
            onClose();
        } else {
            onOpen();
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Invite Member
                    </DialogTitle>
                    <DialogDescription>
                        Enter the email address of the member you want to invite.
                    </DialogDescription>
                </DialogHeader>

                <form.AppForm>
                    <FieldGroup>
                        <form.AppField
                            name="email"
                            children={(field) => <field.FormInputField label="Email" required />}
                        />
                    </FieldGroup>

                    <DialogFooter>
                        <form.FormSubmitButton label="Send Invite" />
                    </DialogFooter>
                </form.AppForm>
            </DialogContent>
        </Dialog>
    )
}