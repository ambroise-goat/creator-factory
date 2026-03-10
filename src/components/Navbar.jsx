import { Link, useLocation } from "react-router-dom";
import { getCurrentCreator, logoutCreator } from "../utils/storage";

export default function Navbar() {
  const location = useLocation();
  const creator = getCurrentCreator();
  const isAdmin = location.pathname === "/admin";

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="Creator Factory" className="h-8 w-8" />
          <span className="font-display text-xl font-extrabold text-brand-500">Creator Factory</span>
        </Link>

        <div className="flex items-center gap-4 text-sm font-medium">
          {creator && !isAdmin && (
            <>
              <Link
                to="/dashboard"
                className="text-gray-600 transition hover:text-brand-500"
              >
                Dashboard
              </Link>
              <button
                onClick={() => {
                  logoutCreator();
                  window.location.href = "/";
                }}
                className="text-gray-400 transition hover:text-red-500"
              >
                Logout
              </button>
            </>
          )}
          {!creator && !isAdmin && (
            <Link
              to="/join"
              className="rounded-card bg-brand-500 px-4 py-2 text-white transition hover:bg-brand-600"
            >
              Join the Program
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
