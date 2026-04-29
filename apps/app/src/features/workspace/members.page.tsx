import { Button } from "@/shared/components/ui/button"
import { SideHeader } from "./components/layout/side-header"
import { PlusIcon } from "lucide-react"
import { WorkspaceLayout } from "./components/layout/layout"
import { MemberList } from "./components/member-list/member-list"
import { useParams } from "@tanstack/react-router"
import { Tabs, TabsTrigger, TabsList, TabsContent } from "@/shared/components/ui/tabs"
import { MemberInvitesList } from "./components/member-list/member-invites-list"
import { InviteMemberDialog } from "./components/member-list/dialogs/invite-member.dialog"
import { useEffect } from "react"

export const WorkspaceMembersPage = () => {

    const { workspaceId } = useParams({
        from: '/app/$workspaceId',
    })

    return (
        <WorkspaceLayout>
            <div className="flex-1 flex flex-col">
                <SideHeader>
                    <SideHeader.Title>
                        Members
                    </SideHeader.Title>
                    <SideHeader.Actions>
                        <InviteMemberDialog workspaceId={workspaceId}>
                            <Button size="sm">
                                <PlusIcon className="w-4 h-4" />
                                Invite Member
                            </Button>
                        </InviteMemberDialog>
                    </SideHeader.Actions>
                </SideHeader>

                <div className="flex-1 flex flex-col p-6">
                    <Tabs defaultValue="Members" >
                        <TabsList>
                            <TabsTrigger value="Members">Members</TabsTrigger>

                            <TabsTrigger value="Invites">Invites</TabsTrigger>
                        </TabsList>

                        <TabsContent value="Members" >
                            <MemberList workspaceId={workspaceId} />
                        </TabsContent>

                        <TabsContent value="Invites" >
                            <MemberInvitesList workspaceId={workspaceId} />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </WorkspaceLayout>
    )
}


