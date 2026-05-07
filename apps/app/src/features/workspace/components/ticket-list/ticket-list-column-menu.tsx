import { deleteTicketListMutation } from "@/api/tickets/mutations/delete-ticket-list.mutation"
import { useMutation } from "@parabella-io/tql-client"
import { toast } from "sonner"
import { Button } from "@/shared/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu"
import { Spinner } from "@/shared/components/ui/spinner"
import { IconDots, IconTrash } from "@tabler/icons-react"

type TicketListColumnMenuProps = {
    ticketListId: string
}

export const TicketListColumnMenu = ({ ticketListId }: TicketListColumnMenuProps) => {

    const deleteTicketList = useMutation({
        mutation: deleteTicketListMutation,
    })

    const handleDeleteTicketList = async () => {
        const { error } = await deleteTicketList.mutate({
            id: ticketListId,
        })

        if (error) {
            toast.error('Failed to delete ticket list')
        } else {
            toast.success('Ticket list deleted')
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost">
                    <IconDots />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent>
                <DropdownMenuItem disabled={deleteTicketList.isLoading} onClick={handleDeleteTicketList}>
                    {deleteTicketList.isLoading ? <Spinner /> : <IconTrash />}
                    Delete List
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}