import Navbar from "@/components/ui/navbar"
import BatteryCard from "@/components/ui/pitBatteryCard"
import {
    Card,
    CardTitle,
  } from "@/components/ui/card"

export default function Pit(){
    return(
        <div>
            <Navbar></Navbar>
            <Card className="m-4 p-3 w-130">
                <CardTitle>Pit Charging Station</CardTitle>
                <div className="flex gap-4 mb-4">
                    <BatteryCard id="00000001"></BatteryCard>
                    <BatteryCard id="00000002"></BatteryCard>
                </div>
                <div className="flex gap-4 mb-4">
                    <BatteryCard id="1234567890"></BatteryCard>
                    <BatteryCard id="TEST"></BatteryCard>
                </div>
                <div className="flex gap-4 mb-4">
                    <BatteryCard id="TEST"></BatteryCard>
                    <BatteryCard id="TEST"></BatteryCard>
                </div>
                <div className="flex gap-4 mb-4">
                    <BatteryCard id="TEST"></BatteryCard>
                    <BatteryCard id="TEST"></BatteryCard>
                </div>
            </Card>
        </div>
    )
}