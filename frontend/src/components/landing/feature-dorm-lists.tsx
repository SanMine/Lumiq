import { dorms } from "@/lib/constants";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Link } from "react-router";
import { AiOutlineArrowRight } from 'react-icons/ai';

export default function FeatureDormLists() {
  return (
    <section className="py-24 w-full max-w-6xl mx-auto px-8">
      <div className="max-w-3xl mx-auto flex flex-col items-center">
        <h2 className="text-3xl font-bold">Featured Dorm Listings</h2>
        <p className="text-sm text-muted-foreground tracking-wide">Handpicked residence for an amazing student life.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-8">
        {
          dorms.map(dorm => (
            <Card key={dorm.id} className="rounded-md flex flex-col p-0 border-none cursor-pointer hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="p-0 rounded-t-md pb-4">
                <img src={dorm.image} alt={dorm.name} className="h-52 w-full object-cover rounded-t-md" />
                <CardTitle className="text-md font-bold px-4 pt-2">{dorm.name}</CardTitle>
                <CardDescription className="px-4">{dorm.description}</CardDescription>
              </CardHeader>
            </Card>
          ))
        }
      </div>
      <Link to="/dorms" aria-label="See All Dorms" className='flex items-center gap-3 justify-center font-medium text-muted-foreground hover:text-primary transition-colors duration-300'>
        <AiOutlineArrowRight className='animate-point' size="1.2rem" aria-hidden="true" />
        See All Dorms
      </Link>
    </section>
  )
}