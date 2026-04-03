"use client";

import Image from "next/image";

type DecorativeTitleProps = {
  text: string;
  svg?: string;
  className?: string;
  textColor?: string;
};

export default function DecorativeTitle({
  text,
  svg = "/icons/home-decorative-oval.svg",
  className = "",
  textColor = "white",
}: DecorativeTitleProps) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <Image
        src={svg}
        alt="decorative"
        width={529}
        height={188}
        className="w-[260px] md:w-[420px] lg:w-[520px] h-auto"
        priority
      />

      <h2
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2text-center font-bold text-lg md:text-2xl lg:text-3xltracking-widewhitespace-nowrap"
        style={{
          color: textColor,
          fontFamily: "'SVN-Gilroy', 'Nunito', sans-serif",
        }}
      >
        {text}
      </h2>
    </div>
  );
}
