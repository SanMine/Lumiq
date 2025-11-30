import FAQ from "@/components/landing/faq"
import FeatureCards from "@/components/landing/feature-cards"
import FeatureDormLists from "@/components/landing/feature-dorm-lists"
import Footer from "@/components/landing/footer"
import GetStarted from "@/components/landing/get-started"
import Hero from "@/components/landing/hero"
import Testimonials from "@/components/landing/testimonials"
import ScrollTopBtn from "@/components/shared/scroll-top-btn"
import { motion } from "framer-motion"

export default function HomePage() {
    // Animation variants for scroll-triggered animations
    const fadeInUp = {
        hidden: { opacity: 0, y: 60 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6 }
        }
    };

    const fadeInLeft = {
        hidden: { opacity: 0, x: -60 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.6 }
        }
    };

    const fadeInRight = {
        hidden: { opacity: 0, x: 60 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.6 }
        }
    };

    return (
        <>
            {/* Hero - fade in from top */}
            <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <Hero />
            </motion.div>

            {/* Feature Cards - fade in up */}
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeInUp}
            >
                <FeatureCards />
            </motion.div>

            {/* Feature Dorm Lists - slide from left */}
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={fadeInLeft}
            >
                <FeatureDormLists />
            </motion.div>

            {/* Get Started - slide from right */}
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeInRight}
            >
                <GetStarted />
            </motion.div>

            {/* FAQ - fade in up */}
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={fadeInUp}
            >
                <FAQ />
            </motion.div>

            {/* Testimonials - slide from left */}
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={fadeInLeft}
            >
                <Testimonials />
            </motion.div>

            {/* Footer - fade in */}
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                variants={fadeInUp}
            >
                <Footer />
            </motion.div>

            <ScrollTopBtn />
        </>
    )
}
