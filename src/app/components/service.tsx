"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./service.module.css";

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
    <section className={styles.section}>
      
      {/* Title */}
      <div className={styles.header}>
        <h2>Dịch Vụ Nổi Bật</h2>
      </div>

      {/* Grid */}
      <div ref={ref} className={styles.grid}>
        {services.map((item) => (
          <div
            key={item.id}
            className={`${styles.card} ${
              visible ? styles.show : ""
            }`}
          >
            
            <div className={styles.imageWrap}>
              <Image
                src={item.image}
                alt={item.title}
                fill
                className={styles.image}
              />
            </div>

            <button className={styles.button}>
              {item.title}
            </button>

          </div>
        ))}
      </div>

    </section>
  );
}