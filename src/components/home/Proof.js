import { motion } from "framer-motion";
import { ArrowUpRight, Quote } from "lucide-react";
import { fade } from "./animations";
import { proof } from "./data";
import Reveal from "./Reveal";

export default function Proof() {
  return (
    <section className="w-full overflow-hidden bg-white">
      <div className="grid min-h-[560px] lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal className="flex flex-col justify-center px-7 py-16 sm:px-12 lg:px-16">
          <motion.p variants={fade} className="text-sm font-black uppercase tracking-[0.28em] text-[#f1950c]">Proof of flow</motion.p>
          <motion.h2 variants={fade} className="mt-4 max-w-xl text-5xl font-black leading-[1.02] tracking-tight text-black sm:text-6xl">
            Less waste,
            <span className="block font-light">more control</span>
          </motion.h2>
          <motion.p variants={fade} className="mt-6 max-w-md text-base font-medium leading-7 text-zinc-500">
            Managers get cleaner decisions because every stock move, sale, and delivery update rolls into one shared source of truth.
          </motion.p>
        </Reveal>
        <Reveal className="relative flex items-center overflow-hidden bg-[#f6f3ed] px-7 py-16 sm:px-12 lg:px-16">
          <div className="absolute right-0 top-0 hidden h-full w-[42%] rounded-l-[48%] bg-[#232832] lg:block" />
          <div className="relative z-10 grid w-full gap-5 sm:grid-cols-3">
            {proof.map(([value, label], index) => (
              <motion.div key={label} variants={fade} whileHover={{ y: -10 }} className="rounded-[2rem] bg-white p-6 shadow-2xl shadow-black/10">
                <div className="mb-10 flex items-center justify-between">
                  <span className="grid size-12 place-items-center rounded-full bg-[#ffe078] text-black"><ArrowUpRight className="size-5" /></span>
                  <Quote className="size-6 text-zinc-300" />
                </div>
                <p className="text-5xl font-black text-black">{value}</p>
                <p className="mt-3 text-sm font-bold text-zinc-500">{label}</p>
                <motion.div initial={{ width: 0 }} whileInView={{ width: `${64 + index * 12}%` }} viewport={{ once: true }} transition={{ delay: index * 0.12, duration: 0.8 }} className="mt-6 h-2 rounded-full bg-black" />
              </motion.div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
