import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";

const projects = [
  {
    title: "Luxury Service Website",
    category: "Web Design",
    image: "/work/project-1.png",
    href: "#",
    description:
      "A sleek service-led website with strong typography, minimal structure, and premium presentation.",
  },
  {
    title: "Creative Studio Landing Page",
    category: "Brand Site",
    image: "/work/project-2.png",
    href: "#",
    description:
      "A modern landing page focused on visual impact, smooth motion, and clear conversion points.",
  },
  {
    title: "Business Software Dashboard",
    category: "Custom Software",
    image: "/work/project-3.png",
    href: "#",
    description:
      "A polished internal platform concept with a clean UI system and clear information hierarchy.",
  },
];

export default function WorkCarousel() {
  const [active, setActive] = useState(0);

  const current = useMemo(() => projects[active], [active]);

  const prev = () => {
    setActive((i) => (i === 0 ? projects.length - 1 : i - 1));
  };

  const next = () => {
    setActive((i) => (i === projects.length - 1 ? 0 : i + 1));
  };

  return (
    <section id="work" className="border-b border-white/10 px-4 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-[0.22em] text-white/45">
            Featured Work
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">
            Monochrome until you step into it.
          </h2>
          <p className="mt-4 text-white/68 sm:text-lg">
            A small selection of previous work presented in black and white by
            default. Click a project to bring it to life.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="relative">
            <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-3 backdrop-blur-xl">
              <div className="relative aspect-[16/10] overflow-hidden rounded-[1.5rem] bg-black">
                <AnimatePresence mode="wait">
                  <motion.a
                    key={current.image}
                    href={current.href}
                    target="_blank"
                    rel="noreferrer"
                    initial={{ opacity: 0, scale: 1.02 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.985 }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    className="group absolute inset-0 block"
                  >
                    <img
                      src={current.image}
                      alt={current.title}
                      className="h-full w-full object-cover transition duration-500 grayscale-0"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                      <div className="inline-flex rounded-full border border-white/14 bg-black/25 px-3 py-1 text-xs text-white/80 backdrop-blur">
                        {current.category}
                      </div>

                      <h3 className="mt-4 text-2xl font-semibold sm:text-3xl">
                        {current.title}
                      </h3>

                      <p className="mt-3 max-w-xl text-sm leading-6 text-white/75 sm:text-base">
                        {current.description}
                      </p>

                      <div className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-white">
                        View project <ExternalLink className="h-4 w-4" />
                      </div>
                    </div>
                  </motion.a>
                </AnimatePresence>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <button
                onClick={prev}
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/12 bg-white/6 text-white transition hover:border-white/20 hover:bg-white/10"
                aria-label="Previous project"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>

              <button
                onClick={next}
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/12 bg-white/6 text-white transition hover:border-white/20 hover:bg-white/10"
                aria-label="Next project"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="grid gap-3">
            {projects.map((project, index) => {
              const isActive = index === active;

              return (
                <button
                  key={project.title}
                  onClick={() => setActive(index)}
                  className={`group overflow-hidden rounded-[1.5rem] border text-left transition ${
                    isActive
                      ? "border-white/20 bg-white/[0.08]"
                      : "border-white/10 bg-white/[0.03] hover:border-white/16 hover:bg-white/[0.05]"
                  }`}
                >
                  <div className="grid grid-cols-[120px_1fr] items-stretch sm:grid-cols-[150px_1fr]">
                    <div className="relative h-full min-h-[110px] overflow-hidden">
                      <img
                        src={project.image}
                        alt={project.title}
                        className={`h-full w-full object-cover transition duration-500 ${
                          isActive ? "grayscale-0 scale-[1.02]" : "grayscale"
                        }`}
                      />
                      <div className="absolute inset-0 bg-black/20" />
                    </div>

                    <div className="p-4 sm:p-5">
                      <div className="text-xs uppercase tracking-[0.18em] text-white/45">
                        {project.category}
                      </div>
                      <h3 className="mt-2 text-lg font-semibold text-white">
                        {project.title}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-white/65">
                        {project.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}