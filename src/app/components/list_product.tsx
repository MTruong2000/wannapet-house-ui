"use client";

import Image from "next/image";
import styles from "../styles/list-product.module.css";

type Product = {
  image: string;
  name: string;
  price: string;
};

type ProductBlockProps = {
  title: string;
  products: Product[];
};

export default function ProductBlock({ title, products }: ProductBlockProps) {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>{title}</h2>

      <div className={styles.grid}>
        {products.map((item, index) => (
          <div key={index} className={styles.card}>
            <div className={styles["image-wrapper"]}>
              <Image src={item.image} alt={item.name} fill style={{objectFit:"cover"}}/>
            </div>

            <p className={styles.name}>{item.name}</p>
            <p className={styles.price}>{item.price}</p>
          </div>
        ))}
      </div>
    </section>
  );
}