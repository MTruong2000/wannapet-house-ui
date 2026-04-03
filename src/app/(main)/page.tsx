import BannerSlider from "@/components/banner-slider";
import FeedbackSection from "@/components/feedback";
import FeaturedServices from "@/components/featured-services";
import PetProductSection from "@/components/pet-product-section";
import WelcomeToWannapet from "@/components/welcome-to-wannapet";

export default function Home() {
  return (
    <>
      <BannerSlider />
      <WelcomeToWannapet />
      <FeaturedServices />
      <PetProductSection
        skuCategory="san-pham-cho-cho"
        petImageSrc="/imgs/homepage-dog.webp"
        petImageAlt="Chó cưng"
        foodIconSrc="/icons/homepage-food.svg"
        titleSvgSrc="/icons/homepage-mua-do-cho-cho.svg"
        titleSvgAlt="Mua Đồ Cho Chó"
        petIconSrc="/icons/homepage-dog-icon.svg"
        petIconAlt="Dog icon"
        petImagePosition="left"
        viewMoreHref="/san-pham-cho-cho"
      />
      <PetProductSection
        skuCategory="san-pham-cho-meo"
        petImageSrc="/imgs/homepage-cat.webp"
        petImageAlt="Mèo cưng"
        foodIconSrc="/icons/homepage-cat-icon.svg"
        titleSvgSrc="/icons/homepage-mua-do-cho-meo.svg"
        titleSvgAlt="Mua Đồ Cho Mèo"
        petIconSrc="/icons/homepage-food.svg"
        petIconAlt="Cat icon"
        petImagePosition="right"
        viewMoreHref="/san-pham-cho-meo"
      />
      <PetProductSection
        skuCategory="phu-kien"
        petImageSrc="/imgs/homepage-dog.webp"
        petImageAlt="Chó cưng"
        foodIconSrc="/icons/homepage-dog-icon.svg"
        titleSvgSrc="/icons/homepage-phu-kien.svg"
        titleSvgAlt="Mua Đồ Cho Chó"
        petIconSrc="/icons/homepage-cat-icon.svg"
        petIconAlt="Dog icon"
        petImagePosition="left"
        viewMoreHref="/phu-kien"
      />
      <FeedbackSection />
    </>
  );
}
