import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function BatteryCard({battery}) {
    return (
        <div>
            <Card className="m-3">
                <CardHeader>
                    <CardTitle className="text-red-300 font-bold text-xl">Braggles</CardTitle>
                    <CardDescription className="text-gray-500">December 2025</CardDescription>
                    <CardAction className="text-black">Open</CardAction>
                </CardHeader>
                <CardFooter>
                    <h4 className="text-sm text-black">{battery}</h4>
                </CardFooter>
            </Card>
        </div>
    )
}