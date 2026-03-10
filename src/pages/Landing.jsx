import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { getServers } from "../utils/storage";
import { useT } from "../i18n";

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
  const t = useT();
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-4xl px-4 py-24 text-center">
        <h1 className="font-display text-4xl font-extrabold leading-tight text-gray-900 sm:text-5xl md:text-6xl">
          {t("hero_title1")}
          <br />
          <span className="text-brand-500">{t("hero_title2")}</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
          {t("hero_subtitle")}
        </p>
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            to="/join"
            className="rounded-card bg-brand-500 px-8 py-3 text-base font-semibold text-white shadow transition hover:bg-brand-600"
          >
            {t("hero_cta_join")}
          </Link>
          <a
            href="#how-it-works"
            className="rounded-card border border-gray-300 px-8 py-3 text-base font-semibold text-gray-700 transition hover:border-brand-500 hover:text-brand-500"
          >
            {t("hero_cta_how")}
          </a>
        </div>
      </div>
    </section>
  );
}

/* ─── How It Works ─── */

function HowItWorks() {
  const t = useT();
  return (
    <section id="how-it-works" className="bg-surface py-20">
      <div className="mx-auto max-w-5xl px-4">
        <h2 className="text-center font-display text-3xl font-bold text-gray-900">
          {t("how_title")}
        </h2>
        <div className="mt-12 grid gap-8 sm:grid-cols-2">
          <AnimatedCard delay={0}>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-xl font-bold text-brand-600">
              1
            </div>
            <h3 className="mt-4 font-display text-xl font-bold text-gray-900">
              {t("how_step1_title")}
            </h3>
            <p className="mt-2 text-gray-600">
              {t("how_step1_desc").split("yourname.blocaria.com").map((part, i, arr) =>
                i < arr.length - 1 ? (
                  <span key={i}>{part}<span className="font-semibold text-brand-500">yourname.blocaria.com</span></span>
                ) : part
              )}
            </p>
          </AnimatedCard>

          <AnimatedCard delay={150}>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-xl font-bold text-brand-600">
              2
            </div>
            <h3 className="mt-4 font-display text-xl font-bold text-gray-900">
              {t("how_step2_title")}
            </h3>
            <p className="mt-2 text-gray-600">{t("how_step2_desc")}</p>
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
  const t = useT();
  const videoIds = ["v8MlsJnigOA", "8YB_Zd0OOI0", "KAFPU8m8irQ"];

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-4xl px-4">
        <h2 className="text-center font-display text-3xl font-bold text-gray-900">
          {t("videos_title")}
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
  const t = useT();
  const servers = getServers();
  return (
    <section className="bg-surface py-20">
      <div className="mx-auto max-w-5xl px-4">
        <h2 className="text-center font-display text-3xl font-bold text-gray-900">
          {t("servers_title")}
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
                {t("servers_learnmore")}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
