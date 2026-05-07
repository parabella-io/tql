import { assignTicketMemberMutation } from "@/api/tickets/mutations/assign-ticket-member.mutation"
import { workspaceMembersMaxPagedQuery } from "@/api/workspaces/queries/workspace-members.query"
import { useAppForm } from "@/shared/components/form/form.hook"
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar"
import { Button } from "@/shared/components/ui/button"
import { Card, CardTitle, CardHeader, CardContent } from "@/shared/components/ui/card"
import { FieldGroup } from "@/shared/components/ui/field"
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover"
import { Spinner } from "@/shared/components/ui/spinner"
import { useDisclosure } from "@/shared/hooks/use-dialog"
import { IconEdit, IconLoader2, IconPlus, IconTrash, IconUser } from "@tabler/icons-react"
import { TicketEntity, TicketLabelEntity, WorkspaceMemberEntity } from "@tql/api"
import { useMutation, usePagedQuery, useQuery } from "@parabella-io/tql-client"
import { toast } from "sonner"
import z from "zod"
import { workspaceTicketLabelsQuery } from "@/api/workspaces/queries/workspace-ticket-labels.query"
import { CreateWorkspaceTicketLabelDialog } from "./dialogs/create-workspace-ticket-label-dialog"
import { useMemo } from "react"
import { addTicketLabelMutation } from "@/api/tickets/mutations/add-ticket-label.mutation"
import { removeTicketLabelMutation } from "@/api/tickets/mutations/remove-ticket-label.mutation"

type TicketDetailsProps = {
    ticket: TicketEntity & {
        assignee: WorkspaceMemberEntity | null
        reporter: WorkspaceMemberEntity
        labels: TicketLabelEntity[]
    }
}

