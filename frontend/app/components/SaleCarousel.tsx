"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface SaleCarouselProps {
  games: any[];
}

export default function SaleCarousel({ games }: SaleCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollButtons = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.8;
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollButtons);
    updateScrollButtons();
    return () => el.removeEventListener("scroll", updateScrollButtons);
  }, [games]);

  useEffect(() => {
    if (games.length === 0) return;
    const timer = setInterval(() => {
      const el = scrollRef.current;
      if (!el) return;
      if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 1) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: el.clientWidth * 0.8, behavior: "smooth" });
      }
    }, 5000);
    return () => clearInterval(timer);
  }, [games]);

  if (games.length === 0) return null;

  return (
    <div className="mb-8">
      <h2 className="text-xl text-zinc-300 mb-4">Ofertas</h2>
      <div className="relative group">
        {canScrollLeft && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-0 bottom-0 z-10 w-10 bg-gradient-to-r from-[#0a0e1a] to-transparent flex items-center justify-start pl-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          >
            <span className="text-zinc-400 text-lg">&lsaquo;</span>
          </button>
        )}
        {canScrollRight && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-0 bottom-0 z-10 w-10 bg-gradient-to-l from-[#0a0e1a] to-transparent flex items-center justify-end pr-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          >
            <span className="text-zinc-400 text-lg">&rsaquo;</span>
          </button>
        )}

        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto scroll-smooth scrollbar-hide pb-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {games.map((game) => (
            <Link
              key={game.id}
              href={`/games/${game.id}`}
              className="shrink-0 w-56 bg-[#111827] border border-[#1e293b] rounded-lg overflow-hidden hover:border-[#00d4ff]/30 transition-colors"
            >
              <div className="relative aspect-video w-full">
                <Image
                  src={game.imageUrl}
                  alt={game.title}
                  fill
                  sizes="224px"
                  className="object-cover"
                />
                <span className="absolute top-2 left-2 bg-green-600 text-white text-xs font-bold px-2 py-0.5 rounded">
                  -{game.discount}%
                </span>
              </div>
              <div className="p-3">
                <h3 className="text-white text-sm font-medium truncate">{game.title}</h3>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-zinc-500 text-xs line-through">${game.price}</span>
                  <span className="text-[#00d4ff] text-sm font-medium">${game.discountedPrice}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
