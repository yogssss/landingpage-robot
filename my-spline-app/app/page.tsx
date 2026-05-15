'use client'

import React, { useState, useEffect, useRef, Suspense, lazy } from "react"
import { Layout, Server, PenTool, ArrowUpRight, Mail, Code, Globe, User, Menu, X, Volume2, VolumeX } from "lucide-react"
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
        .catch(() => {
          console.log("Autoplay dicegah oleh browser.");
          setIsPlaying(false);
        });
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
      <audio ref={audioRef} src="/music.mp3" loop />
      <button
        onClick={toggleMute}
        className="fixed bottom-6 right-6 z-50 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-full transition-all duration-300 shadow-lg text-white"
        aria-label="Toggle Background Music"
      >
        {isPlaying ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
      </button>
    </>
  );
};


// --- COMPONENT: SHADCN CARD ---
const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-lg border bg-card text-card-foreground shadow-sm",
        className
      )}
      {...props}
    />
  )
)
Card.displayName = "Card"

// --- COMPONENT: SPOTLIGHT ---
const Spotlight = ({ className, fill }: { className?: string; fill?: string }) => {
  return (
    <svg
      className={cn(
        "animate-spotlight pointer-events-none absolute z-[1] h-[169%] w-[138%] lg:w-[84%] opacity-0",
        className
      )}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 3787 2842"
      fill="none"
    >
      <g filter="url(#filter)">
        <ellipse
          cx="1924.71"
          cy="273.501"
          rx="1924.71"
          ry="273.501"
          transform="matrix(-0.822377 -0.568943 -0.568943 0.822377 3631.88 2291.09)"
          fill={fill || "white"}
          fillOpacity="0.21"
        ></ellipse>
      </g>
      <defs>
        <filter
          id="filter"
          x="0.860352"
          y="0.838989"
          width="3785.16"
          height="2840.26"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend>
          <feGaussianBlur stdDeviation="151" result="effect1_foregroundBlur_1065_8"></feGaussianBlur>
        </filter>
      </defs>
    </svg>
  )
}

// --- COMPONENT: SPLINE SCENE ---
interface SplineSceneProps {
  scene: string
  className?: string
}

// ✅ FIX: React.memo mencegah SplineScene re-render saat parent state berubah
// (misal saat mobileMenuOpen toggle), karena props-nya (scene, className) tidak berubah
const SplineScene = React.memo(function SplineScene({ scene, className }: SplineSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null)
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
    <div ref={containerRef} className={cn("w-full h-full relative rounded-2xl overflow-hidden", className)}>
      <style>{`spline-viewer::part(logo) { display: none !important; }`}</style>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20 transition-opacity duration-500">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <div 
        className="absolute inset-0 z-10 w-full h-full [&>spline-viewer]:w-full [&>spline-viewer]:h-full"
        dangerouslySetInnerHTML={{
          __html: `<spline-viewer url="${scene}" events-target="global"></spline-viewer>`
        }}
      />
    </div>
  )
})

// --- COMPONENT: CONTAINER SCROLL ANIMATION ---
const ContainerScroll = ({
  titleComponent,
  children,
}: {
  titleComponent: string | React.ReactNode;
  children: React.ReactNode;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const scaleDimensions = () => isMobile ? [0.7, 0.9] : [1.05, 1];

  const rotate = useTransform(scrollYProgress, [0, 1], [20, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], scaleDimensions());
  const translate = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <div className="h-[60rem] md:h-[80rem] flex items-center justify-center relative p-2 md:p-20" ref={containerRef}>
      <div className="py-10 md:py-40 w-full relative" style={{ perspective: "1000px" }}>
        <ScrollHeader translate={translate} titleComponent={titleComponent} />
        <ScrollCard rotate={rotate} translate={translate} scale={scale}>{children}</ScrollCard>
      </div>
    </div>
  );
};

