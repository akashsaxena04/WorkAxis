import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { inviteUser, selectAuthLoading } from "@/store/authSlice";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { MailPlus } from "lucide-react";

export function InviteModal() {
    const dispatch = useDispatch();
    const loading = useSelector(selectAuthLoading);

    const [open, setOpen] = useState(false);
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("employee");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email) {
            toast.error("Please enter an email address");
            return;
        }

        const result = await dispatch(inviteUser({ email, role }));

        if (inviteUser.fulfilled.match(result)) {
            toast.success("Invitation sent successfully!");
            setOpen(false);
            setEmail("");
            setRole("employee");
        } else {
            toast.error(result.payload || "Failed to send invitation");
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                    <MailPlus className="h-4 w-4" />
                    Invite User
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Invite a new user</DialogTitle>
                    <DialogDescription>
                        Send an email invitation containing a link to join the platform.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="user@example.com"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Role</Label>
                        <div className="flex gap-3 mt-2">
                            <Button
                                type="button"
                                variant={role === "employee" ? "default" : "outline"}
                                className={`flex-1 ${role === "employee" ? "bg-blue-600 hover:bg-blue-700" : ""}`}
                                onClick={() => setRole("employee")}
                            >
                                Employee
                            </Button>
                            <Button
                                type="button"
                                variant={role === "employer" ? "default" : "outline"}
                                className={`flex-1 ${role === "employer" ? "bg-blue-600 hover:bg-blue-700" : ""}`}
                                onClick={() => setRole("employer")}
                            >
                                Employer
                            </Button>
                        </div>
                    </div>
                    <div className="flex bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md text-sm text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800 mt-4">
                        <p>They will receive an email with a link to complete their registration.</p>
                    </div>
                    <div className="flex justify-end pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            className="mr-2"
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white">
                            {loading ? "Sending..." : "Send Invite"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
