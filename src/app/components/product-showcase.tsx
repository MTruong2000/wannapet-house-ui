"use client";

import Image from "next/image";
import styles from "../styles/main.module.css";
import { useRef, useEffect } from "react";

type ProductCardProps = {
  src: string;
};

type ProductBlockProps = {
  title: string;
  mainImage: string;
  header_image_left: string[];
  header_image_right: string[];
  products: string[];
  reverse?: boolean;
};

const sections = [
  {
    id: 1,
    title: "Mua Đồ Cho Chó",
    mainImage: "/image/main_dog_image.jpg",
    reverse: false,
    header_image_left: [
      "/image/header_image1.png",
    ],
    header_image_right: [
      "/image/dog_header_image.png",
    ],
    products: [
      "/image/product1.jpg",
      "/image/product2.jpg",
      "/image/product3.jpg",
    ],
  },
  {
    id: 2,
    title: "Mua Đồ Cho Mèo",
    mainImage: "/image/main_cat_image.jpg",
    reverse: true,
    header_image_left: [
      "/image/header_image1.png",
    ],
    header_image_right: [
      "/image/cat_header_image.png",
    ],
    products: [
      "/image/product_cat1.jpg",
      "/image/product_cat2.jpg",
      "/image/product_cat3.jpg",
    ],
  },
  {
    id: 3,
    title: "Phụ Kiện Chó & Mèo",
    mainImage: "/image/phukien.jpg",
    reverse: false,
    header_image_left: [
      "/image/cat_header_image.png",
    ],
    header_image_right: [
      "/image/dog_header_image.png",
    ],
    products: [
      "/image/phukien1.jpg",
      "/image/phukien2.jpg",
      "/image/phukien3.jpg",
    ],
  },
];

function ProductCard({ src }: ProductCardProps) {
  return (
    <div className="bg-[#9aa77a] flex flex-col py-4 px-2">
      <div className="relative bg-white max-w-[300px] w-full aspect-[220/284] mx-auto rounded-[10px] overflow-hidden">
        <Image src={src} alt="" fill className="object-contain p-2" />
      </div>
    </div>
  );
}

function ProductBlock({
  title,
  mainImage,
  header_image_left,
  header_image_right,
  products,
  reverse,
}: ProductBlockProps) {
  return (
    <div
      className={`max-w-[1400px] mx-auto flex flex-col md:flex-row gap-[100px] items-center  ${reverse ? "md:flex-row-reverse" : ""}
  }`}
    >
      <div className="relative flex w-full md:w-[300px] ">
        <div className="absolute w-full max-w-[300px] aspect-[286/367] border-2 border-[#c8e36a] rounded-[16px] top-[30px] left-[-20px]"></div>

        <div className="relative w-full max-w-[300px] aspect-[286/367] rounded-[16px] overflow-hidden bg-white">
          <Image src={mainImage} alt="" fill className="object-cover" />
        </div>
      </div>
      <div className="">
        <div className="flex items-center justify-center mb-[20px] gap-[20px] relative">
          <div className="relative w-[70px] h-[70px]">
            <Image src={header_image_left[0]} alt="" fill className="aspect-[1/1]" />
          </div>

          <h2 className="text-xl font-bold text-[#41431B]">{title}</h2>

          <div className="relative w-[70px] h-[70px]">
            <Image src={header_image_right[0]} alt="" fill className="aspect-[1/1]" />
          </div>
        </div><div className="max-w-[520px] mx-auto">
          <ProductSlider products={products} />
        </div>
        <div className="flex justify-center">
          <button className="min-w-[200px] bg-[#d9d4c2] text-[#41431B] py-2 px-4 rounded-[25px] mt-[20px] hover:bg-[#4b4f1f] hover:text-white cursor-pointer">
            Xem thêm
          </button>
        </div>
      </div>

    </div>
  );
}

function ProductSlider({ products }: { products: string[] }) {
  
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const scrollStep = () => {
    if (!scrollRef.current) return;

    const card = scrollRef.current.querySelector(".card");
    if (!card) return;

    const cardWidth = (card as HTMLElement).offsetWidth + 20;

    scrollRef.current.scrollBy({
      left: cardWidth,
      behavior: "smooth",
    });

    const maxScroll =
      scrollRef.current.scrollWidth - scrollRef.current.clientWidth;

    if (scrollRef.current.scrollLeft >= maxScroll - 5) {
      setTimeout(() => {
        scrollRef.current?.scrollTo({ left: 0, behavior: "smooth" });
      }, 1000);
    }
  };

  useEffect(() => {
    intervalRef.current = setInterval(scrollStep, 2500);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div
      className="relative"
      onMouseEnter={() => clearInterval(intervalRef.current!)}
      onMouseLeave={() =>
        (intervalRef.current = setInterval(scrollStep, 2500))
      }
    >

      <div
        ref={scrollRef}
        className="flex gap-[20px] overflow-x-auto scroll-smooth no-scrollbar px-[10px]"
      >
        {products.map((item, index) => (
          <div key={index} className="card shrink-0 w-full md:w-[240px]">
            <ProductCard src={item} />
          </div>
        ))}
      </div>
    </div>
  );
}
export default function ProductShowcase() {
  return (
    <section className="flex flex-col bg-[#9aa77a] px-[30px] py-[30px] gap-[60px]">
      {sections.map((section) => (
        <ProductBlock key={section.id} {...section} />
      ))}
    </section>
  );
}
