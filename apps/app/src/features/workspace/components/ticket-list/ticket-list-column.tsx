import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { TicketEntity, TicketListEntity } from "@tql/api"
import { useDroppable } from "@dnd-kit/react"
import { TicketListColumnMenu } from "./ticket-list-column-menu"
import { CreateTicketDialog } from "./dialogs/create-ticket.dialog"
import { TicketListColumnItem } from "./ticket-list-item"

type TicketListWithTickets = TicketListEntity & {
    tickets: TicketEntity[]
}

type TicketListColumnProps = {
    ticketList: TicketListWithTickets
}

export const TicketListColumn = ({ ticketList }: TicketListColumnProps) => {

    const { ref } = useDroppable({
        id: ticketList.id,
        data: {
            ticketList
        }
    });

    return (
        <Card className="flex min-w-[300px] bg-muted" ref={ref} id={ticketList.id}>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{ticketList.name}</CardTitle>

                <TicketListColumnMenu ticketListId={ticketList.id} />
            </CardHeader>

            <CardContent>
                <ul className="flex flex-col gap-4">
                    {
                        ticketList.tickets.map((ticket) => (
                            <TicketListColumnItem key={ticket.id} ticket={ticket} />
                        ))
                    }
                </ul>
            </CardContent>

            <CardFooter>
                <CreateTicketDialog
                    workspaceId={ticketList.workspaceId}
                    ticketListId={ticketList.id}
                />
            </CardFooter>
        </Card>
    )
}

