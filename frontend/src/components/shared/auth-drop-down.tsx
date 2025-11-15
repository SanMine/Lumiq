import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { useRef } from "react";
import { IoMdLogOut } from "react-icons/io";
import { MdOutlineAccountCircle } from "react-icons/md";
import { FaRegBuilding } from "react-icons/fa";
import { LiaUsersSolid } from "react-icons/lia";
import { TbHomeSpark } from "react-icons/tb";
import { Link } from "react-router";
import LogoutModal from "../modals/log-out-modal";
import { Button } from "../ui/button";
import { Dialog, DialogTrigger } from "../ui/dialog";

export default function AuthDropdown() {
    const dialogTriggerRef = useRef<HTMLButtonElement>(null)
    const { user } = useAuth()

    const userInitials = user?.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2) || 'U'

    return (
        <Dialog>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="secondary" className="size-8 rounded-full cursor-pointer">
                        <Avatar className="size-9">
                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`} alt={userInitials} />
                            <AvatarFallback>{userInitials}</AvatarFallback>
                        </Avatar>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-70" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal mb-1">
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none truncate">{user?.name || 'User'}</p>
                            <p className="text-xs leading-none text-muted-foreground truncate">{user?.email || ''}</p>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuGroup>
                        <DropdownMenuItem asChild className="cursor-pointer">
                            <Link to='/' className="whitespace-nowrap">
                                <TbHomeSpark className="size-4 text-black mr-1 dark:text-white" aria-hidden="true" />
                                Home
                                <DropdownMenuShortcut>⇧⌘H</DropdownMenuShortcut>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className="cursor-pointer">
                            <Link to='/roommate-match' className="whitespace-nowrap">
                                <LiaUsersSolid className="size-4 text-black mr-1 dark:text-white" aria-hidden="true" />
                                Roommates Matching
                                <DropdownMenuShortcut>⇧⌘R</DropdownMenuShortcut>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className="cursor-pointer">
                            <Link to='/dorms' className="whitespace-nowrap">
                                <FaRegBuilding className="size-4 text-black mr-1 dark:text-white" aria-hidden="true" />
                                All Dormitories
                                <DropdownMenuShortcut>⇧⌘D</DropdownMenuShortcut>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className="cursor-pointer">
                            <Link to='/account' className="whitespace-nowrap">
                                <MdOutlineAccountCircle className="size-4 text-black mr-1 dark:text-white" aria-hidden="true" />
                                Account
                                <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onSelect={(e) => {
                            e.preventDefault()
                            dialogTriggerRef.current?.click()
                        }}
                        className="cursor-pointer"
                    >
                        <IoMdLogOut className="size-4 mr-1 text-sm dark:text-white" aria-hidden="true" />
                        Logout
                        <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <DialogTrigger asChild>
                <button ref={dialogTriggerRef} className="hidden" />
            </DialogTrigger>
            <LogoutModal />
        </Dialog>
    )
}