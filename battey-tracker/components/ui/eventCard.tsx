import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

export default function EventCard({ id }: { id: string }) {
    const result = id.split('-')[0];
    let eventName;

    console.log(id)
    console.log(result)

    if(result == "0001")eventName = "Battery Created"
    else if(result == "0002")eventName = "Discharge Test"
    else if(result == "0003")eventName = "Battery Deployed"
    else eventName = "Unregistered Event"

    return (
        <div className="mt-3">
            <Card>
                <CardHeader>
                    <CardTitle>{eventName}</CardTitle>
                    <CardDescription>{id}</CardDescription>
                </CardHeader>
            </Card>
        </div>
    )

}