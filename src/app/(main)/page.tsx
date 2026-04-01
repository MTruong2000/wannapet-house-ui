import BannerSlider from "@/components/banner-slider";
import FeaturedServices from "@/components/featured-services";
import WelcomeToWannapet from "@/components/welcome-to-wannapet";

export default function Home() {
  return (
    <>
      <BannerSlider />
      <WelcomeToWannapet />
      <FeaturedServices />
    </>
  );
}
