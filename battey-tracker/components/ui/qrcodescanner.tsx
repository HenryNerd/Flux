import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button";
import { Scanner } from "@yudiel/react-qr-scanner";
import {
    ToggleGroup,
    ToggleGroupItem,
} from "@/components/ui/toggle-group"
import { useState, useEffect } from "react";
import Navbar from "@/components/ui/navbar"
import { Card, CardContent } from "@/components/ui/card"
import DichargeTest from "@/components/ui/dischargeTestSheet"
import EventCard from "@/components/ui/eventCard"
import { toast } from "sonner"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose
} from "@/components/ui/dialog"


export default function BatteryScanner() {
    const [scanbatteryID, setScanBatteryID] = useState('')
    const [eventType, setEventType] = useState('')
    const [selectedSlot, setSelectedSlot] = useState('')
    const [batteryData, setBatteryData] = useState<any>(null)
    const [sortedKeys, setSortedKeys] = useState<any>(null)
    const [loading, setLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(false)

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open)
        if (!open) {
            setScanBatteryID('')
            setEventType('')
            setSelectedSlot('')
            setBatteryData(null)
            setSortedKeys(null)
            setLoading(false)
        }
    }

    const handleRecord = async () => {
        try {
            let response;
            
            if (eventType === 'checkin') {
                const fullBatteryKey = `0001-${scanbatteryID}`;
                response = await fetch(`/api/checkin/${selectedSlot}/${fullBatteryKey}`, {
                    method: 'POST',
                });
            } else if (eventType === 'checkout') {
                const fullBatteryKey = `0001-${scanbatteryID}`;
                response = await fetch(`/api/deploy/${fullBatteryKey}`, {
                    method: 'POST',
                });
            }

            if (!response) {
                toast.error('No event type selected');
                return;
            }

            const result = await response.json();

            if (result.success) {
                const action = eventType === 'checkin' ? `checked in to slot ${selectedSlot}` : 'checked out';
                toast.success(`Battery ${action} successfully`);
                handleOpenChange(false);
            } else {
                toast.error(`Failed to ${eventType}: ${result.error || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error recording event:', error);
            toast.error(`Failed to ${eventType}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    useEffect(() => {
        if (scanbatteryID) {
            setLoading(true)
            const fetchData = async () => {
                try {
                    const fullBatteryKey = `0001-${scanbatteryID}`;
                    const dataRes = await fetch(`/api/battery/${fullBatteryKey}`);
                    const data = await dataRes.json();
                    console.log('Battery data fetched:', data);
                    setBatteryData(data);

                    const eventsRes = await fetch(`/api/batteryEvents/${scanbatteryID}`);
                    const events = await eventsRes.json();
                    setSortedKeys(events);
                } catch (error) {
                    console.error('Error fetching battery data:', error)
                } finally {
                    setLoading(false)
                }
            }
            fetchData()
        }
    }, [scanbatteryID])
    return (
        <div>
            <Drawer open={isOpen} onOpenChange={handleOpenChange}>
                <DrawerTrigger asChild>
                    <Button className="bg-slate-100 text-color-black" variant="outline">Scan Battery</Button>
                </DrawerTrigger>
                <DrawerContent className="p-2">
                    {!scanbatteryID ? (
                        <Scanner
                            onScan={(result) => setScanBatteryID(result[0]?.rawValue || '')}
                            components={{
                                torch: true,
                                zoom: true,
                            }}
                        />
                    ) : (
                        <>
                            {loading ? (
                                <div>Loading battery data...</div>
                            ) : batteryData ? (
                                <Card className="mb-3">
                                    <CardContent>
                                        <h1 className="text-red-300 text-3xl font-bold mb-2 break-words">
                                            {batteryData.friendlyName || scanbatteryID}
                                        </h1>
                                        <div>
                                            <p className="text-sm sm:text-base">{batteryData.mounth} {batteryData.season} | {batteryData.batteryID}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ) : (
                                <div>No battery data found</div>
                            )}
                            <ToggleGroup
                                id="type"
                                type="single"
                                variant="outline"
                                value={eventType}
                                onValueChange={setEventType}
                                className="mb-2">
                                <ToggleGroupItem value="checkin">Check In</ToggleGroupItem>
                                <ToggleGroupItem value="checkout">Check Out</ToggleGroupItem>
                            </ToggleGroup>
                            <ToggleGroup
                                id="slotSelector"
                                type="single"
                                variant="outline"
                                value={selectedSlot}
                                onValueChange={setSelectedSlot}
                                disabled={eventType != 'checkin'}
                                className="mb-2"
                            >
                                <ToggleGroupItem value="01">1</ToggleGroupItem>
                                <ToggleGroupItem value="02">2</ToggleGroupItem>
                                <ToggleGroupItem value="03">3</ToggleGroupItem>
                                <ToggleGroupItem value="04">4</ToggleGroupItem>
                                <ToggleGroupItem value="05">5</ToggleGroupItem>
                                <ToggleGroupItem value="06">6</ToggleGroupItem>
                                <ToggleGroupItem value="07">7</ToggleGroupItem>
                                <ToggleGroupItem value="08">8</ToggleGroupItem>
                                <ToggleGroupItem value="09">9</ToggleGroupItem>
                                <ToggleGroupItem value="10">10</ToggleGroupItem>
                            </ToggleGroup>
                            <Button 
                                className="bg-red-300 hover:bg-red-400 text-white" 
                                variant={"outline"}
                                disabled={!eventType || (eventType === 'checkin' && !selectedSlot)}
                                onClick={handleRecord}
                            >
                                Record
                            </Button>
                        </>
                    )}
                </DrawerContent>
            </Drawer>
        </div>
    )
}