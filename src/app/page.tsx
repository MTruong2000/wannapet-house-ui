import Image from "next/image";
import Slider from "./components/slide";
import Hero from "./components/hero"
import Services  from "./components/service";
import ProductShowcase from "./components/product-showcase";
import FeedBackSection from "./components/feedback";
import Header from "./components/header";
import Footer from "./components/footer";
import About from "./components/about";
import Contact from "./components/contact";
export default function Home() {
  return (
    <main >
      <Header />
      <Slider />
      <Hero/>
      <Services />
      <ProductShowcase/>
      <FeedBackSection/>
      <Contact backgroundColor="bg-wannapet-cream" />
      <Footer/>
    </main>
  );
}
