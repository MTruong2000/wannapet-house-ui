"use client";

import Image from "next/image";
import styles from "./productshowcase.module.css";

const products = [
  { id: 1, image: "/image/product1.jpg" },
  { id: 2, image: "/image/product2.jpg" },
  { id: 3, image: "/image/product3.jpg" },
];

export default function ProductShowcase() {
  return (
    <section className={styles.section}>
      
      <div className={styles.container}>

        {/* LEFT IMAGE */}
        <div className={styles.left}>
          <div className={styles.leftBorder}></div>

          <div className={styles.leftImage}>
            <Image
              src="/image/dog.jpg"
              alt="dog"
              fill
              className={styles.image}
            />
          </div>
        </div>

        {/* RIGHT */}
        <div className={styles.right}>

          {/* Title */}
          <h2 className={styles.title}>Mua Đồ Cho Chó</h2>

          {/* Products */}
          <div className={styles.products}>
  {products.map((item) => (
    <div key={item.id} className={styles.card}>
      
      {/* ẢNH */}
      <div className={styles.imageWrap}>
        <Image
          src={item.image}
          alt=""
          fill
          className={styles.image}
        />
      </div>

      {/* BUTTON */}
      <button className={styles.btn}>
        Xem thêm
      </button>

    </div>
  ))}
</div>

          

        </div>

      </div>

    </section>
  );
}