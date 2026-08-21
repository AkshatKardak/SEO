import Hero from "../components/home/Hero";
import HowItWorks from "../components/home/HowItWorks";
import ResponseShowcase from "../components/home/ResponseShowcase";
import Features from "../components/home/Features";
import Footer from "../components/home/Footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <HowItWorks />
      <ResponseShowcase />
      <Features />
      <Footer />
    </div>
  );
}
