import { createTicketMutation } from "@/api/tickets/mutations/create-ticket.mutation"
import { useAppForm } from "@/shared/components/form/form.hook"
import { Button } from "@/shared/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog"
import { FieldGroup } from "@/shared/components/ui/field"
import { useDisclosure } from "@/shared/hooks/use-dialog"
import { useMutation } from "@parabella-io/tql-client"
import { PlusIcon } from "lucide-react"
import { toast } from "sonner"
import z from "zod"

const CreateTicketFormSchema = z.object({
    title: z.string().min(1, 'Title is required'),
})

type CreateTicketParams = {
    workspaceId: string
    ticketListId: string
}

export const CreateTicketDialog = ({ workspaceId, ticketListId }: CreateTicketParams) => {

    const { isOpen, onOpen, onClose } = useDisclosure()

    const createTicket = useMutation({
        mutation: createTicketMutation,
    })

    const form = useAppForm({
        defaultValues: {
            title: '',
        },
        validators: {
            onChange: CreateTicketFormSchema,
        },
        onSubmit: async ({ value }) => {
            const { error } = await createTicket.mutate({
                workspaceId,
                ticketListId,
                title: value.title,
            })

            if (error) {
                toast.error('Ticket creation failed', { position: 'top-center' });
            } else {
                toast.success('Ticket created successfully', { position: 'top-center' });

                onClose()
            }
        }
    })

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <Button variant="outline" className="w-full" onClick={onOpen}>
                <PlusIcon />
                Create Ticket
            </Button>

            <DialogContent>
                <form.AppForm>
                    <DialogHeader>
                        <DialogTitle>
                            Create ticket
                        </DialogTitle>

                        <DialogDescription>
                            Enter the title of your ticket to get started
                        </DialogDescription>
                    </DialogHeader>

                    <FieldGroup>
                        <form.AppField
                            name="title"
                            children={(field) => <field.FormInputField label="Title" required />}
                        />
                    </FieldGroup>

                    <DialogFooter>
                        <form.FormSubmitButton label="Create ticket" />
                    </DialogFooter>
                </form.AppForm>
            </DialogContent>
        </Dialog>
    )
}