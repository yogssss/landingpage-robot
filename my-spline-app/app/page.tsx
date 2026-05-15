'use client'

import React, { useState, useEffect, useRef } from "react"
import { Layout, Server, Figma, ArrowUpRight, Mail, Github, Twitter, Linkedin, Menu } from "lucide-react"
import { motion, useScroll, useTransform, MotionValue } from "framer-motion"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// --- UTILS ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

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
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          ></feBlend>
          <feGaussianBlur
            stdDeviation="151"
            result="effect1_foregroundBlur_1065_8"
          ></feGaussianBlur>
        </filter>
      </defs>
    </svg>
  )
}

// --- COMPONENT: SPLINE SCENE (INLINED) ---
// Menggunakan iframe untuk Spline di lingkungan preview agar tidak ada error dependensi
interface SplineSceneProps {
  scene: string
  className?: string
}
function SplineScene({ scene, className }: SplineSceneProps) {
  // Mengekstrak ID scene dari link URL
  const urlMatch = scene.match(/spline\.design\/(.+)\/scene/);
  const splineId = urlMatch ? urlMatch[1] : 'kZDDjO5HuC9GJUM2';
  
  return (
    <div className={cn("w-full h-full relative rounded-2xl overflow-hidden", className)}>
      <iframe 
        src={`https://my.spline.design/${splineId}/`} 
        frameBorder="0" 
        width="100%" 
        height="100%" 
        className="absolute inset-0 z-10"
        title="3D Interactive Spline"
      ></iframe>
      <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-0">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  )
}

// --- COMPONENT: CONTAINER SCROLL ANIMATION (INLINED) ---
const ContainerScroll = ({
  titleComponent,
  children,
}: {
  titleComponent: string | React.ReactNode;
  children: React.ReactNode;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
  });
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const scaleDimensions = () => {
    return isMobile ? [0.7, 0.9] : [1.05, 1];
  };

  const rotate = useTransform(scrollYProgress, [0, 1], [20, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], scaleDimensions());
  const translate = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <div
      className="h-[60rem] md:h-[80rem] flex items-center justify-center relative p-2 md:p-20"
      ref={containerRef}
    >
      <div
        className="py-10 md:py-40 w-full relative"
        style={{
          perspective: "1000px",
        }}
      >
        <ScrollHeader translate={translate} titleComponent={titleComponent} />
        <ScrollCard rotate={rotate} translate={translate} scale={scale}>
          {children}
        </ScrollCard>
      </div>
    </div>
  );
};

const ScrollHeader = ({ translate, titleComponent }: any) => {
  return (
    <motion.div
      style={{
        translateY: translate,
      }}
      className="div max-w-5xl mx-auto text-center"
    >
      {titleComponent}
    </motion.div>
  );
};

const ScrollCard = ({
  rotate,
  scale,
  children,
}: {
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  translate: MotionValue<number>;
  children: React.ReactNode;
}) => {
  return (
    <motion.div
      style={{
        rotateX: rotate,
        scale,
        boxShadow:
          "0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a, 0 233px 65px #00000003",
      }}
      className="max-w-5xl -mt-12 mx-auto h-[30rem] md:h-[40rem] w-full border-4 border-[#6C6C6C] p-2 md:p-6 bg-[#222222] rounded-[30px] shadow-2xl"
    >
      <div className=" h-full w-full  overflow-hidden rounded-2xl bg-gray-100 dark:bg-zinc-900 md:rounded-2xl md:p-4 ">
        {children}
      </div>
    </motion.div>
  );
};


