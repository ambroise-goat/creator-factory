import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { getServers } from "../utils/storage";

export default function Landing() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <VideoExamples />
      <ServersSection />
    </>
  );
}

/* ─── Hero ─── */

function Hero() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-4xl px-4 py-24 text-center">
        <h1 className="font-display text-4xl font-extrabold leading-tight text-gray-900 sm:text-5xl md:text-6xl">
          Make Minecraft Videos
          <br />
          <span className="text-brand-500">and Get Paid</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
          Create short videos for our Minecraft servers, share your personalized IP, and
          earn money based on your performance.
        </p>
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            to="/join"
            className="rounded-card bg-brand-500 px-8 py-3 text-base font-semibold text-white shadow transition hover:bg-brand-600"
          >
            Join the Program
          </Link>
          <a
            href="#how-it-works"
            className="rounded-card border border-gray-300 px-8 py-3 text-base font-semibold text-gray-700 transition hover:border-brand-500 hover:text-brand-500"
          >
            See How It Works
          </a>
        </div>
      </div>
    </section>
  );
}

/* ─── How It Works ─── */

function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-surface py-20">
      <div className="mx-auto max-w-5xl px-4">
        <h2 className="text-center font-display text-3xl font-bold text-gray-900">
          How It Works
        </h2>
        <div className="mt-12 grid gap-8 sm:grid-cols-2">
          <AnimatedCard delay={0}>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-xl font-bold text-brand-600">
              1
            </div>
            <h3 className="mt-4 font-display text-xl font-bold text-gray-900">
              Claim your IP
            </h3>
            <p className="mt-2 text-gray-600">
              Register and reserve a personalized subdomain like{" "}
              <span className="font-semibold text-brand-500">yourname.blocaria.com</span>.
              This is your unique link — every player who joins through it is attributed to
              you.
            </p>
          </AnimatedCard>

          <AnimatedCard delay={150}>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-xl font-bold text-brand-600">
              2
            </div>
            <h3 className="mt-4 font-display text-xl font-bold text-gray-900">
              Post &amp; Earn
            </h3>
            <p className="mt-2 text-gray-600">
              Make short-form videos with your IP as the CTA, submit the URLs on your
              dashboard, and get paid per unique join or per 1k views.
            </p>
          </AnimatedCard>
        </div>
      </div>
    </section>
  );
}

function AnimatedCard({ children, delay = 0 }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.style.opacity = "0";
    el.style.transform = "translateY(24px)";
    el.style.transition = `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className="rounded-card bg-white p-8 shadow-sm">
      {children}
    </div>
  );
}

/* ─── Video Examples ─── */

function VideoExamples() {
  const videoIds = ["v8MlsJnigOA", "8YB_Zd0OOI0", "KAFPU8m8irQ"];

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-4xl px-4">
        <h2 className="text-center font-display text-3xl font-bold text-gray-900">
          Example Creator Videos
        </h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {videoIds.map((id, i) => (
            <div key={i} className="overflow-hidden rounded-card shadow-sm">
              <div className="relative pb-[177%]">
                <iframe
                  className="absolute inset-0 h-full w-full"
                  src={`https://www.youtube.com/embed/${id}`}
                  title={`Example Creator Video ${i + 1}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Servers ─── */

function ServersSection() {
  const servers = getServers();
  return (
    <section className="bg-surface py-20">
      <div className="mx-auto max-w-5xl px-4">
        <h2 className="text-center font-display text-3xl font-bold text-gray-900">
          Our Servers
        </h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {servers.map((s) => (
            <Link
              key={s.id}
              to={`/servers/${s.id}`}
              className="group rounded-card bg-white p-6 shadow-sm transition hover:shadow-md hover:-translate-y-0.5"
            >
              <h3 className="font-display text-xl font-bold text-gray-900 group-hover:text-brand-500 transition-colors">
                {s.name}
              </h3>
              <p className="mt-2 text-sm text-gray-600">{s.description}</p>
              <p className="mt-4 rounded-lg bg-brand-50 px-3 py-1.5 text-center text-sm font-semibold text-brand-600">
                {s.domain}
              </p>
              <p className="mt-3 text-xs font-medium text-brand-500 opacity-0 group-hover:opacity-100 transition-opacity text-center">
                Learn more →
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
