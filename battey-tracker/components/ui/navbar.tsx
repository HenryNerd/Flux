'use client'
import Image from "next/image";
import { useRouter } from 'next/navigation'
import { Button } from "./button";
import { usePathname } from 'next/navigation'
import { useEffect, useState } from "react";

export default function Navbar() {
    const router = useRouter()
    const pathname = usePathname()
    const [authFirstName, setAuthFirstName] = useState<string | null>(null);
    const [authLastName, setAuthLastName] = useState<string | null>(null);
    const [authUserRole, setAuthUserRole] = useState<string | null>(null);

    const goHome = () => {
        router.push('/')
    }

    useEffect(() => {
        setAuthFirstName(localStorage.getItem("auth_firstName"));
        setAuthLastName(localStorage.getItem("auth_lastName"));
        setAuthUserRole(localStorage.getItem("auth_userRole"));
    }, []);

    if (pathname === '/login') {
        return (
            <div className="bg-gray-200 w-full h-16 flex items-center px-4">
                <Image
                    src="/favicon.ico"
                    alt="Battery image"
                    width={50}
                    height={50}
                    className="cursor-pointer"
                />
                <h1 className="text-red-300 text-2xl font-bold ml-4">
                    BadgerBOTS 1306
                </h1>
            </div>
        )
    }

    return (
        <div className="bg-gray-200 w-full h-16 flex items-center px-4">
            <Image
                src="/favicon.ico"
                alt="Battery image"
                width={50}
                height={50}
                onClick={() => goHome()}
                className="cursor-pointer"
            />
            <h1 className="text-red-300 text-2xl font-bold ml-4">
                BadgerBOTS 1306
            </h1>
            <div className="ml-auto hidden md:block">
                <div className="flex">
                    <h2 className="font-medium mr-3 mt-1.5 ">{authFirstName} {authLastName}</h2>
                    <Button variant="outline" >Log Out</Button>
                </div>
            </div>
        </div>
    )
}