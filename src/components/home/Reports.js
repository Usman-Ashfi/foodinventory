import { motion } from "framer-motion";
import { CheckCircle2, FileBarChart, Printer } from "lucide-react";
import { fade } from "./animations";
import { reportItems } from "./data";
import Reveal from "./Reveal";

const reportRows = [["Gross sales", "$18.4k"], ["Waste alerts", "Low"], ["Orders closed", "316"]];

export default function Reports() {
  return (
    <section id="reports" className="w-full overflow-hidden bg-[#232832] text-white">
      <div className="grid min-h-[680px] lg:grid-cols-[1.06fr_0.94fr]">
        <Reveal className="relative flex items-center px-7 py-16 sm:px-12 lg:px-16">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_24%,rgba(255,224,120,.2),transparent_28%),linear-gradient(rgba(255,255,255,.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.05)_1px,transparent_1px)] bg-size-[auto,36px_36px,36px_36px]" />
          <motion.div variants={fade} className="relative z-10 w-full max-w-3xl rounded-[2rem] bg-white p-5 text-black shadow-2xl shadow-black/30">
            <div className="mb-5 flex items-center justify-between">
              <div><p className="text-sm font-bold text-zinc-400">Manager report</p><h3 className="mt-1 text-3xl font-black">Daily close</h3></div>
              <span className="grid size-14 place-items-center rounded-full bg-[#ffe078]"><FileBarChart className="size-7" /></span>
            </div>
            <div className="space-y-3">{reportRows.map(([label, value]) => <div key={label} className="flex items-center justify-between rounded-full bg-[#f6f3ed] px-5 py-4"><span className="font-bold text-zinc-500">{label}</span><span className="font-black">{value}</span></div>)}</div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">{reportItems.map((item) => <div key={item} className="flex items-center gap-3 rounded-2xl bg-black p-4 text-white"><CheckCircle2 className="size-5 text-[#ffe078]" /><span className="font-bold">{item}</span></div>)}</div>
            <div className="mt-5 rounded-[1.5rem] bg-[#f6f3ed] p-4">
              <div className="mb-3 flex items-center justify-between text-sm font-black">
                <span>Live sales pulse</span>
                <span className="text-[#f1950c]">+22%</span>
              </div>
              <div className="flex h-20 items-end gap-2">
                {[46, 62, 38, 76, 54, 86, 68, 92].map((height, index) => (
                  <motion.span
                    key={height}
                    animate={{ height: [`${height}%`, `${Math.min(height + 20, 100)}%`, `${height}%`] }}
                    transition={{ duration: 1.6, repeat: Infinity, delay: index * 0.12, ease: "easeInOut" }}
                    className="flex-1 rounded-full bg-[#f1950c]"
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </Reveal>
        <Reveal className="flex flex-col justify-center px-7 py-16 sm:px-12 lg:px-16">
          <motion.div variants={fade} className="mb-5 inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-[#ffe078]"><Printer className="size-4" /> Export ready</motion.div>
          <motion.h2 variants={fade} className="max-w-xl text-5xl font-black leading-[1.02] tracking-tight sm:text-6xl">
            Reports that
            <span className="block font-light">read themselves</span>
          </motion.h2>
          <motion.p variants={fade} className="mt-6 max-w-md text-base font-medium leading-7 text-white/55">
            Watch inventory risk, sales, customer activity, user actions, and deliveries update in one clean close-of-day surface.
          </motion.p>
        </Reveal>
      </div>
    </section>
  );
}
