"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import DashboardFloatingNav from "@features/dashboard/components/DashboardFloatingNav";
import Icon from "@shared/components/ui/Icon";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: "dashboard" },
  { label: "Inventory", href: "/dashboard/inventory", icon: "box" },
  { label: "Customers", href: "/dashboard/customers", icon: "users" },
  { label: "Orders", href: "/dashboard/orders", icon: "receipt" },
  { label: "Delivery", href: "/dashboard/deliveries", icon: "delivery" },
  { label: "Reports", href: "/dashboard/reports", icon: "report" },
  { label: "Users", href: "/dashboard/user", icon: "shield" },
];

const routeLabels = [
  ["/dashboard/inventory", "Inventory"],
  ["/dashboard/customers", "Customer management"],
  ["/dashboard/orders", "Order management"],
  ["/dashboard/deliveries", "Delivery tracking"],
  ["/dashboard/reports", "Reports"],
  ["/dashboard/user", "User management"],
  ["/dashboard", "Inventory command center"],
];

const sidebarMotion = {
  hidden: { opacity: 0, x: -28 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], staggerChildren: 0.05 },
  },
};

const itemMotion = {
  hidden: { opacity: 0, x: -12 },
  visible: { opacity: 1, x: 0 },
};

const liquidMove = { duration: 0.38, ease: [0.22, 1, 0.36, 1] };
const navItemHeight = 48;
const navItemGap = 8;
let hasPlayedSidebarIntro = false;
let lastLiquidIndex = null;
let pendingLiquidHref = null;

function getActiveHref(pathname) {
  return navItems.find((item) => pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href)))?.href || "/dashboard";
}

function getActiveIndex(activeHref) {
  return Math.max(0, navItems.findIndex((item) => item.href === activeHref));
}

function getRouteLabel(pathname) {
  return routeLabels.find(([href]) => pathname === href || (href !== "/dashboard" && pathname.startsWith(href)))?.[1] || "Workspace";
}

export function BrandMark({ label = "Operations" }) {
  return (
    <Link href="/dashboard" className="flex items-center gap-3">
      <span className="grid size-11 place-items-center rounded-full bg-[#ffe078] text-[#153a20] shadow-xl shadow-black/10">
        <Icon name="box" />
      </span>
      <span>
        <span className="block text-2xl font-black leading-none tracking-tight text-white">
          fre<span className="text-[#e9291d]">s</span>h
          <span className="text-[#ffb300]">o</span>
        </span>
        <span className="mt-1 block text-xs font-bold text-white/50">
          {label}
        </span>
      </span>
    </Link>
  );
}

function SidebarLink({ item, activeHref, onActivate }) {
  const isActive = activeHref === item.href;

  return (
    <Link
      href={item.href}
      onClick={() => onActivate(item.href)}
      className={`group relative z-10 flex h-12 items-center gap-4 rounded-full px-4 text-sm font-bold transition-colors ${isActive ? "text-[#153a20]" : "text-white/72 hover:text-white"}`}
    >
      <span className="flex items-center gap-4">
        <Icon name={item.icon} className="size-5" />
        <span>{item.label}</span>
      </span>
      {isActive && (
        <span className="ml-auto size-2 rounded-full bg-[#f1950c]" />
      )}
    </Link>
  );
}

