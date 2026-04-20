import { useAppForm } from "@/shared/components/form/form.hook"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/components/ui/dialog"
import { FieldGroup } from "@/shared/components/ui/field"
import { useDisclosure } from "@/shared/hooks/use-dialog"
import { useMutation } from "@tql/client"
import z from "zod"
import { updateTicketListMutation } from "@/api/tickets/mutations/update-ticket-list.mutation"
import { toast } from "sonner"
import { PencilIcon } from "lucide-react"
import { Button } from "@/shared/components/ui/button"

const UpdateTicketListFormSchema = z.object({
    id: z.string(),
    name: z.string().min(1, 'Name is required'),
})

type UpdateTicketListParams = {
    id: string
    name: string
}

export const UpdateTicketListDialog = ({ id, name }: UpdateTicketListParams) => {

    const { isOpen, onOpen, onClose } = useDisclosure()

    const updateTicketList = useMutation({
        mutation: updateTicketListMutation,
    })

    const form = useAppForm({
        defaultValues: {
            id,
            name,
        },
        validators: {
            onChange: UpdateTicketListFormSchema,
        },
        onSubmit: async ({ value }) => {
            await updateTicketList.mutate({
                id: value.id,
                name: value.name,
            })

            toast.success('Ticket list updated successfully');

            onClose()
        }
    })

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <Button onClick={onOpen}>
                <PencilIcon className="w-4 h-4" />
                Update list
            </Button>

            <DialogContent>
                <form.AppForm>
                    <DialogHeader>
                        <DialogTitle>
                            Update ticket list
                        </DialogTitle>

                        <DialogDescription>
                            Enter the name of your ticket list to update
                        </DialogDescription>
                    </DialogHeader>

                    <FieldGroup>
                        <form.AppField
                            name="name"
                            children={(field) => <field.FormInputField label="Name" required />}
                        />
                    </FieldGroup>

                    <DialogFooter>
                        <form.FormSubmitButton label="Update ticket list" />
                    </DialogFooter>
                </form.AppForm>
            </DialogContent>
        </Dialog>
    )
}