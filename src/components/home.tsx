import FAQ from "@/components/sections/faq";
import Features from "@/components/sections/features";
import Footer from "@/components/sections/footer";
import Hero from "@/components/sections/hero";
import { Navbar } from "@/components/navbar";
// import Pricing from "@/components/sections/pricing";
// import Testimonial from "@/components/sections/testimonial";
import { useUser } from "@/db";
import { useEffect } from "react";
import { useLocation } from "wouter";

export default function Home() {
  const user = useUser();
  const [, navigate] = useLocation();
  useEffect(() => {
    if (user?.isLoggedIn) {
      navigate("/boards", { replace: true });
    }
  }, [user, navigate]);
  return (
    <>
      <title>lkal.ma - Whiteboarding Without Limits</title>
      <Navbar />
      <Hero />
      <Features />
      <FAQ />
      {/* <Testimonial /> */}
      {/* <Pricing /> */}
      <Footer />
    </>
  );
}
