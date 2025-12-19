import { ArrowRight, Mail } from "lucide-react";

export default function Contact() {
  const year = new Date().getFullYear();

  return (
    <main className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
      <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">Contact</h1>
      <p className="mt-3 max-w-2xl text-sm sm:text-base text-white/70 leading-relaxed">
        Tell us what you need and your timeline. We’ll reply with next steps and a quick estimate.
      </p>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-white/12 bg-white/6 backdrop-blur-xl p-6">
          <div className="flex items-center gap-3">
            <span className="rounded-2xl border border-white/12 bg-black/35 p-3">
              <Mail className="h-5 w-5" />
            </span>
            <div>
              <div className="text-sm font-semibold">Email</div>
              <div className="text-sm text-white/70">hello@yourdomain.com</div>
            </div>
          </div>

          <div className="mt-6 text-sm text-white/60">
            Prefer a real form submission? We can wire it to Firebase (Functions + Firestore) next.
          </div>
        </div>

        <div className="rounded-3xl border border-white/12 bg-white/6 backdrop-blur-xl p-6">
          <form
            className="grid gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              const name = fd.get("name");
              const email = fd.get("email");
              const message = fd.get("message");
              const subject = encodeURIComponent(`PM Solutions enquiry from ${name}`);
              const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
              window.location.href = `mailto:hello@yourdomain.com?subject=${subject}&body=${body}`;
            }}
          >
            <input
              name="name"
              required
              placeholder="Your name"
              className="w-full rounded-2xl border border-white/18 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/45 outline-none focus:border-white/35 focus:bg-white/12"
            />
            <input
              name="email"
              type="email"
              required
              placeholder="Your email"
              className="w-full rounded-2xl border border-white/18 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/45 outline-none focus:border-white/35 focus:bg-white/12"
            />
            <textarea
              name="message"
              required
              rows="6"
              placeholder="What do you need help with?"
              className="w-full rounded-2xl border border-white/18 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/45 outline-none focus:border-white/35 focus:bg-white/12"
            />
            <button
              type="submit"
              className="mt-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-black hover:brightness-95 transition"
            >
              Send <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>

      <div className="mt-14 text-xs text-white/45">© {year} PM Solutions. All rights reserved.</div>
    </main>
  );
}
