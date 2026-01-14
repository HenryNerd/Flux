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
    SelectLabel,
} from "@/components/ui/select"
import {
    ToggleGroup,
    ToggleGroupItem,
} from "@/components/ui/toggle-group"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { SelectGroup } from "@radix-ui/react-select"
import { toast } from "sonner"

export default function Pit() {
    const [keys, setKeys] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedBattery, setSelectedBattery] = useState('')
    const [selectedSlot, setSelectedSlot] = useState('')

    useEffect(() => {
        fetch('/api/getBattries')
            .then(res => res.json())
            .then(data => {
                const flatKeys = data.keys.flat()
                setKeys(flatKeys)
                setLoading(false)
            })
    }, [])

    const buttonClick = async () => {
        if (!selectedBattery || !selectedSlot) {
            toast.warning("Please select both a battery and a charger slot");
            return;
        }

        try {
            const response = await fetch(`/api/checkin/${selectedSlot}/${selectedBattery}`, {
                method: 'POST',
            });
            const result = await response.json();

            if (result.success) {
                toast.success("Event has been created")
                setSelectedBattery('');
                setSelectedSlot('');
            } else {
                toast.error("Failed to check in: " + result.error);
            }
        } catch (error) {
            console.error("Error checking in:", error); 
            toast.error("Failed to check in battery");
        }
    }

    return (
        <div>
            <Navbar></Navbar>
            <div className="flex">
                <Card className="m-4 p-3 w-2/5">
                    <CardTitle className="text-lg mb-4">Pit Charging Station</CardTitle>
                    <div className="flex flex-col items-center justify-center gap-4">
                        <div className="flex gap-4">
                            <BatteryCard slot="01" id="00000001"></BatteryCard>
                            <BatteryCard slot="02" id=""></BatteryCard>
                        </div>
                        <div className="flex gap-4">
                            <BatteryCard slot="03" id="00000002"></BatteryCard>
                            <BatteryCard slot="04" id="00000003"></BatteryCard>
                        </div>
                        <div className="flex gap-4">
                            <BatteryCard slot="05" id="00000004"></BatteryCard>
                            <BatteryCard slot="06" id="00000005"></BatteryCard>
                        </div>
                        <div className="flex gap-4">
                            <BatteryCard slot="07" id="00000006"></BatteryCard>
                            <BatteryCard slot="08" id="00000007"></BatteryCard>
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
                <Card className="h-min w-1/4 m-4">
                    <CardTitle className="text-lg ml-3 mt-3">Battery Check In</CardTitle>
                    <div className="ml-3 mr-3 mb-3">
                        <Label className="mb-1">Battery:</Label>
                        <Select value={selectedBattery} onValueChange={setSelectedBattery}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select Battery" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Batteries</SelectLabel>
                                    {
                                        keys.map((key) => (
                                            <SelectItem key={key} value={key}>{key}</SelectItem>
                                        ))
                                    }
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <Label className="mt-4 mb-1" htmlFor="slotSelector">Charger Slot:</Label>
                        <ToggleGroup
                            id="slotSelector"
                            type="single"
                            variant="outline"
                            value={selectedSlot}
                            onValueChange={setSelectedSlot}
                        >
                            <ToggleGroupItem value="01">1</ToggleGroupItem>
                            <ToggleGroupItem value="02">2</ToggleGroupItem>
                            <ToggleGroupItem value="03">3</ToggleGroupItem>
                            <ToggleGroupItem value="04">4</ToggleGroupItem>
                            <ToggleGroupItem value="05">5</ToggleGroupItem>
                            <ToggleGroupItem value="06">6</ToggleGroupItem>
                            <ToggleGroupItem value="07">7</ToggleGroupItem>
                            <ToggleGroupItem value="08">8</ToggleGroupItem>
                        </ToggleGroup>
                        <Button
                            className="bg-yellow-300 mt-4 w-full hover:bg-yellow-400"
                            variant="outline"
                            onClick={buttonClick}
                        >
                            Check In
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    )
}