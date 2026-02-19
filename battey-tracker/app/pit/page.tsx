'use client'
import Navbar from "@/components/ui/navbar"
import BatteryCard from "@/components/ui/pitBatteryCard"
import {
    Card,
    CardAction,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useEffect, useState, useRef } from "react"
import RotationBatteryCard from "@/components/ui/rotation"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    SelectLabel,
} from "@/components/ui/select"
import {
    ToggleGroup,
    ToggleGroupItem,
} from "@/components/ui/toggle-group"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { SelectGroup } from "@radix-ui/react-select"
import { toast } from "sonner"

interface BatteryInfo {
    key: string
    friendlyName: string
    batteryID: string
}

interface QueuedAction {
    id: string
    type: 'checkin' | 'skip' | 'deploy'
    data: any
    timestamp: number
}

export default function Pit() {
    const [keys, setKeys] = useState<string[]>([])
    const [batteries, setBatteries] = useState<BatteryInfo[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedBattery, setSelectedBattery] = useState('')
    const [selectedSlot, setSelectedSlot] = useState('')
    const [isOnline, setIsOnline] = useState(true)
    const [queue, setQueue] = useState<QueuedAction[]>([])
    const fetchTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        const savedQueue = localStorage.getItem('offline-queue')
        if (savedQueue) {
            try {
                setQueue(JSON.parse(savedQueue))
            } catch (e) {
                localStorage.removeItem('offline-queue')
            }
        }

        const cachedBatteries = localStorage.getItem('batteries-cache')
        if (cachedBatteries) {
            try {
                const cached = JSON.parse(cachedBatteries)
                setBatteries(cached)
                setKeys(cached.map((b: BatteryInfo) => b.key))
                setLoading(false)
            } catch (e) {
                localStorage.removeItem('batteries-cache')
            }
        }

        const handleOnline = () => setIsOnline(true)
        const handleOffline = () => setIsOnline(false)

        window.addEventListener('online', handleOnline)
        window.addEventListener('offline', handleOffline)

        setIsOnline(navigator.onLine)

        return () => {
            window.removeEventListener('online', handleOnline)
            window.removeEventListener('offline', handleOffline)
        }
    }, [])

    useEffect(() => {
        if (isOnline && queue.length > 0) {
            syncQueue()
        }
    }, [isOnline])

    const syncQueue = async () => {
        const results = await Promise.allSettled(
            queue.map(async (action) => {
                switch (action.type) {
                    case 'checkin':
                        return fetch(`/api/checkin/${action.data.slot}/${action.data.battery}`, {
                            method: 'POST'
                        })
                    case 'skip':
                        return fetch('/api/updateRotation', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ batteryID: action.data.batteryID })
                        })
                    case 'deploy':
                        return fetch(`/api/deploy/${action.data.battery}`, {
                            method: 'POST'
                        })
                }
            })
        )

        const failedActions = queue.filter((_, index) => {
            return results[index].status === 'rejected'
        })

        setQueue(failedActions)
        localStorage.setItem('offline-queue', JSON.stringify(failedActions))
        
        if (failedActions.length === 0) {
            toast.success('All queued actions synced')
            fetchBatteries()
        }
    }

    const addToQueue = (action: Omit<QueuedAction, 'id' | 'timestamp'>) => {
        const newAction: QueuedAction = {
            ...action,
            id: `${Date.now()}-${Math.random()}`,
            timestamp: Date.now()
        }

        const newQueue = [...queue, newAction]
        setQueue(newQueue)
        localStorage.setItem('offline-queue', JSON.stringify(newQueue))
    }

    const fetchBatteries = async () => {
        if (fetchTimeoutRef.current) {
            clearTimeout(fetchTimeoutRef.current)
        }
        
        fetchTimeoutRef.current = setTimeout(async () => {
            if (!isOnline) {
                return
            }
            
            try {
                const response = await fetch('/api/getBattries')
                const data = await response.json()
                const flatKeys = data.keys.flat()
                setKeys(flatKeys)
                
                const batteryDetails = await Promise.all(
                    flatKeys.map(async (key: string) => {
                        const batteryResponse = await fetch(`/api/battery/${key}`)
                        const batteryData = await batteryResponse.json()
                        return {
                            key: key,
                            friendlyName: batteryData.friendlyName || key,
                            batteryID: batteryData.batteryID
                        }
                    })
                )
                
                setBatteries(batteryDetails)
                localStorage.setItem('batteries-cache', JSON.stringify(batteryDetails))
                setLoading(false)
            } catch (error) {
                console.error('Error fetching batteries:', error)
                setLoading(false)
            }
        }, 300)
    }

    useEffect(() => {
        fetchBatteries()
        
        if (isOnline) {
            const interval = setInterval(fetchBatteries, 5000)
            return () => {
                clearInterval(interval)
                if (fetchTimeoutRef.current) {
                    clearTimeout(fetchTimeoutRef.current)
                }
            }
        }
        
        return () => {
            if (fetchTimeoutRef.current) {
                clearTimeout(fetchTimeoutRef.current)
            }
        }
    }, [isOnline])

    const buttonClick = async () => {
        if (!selectedBattery || !selectedSlot) {
            toast.warning("Please select both a battery and a charger slot");
            return;
        }

        if (!isOnline) {
            addToQueue({
                type: 'checkin',
                data: { slot: selectedSlot, battery: selectedBattery }
            })
            toast.success("Queued for sync when online")
            setSelectedBattery('')
            setSelectedSlot('')
            return
        }

        try {
            const response = await fetch(`/api/checkin/${selectedSlot}/${selectedBattery}`, {
                method: 'POST',
            });
            const result = await response.json();

            if (result.success) {
                toast.success("Event has been created")
                setSelectedBattery('');
                setSelectedSlot('');
                fetchBatteries();
            } else {
                toast.error("Failed to check in: " + result.error);
            }
        } catch (error) {
            console.error("Error checking in:", error); 
            addToQueue({
                type: 'checkin',
                data: { slot: selectedSlot, battery: selectedBattery }
            })
            toast.warning("Queued for sync when online")
            setSelectedBattery('')
            setSelectedSlot('')
        }
    }

    const skipBattery = async () => {
        if (keys.length === 0) {
            toast.warning("No batteries in rotation");
            return;
        }

        const topBattery = keys[0];

        if (!isOnline) {
            addToQueue({
                type: 'skip',
                data: { batteryID: topBattery }
            })
            toast.success("Queued for sync when online")
            return
        }

        try {
            const response = await fetch('/api/updateRotation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ batteryID: topBattery })
            });

            const result = await response.json();

            if (result.success) {
                toast.success("Battery moved to end of rotation");
                fetchBatteries();
            } else {
                toast.error("Failed to skip battery");
            }
        } catch (error) {
            console.error("Error skipping battery:", error);
            addToQueue({
                type: 'skip',
                data: { batteryID: topBattery }
            })
            toast.warning("Queued for sync when online")
        }
    }

    return (
        <div>
            <Navbar></Navbar>
            {!isOnline && (
                <Card className="m-4 gap-2 pl-3 pr-3 pt-2 pb-2 bg-amber-300 border-0">
                    <CardTitle>No Internet Connection</CardTitle>
                    <CardDescription>
                        Changes will be transmitted when internet is available 
                        {queue.length > 0 && ` (${queue.length} action${queue.length > 1 ? 's' : ''} queued)`}
                    </CardDescription>
                </Card>
            )}
            {isOnline && queue.length > 0 && (
                <Card className="m-4 gap-2 pl-3 pr-3 pt-2 pb-2 bg-blue-300 border-0">
                    <CardTitle>Syncing...</CardTitle>
                    <CardDescription>
                        Syncing {queue.length} queued action{queue.length > 1 ? 's' : ''}
                    </CardDescription>
                </Card>
            )}
            <div className="flex">
                <Card className="m-4 p-3 w-2/5">
                    <CardTitle className="text-lg mb-4">Pit Charging Station</CardTitle>
                    <div className="flex flex-col items-center justify-center gap-4">
                        <div className="flex gap-4">
                            <BatteryCard slot="01" onRotationUpdate={fetchBatteries} isOnline={isOnline} addToQueue={addToQueue}></BatteryCard>
                            <BatteryCard slot="02" onRotationUpdate={fetchBatteries} isOnline={isOnline} addToQueue={addToQueue}></BatteryCard>
                        </div>
                        <div className="flex gap-4">
                            <BatteryCard slot="03" onRotationUpdate={fetchBatteries} isOnline={isOnline} addToQueue={addToQueue}></BatteryCard>
                            <BatteryCard slot="04" onRotationUpdate={fetchBatteries} isOnline={isOnline} addToQueue={addToQueue}></BatteryCard>
                        </div>
                        <div className="flex gap-4">
                            <BatteryCard slot="05" onRotationUpdate={fetchBatteries} isOnline={isOnline} addToQueue={addToQueue}></BatteryCard>
                            <BatteryCard slot="06" onRotationUpdate={fetchBatteries} isOnline={isOnline} addToQueue={addToQueue}></BatteryCard>
                        </div>
                        <div className="flex gap-4">
                            <BatteryCard slot="07" onRotationUpdate={fetchBatteries} isOnline={isOnline} addToQueue={addToQueue}></BatteryCard>
                            <BatteryCard slot="08" onRotationUpdate={fetchBatteries} isOnline={isOnline} addToQueue={addToQueue}></BatteryCard>
                        </div>
                    </div>
                </Card>
                <Card className="m-4 w-1/4 p-0">
                    <div className="flex justify-between items-center">
                        <CardTitle className="mt-3 ml-3 text-lg">Battery Rotation</CardTitle>
                        <Button 
                            variant="outline" 
                            className="mt-2 mr-3" 
                            onClick={skipBattery}
                            disabled={keys.length === 0}
                        >
                            Skip
                        </Button>
                    </div>
                    <div className="gap-0">
                        {
                            keys.map((key, index) => (
                                <RotationBatteryCard key={key} id={key} isOnline={isOnline}></RotationBatteryCard>
                            ))
                        }
                    </div>
                </Card>
                <Card className="h-min w-1/4 m-4">
                    <CardTitle className="text-lg ml-3 mt-3">Battery Check In</CardTitle>
                    <div className="ml-3 mr-3 mb-3">
                        <Label className="mb-1">Battery:</Label>
                        <Select value={selectedBattery} onValueChange={setSelectedBattery}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select Battery" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Batteries</SelectLabel>
                                    {
                                        batteries.map((battery) => (
                                            <SelectItem key={battery.key} value={battery.key}>
                                                {battery.friendlyName}
                                            </SelectItem>
                                        ))
                                    }
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <Label className="mt-4 mb-1" htmlFor="slotSelector">Charger Slot:</Label>
                        <ToggleGroup
                            id="slotSelector"
                            type="single"
                            variant="outline"
                            value={selectedSlot}
                            onValueChange={setSelectedSlot}
                        >
                            <ToggleGroupItem value="01">1</ToggleGroupItem>
                            <ToggleGroupItem value="02">2</ToggleGroupItem>
                            <ToggleGroupItem value="03">3</ToggleGroupItem>
                            <ToggleGroupItem value="04">4</ToggleGroupItem>
                            <ToggleGroupItem value="05">5</ToggleGroupItem>
                            <ToggleGroupItem value="06">6</ToggleGroupItem>
                            <ToggleGroupItem value="07">7</ToggleGroupItem>
                            <ToggleGroupItem value="08">8</ToggleGroupItem>
                        </ToggleGroup>
                        <Button
                            className="bg-yellow-300 mt-4 w-full hover:bg-yellow-400"
                            variant="outline"
                            onClick={buttonClick}
                        >
                            Check In
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    )
}