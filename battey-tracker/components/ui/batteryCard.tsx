import { useEffect, useState } from 'react'
import {
    Card,
    CardAction,
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
import { useRouter } from 'next/navigation'
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"

interface BatteryData {
    season: string
    month: string
    friendlyName: string
    batteryID: string
    capacity: string
}

interface DischargeTest {
    mesuredAh: string
    mesuredWh: string
    testTime: string
    timestamp: string
}


export default function BatteryCard({ battery }: { battery: string }) {
    const [data, setData] = useState<BatteryData | null>(null)
    const [loading, setLoading] = useState(true)
    const [mesuredAh, setMesuredAh] = useState('');
    const [mesuredWh, setMesuredWh] = useState('');
    const [testTime, setTestTime] = useState('');
    const [dischargeTests, setDischargeTests] = useState<DischargeTest[]>([])
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        console.log('Form submitted:', { mesuredAh, mesuredWh, testTime })

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

            const result = await response.json()
            console.log('Success:', result)

        } catch (error) {
            console.error('Error:', error)
        }

        setMesuredAh('');
        setMesuredWh('');
        setTestTime('');
    }

    useEffect(() => {
        const fetchBatteryData = async () => {
            try {
                // Fetch battery data
                const batteryRes = await fetch(`/api/battery/${battery}`)
                const batteryData = await batteryRes.json()
                setData(batteryData)

                // Extract battery ID to fetch events
                const batteryId = battery.split('-')[1]
                
                // Fetch battery events
                const eventsRes = await fetch(`/api/batteryEvents/${batteryId}`)
                const eventsData = await eventsRes.json()
                
                console.log('Events fetched:', eventsData)
                console.log('Battery ID:', batteryId)
                
                // Filter for discharge test events (0002 prefix)
                if (eventsData.keys && Array.isArray(eventsData.keys)) {
                    const tests: DischargeTest[] = []
                    for (const eventKey of eventsData.keys) {
                        console.log('Processing event:', eventKey)
                        const keyParts = eventKey.split('-')
                        // 0002 is the discharge test event type
                        if (keyParts[0] === '0002' && keyParts[1] === batteryId) {
                            console.log('Found discharge test, fetching data for:', eventKey)
                            try {
                                const testRes = await fetch(`/api/getEvent/${eventKey}`)
                                const testData = await testRes.json()
                                console.log('Test data:', testData)
                                tests.push({
                                    mesuredAh: testData.mesuredAh || '',
                                    mesuredWh: testData.mesuredWh || '',
                                    testTime: testData.testTime || '',
                                    timestamp: testData.timestamp || ''
                                })
                            } catch (e) {
                                console.error('Error fetching test data:', e)
                            }
                        }
                    }
                    // Sort by timestamp descending to get most recent first
                    tests.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                    console.log('Final tests:', tests)
                    setDischargeTests(tests)
                }
                
                setLoading(false)
            } catch (error) {
                console.error('Error fetching battery data:', error)
                setLoading(false)
            }
        }

        fetchBatteryData()
    }, [battery])

    if (loading) return <div>
        <Card className="m-3">
                <CardHeader>
                    <CardTitle className="text-red-300 font-bold text-2xl">
                    <Skeleton className="h-24 w-128 rounded-full" />
                    </CardTitle>
                    <CardDescription className="text-gray-500">
                    <Skeleton className="h-24 w-128 rounded-full" />
                    </CardDescription>
                </CardHeader>
            </Card>
    </div>
    if (!data) return <div>No data</div>


    const handleClick = (batteryId: string) => {
        router.push(`/battery/${batteryId}`)
    }

    const deploy = async () => {
        try {
            const response = await fetch(`/api/deploy/${battery}`, {
                method: 'POST',
            });
            const result = await response.json();

            if (result.success) {
                toast.success(`${data.friendlyName} has been checked out`)
            } else {
                toast.error(`Could not check out ${data.friendlyName}`)
            }
        } catch (error) {
            console.error("Error checking out:", error);
            toast.error(`Could not check out ${data.friendlyName}`)
        }
    };

    return (
        <div>
            <Card className="m-3 relative">
                <Button 
                    className="absolute top-4 right-4 bg-slate-200" 
                    variant="outline"
                    onClick={() => handleClick(battery)}
                >
                    Open
                </Button>
                <div className='flex gap-8 items-center'>
                    <div>
                        <CardHeader>
                            <CardTitle className="text-red-300 font-bold text-2xl">
                                {data.friendlyName || 'Battery'}
                            </CardTitle>
                            <CardDescription className="text-gray-500">
                                {data.month} {data.season} | {data.batteryID}
                            </CardDescription>
                        </CardHeader>
                        <CardFooter>
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button className='mt-1'>Discharge Test</Button>
                                </SheetTrigger>
                                <SheetContent>
                                    <SheetHeader>
                                        <SheetTitle className="text-center">Add Discharge Test For {data.friendlyName}</SheetTitle>
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
                                        <SheetFooter>
                                            <SheetClose asChild>
                                                <Button type='submit'>Add Event</Button>
                                            </SheetClose>
                                        </SheetFooter>
                                    </form>
                                </SheetContent>
                            </Sheet>
                            <Button onClick={deploy} className='ml-2 mt-1'>Deploy</Button>
                        </CardFooter>
                    </div>
                    <div className="text-left hidden md:block">
                        <h2 className="text-gray-700 text-lg font-semibold text-center">Capacity</h2>
                        {dischargeTests.length > 0 ? (
                            (() => {
                                const ah = parseFloat(dischargeTests[0].mesuredAh);
                                let colorClass = 'text-red-500';
                                if (ah >= 18.25) {
                                    colorClass = 'text-green-400';
                                } else if (ah >= 18) {
                                    colorClass = 'text-amber-500';
                                }
                                return (
                                    <h1 className={`${colorClass} text-3xl font-semibold text-center`}>
                                        {ah.toFixed(2)} Ah
                                    </h1>
                                );
                            })()
                        ) : (
                            <h1 className="text-green-400 text-3xl font-semibold text-center">
                                {parseFloat(data.capacity).toFixed(2)} Ah
                            </h1>
                        )}
                        <h3 className="text-gray-600 text-lg text-center">({dischargeTests.length} Test{dischargeTests.length !== 1 ? 's' : ''})</h3>
                    </div>
                </div>
            </Card>
        </div>
    )
}