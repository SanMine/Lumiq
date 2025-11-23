import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "@/api";
import Loader from "@/components/shared/loader";
import { useAuth } from '@/contexts/AuthContext';

interface Room {
    _id: number | string;
    dormId: number | { _id: number; name: string };
    room_number: string;
    room_type: string;
    capacity: number;
    price_per_month: number;
    booking_fees?: number;
    floor?: number;
    description?: string | null;
    zone?: string | null;
    amenities?: string | null;
    images?: string[];
    status?: string;
}

interface Dorm {
    _id: number | string;
    name: string;
}

export default function SingleRoomDetail() {
    const { id, roomId } = useParams<{ id: string; roomId: string }>();
    const navigate = useNavigate();
    const [room, setRoom] = useState<Room | null>(null);
    const [dorm, setDorm] = useState<Dorm | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            if (!roomId) return;
            setError(null);

            setLoading(true);
            try {
                const [roomRes, dormRes] = await Promise.all([
                    api.get(`/rooms/${roomId}`),
                    id ? api.get(`/dorms/${id}`) : Promise.resolve({ data: null })
                ]);

                const fetchedRoom = roomRes.data;

                // Check if room is available
                if (fetchedRoom.status !== 'Available') {
                    setError('This room is not available for booking');
                    setLoading(false);
                    return;
                }

                setRoom(fetchedRoom);
                setDorm(dormRes?.data || null);
            } catch (err: any) {
                console.error(err);
                setError(err.response?.data?.error || err.message || 'Failed to load room');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [roomId, id]);

    if (loading) return <Loader />;

    if (error || !room) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Card className="border-2 border-border bg-card p-6">
                    <p className="text-destructive font-semibold">{error || 'Room not found'}</p>
                </Card>
            </div>
        );
    }

    const amenities = Array.isArray(room.amenities)
        ? room.amenities.map(String)
        : typeof room.amenities === 'string'
            ? room.amenities.split(',').map(s => s.trim()).filter(Boolean)
            : [];

    const galleryImages = (room.images || []).filter(Boolean);
    const mainImage = galleryImages[0] || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop";
    const thumbnailImages = galleryImages.slice(1, 4);

    return (
        <div className="min-h-screen bg-background text-foreground pb-20">
            <div className="max-w-6xl mx-auto px-6 py-10">

                {/* Back */}
                <button
                    onClick={() => {
                        if (id) {
                            navigate(`/dorms/${id}`);
                        } else {
                            navigate(-1);
                        }
                    }}
                    className="flex items-center gap-2 text-sm text-muted-foreground mb-6 hover:text-foreground transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to {dorm?.name || 'Dorm'}
                </button>

                {/* Title */}
                <h1 className="text-4xl font-bold text-primary mb-2">
                    {room.room_type || `Room ${room.room_number}`}
                </h1>
                <p className="text-muted-foreground mb-8">
                    {room.description || 'Your private space at the dorm.'}
                </p>

                {/* Image Gallery */}
                <div className="space-y-4">
                    <Card className="w-full h-[350px] rounded-xl bg-muted/50 border-border overflow-hidden flex items-center justify-center">
                        {galleryImages.length > 0 ? (
                            <img
                                src={mainImage}
                                alt={room.room_type}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="text-muted-foreground">No images available</div>
                        )}
                    </Card>

                    <div className="grid grid-cols-3 gap-4">
                        {thumbnailImages.length > 0 ? (
                            thumbnailImages.map((img, idx) => (
                                <Card key={idx} className="h-[150px] bg-muted/50 border-border overflow-hidden flex items-center justify-center">
                                    <img
                                        src={img}
                                        alt={`${room.room_type} - ${idx + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </Card>
                            ))
                        ) : (
                            <>
                                <Card className="h-[150px] bg-muted/50 border-border flex items-center justify-center">
                                    <div className="text-muted-foreground text-sm">No image</div>
                                </Card>
                                <Card className="h-[150px] bg-muted/50 border-border flex items-center justify-center">
                                    <div className="text-muted-foreground text-sm">No image</div>
                                </Card>
                                <Card className="h-[150px] bg-muted/50 border-border flex items-center justify-center">
                                    <div className="text-muted-foreground text-sm">No image</div>
                                </Card>
                            </>
                        )}
                        {/* Fill remaining slots if less than 3 thumbnails */}
                        {thumbnailImages.length > 0 && thumbnailImages.length < 3 &&
                            Array.from({ length: 3 - thumbnailImages.length }).map((_, idx) => (
                                <Card key={`empty-${idx}`} className="h-[150px] bg-muted/50 border-border flex items-center justify-center">
                                    <div className="text-muted-foreground text-sm">No image</div>
                                </Card>
                            ))
                        }
                    </div>
                </div>

                {/* Room Info Section */}
                <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">

                    {/* Left: Description & Details */}
                    <div className="md:col-span-2">
                        <h2 className="text-2xl font-bold text-primary mb-4">Room Information</h2>
                        <p className="text-muted-foreground mb-6">
                            {room.description ||
                                "This room is designed for comfort and productivity. It's the perfect retreat for students who value their own private space while still being part of a vibrant dorm community."}
                        </p>

                        {/* Room Attributes Grid */}
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <p className="font-semibold">Room Number</p>
                                <p className="text-muted-foreground">{room.room_number}</p>
                            </div>

                            <div>
                                <p className="font-semibold">Occupants</p>
                                <p className="text-muted-foreground">
                                    {room.capacity == null ? 'N/A' : `${room.capacity} ${room.capacity === 1 ? 'Person' : 'People'}`}
                                </p>
                            </div>

                            <div>
                                <p className="font-semibold">Bed Type</p>
                                <p className="text-muted-foreground">{room.room_type}</p>
                            </div>

                            <div>
                                <p className="font-semibold">Floor</p>
                                <p className="text-muted-foreground">{room.floor ?? 'N/A'}</p>
                            </div>

                            <div>
                                <p className="font-semibold">Building / Zone</p>
                                <p className="text-muted-foreground">{room.zone || 'N/A'}</p>
                            </div>

                            <div>
                                <p className="font-semibold">Dorm</p>
                                <p className="text-muted-foreground">{dorm?.name || 'N/A'}</p>
                            </div>
                        </div>

                        {/* Amenities */}
                        <h2 className="text-2xl font-bold text-primary mt-10 mb-4">
                            In-Room Amenities
                        </h2>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                            {amenities.length > 0 ? (
                                amenities.map((item) => (
                                    <Card
                                        key={item}
                                        className="p-3 bg-muted/50 border-border rounded-lg text-sm flex items-center justify-center hover:bg-muted transition-colors"
                                    >
                                        {item}
                                    </Card>
                                ))
                            ) : (
                                [
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
                                        className="p-3 bg-muted/50 border-border rounded-lg text-sm flex items-center justify-center hover:bg-muted transition-colors"
                                    >
                                        {item}
                                    </Card>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Right: Price Card */}
                    <Card className="p-6 bg-muted/50 border-border h-fit">
                        <CardContent className="space-y-3 p-0">
                            <div>
                                <p className="text-xl font-bold">฿{room.price_per_month?.toLocaleString?.() ?? room.price_per_month}</p>
                                <p className="text-sm text-muted-foreground">/month</p>
                            </div>

                            {room.booking_fees != null && (
                                <div>
                                    <p className="text-sm text-muted-foreground">Booking Fee (one-time)</p>
                                    <p className="text-lg font-medium">฿{room.booking_fees?.toLocaleString?.() ?? room.booking_fees}</p>
                                </div>
                            )}

                            <Badge className={
                                room.status === 'Available'
                                    ? 'bg-green-600 hover:bg-green-700 text-white'
                                    : room.status === 'Reserved'
                                        ? 'bg-amber-600 hover:bg-amber-700 text-white'
                                        : room.status === 'Occupied'
                                            ? 'bg-red-600 hover:bg-red-700 text-white'
                                            : room.status === 'Maintenance'
                                                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                                : 'bg-gray-300 text-gray-800'
                            }>
                                {room.status || 'Unknown'}
                            </Badge>

                            {user?.role !== 'dorm_admin' && (
                                <Button
                                    onClick={() => navigate(id ? `/dorms/${id}/book?roomId=${room._id}` : '/')}
                                    className="rounded-full bg-gradient w-full min-h-[40px] text-white cursor-pointer hover:scale-105 transition-all"
                                    disabled={room.status !== 'Available'}
                                >
                                    Book This Room
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Footer Section */}
                <div className="mt-16 text-center">
                    <h3 className="text-xl font-semibold mb-2">
                        Ready to make this your room?
                    </h3>
                    <p className="text-muted-foreground mb-6">
                        Book now to secure your spot at {dorm?.name || 'this dorm'}.
                    </p>

                    {user?.role !== 'dorm_admin' && (
                        <div className="flex justify-center gap-4">
                            <Button
                                onClick={() => navigate(id ? `/dorms/${id}/book?roomId=${room._id}` : '/')}
                                className="rounded-full bg-gradient w-fit min-h-[40px] text-white cursor-pointer hover:scale-105 transition-all px-8"
                                disabled={room.status !== 'Available'}
                            >
                                Book This Room Now
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}