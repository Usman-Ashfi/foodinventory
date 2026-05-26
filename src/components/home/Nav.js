import Link from "next/link";
import { motion } from "framer-motion";
import { Search, ShoppingBag } from "lucide-react";
import { fade } from "./animations";

export default function Nav() {
  return (
    <header className="sticky top-0 z-30 px-4 py-4 sm:px-6">
      <motion.nav
        variants={fade}
        initial="hidden"
        animate="visible"
        className="mx-auto flex h-16 max-w-7xl items-center justify-between rounded-4xl bg-white px-7 shadow-xl shadow-black/5 sm:px-12"
      >
        <Link
          href="/home"
          className="font-black tracking-tight text-2xl text-black"
        >
          fre<span className="text-[#e9291d]">s</span>h
          <span className="text-[#ffb300]">o</span>
        </Link>
        <div className="hidden items-center gap-10 text-sm font-bold text-black/80 md:flex">
          <Link href="#modules">Inventory</Link>
          <Link href="#reports">Reports</Link>
          <Link href="#scanner">Scanner</Link>
          <Link href="#workflow">Delivery</Link>
        </div>
        <div className="flex items-center gap-4 text-black">
          <Search className="hidden size-6 sm:block" />
          <span className="relative hidden sm:block">
            <ShoppingBag className="size-6" />
            <b className="absolute -right-3 -top-3 grid size-5 place-items-center rounded-full bg-red-600 text-xs text-white">
              2
            </b>
          </span>
          <Link
            href="/login"
            className="hidden rounded-full border border-black/15 px-5 py-3 font-bold md:inline-flex"
          >
            sign in
          </Link>
          <Link
            href="/login"
            className="rounded-full bg-[#ffe078] px-6 py-3 font-bold text-black shadow-lg shadow-black/10"
          >
            login
          </Link>
        </div>
      </motion.nav>
    </header>
  );
}
