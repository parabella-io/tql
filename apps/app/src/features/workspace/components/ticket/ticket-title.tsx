import { updateTicketMutation } from "@/api/tickets/mutations/update-ticket.mutation"
import { useAppForm } from "@/shared/components/form/form.hook"
import { Button } from "@/shared/components/ui/button"
import { FieldGroup } from "@/shared/components/ui/field"
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover"
import { useDisclosure } from "@/shared/hooks/use-dialog"
import { IconPencil } from "@tabler/icons-react"
import { TicketEntity } from "@tql/api"
import { useMutation } from "@parabella-io/tql-client"
import { toast } from "sonner"
import z from "zod"

type TicketTitleProps = {
    ticket: TicketEntity
}

const UpdateTicketTitleFormSchema = z.object({
    title: z.string().min(1, 'Title is required'),
});

export const TicketTitle = ({ ticket }: TicketTitleProps) => {

    const { isOpen, onOpen, onClose } = useDisclosure();

    const updateTicket = useMutation({
        mutation: updateTicketMutation,
    });

    const form = useAppForm({
        defaultValues: {
            title: ticket.title,
        },
        validators: {
            onChange: UpdateTicketTitleFormSchema,
        },
        onSubmit: async ({ value }) => {
            try {
                await updateTicket.mutate({
                    ...ticket,
                    title: value.title,
                });

                toast.success('Ticket updated successfully', { position: 'top-center' });

                onClose();
            } catch (error) {
                toast.error('Failed to update ticket', { position: 'top-center' });
            }
        }
    });

    const handleOpenChange = () => {
        if (isOpen) {
            form.reset();
            onClose();
        } else {
            onOpen();
        }
    }

    return (
        <>
            {ticket.title}

            <Popover open={isOpen} onOpenChange={handleOpenChange}>
                <PopoverTrigger asChild>
                    <Button
                        size="icon"
                        variant="ghost"
                        className="ml-4"
                    >
                        <IconPencil />
                    </Button>
                </PopoverTrigger>

                <PopoverContent>
                    <form.AppForm>
                        <FieldGroup>
                            <form.AppField
                                name="title"
                                children={(field) => <field.FormInputField label="Title" required />}
                            />
                        </FieldGroup>

                        <form.FormSubmitButton label="Save" />
                    </form.AppForm>
                </PopoverContent>
            </Popover>
        </>
    )
}