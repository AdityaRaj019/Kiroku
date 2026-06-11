import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#0A0A0C] text-white flex flex-col">
      <Header />
      <main className="flex-grow">
        <Hero />
      </main>
    </div>
  );
}
