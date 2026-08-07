"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

type OurClientsProps = {
  title: string;
  logos: string[];
};

export default function OurClients({ title, logos }: OurClientsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let scrollAmount = 0;

    const autoScroll = () => {
      scrollAmount += 1;

      container.scrollTo({
        left: scrollAmount,
        behavior: "smooth",
      });

      // Infinite loop reset
      if (scrollAmount >= container.scrollWidth / 2) {
        scrollAmount = 0;
      }
    };

    const interval = setInterval(autoScroll, 30);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* Title */}
      <div className="pb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-center">
          {title}
        </h2>
      </div>

      {/* Carousel */}
      <div className="overflow-hidden">
        <div
          ref={scrollRef}
          className="flex gap-12 items-center whitespace-nowrap overflow-x-hidden"
        >
          {[...logos, ...logos].map((logo, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-[140px] md:w-[160px]"
            >
              <Image
                src={logo}
                alt="Client"
                width={60}
                height={60}
                loading="lazy"
                className="w-full h-[80px] object-contain transition duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}