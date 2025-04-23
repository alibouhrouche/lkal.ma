import Navbar from "@/components/navbar/navbar";
import Hero from "@/components/sections/hero";
import FAQ from "@/components/sections/faq";
import Features from "@/components/sections/features";
import Footer from "@/components/sections/footer";
import Head from "next/head";

export default function Home() {
    return <div>
        <Head>
            <title>
                Whiteboarding Without Limits - Lkal.ma
            </title>
        </Head>
        <Navbar className="sticky top-0 z-10" />
        <Hero />
        <Features />
        <FAQ />
        <Footer />
    </div>
}