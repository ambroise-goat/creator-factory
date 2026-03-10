import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-8 text-sm text-gray-500 sm:flex-row sm:justify-between">
        <div>
          <span className="font-display text-base font-bold text-brand-500">
            Creator Factory
          </span>
          <p className="mt-1">Make Minecraft Videos and Get Paid.</p>
        </div>
        <div className="flex gap-6">
          <Link to="/join" className="transition hover:text-brand-500">
            Join
          </Link>
          <Link to="/admin" className="transition hover:text-brand-500">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
