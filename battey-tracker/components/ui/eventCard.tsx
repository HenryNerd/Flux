import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { getBatteryData } from "@/lib/redis"

export default async function EventCard({ id, realCapacity }: { id: string, realCapacity: string }) {
    const result = id.split('-')[0];
    let eventName;
    let capacity;
    let parsedCapacity = parseInt(realCapacity, 10);
    
    const eventData = await getBatteryData(id);
    
    console.log("EventCard ID:", id);
    console.log("EventCard data:", eventData);
    
    if (result == "0001") {
        eventName = "Created"
    } else if (result == "0002") {
        eventName = "Discharge Test"
        const measuredAh = parseFloat(eventData.mesuredAh || '0');
        capacity = measuredAh > 0 ? ((measuredAh / parsedCapacity) * 100).toFixed(1) : '0';
    } else if (result == "0003") {
        eventName = "Deployed"
    } else if (result == "0004") {
        eventName = "Checked In"
    }else {
        eventName = "Unregistered Event"
    }
    
    return (
        <div className="mt-3">
            <Card>
                <CardHeader>
                    <CardTitle>{eventName}</CardTitle>
                    <CardDescription>
                        {eventData?.timestamp
                            ? new Date(eventData.timestamp).toLocaleDateString()
                            : "No timestamp available"
                        }
                    </CardDescription>
                    {result == "0002" && (
                        <Card>
                            <div className="ml-3">
                                <CardTitle className="text-2xl">{capacity}%</CardTitle>
                                <CardDescription>Of Rated Capacity</CardDescription>
                                <div className="text-sm mt-2">
                                    <div>Measured Ah - {eventData?.mesuredAh || "N/A"}</div>
                                    <div>Measured Wh - {eventData?.mesuredWh || "N/A"}</div>
                                    <div>Test Time - {eventData?.testTime || "N/A"}</div>
                                </div>
                            </div>
                        </Card>
                    )}
                    {result == "0004" && (
                        <div>Slot - {eventData?.slot}</div>
                    )}
                </CardHeader>
            </Card>
        </div>
    )
}