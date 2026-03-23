import Image from "next/image";
import Slider from "./components/slide";
import Hero from "./components/hero"
import Services  from "./components/service";
import ProductShowcase from "./components/productshowcase";
import FeedBackSection from "./components/feedback";
export default function Home() {
  return (
    <main >
      <Slider />
      <Hero/>
      <Services />
      <ProductShowcase/>
      <FeedBackSection/>
    </main>
  );
}
