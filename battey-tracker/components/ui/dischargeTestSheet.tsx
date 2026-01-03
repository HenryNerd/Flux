'use client'

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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

interface BatteryData {
    season: string
    month: string
    friendlyName: string
    batteryID: string
    capacity: string
}

export default function DischargeTest({ battery }: { battery: string }) {
    const [data, setData] = useState<BatteryData | null>(null)
    const [loading, setLoading] = useState(true)
    const [mesuredAh, setMesuredAh] = useState('');
    const [mesuredWh, setMesuredWh] = useState('');
    const [testTime, setTestTime] = useState('');
    const [sheetOpen, setSheetOpen] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        if (!mesuredAh || !mesuredWh || !testTime) {
            console.error('Please fill in all fields');
            return;
        }

        const formData = {
            battery: battery,
            mesuredAh: mesuredAh,
            mesuredWh: mesuredWh,
            testTime: testTime
        }

        try {
            const response = await fetch(`/api/dischargeTest/${battery}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            })

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            const result = await response.json()
            console.log('Success:', result)

            // Reset form and close modal
            setMesuredAh('');
            setMesuredWh('');
            setTestTime('');
            setSheetOpen(false);
            setDrawerOpen(false);

        } catch (error) {
            console.error('Error:', error)
        }
    }

    useEffect(() => {
        fetch(`/api/battery/${battery}`)
            .then(res => {
                if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
                return res.json();
            })
            .then(batteryData => {
                setData(batteryData)
                setLoading(false)
            })
            .catch(error => {
                console.error('Error fetching battery:', error)
                setLoading(false)
            })
    }, [battery])

    return (
        <div>
            <div className="block md:hidden">
                <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
                    <DrawerTrigger asChild>
                        <Button>Discharge Test</Button>
                    </DrawerTrigger>
                    <DrawerContent>
                        <DrawerHeader>
                            <DrawerTitle className="text-center">
                                Add Discharge Test For {data?.friendlyName || 'Battery'}
                            </DrawerTitle>
                        </DrawerHeader>
                        <form onSubmit={handleSubmit}>
                            <div className="m-2">
                                <div className='mt-3'>
                                    <Label className="mb-3" htmlFor="ah">Measured Ah</Label>
                                    <Input
                                        value={mesuredAh}
                                        onChange={(e) => setMesuredAh(e.target.value)}
                                        id="ah"
                                    />
                                </div>
                                <div className='mt-3'>
                                    <Label className="mb-3" htmlFor="wh">Measured Wh</Label>
                                    <Input
                                        value={mesuredWh}
                                        onChange={(e) => setMesuredWh(e.target.value)}
                                        id="wh"
                                    />
                                </div>
                                <div className='mt-3'>
                                    <Label className="mb-3" htmlFor="time">Test Time</Label>
                                    <Input
                                        value={testTime}
                                        onChange={(e) => setTestTime(e.target.value)}
                                        id="time"
                                        placeholder="H:MM:SS"
                                    />
                                </div>
                            </div>
                            <DrawerFooter>
                                <DrawerClose asChild>
                                    <Button type='submit'>Add Event</Button>
                                </DrawerClose>
                            </DrawerFooter>
                        </form>
                    </DrawerContent>
                </Drawer>
            </div>
            <div className="hidden md:block">
                <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                    <SheetTrigger asChild>
                        <Button>Discharge Test</Button>
                    </SheetTrigger>
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle className="text-center">
                                Add Discharge Test For {data?.friendlyName || 'Battery'}
                            </SheetTitle>
                        </SheetHeader>
                        <form onSubmit={handleSubmit}>
                            <div className="m-2">
                                <div className='mt-3'>
                                    <Label className="mb-3" htmlFor="ah">Measured Ah</Label>
                                    <Input
                                        value={mesuredAh}
                                        onChange={(e) => setMesuredAh(e.target.value)}
                                        id="ah"
                                    />
                                </div>
                                <div className='mt-3'>
                                    <Label className="mb-3" htmlFor="wh">Measured Wh</Label>
                                    <Input
                                        value={mesuredWh}
                                        onChange={(e) => setMesuredWh(e.target.value)}
                                        id="wh"
                                    />
                                </div>
                                <div className='mt-3'>
                                    <Label className="mb-3" htmlFor="time">Test Time</Label>
                                    <Input
                                        value={testTime}
                                        onChange={(e) => setTestTime(e.target.value)}
                                        id="time"
                                        placeholder="H:MM:SS"
                                    />
                                </div>
                            </div>
                            <SheetFooter>
                                <SheetClose asChild>
                                    <Button type='submit'>Add Event</Button>
                                </SheetClose>
                            </SheetFooter>
                        </form>
                    </SheetContent>
                </Sheet>
            </div>
        </div>
    )
}