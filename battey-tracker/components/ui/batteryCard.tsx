import { useEffect, useState } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface BatteryData {
    season: string
    mounth: string
    friendlyName: string
    batteryID: string
    capacity: string
}


export default function BatteryCard({ battery }: { battery: string }) {
    const [data, setData] = useState<BatteryData | null>(null)
    const [loading, setLoading] = useState(true)
    const [mesuredAh, setMesuredAh] = useState('');
    const [mesuredWh, setMesuredWh] = useState('');
    const [testTime, setTestTime] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log('Form submitted:', { mesuredAh, mesuredWh, testTime })
        const formData = {
            battery: battery,
            mesuredAh: mesuredAh,
            mesuredWh: mesuredWh,
            testTime: testTime
        }
    }

    useEffect(() => {
        fetch(`/api/battery/${battery}`)
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
    }, [battery])

    if (loading) return <div>Loading...</div>
    if (!data) return <div>No data</div>

    return (
        <div>
            <Card className="m-3">
                <CardHeader>
                    <CardTitle className="text-red-300 font-bold text-2xl">
                        {data.friendlyName || 'Battery'}
                    </CardTitle>
                    <CardDescription className="text-gray-500">
                        {data.mounth} {data.season} | {data.batteryID}
                    </CardDescription>
                </CardHeader>
                <CardFooter>
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button>Discharge Test</Button>
                        </SheetTrigger>
                        <SheetContent>
                            <SheetHeader>
                                <SheetTitle className="text-center">Add Discharge Test</SheetTitle>
                            </SheetHeader>
                            <form onSubmit={handleSubmit}>
                                <div className="m-2">
                                    <div className='mt-3'>
                                        <Label className="mb-3" htmlFor="ah">Measured Ah</Label>
                                        <Input value={mesuredAh} onChange={(e) => setMesuredAh(e.target.value)} id="ah" />
                                    </div>
                                    <div className='mt-3'>
                                        <Label className="mb-3" htmlFor="wh">Measured Wh</Label>
                                        <Input value={mesuredWh} onChange={(e) => setMesuredWh(e.target.value)} id="wh" />
                                    </div>
                                    <div className='mt-3'>
                                        <Label className="mb-3" htmlFor="time">Test Time</Label>
                                        <Input value={testTime} onChange={(e) => setTestTime(e.target.value)} id="time" placeholder="H:MM:SS" />
                                    </div>
                                </div>
                            </form>
                            <SheetFooter>
                                <SheetClose asChild>
                                    <Button type='submit'>Add Event</Button>
                                </SheetClose>
                            </SheetFooter>
                        </SheetContent>
                    </Sheet>
                </CardFooter>
            </Card>
        </div>
    )
}