import Navbar from "@/components/ui/navbar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import DichargeTest from "@/components/ui/dischargeTestSheet"
import EventCard from "@/components/ui/eventCard"

export default async function BatteryPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params

    const batteryId = id.split('-')[1];

    const res = await fetch(`http://localhost:3000/api/battery/${id}`, {
        cache: 'no-store'
    })
    const batteryData = await res.json()

    return (
        <div>
            <Navbar />
            <div className="mx-3 mt-4">
                <Card className="">
                    <CardContent>
                        <h1 className="text-red-300 text-3xl font-bold mb-2">{batteryData.friendlyName || id}</h1>
                        <div>
                            <p>{batteryData.month} {batteryData.season} | {batteryData.batteryID}</p>
                            <div className="mt-3">
                                <DichargeTest battery={id}></DichargeTest>
                                <Button className="ml-2">Deploy</Button>
                                <Button className="ml-2">Post Match</Button>
                                <Button className="ml-2">Charger</Button>
                                <Button variant="destructive" className="ml-2 bg-red-500">Depricate</Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <EventCard id={"0003-"+batteryId}></EventCard>
                <EventCard id={"0002-"+batteryId}></EventCard>
                <EventCard id={"0001-"+batteryId}></EventCard>
            </div>
        </div>
    )
}