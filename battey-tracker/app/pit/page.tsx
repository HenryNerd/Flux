'use client'
import Navbar from "@/components/ui/navbar"
import BatteryCard from "@/components/ui/pitBatteryCard"
import {
    Card,
    CardAction,
    CardTitle,
} from "@/components/ui/card"
import { useEffect, useState } from "react"
import RotationBatteryCard from "@/components/ui/rotation"

export default function Pit() {
    const [keys, setKeys] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch('/api/getBattries')
            .then(res => res.json())
            .then(data => {
                const flatKeys = data.keys.flat()
                setKeys(flatKeys)
                setLoading(false)
            })
    }, [])

    return (
        <div>
            <Navbar></Navbar>
            <div className="flex ">
                <Card className="m-4 p-3 w-130">
                    <CardTitle className="text-lg">Pit Charging Station</CardTitle>
                    <div className="flex gap-4 mb-4">
                        <BatteryCard id="00000001"></BatteryCard>
                        <BatteryCard id="00000002"></BatteryCard>
                    </div>
                    <div className="flex gap-4 mb-4">
                        <BatteryCard id="00000003"></BatteryCard>
                        <BatteryCard id="00000004"></BatteryCard>
                    </div>
                    <div className="flex gap-4 mb-4">
                        <BatteryCard id="00000005"></BatteryCard>
                        <BatteryCard id="00000006"></BatteryCard>
                    </div>
                    <div className="flex gap-4 mb-4">
                        <BatteryCard id="00000007"></BatteryCard>
                        <BatteryCard id=""></BatteryCard>
                    </div>
                </Card>
                <Card className="m-4 w-130 p-0">
                    <CardTitle className="mt-3 ml-3 text-lg">Battery Rotation</CardTitle>
                    <div className="gap-0">
                        {
                            keys.map((key, index) => (
                                <RotationBatteryCard key={key} id={key}></RotationBatteryCard>
                            ))
                        }
                    </div>
                </Card>
            </div>
        </div >
    )
}