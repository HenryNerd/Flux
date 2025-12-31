'use client'
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
import { useState } from "react"

export default function Login() {
      const [username, setusername] = useState('');
      const handleSubmit = async (e: React.FormEvent) => {
        alert(username)
      }

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
                        <form onSubmit={handleSubmit}>
                            <Label htmlFor="username">Username: </Label>
                            <Input value={username} onChange={(e) => setusername(e.target.value)} type="text" id="username"></Input>
                            <Button className="mt-5 w-full bg-red-300 hover:bg-red-400" type="submit">Sign In</Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}