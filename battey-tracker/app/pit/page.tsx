'use client'
import Navbar from "@/components/ui/navbar"
import BatteryCard from "@/components/ui/pitBatteryCard"
import {
    Card,
    CardAction,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useEffect, useState } from "react"
import RotationBatteryCard from "@/components/ui/rotation"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    ToggleGroup,
    ToggleGroupItem,
  } from "@/components/ui/toggle-group"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

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
            <div className="flex">
                <Card className="m-4 p-3 w-2/5">
                    <CardTitle className="text-lg mb-4">Pit Charging Station</CardTitle>
                    <div className="flex flex-col items-center justify-center gap-4">
                        <div className="flex gap-4">
                            <BatteryCard slot="01" id="00000001"></BatteryCard>
                            <BatteryCard slot="02" id="00000002"></BatteryCard>
                        </div>
                        <div className="flex gap-4">
                            <BatteryCard slot="03" id="00000003"></BatteryCard>
                            <BatteryCard slot="04" id="00000004"></BatteryCard>
                        </div>
                        <div className="flex gap-4">
                            <BatteryCard slot="05" id="00000005"></BatteryCard>
                            <BatteryCard slot="06" id="00000006"></BatteryCard>
                        </div>
                        <div className="flex gap-4">
                            <BatteryCard slot="07" id="00000007"></BatteryCard>
                            <BatteryCard slot="08" id=""></BatteryCard>
                        </div>
                    </div>
                </Card>
                <Card className="m-4 w-1/4 p-0">
                    <CardTitle className="mt-3 ml-3 text-lg">Battery Rotation</CardTitle>
                    <div className="gap-0">
                        {
                            keys.map((key, index) => (
                                <RotationBatteryCard key={key} id={key}></RotationBatteryCard>
                            ))
                        }
                    </div>
                </Card>
                <Card className="h-[350px] w-1/4 m-4">
                    <CardTitle className="text-lg">Battery Check Out</CardTitle>
                    <Select>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Theme" />
                        </SelectTrigger>
                        <SelectContent>
                        {
                            keys.map((key, index) => (
                                <SelectItem value="{key}">{key}</SelectItem>
                            ))
                        }
                        </SelectContent>
                    </Select>
                    <Label htmlFor="slotSelector">Charger Slot:</Label>
                    <ToggleGroup id="slotSelector" type="single" variant="outline">
                        <ToggleGroupItem value="1">1</ToggleGroupItem>
                        <ToggleGroupItem value="2">2</ToggleGroupItem>
                        <ToggleGroupItem value="3">3</ToggleGroupItem>
                        <ToggleGroupItem value="4">4</ToggleGroupItem>
                        <ToggleGroupItem value="5">5</ToggleGroupItem>
                        <ToggleGroupItem value="6">6</ToggleGroupItem>
                        <ToggleGroupItem value="7">7</ToggleGroupItem>
                        <ToggleGroupItem value="8">8</ToggleGroupItem>
                    </ToggleGroup>
                    <Button className="bg-yellow-300 ml-2 mr-2 hover:bg-yellow-400" variant="outline">Check In</Button>
                </Card>
            </div>
        </div >
    )
}