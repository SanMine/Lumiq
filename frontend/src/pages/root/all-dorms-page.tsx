import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Star, MapPin } from "lucide-react";
import { useNavigate } from "react-router";

export default function AllDorms() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");

    const dorms = [
        {
            id: 1,
            name: "The Grand Residence",
            location: "Bangkok, Thailand",
            price: "3,200",
            rating: 4.8,
            image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500&h=300&fit=crop"
        },
        {
            id: 2,
            name: "The Student Hub",
            location: "Chiang Mai, Thailand",
            price: "3,000",
            rating: 4.5,
            image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=500&h=300&fit=crop"
        },
        {
            id: 3,
            name: "The Academic Suites",
            location: "Phuket, Thailand",
            price: "3,500",
            rating: 4.9,
            image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500&h=300&fit=crop"
        },
        {
            id: 4,
            name: "The Scholar's Quarters",
            location: "Pattaya, Thailand",
            price: "3,100",
            rating: 4.6,
            image: "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=500&h=300&fit=crop"
        },
        {
            id: 5,
            name: "The Campus Retreat",
            location: "Krabi, Thailand",
            price: "3,300",
            rating: 4.7,
            image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500&h=300&fit=crop"
        },
        {
            id: 6,
            name: "University Place",
            location: "Bangkok, Thailand",
            price: "3,800",
            rating: 4.4,
            image: "https://images.unsplash.com/photo-1574643156929-51fa098b0394?w=500&h=300&fit=crop"
        },
        {
            id: 7,
            name: "Modern Living Dorms",
            location: "Chiang Mai, Thailand",
            price: "2,900",
            rating: 4.3,
            image: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=500&h=300&fit=crop"
        },
        {
            id: 8,
            name: "Coastal Student Residence",
            location: "Phuket, Thailand",
            price: "4,200",
            rating: 4.8,
            image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500&h=300&fit=crop"
        },
        {
            id: 9,
            name: "City Center Dorms",
            location: "Bangkok, Thailand",
            price: "3,600",
            rating: 4.5,
            image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=500&h=300&fit=crop"
        }
    ];

    const filteredDorms = dorms.filter((dorm) =>
        dorm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dorm.location.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <section className="min-h-screen bg-background px-4 sm:px-6 py-8">
            <div className="max-w-7xl mx-auto">
                {/* Search Bar */}
                <div className="mb-8">
                    <div className="relative max-w-2xl mx-auto">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Search by dorm name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-12 h-14 bg-card border-border text-foreground placeholder:text-muted-foreground rounded-full text-base"
                        />
                    </div>
                </div>

                {/* Dorms Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredDorms.map((dorm) => (
                        <Card
                            key={dorm.id}
                            className="group pt-0! overflow-hidden border-2 border-border bg-card transition-all duration-300"
                        >
                            <CardContent className="p-0">
                                {/* Image */}
                                <div className="relative h-64 overflow-hidden">
                                    <img
                                        src={dorm.image}
                                        alt={dorm.name}
                                        className="w-full h-full object-cover cursor-pointer group-hover:scale-110 transition-transform duration-300"
                                    />
                                    {/* Rating Badge */}
                                    <Badge className="absolute top-3 right-3 bg-lime-400 hover:bg-lime-500 text-black font-bold px-3 py-1 flex items-center gap-1">
                                        <Star className="w-3 h-3 fill-black" />
                                        {dorm.rating}
                                    </Badge>
                                </div>

                                {/* Content */}
                                <div className="p-5 space-y-3">
                                    {/* Dorm Name */}
                                    <h3 className="text-xl font-bold text-foreground line-clamp-1">
                                        {dorm.name}
                                    </h3>

                                    {/* Location */}
                                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                        <MapPin className="w-4 h-4" />
                                        <span>{dorm.location}</span>
                                    </div>

                                    {/* Price */}
                                    <p className="text-foreground font-semibold text-lg">
                                        Starts from ฿{dorm.price} / month
                                    </p>

                                    {/* View Details Button */}
                                    <Button
                                        onClick={() => navigate(`/dorms/${dorm.id}`)}
                                        className="w-full bg-card hover:bg-muted text-foreground border-2 cursor-pointer transition-all"
                                        size="lg"
                                    >
                                        View Details
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* No Results */}
                {filteredDorms.length === 0 && (
                    <div className="text-center py-16">
                        <p className="text-muted-foreground text-lg">
                            No dorms found matching "{searchQuery}"
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}