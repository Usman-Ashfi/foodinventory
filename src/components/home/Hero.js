"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Clock,
  ShoppingBag,
  Sparkles,
  Star,
} from "lucide-react";
import { fade, stagger } from "./animations";

const productTabs = [
  ["Stock", "1.2k", "bg-[#d9ffb9]"],
  ["Sales", "$18k", "bg-[#ffd7ec]"],
  ["Routes", "42", "bg-[#ffe5bd]"],
];
const dishes = [
  ["/food/1.webp", "Fresh inventory dish"],
  ["/food/2.webp", "Sales ready food bowl"],
  ["/food/3.webp", "Delivery menu dish"],
];

export default function Hero() {
  const [dishIndex, setDishIndex] = useState(0);
  const [spinDegrees, setSpinDegrees] = useState(0);
  const [dishSrc, dishAlt] = dishes[dishIndex];

  useEffect(() => {
    const timeouts = [];
    const timer = setInterval(() => {
      setSpinDegrees((current) => current + 360);
      timeouts.push(
        setTimeout(() => {
          setDishIndex((current) => (current + 1) % dishes.length);
        }, 600),
      );
    }, 2600);
    return () => {
      clearInterval(timer);
      timeouts.forEach(clearTimeout);
    };
  }, []);

  return (
    <section className="w-full overflow-hidden bg-white">
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="relative w-full overflow-hidden bg-white"
      >
        <div className="absolute right-0 top-0 hidden h-full w-[43%] rounded-l-[48%] bg-[#153a20] lg:block" />
        <div className="absolute right-0 top-0 hidden h-full w-[43%] bg-[radial-gradient(circle_at_35%_35%,rgba(255,255,255,.16),transparent_34%),linear-gradient(rgba(255,255,255,.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.05)_1px,transparent_1px)] bg-size-[auto,34px_34px,34px_34px] lg:block" />

        <div className="relative z-10 grid min-h-170 lg:grid-cols-[0.94fr_1.06fr]">
          <div className="flex flex-col justify-center px-7 py-12 sm:px-12 lg:px-16">
            <motion.div
              variants={fade}
              className="mb-5 inline-flex w-fit items-center gap-2 rounded-full bg-[#f8f3e7] px-4 py-2 text-sm font-bold text-[#886511]"
            >
              <Sparkles className="size-4" />
              Smart food command center
            </motion.div>
            <motion.h1
              variants={fade}
              className="max-w-xl text-5xl font-black leading-[1.02] tracking-tight text-black sm:text-6xl lg:text-7xl"
            >
              Manage your
              <span className="block font-light">favourite Foods</span>
            </motion.h1>
            <motion.p
              variants={fade}
              className="mt-6 max-w-md text-base font-medium leading-7 text-zinc-400"
            >
              Track fresh stock, sales, customers, users, and deliveries from
              one clean workspace built for busy food teams.
            </motion.p>

            <motion.div variants={fade} className="mt-8 flex items-end gap-3">
              <div>
                <p className="text-3xl font-extralight text-zinc-400">
                  Today value
                </p>
                <p className="-mt-1 text-4xl font-black text-black">$24.30k</p>
              </div>
            </motion.div>

            <motion.div
              variants={fade}
              className="mt-8 flex flex-col gap-4 sm:flex-row"
            >
              <Link
                href="/login"
                className="group inline-flex items-center justify-center gap-5 rounded-full bg-black py-3 pl-3 pr-9 font-bold text-white shadow-2xl shadow-black/20 transition hover:-translate-y-0.5"
              >
                <span className="flex size-12 items-center justify-center rounded-full bg-[#ffe078] text-black">
                  <ShoppingBag className="size-5" />
                </span>
                Open Dashboard
                <ArrowRight className="size-4 transition group-hover:translate-x-1" />
              </Link>
            </motion.div>

            <motion.div
              variants={fade}
              className="mt-16 flex items-center gap-5"
            >
              <button
                type="button"
                aria-label="Previous product summary"
                className="hidden size-12 rounded-full bg-white shadow-xl shadow-black/10 sm:grid sm:place-items-center"
              >
                <ChevronLeft className="size-5" />
              </button>
              {productTabs.map(([label, value, color]) => (
                <div
                  key={label}
                  className={`rounded-full ${color} px-5 py-4 text-center shadow-xl shadow-black/5`}
                >
                  <div className="mx-auto mb-2 grid size-14 place-items-center rounded-full bg-white text-[#214f2d]">
                    <ShoppingBag className="size-6" />
                  </div>
                  <p className="text-sm font-bold text-zinc-800">{label}</p>
                  <p className="text-sm font-black text-black">{value}</p>
                </div>
              ))}
              <button
                type="button"
                aria-label="Next product summary"
                className="hidden size-12 rounded-full bg-white shadow-xl shadow-black/10 sm:grid sm:place-items-center"
              >
                <ChevronRight className="size-5" />
              </button>
            </motion.div>
          </div>

          <div className="relative min-h-155 lg:min-h-full">
            <motion.div
              animate={{ y: [0, -14, 0], rotate: [0, 1, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute left-2 top-24 z-20 h-108 w-108 overflow-hidden rounded-full sm:left-12 sm:h-132 sm:w-132 lg:left-0 lg:top-28"
            >
              <motion.div
                animate={{ rotate: spinDegrees, scale: [1, 0.94, 1] }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0"
              >
                <Image
                  src={dishSrc}
                  alt={dishAlt}
                  fill
                  unoptimized
                  priority={dishIndex === 0}
                  sizes="560px"
                  className="scale-125 object-cover"
                />
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.7 }}
              className="absolute bottom-2 left-24 z-10 rounded-[1.6rem] bg-linear-to-b from-[#f1a31b] to-[#f58205] p-7 pt-24 text-white shadow-2xl shadow-orange-900/20 sm:left-48 lg:left-36"
            >
              <div className="flex items-center gap-8">
                <h3 className="text-3xl font-black">Fresh Stock</h3>
                <span className="flex items-center gap-1 font-black">
                  <Star className="size-5 fill-white" /> 4.7
                </span>
              </div>
              <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-black px-7 py-3 font-bold">
                <Clock className="size-5" /> 10-18 mins
              </div>
            </motion.div>

            {[
              "right-24 top-48 size-9 rounded-full bg-[#ef3b25]",
              "right-24 bottom-56 h-10 w-14 rounded-[60%_40%_60%_40%] bg-[#4dae3c]",
              "right-32 bottom-28 h-4 w-24 rounded-full bg-[#ff2f1f]",
            ].map((shape, index) => (
              <motion.span
                key={shape}
                animate={{
                  y: [0, index % 2 ? 14 : -14, 0],
                  rotate: [0, 12, 0],
                }}
                transition={{
                  duration: 4 + index,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className={`absolute z-20 ${shape}`}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
