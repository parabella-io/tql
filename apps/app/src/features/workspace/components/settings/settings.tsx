import { myWorkspacesQuery } from "@/api/workspaces";
import { updateWorkspaceMutation } from "@/api/workspaces/mutations/update-workspace.mutation";
import { ErrorCenter } from "@/shared/components/error/error-center";
import { useAppForm } from "@/shared/components/form/form.hook";
import { LoadingCenter } from "@/shared/components/loading/loading-center";
import { useMutation, useQuery } from "@parabella-io/tql-client";
import { toast } from "sonner";
import z from "zod";
import React, { useMemo } from "react";
import { FieldGroup } from "@/shared/components/ui/field";

const UpdateWorkspaceFormSchema = z.object({
    name: z.string().min(1, 'Name is required'),
});

type WorkspaceSettingsParams = {
    workspaceId: string
};

export const WorkspaceSettings = ({ workspaceId }: WorkspaceSettingsParams) => {
    const workspaces = useQuery({
        query: myWorkspacesQuery,
        params: {},
    });

    const updateWorkspace = useMutation({
        mutation: updateWorkspaceMutation,
    });

    const activeWorkspace = useMemo(() => workspaces.data?.find((workspace) => workspace.id === workspaceId), [workspaces.data, workspaceId]);

    const form = useAppForm({
        defaultValues: {
            name: activeWorkspace?.name ?? "",
        },
        validators: {
            onChange: UpdateWorkspaceFormSchema,
        },
        onSubmit: async ({ value }) => {
            try {
                await updateWorkspace.mutate({
                    id: activeWorkspace!.id,
                    name: value.name,
                });
                toast.success("Workspace name updated", { position: "top-center" });
            } catch (error) {
                toast.error("Failed to update workspace", { position: "top-center" });
                throw error;
            }
        },
    });

    if (!workspaces) {
        return <LoadingCenter />;
    }

    if (workspaces.error) {
        return <ErrorCenter message={'Failed to load workspaces.'} />;
    }

    if (!activeWorkspace) {
        return <ErrorCenter message={'Workspace not found.'} />;
    }

    return (
        <div className="flex-1 flex flex-col max-w-lg w-full p-6">
            <h1 className="font-semibold text-lg mb-6">Settings</h1>

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