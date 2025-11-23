import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MapPin, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Loader from "@/components/shared/loader";
import api from "@/api";

interface WishlistDorm {
    _id: number;
    dormId: number;
    name: string;
    address?: {
        addressLine1?: string;
        subDistrict?: string;
        district?: string;
        province?: string;
        zipCode?: string;
        country?: string;
    };
    fullAddress?: string;
    image_url: string;
    price: number;
    description?: string;
    facilities?: string | string[];
    latitude?: number;
    longitude?: number;
    addedAt: string;
}

export default function WishlistPage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [wishlist, setWishlist] = useState<WishlistDorm[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchWishlist();
    }, [user]);

    const fetchWishlist = async () => {
        if (!user) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const response = await api.get("/wishlist");
            setWishlist(response.data);
        } catch (err: any) {
            console.error("Error fetching wishlist:", err);
            setError(err.response?.data?.error || "Failed to load wishlist");
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (dormId: number) => {
        try {
            await api.delete(`/wishlist/${dormId}`);
            setWishlist(prev => prev.filter(item => item.dormId !== dormId));
        } catch (err: any) {
            console.error("Error removing from wishlist:", err);
            alert(err.response?.data?.error || "Failed to remove from wishlist");
        }
    };

    const handleViewDetails = (dormId: number) => {
        navigate(`/dorms/${dormId}`);
    };

    const handleExploreDorms = () => {
        navigate("/dorms");
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Card className="border-2 border-border bg-card p-8 text-center max-w-md">
                    <Heart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-2xl font-semibold text-foreground mb-2">
                        Login Required
                    </h3>
                    <p className="text-muted-foreground mb-6">
                        Please login to view your wishlist
                    </p>
                    <Button
                        onClick={() => navigate("/auth/sign-in")}
                        className="rounded-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
                    >
                        Login
                    </Button>
                </Card>
            </div>
        );
    }

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Card className="border-2 border-border bg-card p-8 text-center max-w-md">
                    <p className="text-destructive font-semibold mb-4">{error}</p>
                    <Button
                        onClick={fetchWishlist}
                        className="rounded-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
                    >
                        Retry
                    </Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 mb-3 flex items-center gap-3">
                        My Wishlist <Heart className="w-10 h-10 text-pink-500" />
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Your saved dorms for future reference. Compare and choose your perfect student home!
                    </p>
                </div>

                {/* Wishlist Items */}
                {wishlist.length > 0 ? (
                    <div className="space-y-6">
                        {wishlist.map((item) => (
                            <Card
                                key={item._id}
                                className="overflow-hidden border-2 border-border bg-card hover:border-pink-500/50 transition-all duration-300"
                            >
                                <CardContent className="p-0">
                                    <div className="flex flex-col md:flex-row">
                                        {/* Image */}
                                        <div className="md:w-64 h-48 md:h-auto overflow-hidden flex-shrink-0 md:ml-6 rounded-[20px]">
                                            <img
                                                src={item.image_url || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop"}
                                                alt={item.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 p-6 flex flex-col justify-between">
                                            <div>
                                                <h3 className="text-2xl font-bold text-foreground mb-2">
                                                    {item.name}
                                                </h3>
                                                <div className="flex items-center gap-2 text-muted-foreground mb-4">
                                                    <MapPin className="w-4 h-4" />
                                                    <span>{item.fullAddress || 'Address not available'}</span>
                                                </div>
                                                <p className="text-xl font-semibold text-foreground">
                                                    ฿{item.price.toLocaleString()} / month
                                                </p>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="p-6 flex flex-col gap-3 justify-center items-end">
                                            <Button
                                                onClick={() => handleViewDetails(item.dormId)}
                                                className="rounded-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white w-full md:w-auto min-w-[140px]"
                                            >
                                                View Details
                                            </Button>
                                            <Button
                                                onClick={() => handleRemove(item.dormId)}
                                                variant="outline"
                                                className="rounded-full border-2 border-border hover:bg-destructive/10 hover:border-destructive hover:text-destructive w-full md:w-auto min-w-[140px]"
                                            >
                                                <Trash2 className="w-4 h-4 mr-2" />
                                                Remove
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card className="border-2 border-dashed border-border bg-card/50 p-12 text-center">
                        <Heart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="text-2xl font-semibold text-foreground mb-2">
                            Your wishlist is empty
                        </h3>
                        <p className="text-muted-foreground mb-6">
                            Start adding dorms to your wishlist to compare and save for later!
                        </p>
                        <Button
                            onClick={handleExploreDorms}
                            className="rounded-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
                        >
                            Explore Dorms
                        </Button>
                    </Card>
                )}

                {/* Bottom CTA */}
                {wishlist.length > 0 && (
                    <Card className="border-2 border-dashed border-border bg-card/50 mt-8">
                        <CardContent className="p-8 text-center">
                            <p className="text-foreground text-lg mb-4">
                                Looking for more options?
                            </p>
                            <Button
                                onClick={handleExploreDorms}
                                className="rounded-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-8"
                            >
                                Explore more dorms
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