export default function DashboardShell({ user, label, children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [shellUser, setShellUser] = useState(user || null);
  const [activeHref, setActiveHref] = useState(
    () => pendingLiquidHref || getActiveHref(pathname),
  );
  const [skipSidebarIntro, setSkipSidebarIntro] = useState(hasPlayedSidebarIntro);
  const activeIndex = getActiveIndex(activeHref);
  const [pillStartIndex] = useState(() => lastLiquidIndex ?? activeIndex);
  const currentLabel = label || getRouteLabel(pathname);
  const currentUser = user || shellUser;

  function activateLink(href) {
    if (href !== activeHref) {
      lastLiquidIndex = activeIndex;
      pendingLiquidHref = href;
    }
    setActiveHref(href);
  }

  useEffect(() => {
    const href = getActiveHref(pathname);

    if (pendingLiquidHref && href !== pendingLiquidHref) {
      setActiveHref(pendingLiquidHref);
      return;
    }

    pendingLiquidHref = null;
    setActiveHref(href);
  }, [pathname]);

  useEffect(() => {
    if (user) {
      setShellUser(user);
      return;
    }

    let active = true;
    fetch("/api/me")
      .then((response) => response.json())
      .then((data) => {
        if (!active) return;
        if (data.user) setShellUser(data.user);
        else router.push("/login");
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, [router, user]);

  async function logout() {
    await fetch("/api/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <div className="flex h-screen bg-[#153a20]">
      <motion.aside
        variants={sidebarMotion}
        initial={skipSidebarIntro ? false : "hidden"}
        animate="visible"
        onAnimationComplete={() => {
          hasPlayedSidebarIntro = true;
          setSkipSidebarIntro(true);
        }}
        className="hidden h-screen w-72 shrink-0 flex-col justify-between overflow-auto bg-[#153a20] px-7 py-7 text-white lg:flex"
      >
        <div>
          <BrandMark label={currentLabel} />
          <nav
            aria-label="Dashboard sidebar"
            className="relative mt-14 grid gap-2"
          >
            <motion.span
              aria-hidden="true"
              initial={{ y: pillStartIndex * (navItemHeight + navItemGap) }}
              animate={{ y: activeIndex * (navItemHeight + navItemGap) }}
              transition={liquidMove}
              onAnimationComplete={() => {
                lastLiquidIndex = activeIndex;
              }}
              className="absolute inset-x-0 top-0 h-12 rounded-full bg-white shadow-xl shadow-black/15"
            />
            <motion.span
              aria-hidden="true"
              initial={{ y: pillStartIndex * (navItemHeight + navItemGap) }}
              animate={{ y: activeIndex * (navItemHeight + navItemGap) }}
              transition={liquidMove}
              className="absolute -inset-x-2 top-0 h-12 rounded-full bg-[#ffe078]/25 blur-md"
            />
            {navItems.map((item) => (
              <motion.div key={item.href} variants={itemMotion}>
                <SidebarLink
                  item={item}
                  activeHref={activeHref}
                  onActivate={activateLink}
                />
              </motion.div>
            ))}
          </nav>
        </div>

        <motion.div variants={itemMotion}>
          <button
            type="button"
            onClick={logout}
            className="inline-flex w-full items-center justify-center gap-3 rounded-full bg-white px-5 py-3 text-sm font-black text-[#153a20] shadow-xl shadow-black/15 transition hover:-translate-y-0.5"
          >
            <Icon name="logout" className="size-4" />
            Logout
          </button>
        </motion.div>
      </motion.aside>

      <div className="min-w-0 flex-1 bg-[#f8faf7] overflow-auto rounded-l-4xl border shadow-md shadow-white">
        <header className="sticky top-0 z-30 border-b border-black/5 bg-[#f8faf7]/90 backdrop-blur">
          <div className="flex h-20 items-center justify-between gap-4 px-5 sm:px-7 lg:px-9">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-[#f1950c]">
                Workspace
              </p>
              <motion.h1
                key={pathname}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="mt-1 text-xl font-black tracking-tight text-black"
              >
                {currentLabel}
              </motion.h1>
            </div>
            <div className="hidden h-11 max-w-xs flex-1 items-center gap-3 rounded-full bg-white px-4 text-sm font-bold text-zinc-400 shadow-xl shadow-black/5 md:flex">
              <Icon name="search" className="size-4" />
              Search workspace...
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-black text-black">
                  {currentUser?.fullName || currentUser?.username}
                </p>
                <p className="text-xs font-bold capitalize text-zinc-400">
                  {currentUser?.role || "user"}
                </p>
              </div>
              <div className="grid size-11 place-items-center rounded-full bg-[#153a20] text-sm font-black uppercase text-white ring-4 ring-[#d9ffb9]">
                {(currentUser?.fullName || currentUser?.username || "U").charAt(0)}
              </div>
            </div>
          </div>
        </header>
        <div>{children}</div>
      </div>
      <DashboardFloatingNav />
    </div>
  );
}
