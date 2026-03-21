"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./slider.module.css";

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
  className={styles.slider}
  onMouseEnter={stopAuto}
  onMouseLeave={startAuto}
>
  {/* Track */}
  <div
    className={styles.track}
    style={{ transform: `translateX(-${current * 100}%)` }}
  >
    {slides.map((slide) => (
      <a key={slide.id} href={slide.link} className={styles.slide}>
        <Image
          src={slide.image}
          alt=""
          fill
          className={styles.image}
        />
      </a>
    ))}
  </div>

  {/* Dots */}
  <div className={styles.dots}>
    {slides.map((_, index) => (
      <button
        key={index}
        onClick={() => setCurrent(index)}
        className={`${styles.dot} ${
          index === current ? styles.dotActive : ""
        }`}
      />
    ))}
  </div>
</div>
  );
}