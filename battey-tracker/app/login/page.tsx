'use client'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@radix-ui/react-label"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/ui/navbar"
import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"

export default function Login() {
    const [username, setusername] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!username) return;

        try {
            const res = await fetch(`/api/user/${username}`);
            const data = await res.json();

            if (!res.ok || !data.success) {
                alert("User not found");
                return;
            }

            localStorage.setItem("auth_firstName", data.firstName);
            localStorage.setItem("auth_lastName", data.lastName);
            localStorage.setItem("auth_userRole", data.userRole);
            localStorage.setItem("auth_username", username);

            router.push("/");

        } catch (error) {
            console.error(error);
            alert("Failed to contact server");
        }
    }

    return (
        <div>
            <Navbar />
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

                            <Input
                                value={username}
                                onChange={(e) => setusername(e.target.value)}
                                type="text"
                                id="username"
                            />

                            <Button
                                className="mt-5 w-full bg-gradient-to-r from-red-300 via-pink-600 to-purple-300 bg-[length:200%_100%] animate-pulse"
                                type="submit"
                            >
                                Sign In
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
