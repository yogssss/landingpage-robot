'use client'

import React, { useState, useEffect, useRef, Suspense, lazy, memo } from "react"
import { 
  Layout, Server, PenTool, ArrowUpRight, Mail, Code, Globe, User, 
  Menu, X, Volume2, VolumeX, Github, Twitter, Linkedin, Sparkles, ArrowRight 
} from "lucide-react"
import { motion, useScroll, useTransform, MotionValue, AnimatePresence } from "framer-motion"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// --- UTILS ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// --- OPTIMIZED COMPONENT: BACKGROUND MUSIC ---
const BackgroundMusic = memo(() => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.15;
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      }
    }
  }, []);

  const toggleMute = () => {
    if (audioRef.current) {
      if (isPlaying) { audioRef.current.pause(); } 
      else { audioRef.current.play(); }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <>
      <audio ref={audioRef} src="/backsound.mp3" loop />
      <button
        onClick={toggleMute}
        className="fixed bottom-6 right-6 z-[130] p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-full transition-transform active:scale-95 text-white pointer-events-auto shadow-lg"
      >
        {isPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
      </button>
    </>
  );
});
BackgroundMusic.displayName = "BackgroundMusic";

// --- OPTIMIZED COMPONENT: SPLINE SCENE ---
const SplineScene = memo(({ scene, className }: { scene: string; className?: string }) => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const splineViewerUrl = "https://unpkg.com/@splinetool/viewer@1.9.5/build/spline-viewer.js"
    if (!window.customElements.get('spline-viewer')) {
      const script = document.createElement("script")
      script.type = "module"
      script.src = splineViewerUrl
      document.body.appendChild(script)
    }
    const timer = setTimeout(() => setLoading(false), 1000)

    const removeLogoInterval = setInterval(() => {
      const viewer = document.querySelector('spline-viewer');
      if (viewer?.shadowRoot) {
        const logo = viewer.shadowRoot.querySelector('#logo');
        if (logo) {
          (logo as HTMLElement).style.display = 'none';
          clearInterval(removeLogoInterval);
        }
      }
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(removeLogoInterval);
    }
  }, [scene])

  return (
    <div className={cn("w-full h-full relative rounded-2xl overflow-hidden bg-black/20", className)}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-20">
          <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <div 
        className="absolute inset-0 z-10 w-full h-full [&>spline-viewer]:w-full [&>spline-viewer]:h-full"
        dangerouslySetInnerHTML={{ __html: `<spline-viewer url="${scene}" events-target="global" loading="lazy"></spline-viewer>` }}
      />
    </div>
  )
});
SplineScene.displayName = "SplineScene";

// --- COMPONENT: CONTAINER SCROLL ANIMATION ---
const ContainerScroll = ({ titleComponent, children }: { titleComponent: React.ReactNode; children: React.ReactNode }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const scale = useTransform(scrollYProgress, [0, 1], isMobile ? [0.8, 0.9] : [1.05, 1]);
  const rotate = useTransform(scrollYProgress, [0, 1], [20, 0]);
  const translate = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <div className="h-[60rem] md:h-[80rem] flex items-center justify-center relative p-2 md:p-20" ref={containerRef}>
      <div className="py-10 md:py-40 w-full relative" style={{ perspective: "1000px" }}>
        <motion.div style={{ translateY: translate }} className="max-w-5xl mx-auto text-center mb-10 md:mb-20">
          {titleComponent}
        </motion.div>
        <motion.div
          style={{ rotateX: rotate, scale, boxShadow: "0 0 #0000004d, 0 37px 37px #00000042" }}
          className="max-w-5xl mx-auto h-[30rem] md:h-[40rem] w-full border-4 border-[#222] p-2 md:p-6 bg-[#111] rounded-[30px] shadow-2xl overflow-hidden"
        >
          <div className="h-full w-full overflow-hidden rounded-2xl bg-zinc-900">{children}</div>
        </motion.div>
      </div>
    </div>
  );
};

