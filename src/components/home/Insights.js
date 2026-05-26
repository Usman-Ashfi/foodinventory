import { motion } from "framer-motion";
import { BarChart3, ReceiptText, TrendingUp } from "lucide-react";
import { fade } from "./animations";
import { insights } from "./data";
import Reveal from "./Reveal";

const bars = [42, 68, 54, 86, 72, 96, 78, 90];
const receiptRows = [
  ["Spinach bowls", "$4.8k"],
  ["Fresh stock saved", "34%"],
  ["Delivery demand", "+18%"],
];

export default function Insights() {
  return (
    <section id="insights" className="w-full overflow-hidden bg-white">
      <div className="grid min-h-180 lg:grid-cols-[1.1fr_0.9fr]">
        <Reveal className="relative overflow-hidden bg-[#153a20] px-7 py-16 text-white sm:px-12 lg:px-16">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,224,120,.2),transparent_30%),linear-gradient(rgba(255,255,255,.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.05)_1px,transparent_1px)] bg-size-[auto,36px_36px,36px_36px]" />
          <motion.div
            variants={fade}
            className="relative z-10 mx-auto max-w-4xl"
          >
            <div className="mb-8 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-white/45">
                  Analytics cockpit
                </p>
                <h3 className="mt-1 text-4xl font-black">This week</h3>
              </div>
              <span className="grid size-16 place-items-center rounded-full bg-[#ffe078] text-black">
                <BarChart3 className="size-8" />
              </span>
            </div>

            <div className="relative rounded-4xl bg-white/10 p-5 backdrop-blur-md">
              <motion.svg
                viewBox="0 0 720 260"
                className="absolute inset-x-5 top-8 h-52 w-[calc(100%-2.5rem)] text-[#ffe078]"
              >
                <motion.path
                  d="M18 204 C110 84 170 182 244 118 C320 52 382 168 452 92 C528 18 600 118 702 48"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="10"
                  strokeLinecap="round"
                  animate={{ pathLength: [0, 1, 1, 0] }}
                  transition={{
                    duration: 4.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    times: [0, 0.42, 0.78, 1],
                  }}
                />
              </motion.svg>
              <div className="relative z-10 flex h-72 items-end gap-3 rounded-3xl bg-black/10 p-5">
                {bars.map((height, index) => (
                  <motion.div
                    key={`insight-bar-${index}-${height}`}
                    animate={{
                      height: [
                        `${height}%`,
                        `${Math.max(28, height - 24)}%`,
                        `${Math.min(100, height + 10)}%`,
                        `${height}%`,
                      ],
                    }}
                    transition={{
                      duration: 3.2 + index * 0.12,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: index * 0.08,
                    }}
                    className="flex-1 rounded-t-full bg-white/75"
                  />
                ))}
              </div>
            </div>

            <motion.div
              variants={fade}
              className="mt-6 grid gap-4 sm:grid-cols-4"
            >
              {insights.map(([label, value, bg]) => (
                <div
                  key={label}
                  className={`${bg} rounded-full px-5 py-4 text-center text-black shadow-2xl shadow-black/10`}
                >
                  <p className="text-xs font-bold text-zinc-600">{label}</p>
                  <p className="mt-1 text-xl font-black">{value}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </Reveal>

        <Reveal className="relative flex flex-col justify-center px-7 py-16 sm:px-12 lg:px-16">
          <motion.div
            variants={fade}
            className="mb-5 inline-flex w-fit items-center gap-2 rounded-full bg-[#f8f3e7] px-4 py-2 text-sm font-bold text-[#886511]"
          >
            <TrendingUp className="size-4" />
            Live intelligence
          </motion.div>
          <motion.h2
            variants={fade}
            className="max-w-xl text-5xl font-black leading-[1.02] tracking-tight text-black sm:text-6xl"
          >
            Read the kitchen
            <span className="block font-light">like a receipt</span>
          </motion.h2>
          <motion.p
            variants={fade}
            className="mt-6 max-w-md text-base font-medium leading-7 text-zinc-500"
          >
            Sales, waste risk, customer activity, and delivery load collapse
            into clear signals your team can act on before the rush starts.
          </motion.p>

          <motion.div
            variants={fade}
            className="mt-10 max-w-md rounded-[1.8rem] bg-[#f6f3ed] p-5 shadow-2xl shadow-black/10"
          >
            <div className="mb-5 flex items-center justify-between">
              <span className="flex items-center gap-2 font-black text-black">
                <ReceiptText className="size-5 text-[#f1950c]" /> Insight
                receipt
              </span>
              <span className="rounded-full bg-black px-4 py-2 text-xs font-black text-white">
                LIVE
              </span>
            </div>
            <div className="space-y-3">
              {receiptRows.map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between rounded-full bg-white px-5 py-4"
                >
                  <span className="font-bold text-zinc-500">{label}</span>
                  <span className="font-black text-black">{value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </Reveal>
      </div>
    </section>
  );
}
