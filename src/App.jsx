import { Routes, Route } from "react-router-dom";
import { Shell } from "./components/Shell";
import { Nav } from "./components/Nav";

import Home from "./pages/Home";
import Contact from "./pages/Contact";

// Placeholder pages for now (we’ll fill them next)
function Placeholder({ title }) {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
      <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-3 text-white/70">Page content coming next.</p>
    </main>
  );
}

export default function App() {
  return (
    <Shell>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Placeholder title="Services" />} />
        <Route path="/work" element={<Placeholder title="Work" />} />
        <Route path="/process" element={<Placeholder title="Process" />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Shell>
  );
}
