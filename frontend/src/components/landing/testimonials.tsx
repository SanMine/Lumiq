import Autoplay from "embla-carousel-autoplay"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import * as React from "react"
import { FaQuoteLeft } from "react-icons/fa";
import { testimonials } from "@/lib/constants";

export default function Testimonials() {
    const plugin = React.useRef(
        Autoplay({ delay: 1000, stopOnInteraction: true })
    )

    return (
        <section className="pb-32 pt-16 w-full max-w-6xl mx-auto px-8">
            <div className="max-w-6xl mx-auto flex flex-col text-center items-center mb-6">
                <FaQuoteLeft className="h-12 w-12 mb-2" />
                <h2 className="text-3xl font-bold">What Our Community Says</h2>
                <p className="text-sm text-muted-foreground tracking-wide">
                    Hear from our residents about their dormitory life experiences.
                </p>
            </div>
            <Carousel
                plugins={[plugin.current]}
                className="w-full"
                onMouseEnter={plugin.current.stop}
                onMouseLeave={plugin.current.reset}
            >
                <CarouselContent className="">
                    {testimonials.map((item) => (
                        <CarouselItem
                            key={item.id}
                            className="pl-4 lg:basis-1/3">
                            <div className="p-4 py-8 flex lg:px-4 gap-4 flex-col items-center border rounded-md h-full text-center">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    loading="lazy"
                                    decoding="async"
                                    className="h-18 rounded-full"
                                />
                                <p className="my-2 text-muted-foreground italic line-clamp-5">"{item.content}"</p>

                                <div>
                                    <h3 className="font-bold">{item.name}</h3>
                                    <p className="text-sm text-muted-foreground">{item.major}</p>
                                </div>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="hidden cursor-pointer min-[1400px]:flex min-[1400px]:items-center min-[1400px]:justify-center" />
                <CarouselNext className="hidden cursor-pointer min-[1400px]:flex min-[1400px]:items-center min-[1400px]:justify-center" />
            </Carousel>
        </section>
    )
}
