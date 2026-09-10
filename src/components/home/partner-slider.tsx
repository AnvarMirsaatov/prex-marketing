"use client";

import { useRef, useState, useEffect } from "react";
import { PartnerLogo } from "@/components/ui/partner-logo";
import { Button } from "@/components/ui/button";
import type { Partner } from "@/types/home";

export function PartnerSlider({
  items,
  placeholder,
  previous,
  next,
  label,
}: {
  items: readonly Partner[];
  placeholder: string;
  previous: string;
  next: string;
  label: string;
}) {
  const track = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });
  useEffect(() => {
    const element = track.current;
    if (!element) return;
    const update = () => {
      const start = element.scrollLeft <= 1;
      const end = element.scrollLeft + element.clientWidth >= element.scrollWidth - 1;
      setEdges((previous) =>
        previous.start === start && previous.end === end ? previous : { start, end },
      );
    };
    update();
    element.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => {
      element.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, []);
  function move(direction: number) {
    const element = track.current;
    if (!element) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    element.scrollBy({
      left: direction * element.clientWidth,
      behavior: reduced ? "instant" : "smooth",
    });
  }
  return (
    <div className="space-y-4">
      <ul
        ref={track}
        aria-label={label}
        tabIndex={0}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto rounded-card pb-3 [scrollbar-width:thin]"
      >
        {items.map((item) => (
          <li
            key={item.id}
            className="w-[80%] shrink-0 snap-start sm:w-[calc((100%-1rem)/2)] lg:w-[calc((100%-3rem)/4)]"
          >
            <PartnerLogo src={item.logo} alt={item.alt ?? placeholder} placeholder={placeholder} />
          </li>
        ))}
      </ul>
      <div className="flex justify-end gap-3">
        <Button
          variant="outline"
          disabled={edges.start}
          onClick={() => move(-1)}
          aria-label={previous}
        >
          <span aria-hidden="true">←</span>
        </Button>
        <Button variant="outline" disabled={edges.end} onClick={() => move(1)} aria-label={next}>
          <span aria-hidden="true">→</span>
        </Button>
      </div>
    </div>
  );
}
