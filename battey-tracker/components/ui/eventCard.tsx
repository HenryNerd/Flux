import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

export default async function EventCard({ id }: { id: string }) {
    const result = id.split('-')[0];
    let eventName;
    let eventData = null;

    console.log(id)
    console.log(result)

    const rawEventData = await fetch(`http://localhost:3000/api/battery/${id}`, {
        cache: 'no-store'
    });
    eventData = await rawEventData.json();
    console.log("Event data fetched:", eventData);

    if (result == "0001") {
        eventName = "Battery Created"
    } else if (result == "0002") {
        eventName = "Discharge Test"
    } else if (result == "0003") {
        eventName = "Battery Deployed"
    } else {
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
                        <div className="text-sm mt-2">
                            <div>Measured Ah - {eventData?.mesuredAh || "N/A"}</div>
                            <div>Measured Wh - {eventData?.mesuredWh || "N/A"}</div>
                            <div>Test Time - {eventData?.testTime || "N/A"}</div>
                        </div>
                    )}
                </CardHeader>
            </Card>
        </div>
    )
}