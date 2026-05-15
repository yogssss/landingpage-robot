'use client'

import React, { useState, useEffect, useRef, Suspense, lazy } from "react"
// Tambahkan 'X' untuk icon tutup menu
import { Layout, Server, PenTool, ArrowUpRight, Mail, Code, Globe, User, Menu, X, Volume2, VolumeX } from "lucide-react"
// Tambahkan 'AnimatePresence' untuk animasi menu keluar-masuk
import { motion, useScroll, useTransform, MotionValue, AnimatePresence } from "framer-motion"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// --- UTILS ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// --- COMPONENT: BACKGROUND MUSIC ---
const BackgroundMusic = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.2;
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  }, []);

  const toggleMute = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <>
      <audio ref={audioRef} src="/backsound.mp3" loop />
      <button
        onClick={toggleMute}
        className="fixed bottom-6 right-6 z-[110] p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-full transition-all duration-300 shadow-lg text-white pointer-events-auto"
      >
        {isPlaying ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
      </button>
    </>
  );
};

// --- COMPONENT: SPLINE SCENE ---
function SplineScene({ scene, className }: { scene: string; className?: string }) {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const splineViewerUrl = "https://unpkg.com/@splinetool/viewer@1.9.5/build/spline-viewer.js"
    if (!document.querySelector(`script[src="${splineViewerUrl}"]`)) {
      const script = document.createElement("script")
      script.type = "module"
      script.src = splineViewerUrl
      document.body.appendChild(script)
    }
    const timer = setTimeout(() => setLoading(false), 1500)

    const removeLogoInterval = setInterval(() => {
      const viewer = document.querySelector('spline-viewer');
      if (viewer && viewer.shadowRoot) {
        const logo = viewer.shadowRoot.querySelector('#logo');
        if (logo) {
          logo.remove();
          clearInterval(removeLogoInterval);
        }
      }
    }, 500);

    return () => {
      clearTimeout(timer);
      clearInterval(removeLogoInterval);
    }
  }, [scene])

  return (
    <div className={cn("w-full h-full relative rounded-2xl overflow-hidden", className)}>
      <style>{`spline-viewer::part(logo) { display: none !important; }`}</style>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <div 
        className="absolute inset-0 z-10 w-full h-full [&>spline-viewer]:w-full [&>spline-viewer]:h-full"
        dangerouslySetInnerHTML={{ __html: `<spline-viewer url="${scene}" events-target="global"></spline-viewer>` }}
      />
    </div>
  )
}

// --- MAIN PAGE ---
export default function Home() {
  const [mounted, setMounted] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false) // State untuk kontrol menu mobile

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-purple-500/30 overflow-x-hidden relative">
      <BackgroundMusic />

      {/* Navbar Floating Bubble */}
      <div className="fixed top-6 left-0 right-0 z-[120] flex justify-center px-4 pointer-events-none">
        <div className="relative flex flex-col items-center">
          <nav className="pointer-events-auto bg-[#111111]/90 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3.5 flex items-center shadow-[0_4px_12px_rgba(0,0,0,0.6)] transition-all duration-300">
            {/* Logo */}
            <a href="#home" className="text-base font-bold tracking-tight text-white pr-2">
              Gurur<span className="text-purple-500">.</span>
            </a>
            
            <div className="w-[1px] h-5 bg-white/15 mx-4"></div>
            
            {/* Desktop Links */}
            <div className="hidden md:flex items-center space-x-6 text-sm font-medium text-gray-400">
              <a href="#home" className="hover:text-white transition-colors">Home</a>
              <a href="#projects" className="hover:text-white transition-colors">Projects</a>
              <a href="#skills" className="hover:text-white transition-colors">Skills</a>
              <a href="#contact" className="text-white hover:text-purple-400 transition-colors font-bold tracking-wide">Talk</a>
            </div>

            {/* Tombol Toggle Mobile */}
            <div className="md:hidden flex items-center">
               <a href="#contact" className="text-white text-xs font-bold mr-4 bg-white/5 px-3 py-1 rounded-full border border-white/5">Talk</a>
               <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white p-1 focus:outline-none"
               >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
               </button>
            </div>
          </nav>

          {/* Mobile Dropdown Menu (Muncul pas di-klik) */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div 
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 12, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                className="absolute top-full bg-[#111111]/95 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-6 flex flex-col space-y-4 pointer-events-auto shadow-2xl min-w-[200px] md:hidden"
              >
                <a href="#home" onClick={() => setIsMenuOpen(false)} className="text-gray-400 hover:text-white text-lg font-medium">Home</a>
                <a href="#projects" onClick={() => setIsMenuOpen(false)} className="text-gray-400 hover:text-white text-lg font-medium">Projects</a>
                <a href="#skills" onClick={() => setIsMenuOpen(false)} className="text-gray-400 hover:text-white text-lg font-medium">Skills</a>
                <hr className="border-white/5" />
                <a href="#contact" onClick={() => setIsMenuOpen(false)} className="text-white font-bold text-lg">Contact Me</a>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="relative z-10 pt-28 pb-10">
        {/* HERO SECTION */}
        <section id="home" className="px-6 max-w-7xl mx-auto flex items-center justify-center min-h-[80vh] md:min-h-[90vh]">
          <div className="w-full mt-10 md:mt-0">
            <div className="w-full min-h-[700px] md:min-h-[600px] h-auto bg-black/[0.96] relative overflow-hidden border-white/10 rounded-[2.5rem] flex flex-col md:flex-row border">
              
              {/* Teks Content */}
              <div className="flex-1 p-8 md:p-12 relative z-10 flex flex-col justify-center order-2 md:order-1">
                <div className="inline-flex items-center px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-6 text-xs text-gray-300 w-fit">
                    <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                    Available for work
                </div>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 leading-tight">
                  Crafting digital <br className="hidden sm:block" /> experiences.
                </h1>
                <p className="mt-6 text-neutral-400 max-w-lg text-base md:text-lg leading-relaxed">
                  I'm a creative developer focusing on building interactive, functional, and visually stunning web applications.
                </p>
                <div className="mt-8 flex gap-4">
                  <a href="#projects" className="px-8 py-3 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition-all text-sm shadow-xl shadow-white/5">
                      View Work
                  </a>
                </div>
              </div>

              {/* 3D Robot Content */}
              <div className="w-full h-[400px] md:h-auto md:flex-1 relative order-1 md:order-2">
                <SplineScene 
                  scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>
        </section>
      </div>
      
      {/* Footer atau Section lain bisa lu tambahin di bawah sini */}
    </main>
  )
}
