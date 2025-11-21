import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft } from "lucide-react"

export default function SingleRoomDetail() {
  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Back */}
        <button className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Campus Suites
        </button>

        {/* Title */}
        <h1 className="text-4xl font-bold text-primary mb-2">
          Single Room Details
        </h1>
        <p className="text-muted-foreground mb-8">
          Your private space at Campus Suites.
        </p>

        {/* Image Gallery */}
        <div className="space-y-4">
          <Card className="w-full h-[350px] rounded-xl bg-muted/50 border-border flex items-center justify-center">
            <div className="text-muted-foreground">Main Image</div>
          </Card>

          <div className="grid grid-cols-3 gap-4">
            <Card className="h-[150px] bg-muted/50 border-border flex items-center justify-center">
              <div className="text-muted-foreground">Image</div>
            </Card>
            <Card className="h-[150px] bg-muted/50 border-border flex items-center justify-center">
              <div className="text-muted-foreground">Image</div>
            </Card>
            <Card className="h-[150px] bg-muted/50 border-border flex items-center justify-center">
              <div className="text-muted-foreground">Image</div>
            </Card>
          </div>
        </div>

        {/* Room Info Section */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Left: Description & Details */}
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold text-primary mb-4">Room Information</h2>
            <p className="text-muted-foreground mb-6">
              This single room is designed for comfort and productivity. It's the perfect
              retreat for students who value their own private space while still being
              part of a vibrant dorm community.
            </p>

            {/* Room Attributes Grid */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="font-semibold">Room Size</p>
                <p className="text-muted-foreground">150 sq ft (14 sq m)</p>
              </div>

              <div>
                <p className="font-semibold">Occupants</p>
                <p className="text-muted-foreground">1 Student</p>
              </div>

              <div>
                <p className="font-semibold">Bed Type</p>
                <p className="text-muted-foreground">Twin XL</p>
              </div>

              <div>
                <p className="font-semibold">Furniture</p>
                <p className="text-muted-foreground">Desk, Chair, Wardrobe</p>
              </div>

              <div>
                <p className="font-semibold">Bathroom</p>
                <p className="text-muted-foreground">Private En-suite</p>
              </div>

              <div>
                <p className="font-semibold">Kitchenette</p>
                <p className="text-muted-foreground">Mini-fridge & Microwave</p>
              </div>
            </div>

            {/* Amenities */}
            <h2 className="text-2xl font-bold text-primary mt-10 mb-4">
              In-Room Amenities
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {[
                "High-Speed Wi-Fi",
                "Air Conditioning",
                "Study Desk",
                "Ergonomic Chair",
                "Wardrobe/Closet",
                "Mini-Fridge",
                "Microwave",
                "Window Blinds",
              ].map((item) => (
                <Card
                  key={item}
                  className="p-3 bg-muted/50 border-border rounded-lg text-sm flex items-center justify-center"
                >
                  {item}
                </Card>
              ))}
            </div>
          </div>

          {/* Right: Price Card */}
          <Card className="p-6 bg-muted/50 border-border h-fit">
            <CardContent className="space-y-3">
              <div>
                <p className="text-xl font-bold">$800</p>
                <p className="text-sm text-muted-foreground">/month</p>
              </div>

              <Badge className="bg-green-600 text-white px-2 py-1">
                Available
              </Badge>
              <p className="text-xs text-muted-foreground">for Fall 2024</p>

              <Button className="rounded-full bg-gradient w-fit min-h-[40px] text-white cursor-pointer">Book This Room</Button>
              
            </CardContent>
          </Card>
        </div>

        {/* Footer Section */}
        <div className="mt-16 text-center">
          <h3 className="text-xl font-semibold mb-2">
            Ready to make this your room?
          </h3>
          <p className="text-muted-foreground mb-6">
            Book now to secure your spot at Campus Suites.
          </p>

          <div className="flex justify-center gap-4">
            <Button className="rounded-full bg-gradient w-fit min-h-[40px] text-white cursor-pointer">Book This Room Now</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
