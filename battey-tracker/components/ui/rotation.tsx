import {
    Card,
    CardTitle,
} from "@/components/ui/card"
import { useEffect, useState } from "react"

export default function RotationBatteryCard({ id }: { id: string }, ) {
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch(`/api/battery/${id}`)
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
    }, [id])

    return (
        <Card className="bg-green-300">
            <CardTitle className="w-full ml-3 font-normal">{data?.friendlyName}</CardTitle>
        </Card>
    )
}