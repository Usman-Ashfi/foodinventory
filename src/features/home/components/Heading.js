import { motion } from "framer-motion";
import { fade } from "@features/home/utility/animations";
import Reveal from "./Reveal";

export default function Heading({ label, title, text, light = false }) {
  return (
    <Reveal className="mx-auto max-w-3xl text-center">
      <motion.p
        variants={fade}
        className={`text-sm font-black uppercase tracking-[0.28em] ${light ? "text-[#cde8a9]" : "text-[#69904d]"}`}
      >
        {label}
      </motion.p>
      <motion.h2
        variants={fade}
        className={`mt-4 font-serif text-4xl font-black sm:text-5xl ${light ? "text-white" : "text-[#153a20]"}`}
      >
        {title}
      </motion.h2>
      {text && (
        <motion.p
          variants={fade}
          className={`mt-5 text-lg leading-8 ${light ? "text-[#dcecd0]" : "text-[#58735b]"}`}
        >
          {text}
        </motion.p>
      )}
    </Reveal>
  );
}
