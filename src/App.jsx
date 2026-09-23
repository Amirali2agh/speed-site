import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { ScrollControls, Scroll } from '@react-three/drei';
import ImmersiveParticles from './components/ImmersiveParticles';
import Navbar from './components/Navbar';
import Preloader from './components/Preloader';

const protocols = [
  {
    name: 'TCP/IP',
    layer: 'Transport + Network',
    description: 'Reliable communication built around addressing, routing, segmentation, and delivery across interconnected networks.',
  },
  {
    name: 'HTTP / HTTPS',
    layer: 'Application',
    description: 'The protocol family behind modern web traffic, with HTTPS adding encryption and authentication through TLS.',
  },
  {
    name: 'DNS',
    layer: 'Application',
    description: 'Translates human-friendly domain names into IP addresses so devices can locate services on a network.',
  },
  {
    name: 'DHCP',
    layer: 'Application',
    description: 'Automatically assigns IP configuration such as addresses, gateways, and DNS servers to network clients.',
  },
];

const services = [
  {
    number: '01',
    title: 'Network Setup',
    text: 'Plan and configure reliable LAN, WAN, Wi-Fi, routing, and switching environments for homes, teams, and businesses.',
  },
  {
    number: '02',
    title: 'Performance',
    text: 'Diagnose latency, packet loss, congestion, DNS issues, and weak wireless coverage to keep traffic moving smoothly.',
  },
  {
    number: '03',
    title: 'Security',
    text: 'Build safer network foundations with segmentation, firewall policies, secure remote access, and practical access controls.',
  },
];

