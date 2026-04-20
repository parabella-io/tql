
import { ErrorCenter } from "@/shared/components/error/error-center";
import { useAppForm } from "@/shared/components/form/form.hook";
import { toast } from "sonner";
import z from "zod";
import React from "react";
import { FieldGroup } from "@/shared/components/ui/field";
import { useAuthActions, useAuthContext } from "@/shared/contexts/auth.contex";
import { Navigate, useNavigate } from "@tanstack/react-router";
import { Button } from "@/shared/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";

const UpdateUserFormSchema = z.object({
    name: z.string().min(1, 'Name is required'),
});

export const AccountPage = () => {

    const { user } = useAuthContext();

    const { updateUser } = useAuthActions();

    const navigate = useNavigate();

    if (!user) {
        return <ErrorCenter message={'User not found.'} />;
    }

    // React to change of activeWorkspace to update defaultValues (for when query completes loading)
    const form = useAppForm({
        defaultValues: {
            name: user?.name ?? "",
        },
        validators: {
            onChange: UpdateUserFormSchema,
        },
        onSubmit: async ({ value }) => {
            try {
                await updateUser(value.name);
                toast.success("User name updated", { position: "top-center" });
            } catch (error) {
                toast.error("Failed to update user", { position: "top-center" });
                throw error;
            }
        },
    });

    const handleRouteToWorkspaces = () => {
        navigate({ to: "/app" });
    }

    if (!user) {
        return <Navigate to="/auth/sign-in" replace />;
    }

    return (
        <div className="flex-1 flex flex-col max-w-lg w-full p-6 gap-4">

            <div>
                <Button onClick={handleRouteToWorkspaces}>
                    <ArrowLeftIcon className="size-4" />
                </Button>
            </div>

            <h1 className="font-semibold text-lg mb-6">Account Settings</h1>

            <form.AppForm >
                <FieldGroup>
                    <form.AppField
                        name="name"
                        children={(field) => <field.FormInputField label="Name" required />}
                    />
                </FieldGroup>

                <div className="mt-4 ml-auto">
                    <form.FormSubmitButton label="Save Changes" />
                </div>
            </form.AppForm>
        </div>
    );
};