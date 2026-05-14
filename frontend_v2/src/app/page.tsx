import Navbar from "@/components/Navbar";
import BackgroundEffect from "@/components/BackgroundEffect";
import HeroSection from "@/components/HeroSection";
import MultiAgentVisualizer from "@/components/MultiAgentVisualizer";
import FeaturesBento from "@/components/FeaturesBento";

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <BackgroundEffect />
      <Navbar />
      
      <HeroSection />
      
      {/* Decorative separator */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      <MultiAgentVisualizer />
      
      {/* Decorative separator */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      <FeaturesBento />

      <footer className="py-12 text-center border-t border-white/10 mt-32 glass">
        <p className="text-foreground-muted">© 2026 DualMind OS. All autonomous rights reserved.</p>
      </footer>
    </main>
  );
}
