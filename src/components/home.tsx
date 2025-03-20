import FAQ from "@/components/sections/faq";
import Features from "@/components/sections/features";
import Footer from "@/components/sections/footer";
import Hero from "@/components/sections/hero";
import { Navbar } from "@/components/navbar";
// import Pricing from "@/components/sections/pricing";
// import Testimonial from "@/components/sections/testimonial";
import { userPromise } from "@/db";
import { redirect } from "react-router";

export async function clientLoader() {
  const user = await userPromise();
  if (user?.isLoggedIn) {
    return redirect("/boards");
  }
}

export default function Home() {
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
