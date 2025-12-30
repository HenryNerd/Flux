import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@radix-ui/react-label"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/ui/navbar"

export default function Login() {
    return (
        <div>
            <Navbar></Navbar>
            <div className="flex justify-center mt-5">
                <Card className="w-lg">
                    <CardHeader className="mb-4">
                        <CardTitle>Sign In</CardTitle>
                        <CardDescription>To get an acount please get a team member with acess to register you.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form>
                            <Label htmlFor="username">Username: </Label>
                            <Input type="text" id="username"></Input>
                            <Button className="mt-5 w-full" type="submit">Sign In</Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}