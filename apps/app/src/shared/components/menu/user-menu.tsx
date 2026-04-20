import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar"
import {
    IconDotsVertical,
    IconLogout,
    IconUserCircle,
} from "@tabler/icons-react"
import { Button } from "../ui/button"
import { Link } from "@tanstack/react-router"
import { useAuthActions, useAuthContext } from "@/shared/contexts/auth.contex"

export const UserMenu = () => {

    const { user } = useAuthContext();

    const { signOut } = useAuthActions();

    const handleLogout = () => {
        signOut();
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size='lg'>
                    <Avatar className="h-8 w-8 rounded-lg grayscale">
                        <AvatarImage src={''} alt={''} />
                        <AvatarFallback className="rounded-lg">DP</AvatarFallback>
                    </Avatar>

                    <div className="ml-2 grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-medium">{user?.name}</span>
                    </div>

                    <IconDotsVertical className="ml-auto size-4" />
                </Button>
            </DropdownMenuTrigger>


            <DropdownMenuContent
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                side={"right"}
                align="end"
                sideOffset={4}
            >
                <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                        <Avatar className="h-8 w-8 rounded-lg">
                            <AvatarImage src={''} alt={''} />
                            <AvatarFallback className="rounded-lg">{user?.name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-medium">{user?.name}</span>
                            <span className="truncate text-xs text-muted-foreground">
                                {user?.email}
                            </span>
                        </div>
                    </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                        <Link to="/app">
                            <IconUserCircle />
                            Dashboard
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuGroup>


                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                        <Link to="/app/account">
                            <IconUserCircle />
                            Account
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={handleLogout}>
                    <IconLogout />
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}