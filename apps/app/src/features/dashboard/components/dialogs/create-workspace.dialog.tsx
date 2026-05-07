import { createWorkspaceMutation } from "@/api/workspaces/mutations/create-workspace.mutation"
import { useAppForm } from "@/shared/components/form/form.hook"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog"
import { FieldGroup } from "@/shared/components/ui/field"
import { useMutation } from "@parabella-io/tql-client"
import z from "zod"

const CreateWorkspaceFormSchema = z.object({
    name: z.string().min(1, 'Name is required'),
})

type CreateWorkspaceDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export const CreateWorkspaceDialog = ({ open, onOpenChange }: CreateWorkspaceDialogProps) => {

    const createWorkspace = useMutation({
        mutation: createWorkspaceMutation,
    })

    const form = useAppForm({
        defaultValues: {
            name: '',
        },
        validators: {
            onChange: CreateWorkspaceFormSchema,
        },
        onSubmit: async ({ value }) => {
            await createWorkspace.mutate({
                name: value.name,
            })

            onOpenChange(false)
        }
    })

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <form.AppForm>
                    <DialogHeader>
                        <DialogTitle>
                            Create workspace
                        </DialogTitle>

                        <DialogDescription>
                            Enter the name of your workspace to get started
                        </DialogDescription>
                    </DialogHeader>

                    <FieldGroup>
                        <form.AppField
                            name="name"
                            children={(field) => <field.FormInputField label="Name" required />}
                        />
                    </FieldGroup>

                    <DialogFooter>
                        <form.FormSubmitButton label="Create workspace" />
                    </DialogFooter>
                </form.AppForm>
            </DialogContent>
        </Dialog>
    )
}