// --- MAIN PAGE ---
export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Variants untuk animasi scroll reveal
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  }

  if (!mounted) return null; // Mencegah hydration mismatch

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-purple-500/30 overflow-x-hidden relative">
      
      {/* Ambient Background Glows */}
      <div className="fixed top-[-10%] left-[-10%] w-96 h-96 bg-purple-600/20 rounded-full mix-blend-screen filter blur-[128px] opacity-50 pointer-events-none z-0"></div>
      <div className="fixed top-[20%] right-[-10%] w-96 h-96 bg-pink-600/20 rounded-full mix-blend-screen filter blur-[128px] opacity-50 pointer-events-none z-0"></div>

      {/* Navbar */}
      <nav className="fixed w-full z-50 bg-[#0a0a0a]/60 backdrop-blur-md border-b border-white/5 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <a href="#home" className="text-xl font-bold tracking-tighter text-white">
            Raka<span className="text-purple-500">.</span>
          </a>
          
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-400">
            <a href="#home" className="hover:text-white transition-colors">Home</a>
            <a href="#skills" className="hover:text-white transition-colors">Skills</a>
            <a href="#projects" className="hover:text-white transition-colors">Projects</a>
          </div>

          <div className="hidden md:block">
            <a href="#contact" className="px-5 py-2.5 bg-white text-black font-medium text-sm rounded-full hover:bg-gray-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.1)]">
              Let's Talk
            </a>
          </div>

          <button className="md:hidden text-white">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </nav>

      <div className="relative z-10 pt-28 pb-10">
        
        {/* HEADER / HERO SECTION (3D Spline Robot) */}
        <section id="home" className="px-6 max-w-7xl mx-auto flex items-center justify-center min-h-[80vh]">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="w-full"
          >
            {/* Ubah tinggi card biar robot nggak kepotong di mobile */}
            <Card className="w-full min-h-[500px] md:h-[600px] bg-black/[0.96] relative overflow-hidden border-white/10 rounded-3xl">
              <Spotlight
                className="-top-40 left-0 md:left-60 md:-top-20"
                fill="white"
              />
              
              <div className="flex flex-col-reverse md:flex-row h-full">
                
                {/* Left content (Teks) */}
                <div className="flex-1 p-8 md:p-12 relative z-10 flex flex-col justify-center">
                  <div className="inline-flex items-center px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-6 text-xs text-gray-300 w-fit">
                      <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                      Available for work
                  </div>
                  <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 leading-tight">
                    Crafting digital <br/> experiences.
                  </h1>
                  <p className="mt-6 text-neutral-300 max-w-lg text-lg leading-relaxed">
                    I'm a creative developer focusing on building interactive, functional, and visually stunning web applications.
                  </p>
                  <div className="mt-8 flex gap-4">
                    <a href="#projects" className="px-6 py-3 bg-white text-black font-medium rounded-full hover:bg-gray-200 transition-colors text-sm">
                        View My Work
                    </a>
                  </div>
                </div>

                {/* Right content (3D Object) */}
                <div className="flex-1 relative min-h-[350px] md:min-h-full">
                  <SplineScene 
                    scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                    className="w-full h-full"
                  />
                </div>

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
              {/* Skill 1 */}
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 hover:bg-white/[0.04] transition-all hover:-translate-y-1">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 text-blue-400">
                  <Layout className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-3">Frontend Dev</h3>
                <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                  Creating beautiful, responsive, and interactive user interfaces using modern web technologies.
                </p>
                <div className="flex flex-wrap gap-2">
                  {['React', 'Next.js', 'Tailwind', 'Framer'].map(tech => (
                    <span key={tech} className="px-3 py-1 text-xs font-medium bg-white/5 border border-white/10 rounded-full">{tech}</span>
                  ))}
                </div>
              </motion.div>

              {/* Skill 2 */}
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 hover:bg-white/[0.04] transition-all hover:-translate-y-1">
                <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center mb-6 text-green-400">
                  <Server className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-3">Backend & API</h3>
                <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                  Building scalable APIs and managing data efficiently to support frontend applications.
                </p>
                <div className="flex flex-wrap gap-2">
                  {['Node.js', 'Express', 'PostgreSQL', 'MongoDB'].map(tech => (
                    <span key={tech} className="px-3 py-1 text-xs font-medium bg-white/5 border border-white/10 rounded-full">{tech}</span>
                  ))}
                </div>
              </motion.div>

              {/* Skill 3 */}
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 hover:bg-white/[0.04] transition-all hover:-translate-y-1">
                <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6 text-purple-400">
                  <Figma className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-3">UI/UX Design</h3>
                <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                  Crafting intuitive user experiences and aesthetic designs before bringing them to code.
                </p>
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
          <p className="text-gray-500 text-sm mb-4 md:mb-0">© 2024 Raka Portfolio. All rights reserved.</p>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-500 hover:text-white transition-colors"><Github className="w-5 h-5" /></a>
            <a href="#" className="text-gray-500 hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
            <a href="#" className="text-gray-500 hover:text-white transition-colors"><Linkedin className="w-5 h-5" /></a>
          </div>
        </div>
      </footer>
    </main>
  )
}
