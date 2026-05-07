import { useParams } from "@tanstack/react-router";
import { useMutation, useQuery } from "@parabella-io/tql-client";
import { LoadingCenter } from "@/shared/components/loading/loading-center";
import { ticketListsQuery } from "@/api/tickets";
import { CreateTicketListDialog } from "./dialogs/create-ticket-list.dialog";
import { TicketListColumn } from "./ticket-list-column";
import { ErrorCenter } from "@/shared/components/error/error-center";
import { DragDropProvider, DragEndEvent } from '@dnd-kit/react';
import { TicketEntity } from "@tql/api";
import { TicketListEntity } from "@tql/api";
import { moveTicketMutation } from "@/api/tickets/mutations/move-ticket.mutation";

export const TicketList = () => {
    const { workspaceId } = useParams({
        from: '/app/$workspaceId',
    });

    const ticketLists = useQuery({
        query: ticketListsQuery,
        params: {
            workspaceId,
        },
    });

    const moveTicket = useMutation({
        mutation: moveTicketMutation,
    })

    const handleDragEnd = async (event: DragEndEvent) => {
        if (event.canceled) return;

        const { source, target } = event.operation;

        const sourceTicket = source.data.ticket as TicketEntity;

        const targetTicketList = target.data.ticketList as TicketListEntity;

        const targetTicket = target.data.ticket as TicketEntity;

        const targetTicketListId = targetTicketList ? targetTicketList.id : targetTicket.ticketListId;

        console.log({
            sourceTicket,
            targetTicketList,
            targetTicket,
            targetTicketListId,
        })

        if (!targetTicketListId) return;

        await moveTicket.mutate({
            id: sourceTicket.id,
            oldTicketListId: sourceTicket.ticketListId,
            newTicketListId: targetTicketList.id,
        })
    }

    if (ticketLists.error) {
        return (
            <ErrorCenter message={'Failed to load ticket lists.'} />
        )
    }

    if (!ticketLists.data) {
        return (
            <LoadingCenter />
        )
    }

    if (ticketLists.data.length === 0) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center text-center h-full w-full gap-4">
                <p> You have no lists yet.</p>

                <CreateTicketListDialog workspaceId={workspaceId} />
            </div>
        )
    }

    return (
        <DragDropProvider
            onDragEnd={handleDragEnd}
        >
            <div className="flex flex-row items-start justify-start gap-4 p-8">
                {
                    ticketLists.data.map((ticketList) => (
                        <TicketListColumn key={ticketList.id} ticketList={ticketList} />
                    ))
                }
            </div>
        </DragDropProvider>

    )
}