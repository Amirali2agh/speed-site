import React, { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Scroll, ScrollControls } from '@react-three/drei';
import ImmersiveParticles from './components/ImmersiveParticles';
import Navbar from './components/Navbar';
import Preloader from './components/Preloader';

const services = [
  { number: '۰۱', title: 'راه‌اندازی و طراحی شبکه', text: 'طراحی و پیاده‌سازی شبکه‌های LAN و WAN، تنظیم روتر و سوئیچ، راه‌اندازی Wi‑Fi و ایجاد ساختاری منظم برای اتصال کاربران و تجهیزات.' },
  { number: '۰۲', title: 'عیب‌یابی و افزایش سرعت', text: 'بررسی قطعی، تأخیر، Packet Loss، اختلال DNS، پوشش ضعیف وای‌فای و گلوگاه‌های شبکه برای پیدا کردن علت اصلی کندی و ناپایداری.' },
  { number: '۰۳', title: 'امنیت و دسترسی', text: 'طراحی سیاست‌های دسترسی، تفکیک شبکه، تنظیم Firewall و ایجاد دسترسی امن برای کاربران و سرویس‌های داخلی و راه دور.' },
  { number: '۰۴', title: 'پشتیبانی و مانیتورینگ', text: 'پایش وضعیت تجهیزات و سرویس‌ها، بررسی رخدادها و مستندسازی تنظیمات تا مشکلات شبکه سریع‌تر شناسایی و رفع شوند.' },
];

const protocols = [
  { name: 'TCP/IP', layer: 'Transport + Network', description: 'مجموعه‌ای از پروتکل‌های پایه اینترنت است که برای آدرس‌دهی، مسیریابی، انتقال و برقراری ارتباط بین شبکه‌های مختلف استفاده می‌شود.' },
  { name: 'HTTP / HTTPS', layer: 'Application', description: 'برای تبادل اطلاعات وب استفاده می‌شود. نسخه HTTPS با استفاده از TLS ارتباط را رمزنگاری و هویت سرویس را قابل بررسی می‌کند.' },
  { name: 'DNS', layer: 'Application', description: 'نام‌هایی مثل example.com را به آدرس‌های IP تبدیل می‌کند تا دستگاه بتواند سرویس موردنظر را در شبکه پیدا کند.' },
  { name: 'DHCP', layer: 'Application', description: 'تنظیمات شبکه مانند IP، Gateway و DNS را به‌صورت خودکار در اختیار کلاینت‌ها قرار می‌دهد و مدیریت شبکه را ساده‌تر می‌کند.' },
  { name: 'UDP', layer: 'Transport', description: 'پروتکل انتقالی با سربار کمتر است که در کاربردهایی مثل استریم، تماس آنلاین و سرویس‌هایی که سرعت پاسخ اهمیت زیادی دارد استفاده می‌شود.' },
  { name: 'ICMP', layer: 'Network', description: 'برای پیام‌های کنترلی و عیب‌یابی شبکه کاربرد دارد و ابزارهایی مانند ping بر پایه پیام‌های ICMP کار می‌کنند.' },
];

