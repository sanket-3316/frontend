"use client";

import { useEffect, useRef, useState } from "react";

type Stat = {
  icon: string;
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
};

interface StatsSectionProps {
  stats: Stat[];
}
export default function StatsSection({ stats }: StatsSectionProps) {
  const [start, setStart] = useState(false);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  // Detect when section is visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStart(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-10 px-5 " ref={sectionRef}>
      <div className="mx-auto max-w-7xl grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {stats.map((stat, index) => {
          const Icon = stat.icon;

          return (
            <div
              key={index}
              className="bg-white rounded-xl  p-6 flex flex-col items-center justify-center hover:shadow-md transition  shadow-lg shadow-cyan-500/10"
            >

              <h4 className="!text-2xl md:!text-3xl font-bold ">
                {stat.prefix}
                <Counter target={stat.value} start={start} />
                {stat.suffix}
              </h4>

              <p className=" mt-1 text-sm md:!text-base">
                {stat.label}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// Counter Component
function Counter({ target, start }: { target: number; start: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;

    let startValue = 0;
    const duration = 1500; // animation duration
    const increment = target / (duration / 16);

    const timer = setInterval(() => {
      startValue += increment;

      if (startValue >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(startValue));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [start, target]);

  return <span className="!text-2xl md:!text-3xl font-bold">{count.toLocaleString()}</span>;
}