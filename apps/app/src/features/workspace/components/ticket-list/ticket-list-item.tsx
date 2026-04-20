import { useDraggable } from "@dnd-kit/react";
import { TicketEntity } from "@tql/api";
import { Card, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { IconDots } from "@tabler/icons-react"
import { Button } from "@/shared/components/ui/button"
import { useDisclosure } from "@/shared/hooks/use-dialog";
import { TicketDialog } from "../ticket/ticket.dialog";

type TicketListColumnItemProps = {
    ticket: TicketEntity
}

export const TicketListColumnItem = ({ ticket }: TicketListColumnItemProps) => {
    const { ref } = useDraggable({
        id: ticket.id,
        data: {
            ticket
        }
    });

    const {
        isOpen,
        onOpen,
        onClose
    } = useDisclosure()

    return (
        <li ref={ref} id={ticket.id}>
            <Card className="py-4 group" ref={ref} id={ticket.id} onClick={onOpen}>
                <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                        {ticket.title}

                        <Button
                            size="icon"
                            variant="ghost"
                            className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(event) => {
                                event.stopPropagation()
                            }}
                        >
                            <IconDots />
                        </Button>
                    </CardTitle>
                </CardHeader>
            </Card>

            <TicketDialog isOpen={isOpen} onClose={onClose} ticketId={ticket.id} />
        </li>

    )
}