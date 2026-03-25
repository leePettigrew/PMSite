import LogoAssembler from "../components/LogoAssembler";
import WorkCarousel from "../components/WorkCarousel";
import { ArrowRight, Code2, LayoutTemplate, Rocket, Mail } from "lucide-react";

const services = [
  {
    title: "Website Design",
    text: "Modern, premium websites built to look sharp, feel fast, and convert visitors into real enquiries.",
    icon: LayoutTemplate,
  },
  {
    title: "Custom Software",
    text: "Tailored tools, dashboards, and business systems built around the way you actually work.",
    icon: Code2,
  },
  {
    title: "Launch & Growth",
    text: "From first concept to deployment, performance, polish, and ongoing improvements are handled properly.",
    icon: Rocket,
  },
];

const process = [
  {
    step: "01",
    title: "Discovery",
    text: "We clarify your goals, audience, offer, and what the website or software actually needs to achieve.",
  },
  {
    step: "02",
    title: "Design & Build",
    text: "A clean, high-end design direction is paired with solid development and thoughtful detail.",
  },
  {
    step: "03",
    title: "Launch",
    text: "Everything is refined, tested, and deployed with performance, responsiveness, and presentation in mind.",
  },
];

export default function Home() {
  return (
    <main className="bg-[#05070b] text-white">
      <section
        id="home"
        className="relative min-h-screen overflow-hidden border-b border-white/10"
      >
        <LogoAssembler />

        <div className="pointer-events-none absolute inset-0 z-10 flex flex-col">
          <div className="flex justify-center px-4 pt-8 sm:pt-10">
            <div className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-white/12 bg-black/35 px-4 py-2 text-xs sm:text-sm text-white/80 backdrop-blur-xl">
              Premium Websites • Custom Software • Dublin
            </div>
          </div>

          <div className="flex-1" />

          <div className="px-4 pb-12 sm:pb-16">
            <div className="pointer-events-auto mx-auto max-w-3xl text-center">
              <p className="mx-auto max-w-2xl text-sm leading-6 text-white/72 sm:text-base">
                PM Solutions creates sleek websites and custom digital experiences
                with a premium feel, strong performance, and clean modern design.
              </p>

              <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:brightness-95"
                >
                  Get a quote <ArrowRight className="h-4 w-4" />
                </a>

                <a
                  href="#work"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/12 bg-white/6 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/10 backdrop-blur-xl"
                >
                  View work
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <WorkCarousel />

      <section id="services" className="border-b border-white/10 px-4 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-[0.22em] text-white/45">
              Services
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">
              Built to look premium and work properly.
            </h2>
            <p className="mt-4 text-white/68 sm:text-lg">
              Whether you need a standout website or software tailored to your business,
              the focus is always on quality, usability, and strong presentation.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {services.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl"
                >
                  <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/12 bg-white/6">
                    <Icon className="h-5 w-5 text-white/90" />
                  </div>
                  <h3 className="text-xl font-semibold">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-white/68">{item.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="process" className="border-b border-white/10 px-4 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-[0.22em] text-white/45">
              Process
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">
              Simple, clear, and focused.
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {process.map((item) => (
              <div
                key={item.step}
                className="rounded-3xl border border-white/10 bg-white/[0.04] p-6"
              >
                <div className="text-sm font-semibold text-white/45">{item.step}</div>
                <h3 className="mt-4 text-xl font-semibold">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/68">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="px-4 py-20 sm:py-24">
        <div className="mx-auto max-w-4xl rounded-[2rem] border border-white/10 bg-white/[0.05] p-8 text-center backdrop-blur-xl sm:p-12">
          <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/12 bg-white/6">
            <Mail className="h-5 w-5" />
          </div>

          <h2 className="mt-6 text-3xl font-semibold tracking-tight sm:text-5xl">
            Let’s build something sharp.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-white/68 sm:text-lg">
            Need a premium website, a redesign, or custom software built around your
            business? Get in touch and we can talk through it properly.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href="mailto:hello@pmsolutions.ie"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:brightness-95"
            >
              Email PM Solutions
            </a>

            <a
              href="#home"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/12 bg-white/6 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/10"
            >
              Back to top
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}