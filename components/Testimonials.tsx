"use client";
import { useRef, useEffect } from "react";

type Testimonial = {
  id: number;
  content: string;
  name: string;
  organization: string;
};

interface TestimonialsProps {
  testimonials: Testimonial[];
}

export default function Testimonials({ testimonials }: TestimonialsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;

    const scrollAmount = scrollRef.current.offsetWidth;

    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    if (!scrollRef.current || testimonials.length === 0) return;

    const container = scrollRef.current;
    let animationFrame: number;
    let isPaused = false;

    const speed = 0.5; // 🔥 smooth speed (0.3–1 ideal)

    const scroll = () => {
      if (!container || isPaused) return;

      container.scrollLeft += speed;

      // 👉 infinite loop (no jump)
      if (container.scrollLeft >= container.scrollWidth / 2) {
        container.scrollLeft = 0;
      }

      animationFrame = requestAnimationFrame(scroll);
    };

    animationFrame = requestAnimationFrame(scroll);

    // 👉 hover pause
    const handleMouseEnter = () => (isPaused = true);
    const handleMouseLeave = () => {
      isPaused = false;
      animationFrame = requestAnimationFrame(scroll);
    };

    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationFrame);
      container.removeEventListener("mouseenter", handleMouseEnter);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [testimonials]);

  return (
    <div className="relative px-4">
      {/* Scroll Container */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto no-scrollbar p-5"
      >
        {[...testimonials, ...testimonials].map((item, index) => (
          <div
            key={index}
            className="min-w-full sm:min-w-[80%] md:min-w-[48%] bg-white rounded-2xl shadow-md p-6 md:p-8 flex flex-col justify-between"
          >
            <div className="text-[#22407b] text-4xl mb-4">❝</div>

            <p className="text-gray-600 italic mb-6 leading-relaxed">
              {item.content}
            </p>

            <div>
              <h3 className="font-semibold text-gray-800">
                {item.name}
              </h3>
              <p className="text-gray-500 text-sm">
                {item.organization}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}