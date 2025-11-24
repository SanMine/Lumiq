import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Link } from "react-router";
import { AiOutlineArrowRight } from 'react-icons/ai';
import { useEffect, useState } from "react";
import api from "@/api";
import { Skeleton } from "../ui/skeleton";

interface Dorm {
  _id: number;
  name: string;
  image_url?: string;
  description?: string;
}

export default function FeatureDormLists() {
  const [featuredDorms, setFeaturedDorms] = useState<Dorm[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDorms = async () => {
      try {
        const response = await api.get('/dorms');
        const allDorms = response.data;

        if (allDorms && allDorms.length > 0) {
          // Shuffle array using Fisher-Yates algorithm
          const shuffled = [...allDorms];
          for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
          }

          // Take first 3
          setFeaturedDorms(shuffled.slice(0, 3));
        }
      } catch (error) {
        console.error("Failed to fetch dorms:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDorms();
  }, []);

  const getImageUrl = (dorm: Dorm) => {
    return dorm.image_url || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500&h=300&fit=crop";
  };

  return (
    <section className="py-24 w-full max-w-6xl mx-auto px-8">
      <div className="max-w-3xl mx-auto flex flex-col items-center">
        <h2 className="text-2xl md:text-3xl font-bold">Featured Dorm Listings</h2>
        <p className="text-xs md:text-sm text-muted-foreground tracking-wide text-center">Handpicked residence for an amazing student life.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-8">
        {isLoading ? (
          // Loading Skeletons
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="flex flex-col space-y-3">
              <Skeleton className="h-52 w-full rounded-md" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          ))
        ) : (
          featuredDorms.map(dorm => (
            <Link key={dorm._id} to={`/dorms/${dorm._id}`}>
              <Card className="rounded-md flex flex-col p-0 border-none cursor-pointer hover:shadow-lg transition-shadow duration-300 h-full">
                <CardHeader className="p-0 rounded-t-md pb-4">
                  <img
                    src={getImageUrl(dorm)}
                    alt={dorm.name}
                    className="h-52 w-full object-cover rounded-t-md"
                  />
                  <CardTitle className="text-md font-bold px-4 pt-2 line-clamp-1">{dorm.name}</CardTitle>
                  <CardDescription className="px-4 line-clamp-2">{dorm.description || "Experience comfortable living with modern amenities."}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))
        )}
      </div>

      <Link to="/dorms" aria-label="See All Dorms" className='flex items-center gap-3 justify-center font-medium text-muted-foreground hover:text-primary transition-colors duration-300'>
        <AiOutlineArrowRight className='animate-point' size="1.2rem" aria-hidden="true" />
        See All Dorms
      </Link>
    </section>
  )
}