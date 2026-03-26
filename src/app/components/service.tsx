"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "../styles/main.module.css";

const services = [
  {
    id: 1,
    image: "/image/service1.jpg",
    title: "PET GROOMING",
  },
  {
    id: 2,
    image: "/image/service2.jpg",
    title: "PHỤ KIỆN – THỨC ĂN",
  },
  {
    id: 3,
    image: "/image/service3.jpg",
    title: "HOTEL",
  },
];

export default function Services() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  return (
    <section className="w-full bg-[#9aa77a] px-[20px] py-[20px] text-center">

      <div className="flex justify-center items-center py-12">
        <div className="relative flex justify-center items-center w-full">
          <Image src="/image/elipse.png" alt="Services" width={500} height={100} className="aspect-[1080/383] brightness-0 invert" />

          <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-extrabold text-[#454543] text-[clamp(24px,2vw,60px)]">
            Dịch Vụ Nổi Bật
          </span>
        </div>
      </div>

      <div ref={ref} className="relative max-w-[1400px] mx-auto mt-[40px] grid grid-cols-1 md:grid-cols-3 gap-[20px]">
        {services.map((item, index) => (
          <div
            key={item.id}
           className={`${styles["fade-scale-item"]} ${visible ? styles["active"] : ""}`}
            style={{ animationDelay: `${index * 0.15}s` }}
          >

            <div className="relative w-full h-[250px] md:h-[350px] lg:h-[400px] max-w-[400px] mx-auto overflow-hidden rounded-[20px] group">

              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover transition duration-500 group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition"></div>

            </div>

            <button className="bg-[#d9d4c2] text-[#41431B] py-2 px-4 rounded-[25px] mt-[20px] hover:bg-[#41431B] hover:text-white cursor-pointer">
              {item.title}
            </button>

          </div>
        ))}
      </div>

    </section>
  );
}
