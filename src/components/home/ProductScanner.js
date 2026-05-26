import { motion } from "framer-motion";
import { ArrowRight, Boxes, ScanLine, Sparkles } from "lucide-react";
import { fade } from "./animations";
import { products } from "./data";
import Reveal from "./Reveal";

const scanStyles = [
  ["bg-[#d9ffb9]", "text-[#376400]", "82%"],
  ["bg-[#ffd7ec]", "text-[#8f2759]", "58%"],
  ["bg-[#ffe5bd]", "text-[#8b5200]", "91%"],
  ["bg-[#d7efff]", "text-[#075985]", "44%"],
];

function ProductChip({ item, index }) {
  const [name, meta, state] = item;
  const [bg, text, width] = scanStyles[index];
  return (
    <motion.div
      variants={fade}
      animate={{
        y: [0, index % 2 ? 10 : -10, 0],
        rotate: [0, index % 2 ? -1 : 1, 0],
      }}
      transition={{
        duration: 4 + index * 0.4,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={`relative overflow-hidden rounded-full ${bg} px-5 py-4 shadow-2xl shadow-black/10`}
    >
      <div className="flex items-center gap-4">
        <span className="grid size-14 shrink-0 place-items-center rounded-full bg-white shadow-lg shadow-black/5">
          <Boxes className={`size-6 ${text}`} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-black text-black">{name}</h3>
            <span
              className={`rounded-full bg-white/70 px-3 py-1 text-xs font-black ${text}`}
            >
              {state}
            </span>
          </div>
          <p className="mt-1 text-xs font-semibold text-zinc-700">{meta}</p>
          <div className="mt-3 h-2 rounded-full bg-white/55">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.12, duration: 0.8 }}
              className="h-full rounded-full bg-black"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function ProductScanner() {
  return (
    <section id="scanner" className="w-full overflow-hidden bg-white">
      <div className="grid min-h-170 lg:grid-cols-[1.06fr_0.94fr]">
        <Reveal className="flex flex-col justify-center px-7 py-16 sm:px-12 lg:px-16">
          <motion.div
            variants={fade}
            className="mb-5 inline-flex w-fit items-center gap-2 rounded-full bg-[#f8f3e7] px-4 py-2 text-sm font-bold text-[#886511]"
          >
            <Sparkles className="size-4" />
            AI stock scanner
          </motion.div>
          <motion.h2
            variants={fade}
            className="max-w-xl text-5xl font-black leading-[1.02] tracking-tight text-black sm:text-6xl"
          >
            Scan every dish
            <span className="block font-light">before it slows you down</span>
          </motion.h2>
          <motion.p
            variants={fade}
            className="mt-6 max-w-md text-base font-medium leading-7 text-zinc-400"
          >
            Products move from receiving to sales and delivery with live
            freshness scores, batch IDs, and low-stock alerts surfaced like a
            fast food command deck.
          </motion.p>
          <motion.div
            variants={fade}
            className="mt-8 flex flex-col gap-4 sm:flex-row"
          >
            <button
              type="button"
              className="inline-flex items-center justify-center gap-3 rounded-full bg-black px-7 py-4 font-bold text-white shadow-2xl shadow-black/20"
            >
              Run scanner <ArrowRight className="size-4" />
            </button>
            <div className="rounded-full bg-[#d9ffb9] px-6 py-4 text-center shadow-xl shadow-black/5">
              <p className="text-sm font-bold text-zinc-700">Accuracy</p>
              <p className="font-black text-black">97%</p>
            </div>
          </motion.div>
        </Reveal>

        <Reveal className="relative flex items-center overflow-hidden px-7 py-16 sm:px-12 lg:px-16">
          <div className="absolute left-0 top-0 hidden h-full w-[44%] bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,.16),transparent_34%),linear-gradient(rgba(255,255,255,.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.05)_1px,transparent_1px)] bg-size-[auto,34px_34px,34px_34px] lg:block" />
          <motion.div
            variants={fade}
            className="relative z-10 w-full max-w-3xl rounded-4xl bg-[#153a20] p-5 shadow-2xl shadow-black/20 lg:ml-10"
          >
            <div className="mb-5 flex items-center justify-between text-white">
              <div>
                <p className="text-sm font-bold text-white/45">Scanner feed</p>
                <h3 className="mt-1 text-3xl font-black">Product signals</h3>
              </div>
              <span className="grid size-14 place-items-center rounded-full bg-[#ffe078] text-black">
                <ScanLine className="size-7" />
              </span>
            </div>
            <div className="relative overflow-hidden rounded-[1.6rem] bg-[rgba(255,255,255,.08)] p-4">
              <motion.div
                animate={{ y: [0, 360, 0] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute left-4 right-4 top-4 z-20 h-px bg-[#ffe078] shadow-[0_0_30px_10px_rgba(255,224,120,.35)]"
              />
              <div className="relative z-10 grid gap-4">
                {products.map((item, index) => (
                  <ProductChip key={item[0]} item={item} index={index} />
                ))}
              </div>
            </div>
          </motion.div>
        </Reveal>
      </div>
    </section>
  );
}
