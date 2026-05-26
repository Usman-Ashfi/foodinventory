import { motion } from "framer-motion";
import { ArrowRight, MapPin, Navigation } from "lucide-react";
import { fade } from "./animations";
import { steps } from "./data";
import Reveal from "./Reveal";

const positions = [
  "lg:left-[8%] lg:top-[18%]",
  "lg:left-[43%] lg:top-[54%]",
  "lg:right-[8%] lg:top-[24%]",
];

export default function Workflow() {
  return (
    <section id="workflow" className="w-full overflow-hidden bg-[#f6f3ed]">
      <div className="grid min-h-[720px] lg:grid-cols-[0.88fr_1.12fr]">
        <Reveal className="flex flex-col justify-center px-7 py-16 sm:px-12 lg:px-16">
          <motion.p variants={fade} className="text-sm font-black uppercase tracking-[0.28em] text-[#f1950c]">
            Operational flow
          </motion.p>
          <motion.h2 variants={fade} className="mt-4 max-w-xl text-5xl font-black leading-[1.02] tracking-tight text-black sm:text-6xl">
            Route every order
            <span className="block font-light">from shelf to door</span>
          </motion.h2>
          <motion.p variants={fade} className="mt-6 max-w-md text-base font-medium leading-7 text-zinc-500">
            FreshFlow turns receiving, serving, and dispatch into one live route so every team member knows what needs to move next.
          </motion.p>
          <motion.div variants={fade} className="mt-8 flex flex-wrap gap-4">
            <button className="inline-flex items-center gap-3 rounded-full bg-black px-7 py-4 font-bold text-white shadow-2xl shadow-black/20">
              View route <ArrowRight className="size-4" />
            </button>
            <div className="rounded-full bg-[#ffe078] px-6 py-4 text-center shadow-xl shadow-black/5">
              <p className="text-sm font-bold text-zinc-700">Live stops</p>
              <p className="font-black text-black">03</p>
            </div>
          </motion.div>
        </Reveal>

        <Reveal className="relative overflow-hidden bg-[#232832] px-7 py-16 text-white sm:px-12 lg:px-16">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,224,120,.18),transparent_28%),linear-gradient(rgba(255,255,255,.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.05)_1px,transparent_1px)] bg-size-[auto,36px_36px,36px_36px]" />
          <motion.svg variants={fade} viewBox="0 0 900 520" className="absolute inset-x-0 top-24 z-0 mx-auto h-[420px] w-[92%] text-[#ffe078]">
            <motion.path
              d="M80 120 C230 20 335 310 465 270 C610 225 625 80 810 150"
              fill="none"
              stroke="currentColor"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray="24 22"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.3, ease: "easeOut" }}
            />
          </motion.svg>
          <motion.div animate={{ x: ["0%", "58%", "100%"], y: [0, 180, 25], rotate: [0, 28, 0] }} transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }} className="absolute left-[8%] top-[25%] z-20 grid size-16 place-items-center rounded-full bg-[#ffe078] text-black shadow-2xl shadow-yellow-900/20">
            <Navigation className="size-7" />
          </motion.div>

          <div className="relative z-10 grid min-h-[560px] gap-5 lg:block">
            {steps.map(([title, copy, Icon], index) => (
              <motion.article
                key={title}
                variants={fade}
                whileHover={{ y: -8, rotate: index === 1 ? -1 : 1 }}
                className={`relative ${positions[index]} w-full rounded-[1.6rem] bg-white p-5 text-black shadow-2xl shadow-black/20 lg:absolute lg:w-72`}
              >
                <div className="mb-5 flex items-center justify-between">
                  <span className="grid size-14 place-items-center rounded-full bg-[#f6f3ed] text-[#f1950c]"><Icon className="size-7" /></span>
                  <span className="rounded-full bg-black px-4 py-2 text-xs font-black text-white">0{index + 1}</span>
                </div>
                <h3 className="text-2xl font-black">{title}</h3>
                <p className="mt-2 text-sm font-medium leading-6 text-zinc-500">{copy}</p>
              </motion.article>
            ))}
            <motion.div variants={fade} className="relative rounded-full bg-white/10 p-3 backdrop-blur-md lg:absolute lg:bottom-5 lg:left-6 lg:right-6">
              <div className="flex items-center justify-between rounded-full bg-white px-5 py-4 text-black">
                <span className="flex items-center gap-2 font-black"><MapPin className="size-5 text-[#f1950c]" /> Dispatch board</span>
                <span className="rounded-full bg-[#d9ffb9] px-4 py-2 text-sm font-black">On time</span>
              </div>
            </motion.div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
