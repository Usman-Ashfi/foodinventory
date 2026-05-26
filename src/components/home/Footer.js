import Link from "next/link";
import { Search, ShoppingBag } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-white px-7 py-10 text-black sm:px-12 lg:px-16">
      <div className="grid gap-8 border-t border-black/10 pt-10 lg:grid-cols-[1fr_1.2fr_0.8fr]">
        <div>
          <Link href="/home" className="font-black tracking-tight text-3xl">
            fre<span className="text-[#e9291d]">s</span>h<span className="text-[#ffb300]">o</span>
          </Link>
          <p className="mt-4 max-w-xs text-sm font-medium leading-6 text-zinc-500">Smart food management for inventory, reports, customers, users, and deliveries.</p>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm font-bold sm:grid-cols-4">
          {[
            ["#modules", "Inventory"],
            ["#scanner", "Scanner"],
            ["#insights", "Insights"],
            ["#workflow", "Delivery"],
          ].map(([href, label]) => (
            <Link key={label} href={href} className="transition hover:text-[#f1950c]">
              {label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-4 lg:justify-end">
          <span className="grid size-11 place-items-center rounded-full bg-[#f6f3ed]"><Search className="size-5" /></span>
          <Link href="/login" className="inline-flex items-center gap-3 rounded-full bg-black py-2 pl-2 pr-5 text-sm font-bold text-white">
            <span className="grid size-9 place-items-center rounded-full bg-[#ffe078] text-black"><ShoppingBag className="size-4" /></span>
            login
          </Link>
        </div>
      </div>
    </footer>
  );
}
