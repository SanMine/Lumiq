import FAQ from "@/components/landing/faq"
import FeatureCards from "@/components/landing/feature-cards"
import FeatureDormLists from "@/components/landing/feature-dorm-lists"
import Footer from "@/components/landing/footer"
import GetStarted from "@/components/landing/get-started"
import Hero from "@/components/landing/hero"
import Testimonials from "@/components/landing/testimonials"
import ScrollTopBtn from "@/components/shared/scroll-top-btn"

export default function HomePage() {
    return (
        <>
            <Hero />
            <FeatureCards />
            <FeatureDormLists />
            <GetStarted />
            <FAQ />
            <Testimonials />
            <Footer />
            <ScrollTopBtn />
        </>
    )
}
