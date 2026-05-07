import { createWorkspaceTicketLabelMutation } from "@/api/workspaces/mutations/create-workspace-ticket-label.mutation"
import { useAppForm } from "@/shared/components/form/form.hook"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, } from "@/shared/components/ui/dialog"
import { FieldGroup } from "@/shared/components/ui/field"
import { useDisclosure } from "@/shared/hooks/use-dialog"
import { useMutation } from "@parabella-io/tql-client"
import { toast } from "sonner"
import z from "zod"

type CreateWorkspaceTicketLabelDialogProps = {
    workspaceId: string
    children: React.ReactNode
}

const CreateWorkspaceTicketLabelFormSchema = z.object({
    name: z.string().min(1, 'Name is required'),
})

export const CreateWorkspaceTicketLabelDialog = ({ workspaceId, children }: CreateWorkspaceTicketLabelDialogProps) => {
    const { isOpen, onOpen, onClose } = useDisclosure()

    const createWorkspaceTicketLabel = useMutation({
        mutation: createWorkspaceTicketLabelMutation,
    })

    const form = useAppForm({
        defaultValues: {
            name: '',
        },
        validators: {
            onChange: CreateWorkspaceTicketLabelFormSchema,
        },
        onSubmit: async ({ value }) => {
            try {
                await createWorkspaceTicketLabel.mutate({
                    workspaceId: workspaceId,
                    name: value.name,
                })
                toast.success('Label created successfully', { position: 'top-center' })
                onClose()
            } catch (error) {
                toast.error('Failed to create label', { position: 'top-center' })
            }
        }
    })

    const handleOpenChange = () => {
        if (isOpen) {
            onClose()
        } else {
            onOpen()
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle >
                        Create label
                    </DialogTitle>
                </DialogHeader>

                <form.AppForm>
                    <FieldGroup>
                        <form.AppField
                            name="name"
                            children={(field) => <field.FormInputField label="Name" required placeholder="Enter label name" />}
                        />
                    </FieldGroup>

                    <DialogFooter>
                        <form.FormSubmitButton label="Create label" />
                    </DialogFooter>
                </form.AppForm>
            </DialogContent>
        </Dialog>
    )
}