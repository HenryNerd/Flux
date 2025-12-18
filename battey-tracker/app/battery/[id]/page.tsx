import Navbar from "@/components/ui/navbar"
import { Card, CardContent } from "@/components/ui/card"

export default async function BatteryPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params

    const res = await fetch(`http://localhost:3000/api/battery/${id}`, {
        cache: 'no-store'
    })
    const batteryData = await res.json()

    return (
        <div>
            <Navbar />
<div className="mx-3">
    <Card className="mt-4">
        <CardContent>
            <h1 className="text-3xl font-bold mb-6">{batteryData.friendlyName || id}</h1>
            <div>
                <p>Season: {batteryData.season}</p>
                <p>Month: {batteryData.month}</p>
                <p>Battery ID: {batteryData.batteryID}</p>
                <p>Capacity: {batteryData.capacity}</p>
            </div>
        </CardContent>
    </Card>
</div>
        </div>
    )
}