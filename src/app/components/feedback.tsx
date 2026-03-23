"use client";

import Image from "next/image";
import styles from "../styles/feedback.module.css";

type ImageItem = {
  src: string;
  className?: string;
  width: number;
  height: number;
};

type FeedbackItem = {
  text: string;
};

// DATA
const images: ImageItem[] = [
  {
    src: "/image/feedback1.png",
    className: "left",
    width: 220,
    height: 220,
  },
  {
    src: "/image/feedback2.jpg",
    className: "center",
    width: 260,
    height: 260,
  },
  {
    src: "/image/feedback2.jpg",
    className: "right",
    width: 220,
    height: 220,
  },
];

const feedbacks: FeedbackItem[] = [
  { text: "TEXT FEEDBACK" 
  },
  { text: "TEXT FEEDBACK" 
  },
  { text: "TEXT FEEDBACK"
   },
];

export default function FeedbackSection() {
  return (
    <section className={styles["section"]}>
      
      {/* HEADER */}
      <div className={styles["header"]}>
        <div className={styles["ellipse"]}></div>
        <h2 className={styles["title"]}>Feedback</h2>
      </div>

      {/* IMAGES */}
      <div className={styles["images"]}>
        {images.map((item, index) => (
          <div
            key={index}
            className={`${styles["image-wrapper"]} ${
              item.className ? styles[item.className] : ""
            }`}
          >
            <Image
              src={item.src}
              width={item.width}
              height={item.height}
              alt=""
            />
          </div>
        ))}
      </div>

      {/* FEEDBACK */}
      <div className={styles["feedback"]}>
        {feedbacks.map((item, index) => (
          <div key={index} className={styles["card"]}>
            <p>{item.text}</p>
          </div>
        ))}
      </div>

    </section>
  );
}
