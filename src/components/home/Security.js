import { motion } from "framer-motion";
import {
  ArrowRight,
  Fingerprint,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";
import { fade } from "./animations";
import { roles } from "./data";
import Reveal from "./Reveal";

const permissions = ["Inventory", "Reports", "Orders", "Delivery"];
const colors = ["bg-[#d9ffb9]", "bg-[#ffd7ec]", "bg-[#ffe5bd]", "bg-[#d7efff]"];

export default function Security() {
  return (
    <section
      id="security"
      className="relative w-full overflow-hidden bg-[#153a20]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_18%,rgba(255,224,120,.2),transparent_28%),linear-gradient(rgba(255,255,255,.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.05)_1px,transparent_1px)] bg-size-[auto,36px_36px,36px_36px]" />

      <div className="grid min-h-180 lg:grid-cols-[0.96fr_1.04fr]">
        <Reveal className="flex flex-col justify-center px-7 py-16 sm:px-12 lg:px-16">
          <motion.div
            variants={fade}
            className="mb-5 inline-flex w-fit items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-[#886511]"
          >
            <ShieldCheck className="size-4" />
            Team security
          </motion.div>
          <motion.h2
            variants={fade}
            className="max-w-xl text-5xl font-black leading-[1.02] tracking-tight text-white sm:text-6xl"
          >
            Let teams in
            <span className="block font-light">without opening everything</span>
          </motion.h2>
          <motion.p
            variants={fade}
            className="mt-6 max-w-md text-base font-medium leading-7 text-zinc-500"
          >
            Owners keep sensitive reports protected while cashiers, managers,
            and dispatchers get the exact food workflows they need.
          </motion.p>
          <motion.div variants={fade} className="mt-8 flex flex-wrap gap-4">
            <button
              type="button"
              className="inline-flex items-center gap-3 rounded-full bg-black px-7 py-4 font-bold text-white shadow-2xl shadow-black/20"
            >
              Configure roles <ArrowRight className="size-4" />
            </button>
            <div className="rounded-full bg-[#ffe078] px-6 py-4 text-center shadow-xl shadow-black/5">
              <p className="text-sm font-bold text-zinc-700">Protected</p>
              <p className="font-black text-black">24/7</p>
            </div>
          </motion.div>
        </Reveal>

        <Reveal className="relative overflow-hidden px-7 py-16 text-white sm:px-12 lg:px-16">
          <motion.div
            variants={fade}
            className="relative z-10 mx-auto max-w-4xl"
          >
            <div className="mb-7 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-white/45">Access matrix</p>
                <h3 className="mt-1 text-4xl font-black">User control</h3>
              </div>
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="grid size-16 place-items-center rounded-full bg-[#ffe078] text-black"
              >
                <Fingerprint className="size-8" />
              </motion.span>
            </div>

            <div className="grid gap-5 lg:grid-cols-[0.82fr_1.18fr]">
              <div className="relative min-h-72 rounded-4xl bg-white/10 p-6 backdrop-blur-md">
                <motion.div
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{
                    duration: 2.4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-8 rounded-full border border-[#ffe078]/25"
                />
                <motion.div
                  animate={{ scale: [1.08, 1, 1.08] }}
                  transition={{
                    duration: 2.4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-16 rounded-full border border-white/20"
                />
                <div className="absolute inset-0 grid place-items-center">
                  <div className="grid size-28 place-items-center rounded-full bg-white text-black shadow-2xl shadow-black/20">
                    <LockKeyhole className="size-12" />
                  </div>
                </div>
              </div>

              <div className="grid gap-4">
                {roles.map(([role, copy], index) => (
                  <motion.div
                    key={role}
                    variants={fade}
                    whileHover={{ x: 8 }}
                    className={`${colors[index]} rounded-full px-5 py-4 text-black shadow-2xl shadow-black/10`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h4 className="font-black">{role}</h4>
                        <p className="mt-1 text-xs font-semibold text-zinc-700">
                          {copy}
                        </p>
                      </div>
                      <span className="rounded-full bg-white px-4 py-2 text-xs font-black">
                        Active
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div
              variants={fade}
              className="mt-6 rounded-[1.8rem] bg-white p-5 text-black shadow-2xl shadow-black/15"
            >
              <div className="grid gap-3 sm:grid-cols-4">
                {permissions.map((item, index) => (
                  <div
                    key={item}
                    className="rounded-2xl bg-[#f6f3ed] p-4 text-center"
                  >
                    <p className="text-xs font-bold text-zinc-500">{item}</p>
                    <p className="mt-1 font-black">
                      {index === 1 ? "Private" : "Allowed"}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </Reveal>
      </div>
    </section>
  );
}