const ScrollHeader = ({ translate, titleComponent }: any) => (
  <motion.div style={{ translateY: translate }} className="div max-w-5xl mx-auto text-center">
    {titleComponent}
  </motion.div>
);

const ScrollCard = ({
  rotate, scale, children,
}: {
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  translate: MotionValue<number>;
  children: React.ReactNode;
}) => (
  <motion.div
    style={{
      rotateX: rotate,
      scale,
      boxShadow: "0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a, 0 233px 65px #00000003",
    }}
    className="max-w-5xl -mt-12 mx-auto h-[30rem] md:h-[40rem] w-full border-4 border-[#6C6C6C] p-2 md:p-6 bg-[#222222] rounded-[30px] shadow-2xl"
  >
    <div className="h-full w-full overflow-hidden rounded-2xl bg-gray-100 dark:bg-zinc-900 md:rounded-2xl md:p-4">
      {children}
    </div>
  </motion.div>
);


// --- COMPONENT: NAVBAR ---
// ✅ FIX: Dipisah jadi komponen sendiri supaya state mobileMenuOpen TIDAK
// menyebabkan re-render di komponen Home (dan SplineScene ikut terdampak).
const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const handleNavClick = () => setMobileMenuOpen(false)

  return (
    <div className="fixed top-6 left-0 right-0 z-[100] flex justify-center px-4 pointer-events-none">
      <div className="pointer-events-auto w-full max-w-fit">
        <nav className="bg-[#111111]/90 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3.5 flex items-center shadow-[0_4px_12px_rgba(0,0,0,0.6)] transition-all duration-300">
          <a href="#home" className="text-base font-bold tracking-tight text-white pr-2" onClick={handleNavClick}>
            Gurur<span className="text-purple-500">.</span>
          </a>
          <div className="hidden md:block w-[1px] h-5 bg-white/15 mx-4"></div>
          <div className="hidden md:flex items-center space-x-6 text-sm font-medium text-gray-400">
            <a href="#home" className="hover:text-white transition-colors">Home</a>
            <a href="#projects" className="hover:text-white transition-colors">Projects</a>
            <a href="#skills" className="hover:text-white transition-colors">Skills</a>
            <a href="#contact" className="text-white hover:text-purple-400 transition-colors font-bold tracking-wide">Talk</a>
          </div>
          <button
            className="md:hidden text-white ml-6"
            onClick={() => setMobileMenuOpen(prev => !prev)}
            aria-label="Toggle mobile menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </nav>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="md:hidden mt-2 mx-auto bg-[#111111]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.6)] overflow-hidden"
            >
              <div className="flex flex-col py-2">
                <a href="#home" onClick={handleNavClick} className="px-6 py-3 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all">Home</a>
                <a href="#projects" onClick={handleNavClick} className="px-6 py-3 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all">Projects</a>
                <a href="#skills" onClick={handleNavClick} className="px-6 py-3 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all">Skills</a>
                <div className="mx-4 my-1 border-t border-white/10"></div>
                <a href="#contact" onClick={handleNavClick} className="px-6 py-3 text-sm font-bold text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 transition-all">Talk</a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// --- COMPONENT: LOADING SCREEN ---
// Loader dimodifikasi dari loader-6.tsx (styled-components → inline CSS)
// Teks "REC" diganti jadi "Sabar Mpruyyy😝"
const LoadingScreen = ({ onDone }: { onDone: () => void }) => {
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    // Tampil 2.8 detik lalu fade out
    const timer = setTimeout(() => {
      setFadeOut(true)
      setTimeout(onDone, 600) // tunggu animasi fade selesai
    }, 8000)
    return () => clearTimeout(timer)
  }, [onDone])

  return (
    <>
      <style>{`
        .gurur-loader { --c: #f7971d; font-size: 18px; }

        .gurur-ph1 {
          position: absolute; left: 100%; top: 100%;
          transform: translate(-50%, -50%);
          display: flex; flex-direction: row; align-items: center; gap: 8px;
          animation: gurur-ph1 3s ease infinite;
          clip-path: polygon(-4em -1em, 4em -1em, 4em 1em, -4em 1em);
        }
        .gurur-record {
          position: absolute; left: 70%; top: 70%;
          width: 5em; height: 5em;
          background: var(--c); border-radius: 999px;
          animation: gurur-blink 1s step-end infinite;
          transform: translate(-3.5em, -50%);
        }
        .gurur-record-text {
          position: absolute; color: var(--c);
          font-size: 1.1em; font-weight: 700; letter-spacing: -0.02em;
          left: 50%; top: 50%;
          transform: translate(-0.6em, -50%);
          white-space: nowrap;
        }
        @keyframes gurur-blink { 50% { opacity: 0; } 75% { opacity: 1; } }
        @keyframes gurur-ph1 {
          25.5% { translate: 0 0; clip-path: polygon(-4em -1em, 4em -1em, 4em 1em, -4em 1em); }
          30%, to { opacity: 1; translate: 0 3em; clip-path: polygon(-4em 1em, 4em 1em, 4em 1em, -4em 1em); }
          30.1% { opacity: 0; translate: 0 3em; }
          92.4%, to { translate: 0 0; opacity: 0; clip-path: polygon(-4em -1em, 4em -1em, 4em 1em, -4em 1em); }
          92.5% { opacity: 1; clip-path: polygon(-4em -1em, -0.5em -1em, -0.5em 1em, -4em 1em); }
          to { opacity: 1; clip-path: polygon(-4em -1em, 4em -1em, 4em 1em, -4em 1em); }
        }

        .gurur-ph2 {
          position: absolute; left: 50%; top: 50%;
          transform: translate(-50%, -4em);
          width: 11em; height: 7em;
          perspective: 150px; perspective-origin: 50% 0%;
          transform-style: preserve-3d;
          animation: gurur-ph2 3s ease-in-out infinite;
        }
        @keyframes gurur-ph2 {
          0%, 15% { translate: 0 4em; }
          0%, 29% { opacity: 0; }
          30% { opacity: 1; }
          40% { translate: 0 0; }
          50% { translate: 0 0.5em; opacity: 1; }
          50.1%, to { opacity: 0; }
        }

        .gurur-laptop-b {
          position: absolute; left: 0; right: 0; bottom: 0;
          height: 0.5em; background: var(--c);
          border-bottom-left-radius: 2em; border-bottom-right-radius: 2em;
          animation: gurur-ph2b 3s ease infinite;
        }
        .gurur-laptop-t {
          margin: 0 1.25em; color: var(--c);
          transform-origin: 50% 100%;
          animation: gurur-ph2t 3s ease infinite;
        }
        @keyframes gurur-ph2t {
          0%, 29% { transform: rotateX(-10deg); }
          0%, 41.9% { stroke-dasharray: unset; }
          42% { transform: rotateX(4deg); stroke-dasharray: 0 0 100; }
          50% { transform: rotateX(-20deg); stroke-dasharray: 0 50 0 100; }
        }
        @keyframes gurur-ph2b { 42% { scale: 1 1; } 50% { scale: 0 1; } }

        .gurur-icon {
          position: absolute; width: 4em; height: 4em;
          background: var(--c); border-radius: 999px;
          top: 50%; left: 50%; transform: translate(-50%, -50%);
          transform-origin: center;
          animation: gurur-icon 3s ease-in-out infinite;
          isolation: isolate; border-color: var(--c); border-style: solid; z-index: -1;
        }
        @keyframes gurur-icon {
          0%, 15% { translate: 0 4.5em; width: 0; height: 0; }
          0%, 29% { opacity: 0; }
          30% { opacity: 1; }
          40% { translate: 0 -0.75em; width: 4em; height: 4em; }
          50% { translate: 0 0em; opacity: 1; background: var(--c); }
          50.1% { border-width: 2em; background: black; }
          65% { width: 4em; height: 4em; transform: translate(-50%, -50%); border-width: 4px; }
          80%, to { width: 2em; height: 2em; translate: 0 0; transform: translate(-3.5em, -50%); border-width: 1em; background: black; }
          80.1%, to { background: var(--c); }
          84.9% { opacity: 1; }
          85%, to { opacity: 0; }
        }
        .gurur-icon::before {
          content: ""; position: absolute; top: 50%; left: 50%;
          border: 0.8em solid black; box-sizing: border-box;
          border-left-color: transparent !important; border-bottom-color: transparent !important;
          transform: translate(-50%, 2.5em) rotate(-45deg);
          transform-origin: center;
          animation: gurur-iconb 3s ease-in-out infinite; z-index: -1;
        }
        @keyframes gurur-iconb {
          20% { transform: translate(-50%, 2.5em) rotate(-45deg); }
          50% { transform: translate(-50%, -25%) rotate(-45deg); border-color: black; }
          65%, to { transform: translateY(0) scale(1) scaleX(1.5) translate(-60%, -50%) rotate(45deg); border-color: var(--c); }
          85%, to { transform: translate(-40%, -50%) scale(0) scaleX(1.5) translate(-75%, -50%) rotate(45deg); }
        }
        .gurur-icon::after {
          content: ""; position: absolute; top: 50%; left: 50%;
          background: black; width: 1em; height: 2em; box-sizing: border-box;
          animation: gurur-icona 3s ease-in-out infinite;
        }
        @keyframes gurur-icona {
          20% { transform: translate(-50%, 2.5em); }
          50% { transform: translate(-50%, 0.4em); }
          65%, to { transform: translate(-50%, 2.5em); }
        }
      `}</style>

      <motion.div
        animate={{ opacity: fadeOut ? 0 : 1 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#050505]"
      >
        {/* Ambient glows sama seperti page aslinya */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-600/20 rounded-full mix-blend-screen filter blur-[128px] opacity-50 pointer-events-none"></div>
        <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-pink-600/20 rounded-full mix-blend-screen filter blur-[128px] opacity-50 pointer-events-none"></div>

        {/* Loader container */}
        <div className="relative w-[200px] h-[200px] gurur-loader">
          {/* Phase 1: REC indicator → teks custom */}
          <div className="gurur-ph1">
            <div className="gurur-record" />
            <div className="gurur-record-text">Sabar Mpruyyy😝</div>
          </div>

          {/* Phase 2: Laptop animation */}
          <div className="gurur-ph2">
            <div className="gurur-laptop-b" />
            <svg className="gurur-laptop-t" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 42 30">
              <path
                d="M21 1H5C2.78 1 1 2.78 1 5V25a4 4 90 004 4H37a4 4 90 004-4V5c0-2.22-1.8-4-4-4H21"
                pathLength={100} strokeWidth={2} stroke="currentColor" fill="none"
              />
            </svg>
          </div>

          {/* Phase 3: Icon morphing */}
          <div className="gurur-icon" />
        </div>

        {/* Nama portfolio di bawah loader */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-8 text-sm font-semibold tracking-[0.3em] uppercase text-white/40"
        >
          Gurur<span className="text-[#f7971d]">.</span>portfolio
        </motion.p>
      </motion.div>
    </>
  )
}

// --- MAIN PAGE ---
export default function Home() {
  const [mounted, setMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setMounted(true)
  }, [])

  const fadeUp: any = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  }

  if (!mounted) return null;

  return (
    <>
      {/* Loading screen muncul di atas segalanya */}
      <AnimatePresence>
        {isLoading && <LoadingScreen onDone={() => setIsLoading(false)} />}
      </AnimatePresence>

    <main className="min-h-screen bg-[#050505] text-white selection:bg-purple-500/30 overflow-x-hidden relative">
      
      <BackgroundMusic />

      {/* Ambient Background Glows */}
      <div className="fixed top-[-10%] left-[-10%] w-96 h-96 bg-purple-600/20 rounded-full mix-blend-screen filter blur-[128px] opacity-50 pointer-events-none z-0"></div>
      <div className="fixed top-[20%] right-[-10%] w-96 h-96 bg-pink-600/20 rounded-full mix-blend-screen filter blur-[128px] opacity-50 pointer-events-none z-0"></div>

      {/* ✅ FIX: Navbar terisolasi — state-nya tidak ikut me-re-render Home */}
      <Navbar />

      <div className="relative z-10 pt-28 pb-10">
        
        {/* HERO SECTION */}
        <section id="home" className="px-6 max-w-7xl mx-auto flex items-center justify-center min-h-[80vh] md:min-h-[90vh]">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="w-full mt-10 md:mt-0"
          >
            <Card className="w-full min-h-[700px] md:min-h-[600px] h-auto bg-black/[0.96] relative overflow-hidden border-white/10 rounded-3xl flex flex-col md:flex-row">
              <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />
              
              <div className="flex-1 p-6 md:p-12 relative z-10 flex flex-col justify-center order-2 md:order-1">
                <div className="inline-flex items-center px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-4 md:mb-6 text-xs text-gray-300 w-fit">
                    <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                    Available for work
                </div>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 leading-tight">
                  Crafting digital <br className="hidden sm:block" /> experiences.
                </h1>
                <p className="mt-4 md:mt-6 text-neutral-300 max-w-lg text-base md:text-lg leading-relaxed">
                  Building interactive, functional, and visually stunning web applications.
                  Mode Pecut AI sejam kelar😝😹
                </p>
                <div className="mt-6 md:mt-8 flex gap-4">
                  <a href="#projects" className="px-6 py-3 bg-white text-black font-medium rounded-full hover:bg-gray-200 transition-colors text-sm w-full sm:w-auto text-center">
                      View My Work
                  </a>
                </div>
              </div>

              <div className="w-full h-[350px] md:h-auto md:flex-1 relative order-1 md:order-2 border-b border-white/5 md:border-b-0 cursor-grab active:cursor-grabbing">
                <SplineScene 
                  scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                  className="w-full h-full"
                />
              </div>
            </Card>
          </motion.div>
        </section>

        {/* CONTAINER SCROLL ANIMATION SECTION */}
        <section className="w-full relative z-20 -mt-20 md:mt-0">
          <div className="flex flex-col overflow-hidden">
            <ContainerScroll
              titleComponent={
                <>
                  <h2 className="text-4xl md:text-5xl font-semibold text-white">
                    Unleash the power of <br />
                    <span className="text-5xl md:text-[6rem] font-bold mt-1 leading-none bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                      Scroll Animations
                    </span>
                  </h2>
                </>
              }
            >
              <img
                src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80"
                alt="hero dashboard"
                className="mx-auto rounded-2xl object-cover h-full w-full object-center"
                draggable={false}
              />
            </ContainerScroll>
          </div>
        </section>

        {/* SKILLS SECTION */}
        <section id="skills" className="py-32 px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
              className="text-center mb-20"
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-4">My <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">Arsenal</span></h2>
              <p className="text-gray-400 max-w-2xl mx-auto text-lg">Tools and technologies I use to bring ideas to life.</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 hover:bg-white/[0.04] transition-all hover:-translate-y-1">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 text-blue-400">
                  <Layout className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-3">Frontend Dev</h3>
                <p className="text-gray-400 text-sm mb-6 leading-relaxed">Creating beautiful, responsive, and interactive user interfaces using modern web technologies.</p>
                <div className="flex flex-wrap gap-2">
                  {['React', 'Next.js', 'Tailwind', 'Framer'].map(tech => (
                    <span key={tech} className="px-3 py-1 text-xs font-medium bg-white/5 border border-white/10 rounded-full">{tech}</span>
                  ))}
                </div>
              </motion.div>

              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 hover:bg-white/[0.04] transition-all hover:-translate-y-1">
                <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center mb-6 text-green-400">
                  <Server className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-3">Backend & API</h3>
                <p className="text-gray-400 text-sm mb-6 leading-relaxed">Building scalable APIs and managing data efficiently to support frontend applications.</p>
                <div className="flex flex-wrap gap-2">
                  {['Node.js', 'Express', 'PostgreSQL', 'MongoDB'].map(tech => (
                    <span key={tech} className="px-3 py-1 text-xs font-medium bg-white/5 border border-white/10 rounded-full">{tech}</span>
                  ))}
                </div>
              </motion.div>

              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 hover:bg-white/[0.04] transition-all hover:-translate-y-1">
                <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6 text-purple-400">
                  <PenTool className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-3">UI/UX Design</h3>
                <p className="text-gray-400 text-sm mb-6 leading-relaxed">Crafting intuitive user experiences and aesthetic designs before bringing them to code.</p>
                <div className="flex flex-wrap gap-2">
                  {['Figma', 'Wireframing', 'Prototyping', 'Design Systems'].map(tech => (
                    <span key={tech} className="px-3 py-1 text-xs font-medium bg-white/5 border border-white/10 rounded-full">{tech}</span>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* PROJECTS SECTION */}
        <section id="projects" className="py-32 px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="flex flex-col md:flex-row justify-between items-end mb-16">
              <div>
                <h2 className="text-3xl md:text-5xl font-bold mb-4">Selected <span className="text-gray-400">Work</span></h2>
                <p className="text-gray-400 text-lg">A showcase of my recent projects.</p>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { title: "E-Commerce Platform", tech: "Next.js, Stripe, Tailwind", img: "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80", year: "2023" },
                { title: "Financial Dashboard", tech: "React, D3.js, Node.js", img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80", year: "2024" }
              ].map((project, i) => (
                <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="group cursor-pointer">
                  <div className="relative overflow-hidden rounded-3xl mb-6 aspect-video bg-white/5 p-2 border border-white/5">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <img src={project.img} alt={project.title} className="w-full h-full object-cover rounded-2xl transform group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute bottom-6 left-6 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                      <span className="p-3 bg-white text-black rounded-full inline-flex items-center justify-center hover:scale-110 transition-transform">
                        <ArrowUpRight className="w-5 h-5" />
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-2xl font-bold mb-2 group-hover:text-purple-400 transition-colors">{project.title}</h3>
                      <p className="text-gray-400 text-sm">{project.tech}</p>
                    </div>
                    <span className="text-xs font-medium px-3 py-1 bg-white/5 rounded-full border border-white/10">{project.year}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT SECTION */}
        <section id="contact" className="py-32 px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="max-w-4xl mx-auto bg-white/[0.02] border border-white/5 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 blur-3xl rounded-full z-0 pointer-events-none"></div>
            
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-bold mb-6">Have an idea? <br/> <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">Let's build it.</span></h2>
              <p className="text-gray-400 mb-10 text-lg max-w-xl mx-auto">I'm currently open to new opportunities and projects. Feel free to reach out to me.</p>
              
              <a href="mailto:hello@example.com" className="inline-flex items-center px-8 py-4 bg-white text-black font-semibold rounded-full hover:scale-105 transition-transform duration-300 shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                <Mail className="w-5 h-5 mr-2" /> hello@example.com
              </a>
            </div>
          </motion.div>
        </section>

      </div>

      {/* FOOTER */}
      <footer className="py-10 px-6 border-t border-white/5 text-center md:text-left relative z-10 bg-black">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">© 2026 Gurur Portfolio's. All rights reserved.</p>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-500 hover:text-white transition-colors"><Code className="w-5 h-5" /></a>
            <a href="#" className="text-gray-500 hover:text-white transition-colors"><Globe className="w-5 h-5" /></a>
            <a href="#" className="text-gray-500 hover:text-white transition-colors"><User className="w-5 h-5" /></a>
          </div>
        </div>
      </footer>
    </main>
    </>
  )
}
