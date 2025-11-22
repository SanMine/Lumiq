//dorm-detail-page.tsx
import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Wifi, Coffee, Dumbbell, Home, Bed, Zap } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
// Fix Leaflet default marker icon with Vite
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41], 
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;
import * as HoverCardPrimitive from '@radix-ui/react-hover-card';
import { Mail, Phone, MessageSquare, Facebook } from 'lucide-react';
import { cn } from '@/lib/utils';
import api from "@/api";
import Loader from "@/components/shared/loader";

interface Dorm {
  _id: number;
  name: string;
  location: string;
  image_url: string;
  description: string;
  availibility: boolean;
  facilities: string[];
  latitude?: number;
  longitude?: number;
  price: number;
  insurance_policy: number;
  Water_fee: number;
  Electricity_fee: number;
  average_rating?: number | string;
  total_ratings?: number;
  min_rating?: number;
  max_rating?: number;
  // Contact fields
  contact_gmail?: string;
  contact_phone?: string;
  contact_line?: string;
  contact_facebook?: string;
}

interface Room {
  _id: number;
  dormId: number | { _id: number; name: string };
  room_number: string;
  room_type: string;
  capacity: number;
  price_per_month: number;
  floor: number;
  description: string | null;
  amenities: string | null;
  images: string[];
  status: string;
  current_resident_id: number | null;
  expected_move_in_date: string | null;
  expected_available_date: string | null;
}

interface Rating {
  _id: number;
  rating: number;
  userId: {
    _id: number;
    name: string;
    email: string;
  };
  dormId: number;
  createdAt: string;
  updatedAt: string;
}

