import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { fade } from "@features/home/utility/animations";
import Reveal from "./Reveal";

export default function CTA() {
  return (
    <section className="w-full overflow-hidden bg-[#f6f3ed]">
      <Reveal className="relative grid min-h-130 overflow-hidden lg:grid-cols-[1fr_0.9fr]">
        <div className="flex flex-col justify-center px-7 py-16 sm:px-12 lg:px-16">
          <motion.p
            variants={fade}
            className="text-sm font-black uppercase tracking-[0.28em] text-[#f1950c]"
          >
            Ready when you are
          </motion.p>
          <motion.h2
            variants={fade}
            className="mt-4 max-w-3xl text-5xl font-black leading-[1.02] tracking-tight text-black sm:text-6xl"
          >
            Bring your food operation
            <span className="block font-light">into one fresh workspace</span>
          </motion.h2>
          <motion.div
            variants={fade}
            className="mt-8 flex flex-col gap-4 sm:flex-row"
          >
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-5 rounded-full bg-black py-3 pl-3 pr-9 font-bold text-white shadow-2xl shadow-black/20"
            >
              <span className="grid size-12 place-items-center rounded-full bg-[#ffe078] text-black">
                <ShoppingBag className="size-5" />
              </span>
              Open dashboard <ArrowRight className="size-4" />
            </Link>
            <Link
              href="#modules"
              className="inline-flex items-center justify-center rounded-full bg-white px-8 py-4 font-bold text-black shadow-xl shadow-black/5"
            >
              Explore modules
            </Link>
          </motion.div>
        </div>
        <div className="relative hidden bg-[#153a20] lg:block">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_35%,rgba(255,224,120,.22),transparent_30%),linear-gradient(rgba(255,255,255,.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.05)_1px,transparent_1px)] bg-size-[auto,36px_36px,36px_36px]" />
          <motion.div
            animate={{ y: [0, -18, 0], rotate: [0, 2, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-16 top-24 rounded-4xl bg-[#ffe078] p-8 text-black shadow-2xl shadow-black/25"
          >
            <p className="text-sm font-bold text-black/55">FreshFlow score</p>
            <p className="mt-2 text-6xl font-black">97%</p>
          </motion.div>
          {["Stock synced", "Route assigned", "Report packed"].map(
            (item, index) => (
              <motion.div
                key={item}
                animate={{ x: [0, 18, 0], opacity: [0.72, 1, 0.72] }}
                transition={{
                  duration: 3.2,
                  repeat: Infinity,
                  delay: index * 0.45,
                  ease: "easeInOut",
                }}
                className="absolute right-14 rounded-full bg-white px-5 py-3 text-sm font-black text-black shadow-2xl shadow-black/20"
                style={{ top: `${130 + index * 78}px` }}
              >
                {item}
              </motion.div>
            ),
          )}
        </div>
      </Reveal>
    </section>
  );
}
