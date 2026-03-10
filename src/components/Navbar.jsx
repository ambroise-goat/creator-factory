import { Link, useLocation } from "react-router-dom";
import { getCurrentCreator, logoutCreator } from "../utils/storage";
import { useT, useLang } from "../i18n";

export default function Navbar() {
  const location = useLocation();
  const creator = getCurrentCreator();
  const isAdmin = location.pathname === "/admin";
  const t = useT();
  const { lang, toggle } = useLang();

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <img src={`${import.meta.env.BASE_URL}logo.png`} alt="Creator Factory" className="h-8 w-8" />
          <span className="font-display text-xl font-extrabold text-brand-500">Creator Factory</span>
        </Link>

        <div className="flex items-center gap-4 text-sm font-medium">
          {/* Language toggle */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => toggle("fr")}
              title="Français"
              className={`text-lg transition ${lang === "fr" ? "opacity-100" : "opacity-30 hover:opacity-60"}`}
            >
              🇫🇷
            </button>
            <button
              onClick={() => toggle("en")}
              title="English"
              className={`text-lg transition ${lang === "en" ? "opacity-100" : "opacity-30 hover:opacity-60"}`}
            >
              🇬🇧
            </button>
          </div>

          {creator && !isAdmin && (
            <>
              <Link to="/dashboard" className="text-gray-600 transition hover:text-brand-500">
                {t("nav_dashboard")}
              </Link>
              <button
                onClick={() => { logoutCreator(); window.location.href = "/"; }}
                className="text-gray-400 transition hover:text-red-500"
              >
                {t("nav_logout")}
              </button>
            </>
          )}
          {!creator && !isAdmin && (
            <Link
              to="/join"
              className="rounded-card bg-brand-500 px-4 py-2 text-white transition hover:bg-brand-600"
            >
              {t("nav_join")}
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
