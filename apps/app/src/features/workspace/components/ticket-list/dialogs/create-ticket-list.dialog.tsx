import { createTicketListMutation } from "@/api/tickets/mutations/create-ticket-list.mutation"
import { useAppForm } from "@/shared/components/form/form.hook"
import { Button } from "@/shared/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/components/ui/dialog"
import { FieldGroup } from "@/shared/components/ui/field"
import { useDisclosure } from "@/shared/hooks/use-dialog"
import { useMutation } from "@tql/client"
import { PlusIcon } from "lucide-react"
import { toast } from "sonner"
import z from "zod"

const CreateTicketListFormSchema = z.object({
    name: z.string().min(1, 'Name is required'),
})

type CreateTicketListParams = {
    workspaceId: string
}

export const CreateTicketListDialog = ({ workspaceId }: CreateTicketListParams) => {

    const { isOpen, onOpen, onClose } = useDisclosure()

    const createTicketList = useMutation({
        mutation: createTicketListMutation,
    })

    const form = useAppForm({
        defaultValues: {
            name: '',
        },
        validators: {
            onChange: CreateTicketListFormSchema,
        },
        onSubmit: async ({ value }) => {
            await createTicketList.mutate({
                workspaceId,
                name: value.name,
            })

            toast.success('Ticket list created successfully');

            onClose()
        }
    })

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <Button onClick={onOpen}>
                <PlusIcon className="w-4 h-4" />
                Create list
            </Button>

            <DialogContent>
                <form.AppForm>
                    <DialogHeader>
                        <DialogTitle>
                            Create ticket list
                        </DialogTitle>

                        <DialogDescription>
                            Enter the name of your ticket list to get started
                        </DialogDescription>
                    </DialogHeader>

                    <FieldGroup>
                        <form.AppField
                            name="name"
                            children={(field) => <field.FormInputField label="Name" required />}
                        />
                    </FieldGroup>

                    <DialogFooter>
                        <form.FormSubmitButton label="Create ticket list" />
                    </DialogFooter>
                </form.AppForm>
            </DialogContent>
        </Dialog>
    )
}