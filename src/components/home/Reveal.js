import { motion } from "framer-motion";
import { stagger } from "./animations";

export default function Reveal({ children, className = "", once = true }) {
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-80px" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
