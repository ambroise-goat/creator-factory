import { useState } from "react";

const ADMIN_PASSWORD = "admin123";

export default function AdminAuth({ onSuccess }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem("adminAuthed", "true");
      onSuccess();
    } else {
      setError(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-card bg-white p-8 shadow-lg"
      >
        <h2 className="font-display text-xl font-bold text-gray-900">Admin Access</h2>
        <p className="mt-1 text-sm text-gray-500">Enter the admin password to continue.</p>
        <input
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError(false);
          }}
          placeholder="Password"
          className="mt-4 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          autoFocus
        />
        {error && <p className="mt-2 text-sm text-red-600">Incorrect password.</p>}
        <button
          type="submit"
          className="mt-4 w-full rounded-card bg-brand-500 py-2 text-sm font-semibold text-white transition hover:bg-brand-600"
        >
          Enter
        </button>
      </form>
    </div>
  );
}
