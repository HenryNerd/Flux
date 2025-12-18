'use client'
import Image from "next/image";
import { useRouter } from 'next/navigation'
export default function Navbar() {

    const router = useRouter()

    const goHome = () => {
        router.push(`/`)
    }

    return (
        <div className="bg-gray-200 w-full h-16 flex items-center px-4">
            <Image
                src="/favicon.ico"
                alt="Battery image"
                width={50}
                height={50}
                onClick={() => goHome()}
            />
            <h1 className="text-red-300 text-2xl font-bold ml-4">
                BadgerBOTS 1306
            </h1>
        </div>
    )
}

