'use client'
import {
    Card,
    CardDescription,
    CardTitle,
} from "@/components/ui/card"
import { useEffect, useState } from "react"
import {
    Sheet,
    SheetClose,
    SheetContent,
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

interface QueuedAction {
    id: string
    type: 'deploy'
    data: any
    timestamp: number
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

export default function BatteryCard({ 
    slot, 
    onRotationUpdate, 
    isOnline = true,
    addToQueue
}: { 
    slot: string
    onRotationUpdate?: () => void
    isOnline?: boolean
    addToQueue?: (action: Omit<QueuedAction, 'id' | 'timestamp'>) => void
}) {
    const [slotData, setSlotData] = useState<SlotData | null>(null)
    const [batteryData, setBatteryData] = useState<BatteryData | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchSlotData = async () => {
            const slotCacheKey = `slot-${slot}-cache`
            
            const cachedSlot = localStorage.getItem(slotCacheKey)
            if (cachedSlot) {
                try {
                    const cached = JSON.parse(cachedSlot)
                    setSlotData(cached)
                    
                    if (cached.latestCheckIn?.batteryID) {
                        const cachedBattery = localStorage.getItem(`battery-${cached.latestCheckIn.batteryID}-cache`)
                        if (cachedBattery) {
                            setBatteryData(JSON.parse(cachedBattery))
                        }
                    }
                    setLoading(false)
                } catch (e) {
                    console.error('Error parsing cache:', e)
                }
            }
            
            if (!isOnline) {
                return
            }
            
            try {
                const slotResponse = await fetch(`/api/getSlot/${slot}`)
                const slotResult = await slotResponse.json()
                
                if (slotResult.success !== false) {
                    setSlotData(slotResult)
                    localStorage.setItem(slotCacheKey, JSON.stringify(slotResult))

                    if (slotResult.latestCheckIn?.batteryID) {
                        const batteryResponse = await fetch(`/api/battery/0001-${slotResult.latestCheckIn.batteryID}`)
                        const batteryResult = await batteryResponse.json()
                        setBatteryData(batteryResult)
                        localStorage.setItem(`battery-${slotResult.latestCheckIn.batteryID}-cache`, JSON.stringify(batteryResult))
                    } else {
                        setBatteryData(null)
                    }
                    
                    setLoading(false)
                }
            } catch (error) {
                console.error('Error fetching slot data:', error)
            }
        }

        fetchSlotData()

        if (isOnline) {
            const interval = setInterval(fetchSlotData, 5000)
            return () => clearInterval(interval)
        }
    }, [slot, isOnline])

    const updateRotationOrderOffline = (batteryKey: string) => {
        try {
            const cachedBatteries = localStorage.getItem('batteries-cache')
            if (!cachedBatteries) return
            
            const batteries = JSON.parse(cachedBatteries)
            const batteryKeys = batteries.map((b: any) => b.key)
            
            const index = batteryKeys.indexOf(batteryKey)
            if (index > -1) {
                batteryKeys.splice(index, 1)
                batteryKeys.push(batteryKey)
                
                const reorderedBatteries = batteryKeys.map((key: string) => 
                    batteries.find((b: any) => b.key === key)
                )
                
                localStorage.setItem('batteries-cache', JSON.stringify(reorderedBatteries))
            }
        } catch (e) {
            console.error('Error updating rotation order:', e)
        }
    }

    const deploy = async () => {
        if (!slotData?.latestCheckIn?.batteryID) {
            toast.warning("No battery in this slot");
            return;
        }

        const batteryKey = `0001-${slotData.latestCheckIn.batteryID}`;

        if (!isOnline) {
            const updatedSlotData = { ...slotData, isDeployed: true };
            setSlotData(updatedSlotData);
            localStorage.setItem(`slot-${slot}-cache`, JSON.stringify(updatedSlotData));
            setBatteryData(null);
            
            updateRotationOrderOffline(batteryKey);
            
            if (addToQueue) {
                addToQueue({
                    type: 'deploy',
                    data: { battery: batteryKey }
                });
            }
            
            toast.success("Battery deploy queued for sync");
            
            if (onRotationUpdate) {
                onRotationUpdate();
            }
            return;
        }

        try {
            const response = await fetch(`/api/deploy/${batteryKey}`, {
                method: 'POST',
            });
            const result = await response.json();

            if (result.success) {
                toast.success("Battery Checked Out");
                
                const updatedSlotData = { ...slotData, isDeployed: true };
                setSlotData(updatedSlotData);
                localStorage.setItem(`slot-${slot}-cache`, JSON.stringify(updatedSlotData));
                setBatteryData(null);

                if (onRotationUpdate) {
                    onRotationUpdate();
                }
            } else {
                toast.error("Failed to check out: " + result.error);
            }
        } catch (error) {
            console.error("Error checking out:", error);
            
            const updatedSlotData = { ...slotData, isDeployed: true };
            setSlotData(updatedSlotData);
            localStorage.setItem(`slot-${slot}-cache`, JSON.stringify(updatedSlotData));
            setBatteryData(null);
            
            updateRotationOrderOffline(batteryKey);
            
            if (addToQueue) {
                addToQueue({
                    type: 'deploy',
                    data: { battery: batteryKey }
                });
            }
            
            toast.warning("Battery deploy queued for sync");
            
            if (onRotationUpdate) {
                onRotationUpdate();
            }
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
                    <SheetClose asChild>
                        <Button className="bg-slate-200 m-3" onClick={deploy} variant="outline">
                            Deploy
                        </Button>
                    </SheetClose>
                </SheetContent>
            </Sheet>
        </div>
    )
}