"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "../styles/slider.module.css";

const slides = [
  { id: 1, image: "/image/slide1.jpg", link: "/" },
  { id: 2, image: "/image/slide2.jpg", link: "/" },
  { id: 3, image: "/image/slide3.jpg", link: "/" },
];

export default function Slider() {
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startAuto = () => {
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
  };

  const stopAuto = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  useEffect(() => {
    startAuto();
    return () => stopAuto();
  }, []);

  return (
    <div
  className="relative w-full aspect-[1920/696] overflow-hidden"
  onMouseEnter={stopAuto}
  onMouseLeave={startAuto}
>
  <div
    className="flex h-full transition-transform duration-700 will-change-transform"
    style={{ transform: `translateX(-${current * 100}%)` }}
  >
    {slides.map((slide) => (
      <a key={slide.id} href={slide.link} className="min-w-full h-full relative">
        <Image
          src={slide.image}
          alt=""
          fill
          className="w-full h-full object-cover"
        />
      </a>
    ))}
  </div>

  <div className="absolute bottom-[16px] left-[50%] flex gap-2 z-10">
    {slides.map((_, index) => (
      <button
        key={index}
        onClick={() => setCurrent(index)}
        className={`w-3 h-3 rounded-full border border-black ${
          index === current ? "bg-black" : "bg-transparent"
        }`}
      />
    ))}
  </div>
</div>
  );
}
