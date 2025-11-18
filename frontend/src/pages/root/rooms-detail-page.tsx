import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Wifi, Coffee, Dumbbell, Home, Bed, Zap } from "lucide-react";

export default function RoomsDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  console.log("Dorm ID:", id);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        
        {/* Main Dorm Info Card */}
        <Card className="overflow-hidden border-2 border-border bg-card mb-8 py-0">
          <CardContent className="p-0">
            {/* Hero Image */}
            <div className="relative h-96 overflow-hidden ">
              <img
                src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&h=600&fit=crop"
                alt="Campus Suites"
                className="w-full h-full object-cover"
              />
              {/* Rating Badge */}
              <Badge className="absolute top-4 right-4 bg-lime-400 hover:bg-lime-500 text-black rounded-full  w-fit min-h-[40px]  cursor-pointeritems-center ">
                <Star className="w-5 h-5 fill-black" />
                4.5 (120 reviews)
              </Badge>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">Campus Suites</h1>
              
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-5 h-5" />
                <span className="text-lg">123 University Ave, Cityville, State 12345</span>
              </div>

              <div className="flex flex-wrap gap-4 items-center justify-between pt-4 border-t border-border">
                <span className="text-foreground font-semibold text-xl">
                  Price Range: ฿800 – ฿1,200 / month
                </span>
                <Button 
                  onClick={() => navigate(`/dorms/${id}/book`)}
                  className="rounded-full bg-gradient w-fit min-h-[40px] text-white cursor-pointer"
                >
                  Book / Apply Now
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Description & Highlights */}
        <Card className="border-2 border-border bg-card mb-8">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold text-foreground mb-4">Description & Highlights</h2>
            <p className="text-muted-foreground text-lg mb-6">
              Campus Suites offers modern student living with a focus on community and
              convenience. Located just steps from MFU campus, it provides a range of
              room options and amenities to suit every student's needs.
            </p>

            {/* Highlights Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="bg-muted/50 p-4 rounded-lg text-center border border-border hover:bg-muted transition-colors">
                <Bed className="w-6 h-6 mx-auto mb-2 text-foreground" />
                <span className="text-sm text-foreground">Varied Room Types</span>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg text-center border border-border hover:bg-muted transition-colors">
                <Zap className="w-6 h-6 mx-auto mb-2 text-foreground" />
                <span className="text-sm text-foreground">High-Speed Internet</span>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg text-center border border-border hover:bg-muted transition-colors">
                <Coffee className="w-6 h-6 mx-auto mb-2 text-foreground" />
                <span className="text-sm text-foreground">Shared Kitchen</span>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg text-center border border-border hover:bg-muted transition-colors">
                <Wifi className="w-6 h-6 mx-auto mb-2 text-foreground" />
                <span className="text-sm text-foreground">Laundry Facilities</span>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg text-center border border-border hover:bg-muted transition-colors">
                <Home className="w-6 h-6 mx-auto mb-2 text-foreground" />
                <span className="text-sm text-foreground">Common Lounge</span>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg text-center border border-border hover:bg-muted transition-colors">
                <Dumbbell className="w-6 h-6 mx-auto mb-2 text-foreground" />
                <span className="text-sm text-foreground">Fitness Center</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Room Options */}
        <Card className="border-2 border-border bg-card mb-8">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold text-foreground mb-4">Room Options</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b border-border">
                  <tr className="text-foreground">
                    <th className="pb-3 font-semibold">Room Type</th>
                    <th className="pb-3 font-semibold">Size</th>
                    <th className="pb-3 font-semibold">Price</th>
                    <th className="pb-3 font-semibold">Availability</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr className="hover:bg-muted/50 transition-colors">
                    <td className="py-4 text-foreground font-medium">Single Room</td>
                    <td className="py-4 text-muted-foreground">150 sq ft</td>
                    <td className="py-4 text-foreground">฿800/month</td>
                    <td className="py-4">
                      <Badge className="bg-lime-400 text-black hover:bg-lime-500">Available</Badge>
                    </td>
                  </tr>
                  <tr className="hover:bg-muted/50 transition-colors">
                    <td className="py-4 text-foreground font-medium">Double Room</td>
                    <td className="py-4 text-muted-foreground">250 sq ft</td>
                    <td className="py-4 text-foreground">฿1000/month</td>
                    <td className="py-4">
                      <Badge className="bg-yellow-400 text-black hover:bg-yellow-500">Limited</Badge>
                    </td>
                  </tr>
                  <tr className="hover:bg-muted/50 transition-colors">
                    <td className="py-4 text-foreground font-medium">Suite</td>
                    <td className="py-4 text-muted-foreground">400 sq ft</td>
                    <td className="py-4 text-foreground">฿1200/month</td>
                    <td className="py-4">
                      <Badge className="bg-red-500 text-white hover:bg-red-600">Full</Badge>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Reviews & Ratings */}
        <Card className="border-2 border-border bg-card mb-8">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold text-foreground mb-4">Reviews & Ratings</h2>
            <div className="flex items-center gap-6 mb-6">
              <div className="text-5xl font-bold text-lime-400">4.5</div>
              <div className="text-muted-foreground text-lg">Based on 120 reviews</div>
            </div>

            {/* Reviews */}
            <div className="space-y-4">
              <Card className="bg-muted/50 border-border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-foreground">Sophia Clark</p>
                    <span className="text-muted-foreground text-sm">2023-08-15</span>
                  </div>
                  <p className="text-muted-foreground">
                    Campus Suites is an amazing place to live! The rooms are modern and clean,
                    and the staff is super friendly and helpful.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-muted/50 border-border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-foreground">Ethan Miller</p>
                    <span className="text-muted-foreground text-sm">2023-07-20</span>
                  </div>
                  <p className="text-muted-foreground">
                    Great location, right next to campus. The only downside is it can get a bit noisy sometimes.
                  </p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Location & Map */}
        <Card className="border-2 border-border bg-card mb-8">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold text-foreground mb-4">Location & Accessibility</h2>
            <div className="bg-muted/50 rounded-lg overflow-hidden border border-border">
              <img
                src="https://via.placeholder.com/1200x400?text=Map+Placeholder"
                alt="map"
                className="w-full h-80 object-cover"
              />
            </div>
          </CardContent>
        </Card>

        {/* Policies & Safety */}
        <Card className="border-2 border-border bg-card mb-8">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold text-foreground mb-4">Policies & Safety</h2>
            <div className="space-y-4">
              <Card className="bg-muted/50 border-border">
                <CardContent className="p-4">
                  <p className="text-foreground">
                    <strong className="text-foreground">Rules:</strong>
                    <span className="text-muted-foreground"> No pets, quiet hours after 10 PM, guest policy.</span>
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-muted/50 border-border">
                <CardContent className="p-4">
                  <p className="text-foreground">
                    <strong className="text-foreground">Safety Features:</strong>
                    <span className="text-muted-foreground"> 24/7 security, key card access, emergency call system.</span>
                  </p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Footer Actions */}
        <Card className="border-2 border-border bg-card">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-foreground text-lg font-semibold">Ready to find your new home?</p>
              <div className="flex flex-wrap gap-3">
                <Button 
                  onClick={() => navigate(`/dorms/${id}/book`)}
                  variant="outline" className="rounded-full bg-gradient w-fit min-h-[40px] text-white cursor-pointer"
                >
                  Book a Room
                </Button>
                <Button variant="outline" className="rounded-full bg-gradient w-fit min-h-[40px] text-white cursor-pointer">
                  Contact Dorm
                </Button>
                <Button variant="outline" className="rounded-full bg-gradient w-fit min-h-[40px] text-white cursor-pointer">
                  Save to Wishlist
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}