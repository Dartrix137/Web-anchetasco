import { SiteHeader } from "@/components/landing/site-header";
import { Hero } from "@/components/landing/hero";
import { WhatNext } from "@/components/landing/what-next";
import { Catalog } from "@/components/landing/catalog";
import { Configurator } from "@/components/landing/configurator";
import { PersonalizationBanner } from "@/components/landing/personalization-banner";
import { QuoteForm } from "@/components/landing/quote-form";
import { SuppliersSection } from "@/components/landing/suppliers-section";
import { ClosingSection } from "@/components/landing/closing-section";
import { LocationSection } from "@/components/landing/location-section";
import { SiteFooter } from "@/components/landing/site-footer";
import { QuoteBar } from "@/components/landing/quote-bar";
import { CompareTray } from "@/components/landing/compare-tray";
import { PersonalizationFloat } from "@/components/landing/personalization-float";
import { WhatsAppFloat } from "@/components/landing/whatsapp-float";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <WhatNext />
        <Catalog />
        <Configurator />
        <PersonalizationBanner />
        <QuoteForm />
        <SuppliersSection />
        <ClosingSection />
        <LocationSection />
      </main>
      <SiteFooter />
      <QuoteBar />
      <CompareTray />
      <PersonalizationFloat />
      <WhatsAppFloat />
    </div>
  );
}
