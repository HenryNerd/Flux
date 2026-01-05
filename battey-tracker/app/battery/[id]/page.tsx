import Navbar from "@/components/ui/navbar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import DichargeTest from "@/components/ui/dischargeTestSheet"
import EventCard from "@/components/ui/eventCard"
import { getBatteryData, getBatteryEvents } from "@/lib/redis"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose
} from "@/components/ui/dialog"

export default async function BatteryPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const batteryId = id.split('-')[1];

    const batteryData = await getBatteryData(id);
    const sortedKeys = await getBatteryEvents(batteryId);

    return (
        <div>
            <Navbar />
            <div className="mx-3 mt-4">
                <Card className="">
                    <CardContent>
                        <h1 className="text-red-300 text-3xl font-bold mb-2">
                            {batteryData.friendlyName || id}
                        </h1>
                        <div>
                            <p>{batteryData.month} {batteryData.season} | {batteryData.batteryID}</p>
                            <div className="mt-3">
                                <DichargeTest battery={id}></DichargeTest>
                                <Button className="ml-2">Deploy</Button>
                                <Button className="ml-2" disabled>Post Match</Button>
                                <Button className="ml-2" disabled>Charger</Button>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="destructive" className="ml-2 bg-red-500" disabled>Deprecate</Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Are you absolutely sure?</DialogTitle>
                                            <DialogDescription>
                                                This action cannot be undone. This will permanently delete this battery and all its data from the server.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="flex justify-end mt-4">
                                            <DialogClose asChild>
                                                <Button variant="destructive" className="bg-red-500">Deprecate</Button>
                                            </DialogClose>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                {sortedKeys.length > 0 ? (
                    sortedKeys.map((eventKey: string) => (
                        <EventCard key={eventKey} id={eventKey} realCapacity={batteryData.capacity} />
                    ))
                ) : (
                    <p className="mt-4 text-gray-500">No events found for this battery</p>
                )}
            </div>
        </div>
    )
}