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
import Image from "next/image"

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
                        <Image
                            src="/favicon.ico"
                            alt="Battery image"
                            width={150}
                            height={150}
                            className="mx-auto"
                        />
                        <CardTitle className="text-3xl text-center">Sign In</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit}>
                            <Label htmlFor="username">Username: </Label>
                            <Input value={username} onChange={(e) => setusername(e.target.value)} type="text" id="username"></Input>
                            <Button className="mt-5 w-full bg-gradient-to-r from-red-300 via-pink-600 to-purple-300 bg-[length:200%_100%] animate-pulse" type="submit">Sign In</Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}