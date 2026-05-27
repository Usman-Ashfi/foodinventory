"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  LockKeyhole,
  PackageCheck,
  ShieldCheck,
  Sparkles,
  Truck,
  User,
} from "lucide-react";

const fade = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0 },
};

const signals = [
  ["Inventory sync", "1,284 items", PackageCheck, "bg-[#d9ffb9]"],
  ["Sales closed", "$18.4k", BarChart3, "bg-[#ffd7ec]"],
  ["Routes live", "42 stops", Truck, "bg-[#ffe5bd]"],
];

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Login failed");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#f6f3ed] text-black">
      <div className="grid min-h-screen lg:grid-cols-[0.94fr_1.06fr]">
        <section className="relative flex flex-col justify-between overflow-hidden bg-[#153a20] px-7 py-8 text-white sm:px-12 lg:px-16">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_18%,rgba(255,224,120,.24),transparent_28%),linear-gradient(rgba(255,255,255,.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.05)_1px,transparent_1px)] bg-size-[auto,36px_36px,36px_36px]" />
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fade}
            className="relative z-10 flex items-center justify-between"
          >
            <Link href="/home" className="font-black tracking-tight text-3xl">
              fre<span className="text-[#e9291d]">s</span>h
              <span className="text-[#ffb300]">o</span>
            </Link>
            <Link
              href="/home"
              className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-white"
            >
              <ArrowLeft className="size-4" />
              Home
            </Link>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            transition={{ staggerChildren: 0.1 }}
            className="relative z-10 my-16 max-w-xl"
          >
            <motion.div
              variants={fade}
              className="mb-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-[#886511]"
            >
              <Sparkles className="size-4" />
              Smart food workspace
            </motion.div>
            <motion.h1
              variants={fade}
              className="text-5xl font-black leading-[1.02] tracking-tight sm:text-6xl"
            >
              Sign in to run
              <span className="block font-light">the food flow</span>
            </motion.h1>
            <motion.p
              variants={fade}
              className="mt-6 max-w-md text-base font-medium leading-7 text-white/60"
            >
              Jump back into inventory, sales reports, customers, users, and
              delivery operations from one live control center.
            </motion.p>
          </motion.div>

          <div className="relative z-10 grid gap-4">
            {signals.map(([label, value, Icon, bg], index) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0, y: [0, index % 2 ? 8 : -8, 0] }}
                transition={{
                  opacity: { delay: 0.28 + index * 0.1, duration: 0.55 },
                  x: { delay: 0.28 + index * 0.1, duration: 0.55 },
                  y: {
                    delay: index * 0.2,
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }}
                className={`${bg} flex items-center justify-between rounded-full px-5 py-4 text-black shadow-2xl shadow-black/20`}
              >
                <span className="flex items-center gap-3 font-black">
                  <span className="grid size-12 place-items-center rounded-full bg-white">
                    <Icon className="size-6" />
                  </span>
                  {label}
                </span>
                <span className="text-sm font-black">{value}</span>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="relative flex items-center justify-center px-7 py-12 sm:px-12 lg:px-16">
          <motion.div
            animate={{ y: [0, -18, 0], rotate: [0, 1.5, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute right-10 top-10 hidden rounded-4xl bg-[#ffe078] p-5 shadow-2xl shadow-black/10 lg:block"
          >
            <p className="text-sm font-bold text-black/55">Protected</p>
            <p className="mt-1 text-3xl font-black">24/7</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="w-full max-w-md rounded-4xl bg-white p-5 shadow-2xl shadow-black/10"
          >
            <div className="rounded-3xl bg-[#f6f3ed] p-6">
              <div className="mb-7 flex items-center justify-between">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.24em] text-[#f1950c]">
                    Welcome back
                  </p>
                  <h2 className="mt-2 text-4xl font-black tracking-tight">
                    Login
                  </h2>
                </div>
                <span className="grid size-14 place-items-center rounded-full bg-[#153a20] text-white">
                  <ShieldCheck className="size-7" />
                </span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
                    {error}
                  </div>
                )}

                <label className="block">
                  <span className="text-sm font-black text-zinc-600">
                    Username
                  </span>
                  <span className="mt-2 flex items-center gap-3 rounded-full bg-white px-4 py-3 shadow-xl shadow-black/5">
                    <User className="size-5 text-[#f1950c]" />
                    <input
                      id="username"
                      name="username"
                      type="text"
                      required
                      autoComplete="username"
                      value={username}
                      onChange={(event) => setUsername(event.target.value)}
                      placeholder="admin"
                      className="w-full bg-transparent text-sm font-bold outline-none placeholder:text-zinc-400"
                    />
                  </span>
                </label>

                <label className="block">
                  <span className="text-sm font-black text-zinc-600">
                    Password
                  </span>
                  <span className="mt-2 flex items-center gap-3 rounded-full bg-white px-4 py-3 shadow-xl shadow-black/5">
                    <LockKeyhole className="size-5 text-[#f1950c]" />
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      autoComplete="current-password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="admin123"
                      className="w-full bg-transparent text-sm font-bold outline-none placeholder:text-zinc-400"
                    />
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={loading}
                  className="group mt-2 inline-flex w-full items-center justify-center gap-4 rounded-full bg-black py-3 pl-3 pr-6 font-bold text-white shadow-2xl shadow-black/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-55"
                >
                  <span className="grid size-12 place-items-center rounded-full bg-[#ffe078] text-black">
                    {loading ? (
                      <span className="size-5 animate-spin rounded-full border-4 border-black/20 border-t-black" />
                    ) : (
                      <LockKeyhole className="size-5" />
                    )}
                  </span>
                  {loading ? "Signing in..." : "Open dashboard"}
                  <ArrowRight className="size-4 transition group-hover:translate-x-1" />
                </button>
              </form>

              <div className="mt-5 rounded-2xl bg-white px-4 py-3 text-center text-xs font-bold text-zinc-500">
                Default login: <span className="text-black">admin</span> /{" "}
                <span className="text-black">admin123</span>
              </div>
            </div>
          </motion.div>
        </section>
      </div>
    </main>
  );
}