export const TicketDetails = ({ ticket }: TicketDetailsProps) => {

    const assignMemberPopover = useDisclosure();

    const updateLabelPopover = useDisclosure();

    return (
        <Card className="w-[400px]">
            <CardHeader>
                <CardTitle>Details</CardTitle>
            </CardHeader>

            <CardContent>
                <div className="flex flex-col">
                    <div className="flex items-center gap-3 rounded-md border p-3 bg-muted/50 mb-4">
                        <Avatar className="h-8 w-8">
                            <AvatarFallback>
                                {ticket.reporter.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .toUpperCase()}
                            </AvatarFallback>
                        </Avatar>

                        <div className="flex flex-col">
                            <span className="text-xs text-muted-foreground mb-1">Reported by</span>
                            <span className="font-medium">{ticket.reporter.name}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-md border p-3 bg-muted/50 mb-4">
                        <Avatar className="h-8 w-8">
                            <AvatarFallback>
                                {ticket.assignee
                                    ? (ticket.assignee.name.split(" ").map((n) => n[0]).join("").toUpperCase())
                                    : <IconUser size={16} />}
                            </AvatarFallback>
                        </Avatar>

                        <div className="flex flex-col w-full">
                            <span className="text-xs text-muted-foreground mb-1">Assigned to</span>

                            {ticket.assignee ? (
                                <div className="flex items-center w-full">
                                    <span className="font-medium">{ticket.assignee.name}</span>

                                    <div className="ml-auto">
                                        <AssignMemberPopover
                                            assigneeId={ticket.assigneeId}
                                            ticketId={ticket.id}
                                            workspaceId={ticket.workspaceId}
                                            disclosure={assignMemberPopover}
                                        >
                                            <Button size="icon" variant="ghost">
                                                <IconEdit size={16} />
                                            </Button>
                                        </AssignMemberPopover>
                                    </div>
                                </div>
                            ) : (
                                <AssignMemberPopover
                                    assigneeId={ticket.assigneeId}
                                    ticketId={ticket.id}
                                    workspaceId={ticket.workspaceId}
                                    disclosure={assignMemberPopover}
                                >
                                    <Button
                                        onClick={assignMemberPopover.onOpen}
                                        variant="outline"
                                        size="sm"
                                        className="text-xs font-medium w-fit mt-0.5 flex items-center px-2 h-7 min-h-[28px]"
                                    >
                                        <IconUser className="mr-1" size={16} />
                                        Assign member
                                    </Button>
                                </AssignMemberPopover>
                            )}
                        </div>
                    </div>


                    <div className="flex flex-col gap-2 rounded-md border p-3 bg-muted/50 mb-4">
                        <span className="text-xs text-muted-foreground mb-1">Labels</span>
                        <div className="flex flex-wrap gap-2">
                            {ticket.labels.length > 0 ? (
                                <div className="w-full flex flex-row flex-wrap items-center gap-2">

                                    {ticket.labels.map(label => (
                                        <TicketLabelItem
                                            key={label.id}
                                            label={label}
                                            workspaceId={ticket.workspaceId}
                                            ticketId={ticket.id}
                                        />
                                    ))}

                                    <div>
                                        <TicketUpdateLabelPopover
                                            ticketId={ticket.id}
                                            workspaceId={ticket.workspaceId}
                                            labels={ticket.labels}
                                            disclosure={updateLabelPopover}
                                        >
                                            <Button variant="outline" size="sm" className="text-xs font-medium w-fit mt-0.5 flex items-center px-2 h-7 min-h-[28px]">
                                                <IconPlus className="mr-1" size={16} />
                                                Add label
                                            </Button>
                                        </TicketUpdateLabelPopover>
                                    </div>
                                </div>

                            ) : (
                                <div className="flex items-center gap-2">
                                    <TicketUpdateLabelPopover ticketId={ticket.id} workspaceId={ticket.workspaceId} labels={ticket.labels} disclosure={updateLabelPopover} >
                                        <Button variant="outline" size="sm" className="text-xs font-medium w-fit mt-0.5 flex items-center px-2 h-7 min-h-[28px]">
                                            <IconPlus className="mr-1" size={16} />
                                            Add label
                                        </Button>
                                    </TicketUpdateLabelPopover>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}


type TicketAssigneePopoverProps = {
    ticketId: string;
    workspaceId: string;
    assigneeId: string | null;
    disclosure: {
        isOpen: boolean;
        onOpen: () => void;
        onClose: () => void;
    };
    children: React.ReactNode;
}

const AssignMemberPopover = ({ ticketId, workspaceId, assigneeId, disclosure, children }: TicketAssigneePopoverProps) => {

    const workspaceMembers = usePagedQuery({
        isEnabled: disclosure.isOpen,
        pagedQuery: workspaceMembersMaxPagedQuery,
        params: {
            workspaceId: workspaceId,
        },
    })

    const assignMember = useMutation({
        mutation: assignTicketMemberMutation,
    })

    const form = useAppForm({
        defaultValues: {
            assigneeId: assigneeId ?? '',
        },
        validators: {
            onChange: z.object({
                assigneeId: z.string().min(1, 'Member is required'),
            }),
        },
        onSubmit: async ({ value }) => {
            try {
                await assignMember.mutate({
                    workspaceId: workspaceId,
                    ticketId: ticketId,
                    memberId: value.assigneeId,
                })
                toast.success('Member assigned successfully', { position: 'top-center' })
                disclosure.onClose();
            } catch (error) {
                toast.error('Failed to assign member', { position: 'top-center' })
            }
        },
    })


    const handleOpenChange = () => {
        if (disclosure.isOpen) {
            form.reset();
            disclosure.onClose();
        } else {
            disclosure.onOpen();
        }
    }

    return (
        <Popover open={disclosure.isOpen} onOpenChange={handleOpenChange}>
            <PopoverTrigger asChild>
                {children}
            </PopoverTrigger>

            <PopoverContent>
                {
                    workspaceMembers.isLoading && workspaceMembers.data.length === 0 ? (<><Spinner /></>) : (<>
                        <form.AppForm>
                            <FieldGroup>
                                <form.AppField name="assigneeId">
                                    {(field) => (
                                        <field.FormSelectField
                                            label="Assign member"
                                            required
                                            options={workspaceMembers.data.map(member => ({
                                                label: member.name,
                                                value: member.id,
                                            }))}
                                            placeholder="Select a member"
                                        />
                                    )}
                                </form.AppField>
                            </FieldGroup>

                            <form.FormSubmitButton label="Assign" />

                        </form.AppForm>
                    </>)
                }
            </PopoverContent>
        </Popover>
    )
}

type TicketUpdateLabelPopoverProps = {
    ticketId: string;
    workspaceId: string;
    labels: TicketLabelEntity[];
    disclosure: {
        isOpen: boolean;
        onOpen: () => void;
        onClose: () => void;
    };
    children: React.ReactNode;
}

export function TicketUpdateLabelPopover({ ticketId, workspaceId, labels, disclosure, children }: TicketUpdateLabelPopoverProps) {

    const workspaceTicketLabels = useQuery({
        query: workspaceTicketLabelsQuery,
        params: {
            workspaceId: workspaceId,
        },
    })

    const addTicketLabel = useMutation({
        mutation: addTicketLabelMutation,
    })

    const form = useAppForm({
        defaultValues: {
            labelId: '',
        },
        validators: {
            onChange: z.object({
                labelId: z.string().min(1, 'Label is required'),
            }),
        },
        onSubmit: async ({ value }) => {
            try {
                await addTicketLabel.mutate({
                    workspaceId: workspaceId,
                    ticketId: ticketId,
                    labelId: value.labelId,
                })
                toast.success('Label added successfully', { position: 'top-center' })
                disclosure.onClose();
            } catch (error) {
                toast.error('Failed to add label', { position: 'top-center' })
            }
        }
    })

    const handleOpenChange = () => {
        if (disclosure.isOpen) {
            disclosure.onClose();
            form.reset();
        } else {
            disclosure.onOpen();
        }
    }

    const options = useMemo(() => {
        return workspaceTicketLabels.data
            ?.filter(label => !labels.some(l => l.workspaceTicketLabelId === label.id))
            .map(label => ({
                label: label.name,
                value: label.id,
            })) ?? []
    }, [workspaceTicketLabels.data, labels])

    return (
        <Popover open={disclosure.isOpen} onOpenChange={handleOpenChange}>
            <PopoverTrigger asChild>
                {children}
            </PopoverTrigger>

            <PopoverContent>
                <form.AppForm>
                    {
                        !workspaceTicketLabels.data ? (<><Spinner /></>) : (<>
                            <FieldGroup>
                                <form.AppField name="labelId">
                                    {(field) => (
                                        <field.FormSelectField
                                            label="Label"
                                            required
                                            options={options}
                                            placeholder={options.length > 0 ? 'Select a label' : 'No labels available'}
                                        />
                                    )}
                                </form.AppField>

                            </FieldGroup>
                        </>)
                    }

                    <div className="flex items-center gap-2">
                        <CreateWorkspaceTicketLabelDialog workspaceId={workspaceId}>
                            <Button
                                variant='outline'
                                size='sm'
                            >
                                <IconPlus className="mr-1" size={16} />
                                New label
                            </Button>
                        </CreateWorkspaceTicketLabelDialog>

                        <div className="ml-auto">
                            <form.FormSubmitButton label="Add label" />
                        </div>
                    </div>
                </form.AppForm>
            </PopoverContent>
        </Popover >
    )
}

type TicketLabelItemProps = {
    label: TicketLabelEntity;
    workspaceId: string;
    ticketId: string;

}

const TicketLabelItem = ({ label, workspaceId, ticketId }: TicketLabelItemProps) => {

    const removeLabelPopover = useDisclosure();

    const removeTicketLabel = useMutation({
        mutation: removeTicketLabelMutation,
    })

    const handleRemoveLabel = async () => {
        try {
            await removeTicketLabel.mutate({
                id: label.id,
                workspaceId: workspaceId,
                ticketId: ticketId,
            })

            toast.success('Label removed successfully', { position: 'top-center' })
            removeLabelPopover.onClose();
        } catch (error) {
            toast.error('Failed to remove label', { position: 'top-center' })
        }
    }

    const handleOpenChange = () => {
        if (removeLabelPopover.isOpen) {
            removeLabelPopover.onClose();
        } else {
            removeLabelPopover.onOpen();
        }
    }

    return (
        <Popover open={removeLabelPopover.isOpen} onOpenChange={handleOpenChange}>
            <PopoverTrigger asChild>
                <span
                    className="flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium transition-opacity hover:opacity-70"
                    style={{
                        backgroundColor: "#EEE",
                        color: "#222",
                        fontSize: "0.92rem",
                        border: "1px solid #ddd",
                        boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
                        cursor: "default",
                        userSelect: "none",
                    }}
                >
                    {label.name}
                </span>
            </PopoverTrigger>

            <PopoverContent>
                <Button variant="destructive" size="sm" onClick={handleRemoveLabel} disabled={removeTicketLabel.isLoading}>
                    {removeTicketLabel.isLoading ? <Spinner /> : <IconTrash size={16} />}
                    Remove label
                </Button>
            </PopoverContent>
        </Popover>
    )
}