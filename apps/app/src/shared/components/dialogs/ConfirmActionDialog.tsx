import React, { useState } from "react";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogHeader,
    AlertDialogFooter,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogTitle,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";

type ConfirmActionDialogProps = {
    title: string;
    confirmButtonText: string;
    confirmButtonVariant: "default" | "destructive" | "outline" | "ghost";
    children: React.ReactNode;
    onConfirm: () => Promise<void>;
};

export const ConfirmActionDialog = ({ title, confirmButtonText, confirmButtonVariant, children, onConfirm }: ConfirmActionDialogProps) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleConfirm = async () => {
        setLoading(true);
        try {
            await onConfirm();
            setOpen(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                {children}
            </AlertDialogTrigger>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>

                    <Button
                        variant={confirmButtonVariant}
                        disabled={loading}
                        onClick={handleConfirm}
                        type="button"
                    >
                        {loading && (<Spinner />)}
                        {confirmButtonText}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};