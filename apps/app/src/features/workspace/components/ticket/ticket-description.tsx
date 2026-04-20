import { IconCheck, IconPencil, IconTextCaption, IconX } from "@tabler/icons-react"
import { TicketEntity } from "@tql/api"
import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from '@tiptap/starter-kit'
import { useState } from "react"
import { Button } from "@/shared/components/ui/button"
import { updateTicketMutation } from "@/api/tickets/mutations/update-ticket.mutation"
import { useMutation } from "@tql/client"
import { toast } from "sonner"
import { Spinner } from "@/shared/components/ui/spinner"

type TicketDescriptionProps = {
    ticket: TicketEntity
}

export const TicketDescription = ({ ticket }: TicketDescriptionProps) => {

    const [isEditing, setIsEditing] = useState(false)

    const updateTicket = useMutation({
        mutation: updateTicketMutation,
    })

    const editor = useEditor({
        content: ticket.description,
        extensions: [
            StarterKit,
        ],
    })

    const handleSave = async () => {
        try {
            await updateTicket.mutate({
                id: ticket.id,
                title: ticket.title,
                description: editor.getHTML(),
            })

            toast.success('Ticket updated successfully', { position: 'top-center' });

            setIsEditing(false);

        } catch (error) {
            toast.error('Failed to update ticket', { position: 'top-center' });
        }
    }

    if (!editor) {
        return null
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-start gap-2">

                <div className="flex-1">
                    <div className="flex items-center gap-2 w-full">
                        <IconTextCaption />

                        <h3 className="text-md font-medium">Description</h3>

                        {
                            ticket.description && !isEditing && (
                                <Button onClick={() => setIsEditing(true)} className="ml-auto" variant="outline" size="sm">
                                    <IconPencil />
                                    Edit
                                </Button>
                            )
                        }
                    </div>

                    <div className="mt-4 mx-2">
                        {isEditing ? (
                            <div className="flex flex-col items-center gap-2 w-full">

                                <div
                                    className="border-2 border-input rounded-md p-4 overflow-y-auto w-full h-full flex flex-col min-h-[120px]"
                                    onClick={() => {
                                        if (editor) {
                                            editor.commands.focus();
                                        }
                                    }}
                                    style={{ cursor: "text" }}
                                >
                                    <EditorContent editor={editor} className="[&_.ProseMirror]:outline-none" />
                                </div>


                                <div className="ml-auto gap-4 flex items-center mt-4">
                                    <Button variant="ghost" onClick={() => setIsEditing(false)}>
                                        <IconX />
                                        Cancel
                                    </Button>

                                    <Button onClick={handleSave}>
                                        {updateTicket.isLoading ? <Spinner /> : <IconCheck />}
                                        Save
                                    </Button>
                                </div>
                            </div>

                        ) : (
                            <>
                                {
                                    ticket.description ? (
                                        <div className="text-sm text-muted-foreground">
                                            <EditorContent editor={editor} className="[&_.ProseMirror]:outline-none" readOnly={true} />
                                        </div>

                                    ) : (
                                        <div className="border-2 border-dashed border-input rounded-md p-4 h-[120px] overflow-y-auto hover:cursor-pointer hover:bg-muted transition-colors duration-200" onClick={() => setIsEditing(true)}>
                                            <div className="text-sm text-muted-foreground">
                                                Add a description...
                                            </div>
                                        </div>
                                    )
                                }
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>

    )
}