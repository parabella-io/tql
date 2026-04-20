import { ticketQuery } from "@/api/tickets/queries/ticket.query"
import { useQuery } from "@tql/client"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog"
import { TicketTitle } from "./ticket-title"
import { Separator } from "@/shared/components/ui/separator"
import { TicketDescription } from "./ticket-description"
import { TicketDetails } from "./ticket-details"
import { TicketAttachments } from "./ticket-attachments"

type TicketDialogProps = {
    isOpen: boolean
    onClose: () => void
    ticketId: string
}

export const TicketDialog = ({ isOpen, onClose, ticketId }: TicketDialogProps) => {

    const ticket = useQuery({
        isEnabled: isOpen,
        query: ticketQuery,
        params: {
            id: ticketId,
        },
    });

    if (!isOpen || !ticket.data) {
        return null;
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent showCloseButton={false} className="min-w-[1200px] max-w-none">
                <DialogHeader>
                    <DialogTitle className="text-lg font-medium">
                        <TicketTitle ticket={ticket.data} />
                    </DialogTitle>

                    <DialogDescription className="sr-only">
                        View ticket details
                    </DialogDescription>
                </DialogHeader>

                <Separator />

                <div className="flex items-start gap-4 w-full">
                    <div className="flex-1 gap-4 flex flex-col">
                        <TicketDescription ticket={ticket.data} />

                        <Separator />

                        <TicketAttachments ticket={ticket.data} />
                    </div>


                    <TicketDetails ticket={ticket.data} />
                </div>

            </DialogContent >
        </Dialog>
    )
}