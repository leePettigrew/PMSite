import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import LogoAssembler from "../components/LogoAssembler";

export default function Home() {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return (
    <main className="relative h-[100svh] w-full overflow-hidden">
      <LogoAssembler />

      {/* Subtle label, center-ish, but not fighting the logo */}
      <div className="pointer-events-none absolute inset-0 flex items-start justify-center pt-10 sm:pt-12 px-4">
        <div className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-white/12 bg-black/35 px-4 py-2 text-xs sm:text-sm text-white/80 backdrop-blur-xl">
          Premium Websites • Custom Software • Dublin
        </div>
      </div>

      {/* CTA lower section (no dock, minimal) */}
        <div className="pointer-events-none absolute inset-x-0 bottom-20 sm:bottom-29 px-4">
        <div className="pointer-events-auto mx-auto w-full max-w-3xl text-center">
          <div className="text-white/70 text-sm sm:text-base">
            Move your cursor — the logo fractures into chunks and reforms.
          </div>

          <div className="mt-4 flex flex-col sm:flex-row justify-center gap-3">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-black hover:brightness-95 transition"
            >
              Get a quote <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/services"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/12 bg-white/6 px-5 py-3 text-sm font-semibold text-white hover:border-white/20 hover:bg-white/10 transition backdrop-blur-xl"
            >
              Explore services
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