// --- MAIN PAGE ---
export default function Home() {
  const [mounted, setMounted] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
  }

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-purple-500/30 overflow-x-hidden relative">
      <BackgroundMusic />

      {/* Ambient Backgrounds */}
      <div className="fixed top-[-5%] left-[-5%] w-72 h-72 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none z-0"></div>
      <div className="fixed bottom-[10%] right-[-5%] w-72 h-72 bg-pink-600/10 rounded-full blur-[100px] pointer-events-none z-0"></div>

      {/* Navbar Floating Bubble */}
      <div className="fixed top-6 left-0 right-0 z-[120] flex justify-center px-4 pointer-events-none">
        <div className="relative flex flex-col items-center">
          <nav className="pointer-events-auto bg-[#111111]/90 backdrop-blur-md border border-white/10 rounded-full px-5 py-2.5 flex items-center shadow-[0_4px_12px_rgba(0,0,0,0.6)] transition-all">
            <a href="#home" className="text-base font-bold tracking-tight text-white pr-2">
              Gurur<span className="text-purple-500">.</span>
            </a>
            <div className="w-[1px] h-4 bg-white/15 mx-3"></div>
            <div className="hidden md:flex items-center space-x-5 text-sm font-medium text-gray-400">
              <a href="#home" className="hover:text-white transition-colors">Home</a>
              <a href="#projects" className="hover:text-white transition-colors">Projects</a>
              <a href="#skills" className="hover:text-white transition-colors">Skills</a>
              <a href="#contact" className="text-white hover:text-purple-400 transition-colors font-bold">Talk</a>
            </div>
            <div className="md:hidden flex items-center">
               <a href="#contact" className="text-white text-xs font-bold mr-3 bg-white/5 px-3 py-1 rounded-full border border-white/5">Talk</a>
               <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white p-1">
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
               </button>
            </div>
          </nav>
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 10 }} exit={{ opacity: 0, y: -10 }}
                className="absolute top-full bg-[#111111]/95 backdrop-blur-xl border border-white/10 rounded-3xl p-5 flex flex-col space-y-3 pointer-events-auto shadow-2xl min-w-[180px] md:hidden"
              >
                <a href="#home" onClick={() => setIsMenuOpen(false)} className="text-gray-400 hover:text-white">Home</a>
                <a href="#projects" onClick={() => setIsMenuOpen(false)} className="text-gray-400 hover:text-white">Projects</a>
                <a href="#skills" onClick={() => setIsMenuOpen(false)} className="text-gray-400 hover:text-white">Skills</a>
                <hr className="border-white/5" />
                <a href="#contact" onClick={() => setIsMenuOpen(false)} className="text-white font-bold">Contact Me</a>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="relative z-10 pt-24 pb-10">
        {/* HERO SECTION */}
        <section id="home" className="px-6 max-w-7xl mx-auto flex items-center justify-center min-h-[85vh]">
          <div className="w-full">
            <div className="w-full min-h-[600px] bg-[#0a0a0a] relative overflow-hidden border border-white/5 rounded-[2.5rem] flex flex-col md:flex-row shadow-2xl">
              <div className="flex-1 p-8 md:p-14 relative z-10 flex flex-col justify-center order-2 md:order-1">
                <div className="inline-flex items-center px-3 py-1 rounded-full border border-white/5 bg-white/5 backdrop-blur-sm mb-6 text-[10px] uppercase tracking-widest text-gray-400 w-fit">
                    <span className="flex h-1.5 w-1.5 rounded-full bg-green-500 mr-2"></span> Online
                </div>
                <h1 className="text-4xl sm:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-500 leading-tight">
                  Crafting digital <br className="hidden sm:block" /> experiences.
                </h1>
                <p className="mt-6 text-neutral-400 max-w-md text-base leading-relaxed">
                  Building interactive, functional, and visually stunning web applications.
                  Mode Pecut AI sejam kelar😝😹
                </p>
                <div className="mt-8 flex gap-4">
                  <a href="#projects" className="px-8 py-3 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform text-sm">View Work</a>
                </div>
              </div>
              <div className="w-full h-[350px] md:h-auto md:flex-1 relative order-1 md:order-2">
                <SplineScene scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode" className="w-full h-full" />
              </div>
            </div>
          </div>
        </section>

        {/* CONTAINER SCROLL SECTION */}
        <section className="w-full relative z-20">
          <ContainerScroll
            titleComponent={
              <h2 className="text-4xl md:text-7xl font-bold text-white">
                The Future of <br />
                <span className="text-5xl md:text-[6rem] font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">Web Design</span>
              </h2>
            }
          >
            <img src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1400&q=80" alt="dashboard" className="mx-auto rounded-2xl object-cover h-full w-full" />
          </ContainerScroll>
        </section>

        {/* SKILLS SECTION */}
        <section id="skills" className="py-32 px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-20">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">My <span className="text-purple-500">Arsenal</span></h2>
              <p className="text-gray-400">Tools and technologies I use to bring ideas to life.</p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem] hover:bg-white/10 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6 text-blue-400"><Layout size={24} /></div>
                <h3 className="text-xl font-bold mb-3">Frontend</h3>
                <p className="text-gray-400 text-sm">Building beautiful and responsive user interfaces using React and Next.js.</p>
              </div>
              <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem] hover:bg-white/10 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center mb-6 text-green-400"><Server size={24} /></div>
                <h3 className="text-xl font-bold mb-3">Backend</h3>
                <p className="text-gray-400 text-sm">Scalable server-side logic and database management for robust applications.</p>
              </div>
              <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem] hover:bg-white/10 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-6 text-purple-400"><PenTool size={24} /></div>
                <h3 className="text-xl font-bold mb-3">Design</h3>
                <p className="text-gray-400 text-sm">Crafting clean UI/UX designs that prioritize user experience and aesthetics.</p>
              </div>
            </div>
          </div>
        </section>

        {/* PROJECTS SECTION */}
        <section id="projects" className="py-32 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold mb-16">Selected <span className="text-gray-500">Work</span></h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {[1, 2].map((i) => (
                <div key={i} className="group cursor-pointer">
                  <div className="relative overflow-hidden rounded-[2rem] mb-6 aspect-video bg-zinc-900 border border-white/5">
                    <img src={i === 1 ? "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=800" : "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800"} alt="work" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="p-4 bg-white text-black rounded-full"><ArrowUpRight /></div>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{i === 1 ? 'E-Commerce Admin' : 'Fintech Dashboard'}</h3>
                  <p className="text-gray-400 text-sm">Next.js • Tailwind • Framer Motion</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT SECTION */}
        <section id="contact" className="py-32 px-6">
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-white/10 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-bold mb-6">Let's work <span className="text-purple-400">together.</span></h2>
              <p className="text-gray-400 mb-10 text-lg">Open for new opportunities and collaborations.</p>
              <a href="mailto:hello@example.com" className="inline-flex items-center px-8 py-4 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform"><Mail className="mr-2" /> Say Hello</a>
            </div>
          </div>
        </section>
      </div>

      {/* FOOTER */}
      <footer className="py-10 px-6 border-t border-white/5 text-center text-gray-500 text-sm">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© 2026 Gurur. All rights reserved.</p>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-white transition-colors"><Github size={18} /></a>
            <a href="#" className="hover:text-white transition-colors"><Linkedin size={18} /></a>
          </div>
        </div>
      </footer>
    </main>
  )
}
