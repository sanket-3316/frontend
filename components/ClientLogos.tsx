// components/ui/ClientLogos.tsx

"use client";

import Marquee from "react-fast-marquee";
import Image from "next/image";

type Props = {
  logos: string[];
};

export default function ClientLogos({ logos }: Props) {
  return (
    <div className="w-full">

      <Marquee
        pauseOnHover={true}
        speed={40}
        gradient={false}
      >
        {logos.map((logo, i) => (
          <div
            key={i}
            className="mx-4 flex items-center justify-center bg-white rounded-lg shadow min-w-[140px] h-20"
          >
            <Image
              src={`${logo}`}
              alt="client"
              width={120}
              height={60}
              className="object-contain grayscale hover:grayscale-0 transition"
            />
          </div>
        ))}
      </Marquee>

    </div>
  );
}