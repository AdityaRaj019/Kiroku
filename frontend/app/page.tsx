import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { TopManga } from "@/components/landing/TopManga";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#0A0A0C] text-white flex flex-col">
      <Header />
      <main className="flex-grow">
        <Hero />
        <Features />
        <TopManga />
      </main>
    </div>
  );
}
