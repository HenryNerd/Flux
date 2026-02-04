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
import { toast } from "sonner"

interface LatestCheckIn {
    key: string
    eventType: string
    slot: string
    batteryID: string
    timestamp: string
    season: string
    month: string
}

interface SlotData {
    success: boolean
    slot: string
    latestCheckIn: LatestCheckIn | null
    totalCheckIns: number
    isDeployed: boolean
}

interface BatteryData {
    season: string
    month: string
    friendlyName: string
    batteryID: string
    capacity: string
}

function TimeElapsed({ timestamp }: { timestamp: string }) {
    const [elapsed, setElapsed] = useState('')

    useEffect(() => {
        const updateElapsed = () => {
            const checkInTime = new Date(timestamp).getTime()
            const now = Date.now()
            const diff = now - checkInTime

            const hours = Math.floor(diff / (1000 * 60 * 60))
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
            const seconds = Math.floor((diff % (1000 * 60)) / 1000)

            if (hours > 0) {
                setElapsed(`${hours}h ${minutes}m`)
            } else if (minutes > 0) {
                setElapsed(`${minutes}m ${seconds}s`)
            } else {
                setElapsed(`${seconds}s`)
            }
        }

        updateElapsed()
        const interval = setInterval(updateElapsed, 1000)
        return () => clearInterval(interval)
    }, [timestamp])

    return <span className="text-xs text-gray-600">{elapsed}</span>
}

export default function BatteryCard({ slot, onRotationUpdate }: { slot: string; onRotationUpdate?: () => void }) {
    const [slotData, setSlotData] = useState<SlotData | null>(null)
    const [batteryData, setBatteryData] = useState<BatteryData | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchSlotData = async () => {
            try {
                const slotResponse = await fetch(`/api/getSlot/${slot}`)
                const slotResult = await slotResponse.json()
                setSlotData(slotResult)

                if (slotResult.latestCheckIn?.batteryID) {
                    const batteryResponse = await fetch(`/api/battery/0001-${slotResult.latestCheckIn.batteryID}`)
                    const batteryResult = await batteryResponse.json()
                    setBatteryData(batteryResult)
                } else {
                    setBatteryData(null)
                }
            } catch (error) {
                console.error('Error fetching slot data:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchSlotData()
        
        const interval = setInterval(fetchSlotData, 5000)
        return () => clearInterval(interval)
    }, [slot])

    const deploy = async () => {
        if (!slotData?.latestCheckIn?.batteryID) {
            toast.error("No battery in this slot");
            return;
        }

        try {
            const batteryKey = `0001-${slotData.latestCheckIn.batteryID}`;
            
            const response = await fetch(`/api/deploy/${batteryKey}`, {
                method: 'POST',
            });
            const result = await response.json();
            
            if (result.success) {
                await fetch('/api/updateRotation', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ batteryID: batteryKey })
                });
                
                toast.success("Battery Checked Out");
                
                setLoading(true)
                const slotResponse = await fetch(`/api/getSlot/${slot}`)
                const slotResult = await slotResponse.json()
                setSlotData(slotResult)
                setBatteryData(null)
                setLoading(false)
                
                if (onRotationUpdate) {
                    onRotationUpdate();
                }
            } else {
                toast.error("Failed to check out: " + result.error);
            }
        } catch (error) {
            console.error("Error checking out:", error);
            toast.error("Failed to check out battery");
        }
    };

    if (loading) return (
        <div>
            <Card className="w-60 h-[80px] bg-gray-300 flex items-center justify-center">
                <Skeleton className="h-[20px] w-[150px] rounded-full" />
            </Card>
            <h1 className="text-center mt-1">{slot}</h1>
        </div>
    )

    if (!slotData?.latestCheckIn || slotData.isDeployed) return (
        <div>
            <Card className="w-60 h-[80px] bg-gray-400 flex items-center justify-center">
                <h1 className="text-lg text-white">Empty</h1>
            </Card>
            <h1 className="text-center mt-1">{slot}</h1>
        </div>
    )

    return (
        <div>
            <Sheet>
                <SheetTrigger>
                    <Card className="w-60 h-[80px] bg-green-300 flex flex-col items-center justify-center">
                        <h1 className="text-lg font-semibold">
                            {batteryData?.friendlyName || slotData.latestCheckIn.batteryID}
                        </h1>
                        <TimeElapsed timestamp={slotData.latestCheckIn.timestamp} />
                    </Card>
                    <h1 className="text-center mt-1">{slot}</h1>
                </SheetTrigger>
                <SheetContent>
                    <Card className="m-2 mt-10">
                        <div className="gap-1">
                            <CardTitle className="text-2xl ml-4 mb-2">
                                {batteryData?.friendlyName || 'Battery'}
                            </CardTitle>
                            <CardDescription className="ml-4 text-sm">
                                {batteryData?.season || slotData.latestCheckIn.season} | {slotData.latestCheckIn.batteryID}
                            </CardDescription>
                            <CardDescription className="ml-4 text-xs text-gray-500 mt-2">
                                Checked in: {new Date(slotData.latestCheckIn.timestamp).toLocaleString()}
                            </CardDescription>
                            <CardDescription className="ml-4 text-xs text-gray-500 mt-1">
                                Duration: <TimeElapsed timestamp={slotData.latestCheckIn.timestamp} />
                            </CardDescription>
                        </div>
                    </Card>
                    <Button className="bg-slate-200 m-3" onClick={deploy} variant="outline">
                        Deploy
                    </Button>
                </SheetContent>
            </Sheet>
        </div>
    )
}