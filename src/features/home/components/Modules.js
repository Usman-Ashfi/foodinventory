import { motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { fade } from "@features/home/utility/animations";
import { modules } from "@features/home/utility/data";
import Reveal from "./Reveal";

const cardStyles = [
  ["bg-[#d9ffb9]", "text-[#376400]", "72%"],
  ["bg-[#ffd7ec]", "text-[#8f2759]", "86%"],
  ["bg-[#ffe5bd]", "text-[#8b5200]", "64%"],
  ["bg-[#d7efff]", "text-[#075985]", "78%"],
];

function ModuleCard({ item, index }) {
  const [title, copy, Icon] = item;
  const [bg, text, width] = cardStyles[index];
  return (
    <motion.article
      variants={fade}
      whileHover={{ y: -10, rotate: index % 2 ? 1.5 : -1.5 }}
      className={`group relative overflow-hidden rounded-full ${bg} px-6 py-5 shadow-2xl shadow-black/10`}
    >
      <div className="flex items-center gap-4">
        <div className="grid size-16 shrink-0 place-items-center rounded-full bg-white shadow-lg shadow-black/5">
          <Icon className={`size-7 ${text}`} />
        </div>
        <div className="min-w-0">
          <h3 className="text-lg font-black text-black">{title}</h3>
          <p className="mt-1 max-h-10 overflow-hidden text-xs font-semibold leading-5 text-zinc-700">
            {copy}
          </p>
        </div>
      </div>
      <div className="mt-4 h-2 rounded-full bg-white/55">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width }}
          viewport={{ once: true }}
          transition={{ delay: 0.12 * index, duration: 0.8 }}
          className="h-full rounded-full bg-black"
        />
      </div>
    </motion.article>
  );
}

export default function Modules() {
  return (
    <section id="modules">
      <div className="w-full overflow-hidden bg-white py-20 shadow-2xl shadow-black/10 ">
        <div className="grid gap-10 lg:grid-cols-[1.14fr_0.86fr] lg:items-center">
          <Reveal className="relative">
            <div className="absolute left-0 top-0 hidden h-full w-[55%] rounded-r-[48%] bg-[#153a20] lg:block" />
            <motion.div
              variants={fade}
              className="relative grid gap-5 sm:grid-cols-2"
            >
              {modules.map((item, index) => (
                <ModuleCard key={item[0]} item={item} index={index} />
              ))}
            </motion.div>
            <motion.div
              variants={fade}
              className="relative mt-6 rounded-4xl bg-[#153a20] p-6 text-white shadow-2xl shadow-black/15"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-white/45">
                    Connected today
                  </p>
                  <h3 className="mt-1 text-3xl font-black">1,284 items</h3>
                </div>
                <span className="rounded-full bg-[#ffe078] px-5 py-3 font-black text-black">
                  Live
                </span>
              </div>
              <div className="mt-6 grid grid-cols-3 gap-3">
                {["Stock", "Sales", "Routes"].map((label) => (
                  <div
                    key={label}
                    className="rounded-2xl bg-white/10 p-4 text-center"
                  >
                    <p className="text-xs font-bold text-white/50">{label}</p>
                    <p className="mt-1 font-black">Active</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </Reveal>
          <Reveal className="px-6">
            <motion.p
              variants={fade}
              className="text-sm font-black uppercase tracking-[0.28em] text-[#f1950c]"
            >
              App modules
            </motion.p>
            <motion.h2
              variants={fade}
              className="mt-4 max-w-xl text-5xl font-black leading-[1.02] tracking-tight text-black sm:text-6xl"
            >
              Pick the workflow
              <span className="block font-light">your team needs</span>
            </motion.h2>
            <motion.p
              variants={fade}
              className="mt-6 max-w-md text-base font-medium leading-7 text-zinc-400"
            >
              Every module feels like a menu item: quick to scan, simple to
              open, and connected to the same live food operation data.
            </motion.p>
            <motion.div
              variants={fade}
              className="mt-8 flex items-center gap-4"
            >
              <button
                type="button"
                aria-label="Previous module"
                className="grid size-12 place-items-center rounded-full bg-white shadow-xl shadow-black/10"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-3 rounded-full bg-black px-7 py-4 font-bold text-white shadow-2xl shadow-black/20"
              >
                Explore modules <ArrowRight className="size-4" />
              </button>
              <button
                type="button"
                aria-label="Next module"
                className="grid size-12 place-items-center rounded-full bg-white shadow-xl shadow-black/10"
              >
                <ChevronRight className="size-5" />
              </button>
            </motion.div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