export default function App() {
  const [currentPage, setPage] = useState('home');
  const [scrollEl, setScrollEl] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const particleCount = isMobile ? 800 : 1600;

  return (
    <main className="relative w-full h-screen bg-slate-950 text-white overflow-hidden">
      <Preloader onComplete={() => setIsLoaded(true)} />

      <div className={`transition-opacity duration-1000 delay-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <Navbar currentPage={currentPage} setPage={setPage} scrollEl={scrollEl} />
      </div>

      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 4.2], fov: 60 }} dpr={1}>
          <ambientLight intensity={0.4} />

          <ScrollControls pages={4} damping={0.25}>
            <ImmersiveParticles
              count={particleCount}
              setPage={setPage}
              setScrollEl={setScrollEl}
            />

            <Scroll html>
              {/* HOME */}
              <section className="w-screen h-screen flex flex-col justify-center px-6 md:px-16 lg:px-24 pointer-events-none">
                <div className={`max-w-3xl transition-all duration-1000 delay-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                  <p className="mb-4 text-[11px] md:text-xs font-bold tracking-[0.35em] uppercase text-violet-300">
                    Network & IT Services
                  </p>
                  <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-violet-300 via-indigo-300 to-cyan-300 drop-shadow-md">
                    Speed Service
                  </h1>
                  <p className="text-slate-300 mt-6 max-w-xl text-sm sm:text-base md:text-lg leading-relaxed">
                    Fast, reliable, and secure network solutions for connected businesses and modern digital spaces.
                    From routing and Wi-Fi to protocols and troubleshooting, we turn complex network traffic into a clear system.
                  </p>
                  <div className="mt-8 flex flex-wrap gap-3 pointer-events-auto">
                    <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-slate-200 backdrop-blur-md">Routing</span>
                    <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-slate-200 backdrop-blur-md">Wi-Fi</span>
                    <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-slate-200 backdrop-blur-md">Security</span>
                    <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-slate-200 backdrop-blur-md">Protocols</span>
                  </div>
                </div>
              </section>

              {/* SERVICES */}
              <section className="w-screen h-screen flex flex-col justify-center px-6 md:px-16 lg:px-24 pointer-events-none">
                <div className="max-w-6xl w-full grid lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-16 items-center mx-auto">
                  <div className="pointer-events-auto">
                    <p className="text-[11px] md:text-xs font-bold tracking-[0.35em] uppercase text-indigo-300">What we do</p>
                    <h2 className="mt-3 text-4xl sm:text-6xl md:text-7xl font-black tracking-tight">Network Services</h2>
                    <p className="mt-5 max-w-xl text-sm md:text-base text-slate-400 leading-relaxed">
                      Practical infrastructure work focused on uptime, performance, and clean network architecture.
                    </p>

                    <div className="mt-7 space-y-3">
                      {services.map((service) => (
                        <div key={service.number} className="rounded-2xl border border-white/10 bg-slate-950/55 p-4 md:p-5 backdrop-blur-md">
                          <div className="flex gap-4">
                            <span className="text-xs font-bold tracking-widest text-violet-300">{service.number}</span>
                            <div>
                              <h3 className="text-sm md:text-base font-bold text-white">{service.title}</h3>
                              <p className="mt-1.5 text-xs md:text-sm leading-relaxed text-slate-400">{service.text}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Image slot reserved for the user's future image */}
                  <div className="relative mx-auto w-full max-w-xl aspect-[4/3] rounded-3xl border border-white/10 bg-gradient-to-br from-violet-500/10 via-indigo-500/5 to-cyan-500/10 overflow-hidden pointer-events-auto">
                    <div className="absolute inset-0 flex items-center justify-center p-8 text-center">
                      <div>
                        <div className="mx-auto mb-4 h-12 w-12 rounded-2xl border border-violet-300/20 bg-violet-400/10 flex items-center justify-center text-violet-200 text-lg">
                          SS
                        </div>
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                          Network visual placeholder
                        </p>
                        <p className="mt-2 text-sm text-slate-500">
                          Reserved for the image you send next
                        </p>
                      </div>
                    </div>
                    <img
                      src="/speed-service-network.jpg"
                      alt="Speed Service network environment"
                      className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500"
                      onLoad={(event) => { event.currentTarget.classList.remove('opacity-0'); }}
                      onError={(event) => { event.currentTarget.style.display = 'none'; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />
                  </div>
                </div>
              </section>

              {/* PROTOCOLS */}
              <section className="w-screen h-screen flex flex-col justify-center px-6 md:px-16 lg:px-24 pointer-events-none">
                <div className="max-w-6xl w-full mx-auto pointer-events-auto">
                  <div className="max-w-2xl">
                    <p className="text-[11px] md:text-xs font-bold tracking-[0.35em] uppercase text-cyan-300">Core knowledge</p>
                    <h2 className="mt-3 text-4xl sm:text-6xl md:text-7xl font-black tracking-tight">Network Protocols</h2>
                    <p className="mt-4 text-sm md:text-base text-slate-400 leading-relaxed">
                      A quick field guide to the protocols that move, name, and secure data across modern networks.
                    </p>
                  </div>

                  <div className="mt-8 grid sm:grid-cols-2 gap-4">
                    {protocols.map((protocol) => (
                      <article key={protocol.name} className="rounded-2xl border border-white/10 bg-slate-950/60 p-5 md:p-6 backdrop-blur-lg">
                        <div className="flex items-center justify-between gap-4">
                          <h3 className="text-lg md:text-xl font-bold">{protocol.name}</h3>
                          <span className="rounded-full border border-cyan-300/10 bg-cyan-300/5 px-3 py-1 text-[10px] uppercase tracking-widest text-cyan-200">
                            {protocol.layer}
                          </span>
                        </div>
                        <p className="mt-3 text-xs md:text-sm leading-relaxed text-slate-400">{protocol.description}</p>
                      </article>
                    ))}
                  </div>

                  <div className="mt-5 rounded-2xl border border-cyan-300/10 bg-cyan-300/[0.04] p-4 text-xs md:text-sm text-slate-300">
                    <span className="font-semibold text-cyan-200">Tip:</span> TCP favors reliable delivery, while UDP favors lower overhead and speed for workloads where occasional packet loss is acceptable.
                  </div>
                </div>
              </section>

              {/* CONTACT */}
              <section className="w-screen h-screen flex flex-col justify-center items-center px-6 md:px-12 pointer-events-none text-center">
                <div className="max-w-3xl pointer-events-auto">
                  <p className="text-[11px] md:text-xs font-bold tracking-[0.35em] uppercase text-pink-300">Let's connect</p>
                  <h2 className="mt-3 text-5xl sm:text-7xl md:text-8xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-violet-300 to-indigo-300">
                    Ready to connect?
                  </h2>
                  <p className="mx-auto mt-6 max-w-2xl text-sm md:text-base leading-relaxed text-slate-400">
                    Tell us what is slowing your network down, what you want to build, or what needs to stay secure.
                    Speed Service is ready to help you design the next connection.
                  </p>
                  <div className="mt-8 inline-flex rounded-full border border-white/10 bg-white/10 px-7 py-3 text-xs md:text-sm font-semibold tracking-widest uppercase text-white backdrop-blur-md">
                    Contact details coming soon
                  </div>
                  <p className="mt-5 text-[10px] uppercase tracking-[0.2em] text-slate-600">
                    Your real email, phone, or social links can be added here.
                  </p>
                </div>
              </section>
            </Scroll>
          </ScrollControls>
        </Canvas>
      </div>
    </main>
  );
}
