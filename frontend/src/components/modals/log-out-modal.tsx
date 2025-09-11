import { Button } from "@/components/ui/button"
import {
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"
import Spinner from "../shared/spinner"
import { useNavigate } from "react-router"
export default function LogoutModal() {
    const navigate = useNavigate()

    return (
        <DialogContent className="sm:max-w-[425px] bg-card">
            <DialogHeader>
                <DialogTitle>Logout Confirmation.</DialogTitle>
                <DialogDescription>
                    Are you sure you want to log out?
                </DialogDescription>
            </DialogHeader>
            <DialogFooter>
                <DialogClose asChild>
                    <Button variant="outline" className="cursor-pointer">Cancel</Button>
                </DialogClose>
                <Button type="submit" onClick={() => navigate("/")} variant='destructive' className="cursor-pointer">
                    <Spinner isLoading={false} label={'Logging out...'}>
                        Confirm
                    </Spinner>
                </Button>
            </DialogFooter>
        </DialogContent>
    )
}