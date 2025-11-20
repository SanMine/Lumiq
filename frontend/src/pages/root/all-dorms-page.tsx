import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Star, MapPin } from "lucide-react";
import { useNavigate } from "react-router";
import api from "@/api";
import Loader from "@/components/shared/loader";
import { toast } from "sonner";

interface Dorm {
  _id: number;
  name: string;
  location: string;
  rating?: number;
  average_rating?: number | string;
  total_ratings?: number;
  image_url?: string;
  description?: string;
  price?: number;
  Water_fee?: number;
  Electricity_fee?: number;
  insurance_policy?: number;
  availibility?: boolean;
  facilities?: string;
}

export default function AllDorms() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [dorms, setDorms] = useState<Dorm[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDorms = async () => {
      try {
        const response = await api.get('/dorms');
        console.log('Fetched dorms:', response.data);
        setDorms(response.data || []);
      } catch (error: any) {
        console.error('Error fetching dorms:', error);
        toast.error('Failed to load dorms');
        setDorms([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDorms();
  }, []);

  const filteredDorms = dorms.filter((dorm) =>
    dorm?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dorm?.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return <Loader />;
  }

  const getImageUrl = (dorm: Dorm) => {
    return dorm.image_url || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500&h=300&fit=crop";
  };

  const getRating = (dorm: Dorm): number => {
    const avgRating = typeof dorm.average_rating === 'string' 
      ? parseFloat(dorm.average_rating) 
      : dorm.average_rating;
    return avgRating || dorm.rating || 0;
  };

  const getPrice = (dorm: Dorm) => {
    const monthlyPrice = dorm.price || 3000;
    return monthlyPrice.toLocaleString();
  };

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
              key={dorm._id}
              className="group pt-0! overflow-hidden border-2 border-border bg-card transition-all duration-300"
            >
              <CardContent className="p-0">
                {/* Image */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={getImageUrl(dorm)}
                    alt={dorm.name}
                    className="w-full h-full object-cover cursor-pointer group-hover:scale-110 transition-transform duration-300"
                  />
                  {/* Rating Badge */}
                  <Badge className="absolute top-3 right-3 bg-lime-400 hover:bg-lime-500 text-black font-bold px-3 py-1 flex items-center gap-1">
                    <Star className="w-3 h-3 fill-black" />
                    {getRating(dorm).toFixed(1)}
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
                    Starts from ฿{getPrice(dorm)} / month
                  </p>

                  {/* View Details Button */}
                  <Button
                    onClick={() => navigate(`/dorms/${dorm._id}`)}
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