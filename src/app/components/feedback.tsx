"use client";

import Image from "next/image";
import styles from "../styles/main.css";

type ImageItem = {
  src: string;
  className?: string;
  width: number;
  height: number;
};

type FeedbackItem = {
  text: string;
};

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
    <section className="w-full bg-[#d9d4c2] py-[80px] px-[20px]  text-center">

      <div className="relative mb-20">
        <div className="relative flex justify-center items-center w-full">
                  <Image src="/image/elipse.png" alt="Services" width={500} height={100} className="aspect-[1080/383] " />
        
          <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-extrabold text-[#4e591e] text-[clamp(24px,3vw,60px)] ">
            FeedBack
          </span>
        </div>
      </div> 
      <div className="flex justify-center gap-[40px] mb-[50px]">
        {images.map((item, index) => (
          <div
            key={index}
           className={`
              ${item.className === "left" ? "rotate-[-15deg]" : ""}
              ${item.className === "right" ? "rotate-[15deg]" : ""}
            `}
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
      <div className="flex flex-col md:flex-row md:items-start items-center justify-center gap-[40px]">
        {feedbacks.map((item, index) => (
          <div key={index} className=" border-[#5c5a3a] border-2 p-6 rounded-[10px] w-[250px] h-[200px] text-[#5c5a3a] ">
            <p>{item.text}</p>
          </div>
        ))}
      </div>

    </section>
  );
}
