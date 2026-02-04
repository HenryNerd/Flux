import {
    Card,
    CardTitle,
} from "@/components/ui/card"
import { useEffect, useState } from "react"

interface BatteryData {
    season: string
    month: string
    friendlyName: string
    batteryID: string
    capacity: string
}

interface SlotStatus {
    isCheckedIn: boolean
}

export default function RotationBatteryCard({ id }: { id: string }) {
    const [data, setData] = useState<BatteryData | null>(null)
    const [loading, setLoading] = useState(true)
    const [isCheckedIn, setIsCheckedIn] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const batteryResponse = await fetch(`/api/battery/${id}`)
                const batteryData = await batteryResponse.json()
                setData(batteryData)

                const batteryID = id.replace('0001-', '')
                
                let checkedIn = false
                for (let slot = 1; slot <= 8; slot++) {
                    const slotNum = slot.toString().padStart(2, '0')
                    const slotResponse = await fetch(`/api/getSlot/${slotNum}`)
                    const slotData = await slotResponse.json()
                    
                    if (slotData.latestCheckIn?.batteryID === batteryID && !slotData.isDeployed) {
                        checkedIn = true
                        break
                    }
                }
                
                setIsCheckedIn(checkedIn)
                setLoading(false)
            } catch (error) {
                console.error('Error fetching battery:', error)
                setLoading(false)
            }
        }

        fetchData()
        
        const interval = setInterval(fetchData, 5000)
        return () => clearInterval(interval)
    }, [id])

    const bgColor = isCheckedIn ? 'bg-green-300' : 'bg-red-300'

    return (
        <Card className={bgColor}>
            <CardTitle className="w-full ml-3 font-normal">{data?.friendlyName || 'Loading...'}</CardTitle>
        </Card>
    )
}