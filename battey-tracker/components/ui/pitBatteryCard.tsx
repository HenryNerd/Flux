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
import { useEffect, useState } from "react"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "./button"

export default function BatteryCard({ id }: { id: string }) {
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch(`/api/battery/0001-${id}`)
            .then(res => res.json())
            .then(batteryData => {
                setData(batteryData)
                setLoading(false)
                console.log(batteryData)
            })
            .catch(error => {
                console.error('Error fetching battery:', error)
                setLoading(false)
            })
    }, [id])

    if (loading) return (
        <Card className="w-60 h-[80px] bg-gray-300 flex items-center justify-center">
            <Skeleton className="h-[20px] w-[150px] rounded-full" />
        </Card>
    )

    return (
        <Sheet>
            <SheetTrigger>
                <Card className="w-60 h-[80px] bg-green-300 flex items-center justify-center">
                    <h1 className="text-lg">{data?.friendlyName || id}</h1>
                </Card>
            </SheetTrigger>
            <SheetContent>
                <Card className="m-2 mt-10">
                    <div className="gap-1">
                        <CardTitle className="text-2xl ml-4 mb-2">{data?.friendlyName}</CardTitle>
                        <CardDescription className="ml-4 text-sm">{data.season} | {data.batteryID}</CardDescription>
                    </div>
                </Card>
                <Button className="bg-slate-200 text-color-white" variant="outline">Deploy</Button>
                <Button className="bg-slate-200 text-color-white" variant="outline">Check In</Button>
            </SheetContent>
        </Sheet>
    )
}