import { useParams } from "node_modules/@tanstack/react-router/dist/esm/useParams"
import { WorkspaceLayout } from "./components/layout/layout"
import { SideHeader } from "./components/layout/side-header"
import { WorkspaceSettings } from "./components/settings/settings"

export const WorkspaceSettingsPage = () => {

    const { workspaceId } = useParams({
        from: '/app/$workspaceId',
    })

    return (
        <WorkspaceLayout>
            <div className="flex-1 flex flex-col">
                <SideHeader>
                    <SideHeader.Title>
                        Settings
                    </SideHeader.Title>
                </SideHeader>

                <WorkspaceSettings workspaceId={workspaceId} />
            </div>
        </WorkspaceLayout>
    )
}


