"use client";

import CTA from "./CTA";
import Footer from "./Footer";
import Hero from "./Hero";
import Insights from "./Insights";
import Modules from "./Modules";
import Nav from "./Nav";
import ProductScanner from "./ProductScanner";
import Proof from "./Proof";
import Reports from "./Reports";
import Security from "./Security";
import Workflow from "./Workflow";

export default function HomeLanding() {
  return (
    <main className="min-h-screen text-[#153a20]">
      <Nav />
      <Hero />
      <ProductScanner />
      <Modules />
      <Workflow />
      <Security />
      <Insights />
      <Reports />
      <CTA />
      <Footer />
    </main>
  );
}
