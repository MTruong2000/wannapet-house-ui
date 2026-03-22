"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "../styles/service.module.css";

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
    
      <div className={styles.header}>
        <div className={styles["ellipse-wrapper"]}>
  <svg viewBox="0 0 300 150" className={styles["ellipse-svg"]}>
    
    <ellipse
      cx="150"
      cy="75"
      rx="120"
      ry="50"
       transform="rotate(10 150 75)"
      className={styles["ellipse-line"]
        
      }
    />

    <ellipse
      cx="150"
      cy="75"
      rx="120"
      ry="50"
      className={styles["ellipse-line"]}
      transform="rotate(-10 150 75)"
    />

  </svg>

  <span className={styles["ellipse-text"]}>Dịch Vụ Nổi Bật</span>
</div>
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
            
            <div className={styles["image-wrap"]}>
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
