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

export default function RotationBatteryCard({ id, isOnline = true, position }: { id: string; isOnline?: boolean; position?: number }) {
    const [data, setData] = useState<BatteryData | null>(null)
    const [loading, setLoading] = useState(true)
    const [isCheckedIn, setIsCheckedIn] = useState(false)
    const [showBlink, setShowBlink] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            const cacheKey = `rotation-${id}`
            
            const cached = localStorage.getItem(cacheKey)
            if (cached) {
                try {
                    const { data: cachedData, isCheckedIn: cachedCheckedIn } = JSON.parse(cached)
                    setData(cachedData)
                    setIsCheckedIn(cachedCheckedIn)
                    setLoading(false)
                } catch (e) {
                    console.error('Error parsing cache:', e)
                }
            }
            
            if (!isOnline) {
                return
            }
            
            try {
                const batteryResponse = await fetch(`/api/battery/${id}`)
                const batteryData = await batteryResponse.json()
                setData(batteryData)

                const batteryID = id.replace('0001-', '')
                
                let checkedIn = false
                for (let i = 1; i <= 10; i++) {
                    const slot = i.toString().padStart(2, '0')
                    const cachedSlot = localStorage.getItem(`slot-${slot}-cache`)
                    
                    if (cachedSlot) {
                        try {
                            const slotData = JSON.parse(cachedSlot)
                            if (slotData.latestCheckIn?.batteryID === batteryID && !slotData.isDeployed) {
                                checkedIn = true
                                break
                            }
                        } catch (e) {
                            console.error('Error parsing slot cache:', e)
                        }
                    }
                }
                
                setIsCheckedIn(checkedIn)
                localStorage.setItem(cacheKey, JSON.stringify({ data: batteryData, isCheckedIn: checkedIn }))
                setLoading(false)
            } catch (error) {
                console.error('Error fetching battery:', error)
                setLoading(false)
            }
        }

        fetchData()
        
        if (isOnline) {
            const interval = setInterval(fetchData, 1000)
            return () => clearInterval(interval)
        }
    }, [id, isOnline])

    useEffect(() => {
        const shouldBlink = !isCheckedIn && position !== undefined && position < 3
        
        if (shouldBlink) {
            const blinkInterval = setInterval(() => {
                setShowBlink(prev => !prev)
            }, 1000)
            
            return () => clearInterval(blinkInterval)
        } else {
            setShowBlink(true)
        }
    }, [isCheckedIn, position])

    const getBackgroundColor = () => {
        if (isCheckedIn) {
            return 'bg-green-300'
        }
        
        if (position !== undefined && position < 3) {
            return showBlink ? 'bg-red-300' : 'bg-red-400'
        }

        if (position !== undefined && position >= 3) {
            return showBlink ? 'bg-amber-400' : 'bg-transparent border-2 border-amber-400'
        }
        
        return 'bg-red-300'
    }

    return (
        <Card className={`${getBackgroundColor()} transition-colors duration-200`}>
            <CardTitle className="w-full ml-3 font-normal">{data?.friendlyName || 'Loading...'}</CardTitle>
        </Card>
    )
}