const faqs = [
  { question: 'چرا اینترنت یا شبکه کند می‌شود؟', answer: 'علت می‌تواند از کیفیت لینک و شلوغی شبکه تا DNS، Wi‑Fi، تنظیمات روتر، Packet Loss یا محدودیت یک سرویس باشد. تشخیص درست معمولاً با اندازه‌گیری و بررسی مرحله‌به‌مرحله انجام می‌شود.' },
  { question: 'تفاوت TCP و UDP چیست؟', answer: 'TCP برای تحویل مرتب و قابل‌اعتماد داده طراحی شده است؛ UDP سربار کمتری دارد و در سناریوهایی که تأخیر کم اهمیت بیشتری دارد می‌تواند مناسب‌تر باشد.' },
  { question: 'DNS چه نقشی در باز شدن سایت‌ها دارد؟', answer: 'قبل از برقراری ارتباط با بسیاری از سرویس‌های اینترنتی، نام دامنه باید به IP تبدیل شود. بنابراین اختلال DNS می‌تواند باعث شود یک سرویس برای کاربر در دسترس به نظر نرسد، حتی اگر خود سرویس فعال باشد.' },
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
    <main dir="rtl" className="relative w-full h-screen overflow-hidden bg-slate-950 text-white">
      <Preloader onComplete={() => setIsLoaded(true)} />

      <div className={`transition-opacity duration-1000 delay-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <Navbar currentPage={currentPage} setPage={setPage} scrollEl={scrollEl} />
      </div>

      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 4.2], fov: 60 }} dpr={1}>
          <ambientLight intensity={0.4} />
          <ScrollControls pages={4} damping={0.25}>
            <ImmersiveParticles count={particleCount} setPage={setPage} setScrollEl={setScrollEl} />

            <Scroll html>
              <section className="w-screen h-screen flex items-center px-6 md:px-16 lg:px-24 pointer-events-none">
                <div className={`w-full max-w-5xl mx-auto transition-all duration-1000 delay-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                  <div className="max-w-3xl pointer-events-auto">
                    <p className="mb-4 text-[11px] md:text-xs font-bold tracking-[0.28em] uppercase text-violet-300">Network & IT Services</p>
                    <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight leading-[1.05] text-transparent bg-clip-text bg-gradient-to-r from-violet-300 via-indigo-300 to-cyan-300">Speed Service</h1>
                    <p className="mt-7 text-lg sm:text-xl md:text-2xl font-bold leading-9 text-slate-100">راهکارهای سریع، پایدار و امن برای شبکه و زیرساخت دیجیتال</p>
                    <p className="mt-5 max-w-2xl text-sm sm:text-base md:text-lg leading-8 text-slate-400">
                      در <span className="font-semibold text-slate-200">Speed Service</span> تمرکز ما روی شبکه‌ای است که فقط «وصل» نباشد؛ باید پایدار، قابل‌مدیریت و آماده پاسخ‌گویی به نیاز واقعی کاربران و سرویس‌ها باشد.
                      از طراحی و راه‌اندازی شبکه تا عیب‌یابی، بهینه‌سازی، امنیت و شناخت پروتکل‌ها، همه‌چیز را کنار هم می‌بینیم.
                    </p>
                    <div className="mt-8 flex flex-wrap gap-3 pointer-events-auto">
                      {['شبکه و زیرساخت', 'Wi‑Fi', 'Routing', 'امنیت', 'پروتکل‌ها'].map((item) => (
                        <span key={item} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs sm:text-sm text-slate-200 backdrop-blur-md">{item}</span>
                      ))}
                    </div>
                    <div className="mt-8 grid sm:grid-cols-3 gap-3 max-w-2xl">
                      <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 backdrop-blur-md"><p className="text-xs text-slate-500">تمرکز</p><p className="mt-1 text-sm font-semibold">پایداری شبکه</p></div>
                      <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 backdrop-blur-md"><p className="text-xs text-slate-500">رویکرد</p><p className="mt-1 text-sm font-semibold">عیب‌یابی مبتنی بر داده</p></div>
                      <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 backdrop-blur-md"><p className="text-xs text-slate-500">هدف</p><p className="mt-1 text-sm font-semibold">اتصال بهتر و امن‌تر</p></div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="w-screen h-screen flex items-center px-6 md:px-16 lg:px-24 pointer-events-none">
                <div className="w-full max-w-6xl mx-auto pointer-events-auto">
                  <div className="max-w-3xl">
                    <p className="text-[11px] md:text-xs font-bold tracking-[0.28em] uppercase text-indigo-300">خدمات Speed Service</p>
                    <h2 className="mt-3 text-4xl sm:text-6xl md:text-7xl font-black tracking-tight">خدمات شبکه</h2>
                    <p className="mt-5 text-sm md:text-base leading-8 text-slate-400">
                      هر شبکه شرایط خودش را دارد. هدف ما این است که قبل از تغییر تنظیمات، مسئله را درست بشناسیم و سپس راه‌حلی قابل‌فهم، قابل‌نگهداری و متناسب با نیاز شما پیاده کنیم.
                    </p>
                  </div>

                  <div className="mt-7 grid lg:grid-cols-[1fr_0.85fr] gap-8 items-center">
                    <div className="grid sm:grid-cols-2 gap-3">
                      {services.map((service) => (
                        <article key={service.number} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4 md:p-5 backdrop-blur-md">
                          <div className="flex items-start gap-4">
                            <span className="mt-0.5 min-w-9 text-xs font-bold tracking-widest text-violet-300">{service.number}</span>
                            <div><h3 className="text-sm md:text-base font-bold text-white">{service.title}</h3><p className="mt-2 text-xs md:text-sm leading-7 text-slate-400">{service.text}</p></div>
                          </div>
                        </article>
                      ))}
                    </div>

                    <div className="relative mx-auto w-full max-w-xl aspect-[4/3] rounded-3xl border border-white/10 bg-gradient-to-br from-violet-500/10 via-indigo-500/5 to-cyan-500/10 overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center p-8 text-center">
                        <div><div className="mx-auto mb-4 h-14 w-14 rounded-2xl border border-violet-300/20 bg-violet-400/10 flex items-center justify-center text-violet-200 text-lg font-black">SS</div><p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">محل تصویر شبکه</p><p className="mt-2 text-sm leading-6 text-slate-500">تصویر اصلی سرویس را اینجا قرار می‌دهیم</p></div>
                      </div>
                      <img src="/speed-service-network.jpg" alt="نمای شبکه Speed Service" className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500" onLoad={(event) => event.currentTarget.classList.remove('opacity-0')} onError={(event) => { event.currentTarget.style.display = 'none'; }} />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
                    </div>
                  </div>
                </div>
              </section>

              <section className="w-screen h-screen flex items-center px-6 md:px-16 lg:px-24 pointer-events-none">
                <div className="w-full max-w-6xl mx-auto pointer-events-auto">
                  <div className="max-w-3xl">
                    <p className="text-[11px] md:text-xs font-bold tracking-[0.28em] uppercase text-cyan-300">دانش شبکه</p>
                    <h2 className="mt-3 text-4xl sm:text-6xl md:text-7xl font-black tracking-tight">پروتکل‌های شبکه</h2>
                    <p className="mt-4 text-sm md:text-base leading-8 text-slate-400">
                      برای اینکه بدانیم در یک شبکه چه اتفاقی می‌افتد، باید نقش پروتکل‌ها را بشناسیم. هر پروتکل بخشی از فرآیند ارتباط را مدیریت می‌کند؛ از پیدا کردن مقصد و ترجمه نام‌ها تا انتقال داده و عیب‌یابی.
                    </p>
                  </div>

                  <div className="mt-7 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {protocols.map((protocol) => (
                      <article key={protocol.name} className="rounded-2xl border border-white/10 bg-slate-950/60 p-5 backdrop-blur-lg">
                        <div className="flex items-start justify-between gap-4"><h3 dir="ltr" className="text-lg md:text-xl font-bold">{protocol.name}</h3><span className="rounded-full border border-cyan-300/10 bg-cyan-300/5 px-3 py-1 text-[10px] uppercase tracking-widest text-cyan-200 whitespace-nowrap">{protocol.layer}</span></div>
                        <p className="mt-3 text-xs md:text-sm leading-7 text-slate-400">{protocol.description}</p>
                      </article>
                    ))}
                  </div>

                  <div className="mt-4 rounded-2xl border border-cyan-300/10 bg-cyan-300/[0.04] p-4 md:p-5 text-xs md:text-sm leading-7 text-slate-300">
                    <span className="font-semibold text-cyan-200">نکته:</span> TCP روی تحویل مرتب و قابل‌اعتماد داده تمرکز دارد، در حالی که UDP سربار کمتری دارد و می‌تواند برای برخی کاربردهای حساس به تأخیر مناسب باشد.
                  </div>
                </div>
              </section>

              <section className="w-screen h-screen flex items-center px-6 md:px-12 pointer-events-none">
                <div className="w-full max-w-6xl mx-auto pointer-events-auto">
                  <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-10 items-center">
                    <div>
                      <p className="text-[11px] md:text-xs font-bold tracking-[0.28em] uppercase text-pink-300">ارتباط با Speed Service</p>
                      <h2 className="mt-3 text-5xl sm:text-7xl font-black tracking-tight">شبکه بهتر،<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-violet-300 to-indigo-300">اتصال مطمئن‌تر</span></h2>
                      <p className="mt-6 max-w-xl text-sm md:text-base leading-8 text-slate-400">
                        اگر شبکه شما کند، ناپایدار یا پیچیده شده است، اولین قدم شناخت دقیق مسئله است. در Speed Service می‌توانید نیازتان را درباره راه‌اندازی شبکه، بهینه‌سازی، امنیت یا یادگیری مباحث شبکه مطرح کنید.
                      </p>
                      <div className="mt-7 inline-flex rounded-full border border-white/10 bg-white/10 px-7 py-3 text-xs md:text-sm font-semibold tracking-wide text-white backdrop-blur-md">اطلاعات تماس به‌زودی اضافه می‌شود</div>
                    </div>

                    <div className="space-y-3">
                      {faqs.map((item) => (
                        <article key={item.question} className="rounded-2xl border border-white/10 bg-slate-950/60 p-5 backdrop-blur-md">
                          <h3 className="text-sm md:text-base font-bold text-white">{item.question}</h3>
                          <p className="mt-2 text-xs md:text-sm leading-7 text-slate-400">{item.answer}</p>
                        </article>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            </Scroll>
          </ScrollControls>
        </Canvas>
      </div>
    </main>
  );
}
