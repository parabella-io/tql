import { createTicketAttachmentMutation } from "@/api/tickets/mutations/create-ticket-attachment.mutation";
import { Button } from "@/shared/components/ui/button";
import { useUpload } from "@/shared/hooks/use-upload-file";
import { TicketAttachmentEntity, TicketEntity } from "@tql/api"
import { useMutation } from "@tql/client";
import { Upload, Trash2 } from "lucide-react";
import { v7 } from "uuid";
import React, { useRef } from "react";
import { toast } from "sonner";
import { useViewFile } from "@/shared/hooks/use-view-attachment";
import { deleteTicketAttachmentMutation } from "@/api/tickets/mutations/delete-ticket-attachment.mutation";
import { ConfirmActionDialog } from "@/shared/components/dialogs/ConfirmActionDialog";

type TicketAttachmentsProps = {
    ticket: TicketEntity & {
        attachments: TicketAttachmentEntity[]
    }
}

export const TicketAttachments = ({ ticket }: TicketAttachmentsProps) => {
    const attachments = ticket.attachments || [];

    const { uploadFile } = useUpload();

    const { viewFile } = useViewFile();

    const createTicketAttachment = useMutation({
        mutation: createTicketAttachmentMutation,
    })

    const deleteTicketAttachment = useMutation({
        mutation: deleteTicketAttachmentMutation,
    })

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleDeleteAttachment = async (attachmentId: string) => {
        try {
            await deleteTicketAttachment.mutate({
                workspaceId: ticket.workspaceId,
                ticketId: ticket.id,
                attachmentId: attachmentId,
            });

            toast.success('Attachment deleted successfully', { position: 'top-center' });
        }
        catch (error) {
            toast.error('Failed to delete attachment', { position: 'top-center' });
        }
    }

    const handleUpload = async (file: File) => {
        try {
            const key = `attachments/${ticket.id}/${v7()}`;

            await uploadFile(file, key);

            await createTicketAttachment.mutate({
                workspaceId: ticket.workspaceId,
                ticketId: ticket.id,
                name: file.name,
                size: file.size,
                key: key,
            });

            toast.success('File uploaded successfully', { position: 'top-center' });
        } catch (error) {
            toast.error('Failed to upload file', { position: 'top-center' });
            console.error(error);
        }
    }

    const handleViewFile = async (key: string) => {
        try {
            await viewFile(key);
        } catch (error) {
            toast.error('Failed to view file', { position: 'top-center' });
            console.error(error);
        }
    }

    const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files && e.target.files[0];

        if (file) {
            await handleUpload(file);

            e.target.value = "";
        }
    };

    return (
        <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
                <IconPaperclip />
                <h3 className="text-md font-medium">Attachments</h3>
                <span className="text-xs text-muted-foreground ml-2">{attachments.length} file{attachments.length === 1 ? '' : 's'}</span>
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={onFileChange}
                />
                <Button
                    variant="outline"
                    size="sm"
                    className="ml-auto"
                    onClick={() => fileInputRef.current?.click()}
                    type="button"
                >
                    <Upload />
                    Upload
                </Button>
            </div>

            {attachments.length === 0 && (
                <span className="text-sm text-muted-foreground ml-7">No attachments yet.</span>
            )}

            <ul className="ml-8 flex flex-col gap-2">
                {attachments.map(att => (
                    <li key={att.id} className="flex items-center gap-2">
                        <IconFile />
                        <a
                            onClick={() => handleViewFile(att.key)}
                            className="text-blue-600 underline break-all"
                        >
                            {att.name}
                        </a>

                        <span className="text-xs text-muted-foreground ml-2">
                            {att.size ? `(${formatFileSize(att.size)})` : ""}
                        </span>

                        <ConfirmActionDialog
                            title="Are you sure you want to delete this attachment?"
                            confirmButtonText="Delete"
                            confirmButtonVariant="ghost"
                            onConfirm={async () => await handleDeleteAttachment(att.id)}>
                            <Button
                                type="button"
                                size="icon"
                                variant="ghost"
                                aria-label="Delete attachment"
                                className="ml-1 text-red-600 hover:bg-red-100"
                            >
                                <Trash2 size={16} />
                            </Button>
                        </ConfirmActionDialog>
                    </li>
                ))}
            </ul>
        </div>
    );
};

// Helper icon components (placeholders)
const IconPaperclip = () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" className="inline-block"><path d="M7 13l5-5a3 3 0 10-4.24-4.24l-5 5a3 3 0 004.24 4.24l5-5" /></svg>
);

const IconFile = () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" className="inline-block"><rect x="3" y="3" width="10" height="10" rx="2" /><path d="M7 7h2v2H7z" /></svg>
);

// Helper to format file size nicely
function formatFileSize(size: number) {
    if (size < 1024) return size + " B";
    if (size < 1024 * 1024) return (size / 1024).toFixed(1) + " KB";
    return (size / (1024 * 1024)).toFixed(2) + " MB";
}