export default function DormDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dorm, setDorm] = useState<Dorm | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDormData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Fetch dorm details
        const dormResponse = await api.get(`/dorms/${id}`);
        setDorm(dormResponse.data);
        
        // Fetch rooms for this dorm
        const roomsResponse = await api.get(`/rooms?dormId=${id}`);
        setRooms(roomsResponse.data);
        
        // Fetch ratings for this dorm
        const ratingsResponse = await api.get(`/dorms/${id}/ratings`);
        setRatings(ratingsResponse.data);
      } catch (err: any) {
        setError(err.response?.data?.error || err.message || "Failed to fetch dorm data");
        console.error("Error fetching dorm data:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDormData();
  }, [id]);
  
  console.log("Dorm ID:", id);

  if (loading) {
    return <Loader />;
  }

  if (error || !dorm) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="border-2 border-border bg-card p-6">
          <p className="text-destructive font-semibold">
            {error || "Dorm not found"}
          </p>
        </Card>
      </div>
    );
  }

  const averageRating = typeof dorm.average_rating === 'string' 
    ? parseFloat(dorm.average_rating) 
    : dorm.average_rating || 0;
  const totalRatings = dorm.total_ratings || 0;

  // Highlights pulled from backend: prefer structured array in `facilities` (backwards compatible with comma-separated string)
  const highlights: string[] = Array.isArray(dorm.facilities)
    ? dorm.facilities
    : typeof dorm.facilities === 'string' && dorm.facilities
    ? dorm.facilities.split(',').map(s => s.trim()).filter(Boolean)
    : [];

  const getIconForHighlight = (name: string) => {
    const key = name.toLowerCase();
    if (key.includes('room') || key.includes('type')) return <Bed className="w-6 h-6 mx-auto mb-2 text-foreground" />;
    if (key.includes('internet') || key.includes('wifi')) return <Zap className="w-6 h-6 mx-auto mb-2 text-foreground" />;
    if (key.includes('kitchen') || key.includes('shared')) return <Coffee className="w-6 h-6 mx-auto mb-2 text-foreground" />;
    if (key.includes('laundry')) return <Wifi className="w-6 h-6 mx-auto mb-2 text-foreground" />;
    if (key.includes('lounge') || key.includes('common')) return <Home className="w-6 h-6 mx-auto mb-2 text-foreground" />;
    if (key.includes('fitness') || key.includes('gym')) return <Dumbbell className="w-6 h-6 mx-auto mb-2 text-foreground" />;
    return <Home className="w-6 h-6 mx-auto mb-2 text-foreground" />;
  }

  // Group rooms by room_type and compute aggregates (count, min price, sample id, availability counts)
  const groupedRooms = Object.values(
    rooms.reduce((acc: Record<string, any>, room) => {
      const key = room.room_type || 'Room';
      if (!acc[key]) {
        acc[key] = {
          room_type: key,
          count: 0,
          capacity: room.capacity,
          minPrice: room.price_per_month,
          sampleRoomId: room._id,
          statusCount: { Available: 0, Reserved: 0, Full: 0 },
        };
      }

      acc[key].count += 1;
      acc[key].capacity = acc[key].capacity || room.capacity;
      if (typeof room.price_per_month === 'number') {
        acc[key].minPrice = Math.min(acc[key].minPrice, room.price_per_month);
      }
      acc[key].statusCount[room.status] = (acc[key].statusCount[room.status] || 0) + 1;

      return acc;
    }, {})
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        
          {/* Main Dorm Info Card */}
        <Card className="overflow-hidden border-2 border-border bg-card mb-8 py-0">
          <CardContent className="p-0">
            {/* Hero Image */}
            <div className="relative h-96 overflow-hidden">
              <img
                src={dorm.image_url || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&h=600&fit=crop"}
                alt={dorm.name}
                className="w-full h-full object-cover"
              />
              {/* Rating Badge */}
              <Badge className="absolute top-4 right-4 bg-lime-400 hover:bg-lime-500 text-black rounded-full w-fit min-h-[40px] cursor-pointer items-center">
                <Star className="w-5 h-5 fill-black" />
                {averageRating.toFixed(1)} ({totalRatings} reviews)
              </Badge>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">{dorm.name}</h1>
              
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-5 h-5" />
                <span className="text-lg">{dorm.location}</span>
              </div>

              <div className="flex flex-wrap gap-4 items-center justify-between pt-4 border-t border-border">
                <span className="text-foreground font-semibold text-xl">
                  Price Range: ฿{dorm.price.toLocaleString()} / month
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
              {dorm.description || "Campus Suites offers modern student living with a focus on community and convenience. Located just steps from MFU campus, it provides a range of room options and amenities to suit every student's needs."}
            </p>

            {/* Highlights Grid — sourced from backend `amenities` or `facilities` */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {highlights.length > 0 ? (
                highlights.map((h, idx) => (
                  <div key={idx} className="bg-muted/50 p-4 rounded-lg text-center border border-border hover:bg-muted transition-colors">
                    {getIconForHighlight(h)}
                    <span className="text-sm text-foreground">{h}</span>
                  </div>
                ))
              ) : (
                <div className="col-span-6 text-muted-foreground">No highlights available for this dorm.</div>
              )}
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
                    <th className="pb-3 font-semibold">Total</th>
                    <th className="pb-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {rooms.length > 0 ? groupedRooms.map((grp: any) => {
                    const availability = grp.statusCount.Available > 0 ? 'Available' : grp.statusCount.Reserved > 0 ? 'Limited' : 'Full';
                    return (
                      <tr key={grp.room_type} className="hover:bg-muted/50 transition-colors">
                        <td className="py-4 text-foreground font-medium">
                          <Link to={`/dorms/${id}/rooms/${grp.sampleRoomId ?? 'single'}`} className="hover:underline">
                            {grp.room_type}
                          </Link>
                        </td>
                        <td className="py-4 text-muted-foreground">{grp.capacity} person</td>
                        <td className="py-4 text-foreground">฿{grp.minPrice}/month</td>
                        <td className="py-4">
                          <Badge className={
                            availability === "Available" 
                              ? "bg-lime-400 text-black hover:bg-lime-500"
                              : availability === "Limited"
                              ? "bg-yellow-400 text-black hover:bg-yellow-500"
                              : "bg-red-500 text-white hover:bg-red-600"
                          }>
                            {availability === "Available" ? "Available" : availability === "Limited" ? "Limited" : "Full"}
                          </Badge>
                        </td>
                        <td className="py-4 text-foreground font-medium">{grp.count}</td>
                        <td className="py-4">
                          <Link to={`/dorms/${id}/rooms/${grp.sampleRoomId ?? 'single'}`}>
                            <Button className="rounded-full bg-gradient w-fit min-h-[36px] text-white cursor-pointer">View Rooms</Button>
                          </Link>
                        </td>
                      </tr>
                    )
                  }) : (
                    <tr className="hover:bg-muted/50 transition-colors">
                      <td className="py-4 text-foreground font-medium">
                        <Link to={`/dorms/${id}/rooms/single`} className="hover:underline">
                          Single Room
                        </Link>
                      </td>
                      <td className="py-4 text-muted-foreground">150 sq ft</td>
                      <td className="py-4 text-foreground">฿800/month</td>
                      <td className="py-4">
                        <Badge className="bg-lime-400 text-black hover:bg-lime-500">Available</Badge>
                      </td>
                      <td className="py-4 text-foreground font-medium">1</td>
                      <td className="py-4">
                        <Link to={`/dorms/${id}/rooms/single`}>
                          <Button className="rounded-full bg-gradient w-fit min-h-[36px] text-white cursor-pointer">View Rooms</Button>
                        </Link>
                      </td>
                    </tr>
                  )}
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
              <div className="text-5xl font-bold text-lime-400">{averageRating.toFixed(1)}</div>
              <div className="text-muted-foreground text-lg">Based on {totalRatings} reviews</div>
            </div>

            {/* Reviews */}
            <div className="space-y-4">
              {ratings.length > 0 ? ratings.slice(0, 2).map((rating) => (
                <Card key={rating._id} className="bg-muted/50 border-border">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-foreground">{rating.userId.name}</p>
                      <span className="text-muted-foreground text-sm">{new Date(rating.createdAt).toISOString().split('T')[0]}</span>
                    </div>
                    <p className="text-muted-foreground">
                      Rated {rating.rating} out of 5 stars
                    </p>
                  </CardContent>
                </Card>
              )) : (
                <>
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
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Location & Map */}
        <Card className="border-2 border-border bg-card mb-8">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold text-foreground mb-4">Location & Accessibility</h2>
            <div className="rounded-lg overflow-hidden border border-border">
              {typeof dorm.latitude === 'number' && typeof dorm.longitude === 'number' ? (
                <div className="w-full h-80">
                  <MapContainer
                    center={[dorm.latitude, dorm.longitude]}
                    zoom={15}
                    style={{ height: '100%', width: '100%' }}
                    scrollWheelZoom={false}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={[dorm.latitude, dorm.longitude]}>
                      <Popup>
                        <div className="text-center">
                          <p className="font-semibold">{dorm.name}</p>
                          <p className="text-sm text-muted-foreground">{dorm.location}</p>
                        </div>
                      </Popup>
                    </Marker>
                  </MapContainer>
                </div>
              ) : (
                <div className="bg-muted/50 rounded-lg overflow-hidden border border-border p-6">
                  <p className="text-muted-foreground">Location not available for this dorm.</p>
                </div>
              )}
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

        {/* Contact Us */}
        <Card className="border-2 border-border bg-card mb-8">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold text-foreground text-center mb-4">Contact us</h2>
            <div className="space-y-4">
              <Card className="bg-muted/50 border-border items-center">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-6 justify-center">
                      {/* Phone */}
                      {dorm.contact_phone && (
                        <HoverCardPrimitive.Root openDelay={200} closeDelay={100}>
                          <HoverCardPrimitive.Trigger asChild>
                            <a
                              href={`tel:${dorm.contact_phone}`}
                              className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-muted hover:bg-muted/80 transition-colors"
                              aria-label="Phone"
                            >
                              <Phone className="w-5 h-5 text-foreground" />
                            </a>
                          </HoverCardPrimitive.Trigger>
                          <HoverCardPrimitive.Portal>
                            <HoverCardPrimitive.Content
                              className={cn('bg-popover text-popover-foreground z-50 rounded-md border shadow-md p-3 w-48')}
                              sideOffset={6}
                              align="center"
                            >
                              <div className="space-y-1 text-center">
                                <p className="text-xs font-semibold text-muted-foreground uppercase">Phone</p>
                                <a href={`tel:${dorm.contact_phone}`} className="text-sm text-primary hover:underline">{dorm.contact_phone}</a>
                              </div>
                              <HoverCardPrimitive.Arrow className="fill-border" />
                            </HoverCardPrimitive.Content>
                          </HoverCardPrimitive.Portal>
                        </HoverCardPrimitive.Root>
                      )}

                      {/* Gmail */}
                      {dorm.contact_gmail && (
                        <HoverCardPrimitive.Root openDelay={200} closeDelay={100}>
                          <HoverCardPrimitive.Trigger asChild>
                            <a
                              href={`mailto:${dorm.contact_gmail}`}
                              className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-muted hover:bg-muted/80 transition-colors"
                              aria-label="Email"
                            >
                              <Mail className="w-5 h-5 text-foreground" />
                            </a>
                          </HoverCardPrimitive.Trigger>
                          <HoverCardPrimitive.Portal>
                            <HoverCardPrimitive.Content
                              className={cn('bg-popover text-popover-foreground z-50 rounded-md border shadow-md p-3 w-56')}
                              sideOffset={6}
                              align="center"
                            >
                              <div className="space-y-1 text-center">
                                <p className="text-xs font-semibold text-muted-foreground uppercase">Email</p>
                                <a href={`mailto:${dorm.contact_gmail}`} className="text-sm text-primary hover:underline break-words block">{dorm.contact_gmail}</a>
                              </div>
                              <HoverCardPrimitive.Arrow className="fill-border" />
                            </HoverCardPrimitive.Content>
                          </HoverCardPrimitive.Portal>
                        </HoverCardPrimitive.Root>
                      )}

                      {/* Line */}
                      {dorm.contact_line && (
                        <HoverCardPrimitive.Root openDelay={200} closeDelay={100}>
                          <HoverCardPrimitive.Trigger asChild>
                            <button
                              className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-muted hover:bg-muted/80 transition-colors"
                              aria-label="Line"
                            >
                              <MessageSquare className="w-5 h-5 text-foreground" />
                            </button>
                          </HoverCardPrimitive.Trigger>
                          <HoverCardPrimitive.Portal>
                            <HoverCardPrimitive.Content
                              className={cn('bg-popover text-popover-foreground z-50 rounded-md border shadow-md p-3 w-56')}
                              sideOffset={6}
                              align="center"
                            >
                              <div className="space-y-1 text-center">
                                <p className="text-xs font-semibold text-muted-foreground uppercase">Line</p>
                                <p className="text-sm break-words">{dorm.contact_line}</p>
                              </div>
                              <HoverCardPrimitive.Arrow className="fill-border" />
                            </HoverCardPrimitive.Content>
                          </HoverCardPrimitive.Portal>
                        </HoverCardPrimitive.Root>
                      )}

                      {/* Facebook */}
                      {dorm.contact_facebook && (
                        <HoverCardPrimitive.Root openDelay={200} closeDelay={100}>
                          <HoverCardPrimitive.Trigger asChild>
                            <a
                              href={dorm.contact_facebook.startsWith('http') ? dorm.contact_facebook : `https://${dorm.contact_facebook}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-muted hover:bg-muted/80 transition-colors"
                              aria-label="Facebook"
                            >
                              <Facebook className="w-5 h-5 text-foreground" />
                            </a>
                          </HoverCardPrimitive.Trigger>
                          <HoverCardPrimitive.Portal>
                            <HoverCardPrimitive.Content
                              className={cn('bg-popover text-popover-foreground z-50 rounded-md border shadow-md p-3 w-64')}
                              sideOffset={6}
                              align="center"
                            >
                              <div className="space-y-1 text-center">
                                <p className="text-xs font-semibold text-muted-foreground uppercase">Facebook</p>
                                <a
                                  href={dorm.contact_facebook.startsWith('http') ? dorm.contact_facebook : `https://${dorm.contact_facebook}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-sm text-primary hover:underline break-words block"
                                >
                                  {dorm.contact_facebook}
                                </a>
                              </div>
                              <HoverCardPrimitive.Arrow className="fill-border" />
                            </HoverCardPrimitive.Content>
                          </HoverCardPrimitive.Portal>
                        </HoverCardPrimitive.Root>
                      )}
                    </div>
                  </div>
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
                  variant="outline" 
                  className="rounded-full bg-gradient w-fit min-h-[40px] text-white cursor-pointer"
                >
                  Book a Room
                </Button>
                <Button 
                  variant="outline" 
                  className="rounded-full bg-gradient w-fit min-h-[40px] text-white cursor-pointer"
                >
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
