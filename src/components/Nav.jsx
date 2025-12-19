import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Menu, X } from "lucide-react";

const easeOut = [0.16, 1, 0.3, 1];

const links = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/work", label: "Work" },
  { to: "/process", label: "Process" },
  { to: "/contact", label: "Contact" },
];

export function Nav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onResize = () => window.innerWidth >= 768 && setOpen(false);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#07080c]/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="relative h-9 w-9 rounded-2xl border border-white/12 bg-white/6 backdrop-blur">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/18 to-transparent" />
            <div className="relative grid h-full w-full place-items-center text-sm font-black tracking-tight">
              PM
            </div>
          </div>
          <span className="text-sm font-semibold tracking-tight">PM Solutions</span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `text-sm transition ${
                  isActive ? "text-white" : "text-white/65 hover:text-white"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/contact"
            className="hidden sm:inline-flex items-center gap-2 rounded-2xl border border-white/12 bg-white/6 px-4 py-2 text-sm font-semibold text-white hover:border-white/20 hover:bg-white/10 transition backdrop-blur"
          >
            Get a quote <ArrowRight className="h-4 w-4" />
          </Link>

          <button
            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/12 bg-white/6 backdrop-blur hover:bg-white/10 transition"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="md:hidden fixed inset-0 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.18 } }}
            exit={{ opacity: 0, transition: { duration: 0.18 } }}
          >
            <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
            <motion.div
              className="absolute left-0 right-0 top-0 border-b border-white/10 bg-[#07080c]/85 backdrop-blur-xl"
              initial={{ y: -12, opacity: 0, filter: "blur(6px)" }}
              animate={{ y: 0, opacity: 1, filter: "blur(0px)", transition: { duration: 0.28, ease: easeOut } }}
              exit={{ y: -10, opacity: 0, filter: "blur(6px)", transition: { duration: 0.22, ease: easeOut } }}
            >
              <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                  <div className="text-sm font-semibold">Menu</div>
                  <button
                    className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/12 bg-white/6 backdrop-blur hover:bg-white/10 transition"
                    onClick={() => setOpen(false)}
                    aria-label="Close menu"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="pb-6 grid gap-2">
                  {links.map((l) => (
                    <NavLink
                      key={l.to}
                      to={l.to}
                      onClick={() => setOpen(false)}
                      className={({ isActive }) =>
                        `rounded-2xl border px-4 py-3 text-sm transition ${
                          isActive
                            ? "border-white/20 bg-white/10 text-white"
                            : "border-white/10 bg-white/5 text-white/80 hover:bg-white/10 hover:border-white/20"
                        }`
                      }
                    >
                      {l.label}
                    </NavLink>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
