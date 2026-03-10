import { useParams, Link } from "react-router-dom";
import { getServers } from "../utils/storage";

export default function ServerDetail() {
  const { id } = useParams();
  const server = getServers().find((s) => s.id === id);

  if (!server) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <p className="text-gray-500">Server not found.</p>
        <Link to="/" className="mt-4 inline-block text-brand-500 hover:underline">
          ← Back to home
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Hero */}
      <section className="bg-brand-500 py-16 text-white">
        <div className="mx-auto max-w-3xl px-4">
          <Link
            to="/"
            className="mb-6 inline-flex items-center gap-1 text-sm text-brand-200 hover:text-white"
          >
            ← Back
          </Link>
          <h1 className="font-display text-4xl font-extrabold sm:text-5xl">{server.name}</h1>
          <p className="mt-3 text-lg text-brand-100">{server.description}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            <span className="rounded-full bg-white/20 px-3 py-1 text-sm font-medium">
              {server.domain}
            </span>
          </div>
          <Link
            to="/join"
            className="mt-8 inline-block rounded-card bg-white px-8 py-3 font-semibold text-brand-600 shadow transition hover:bg-brand-50"
          >
            Become a Creator for {server.name}
          </Link>
        </div>
      </section>

      {/* Content */}
      <section className="bg-surface py-16">
        <div className="mx-auto max-w-3xl px-4">
          {server.longDescription ? (
            <DescriptionRenderer text={server.longDescription} />
          ) : (
            <p className="text-gray-500">No description available yet.</p>
          )}
        </div>
      </section>
    </>
  );
}

function DescriptionRenderer({ text }) {
  const blocks = text.split(/\n{2,}/).filter(Boolean);

  return (
    <div>
      {blocks.map((block, i) => {
        const firstLine = block.split("\n")[0].trim();

        // ALL-CAPS block → section heading
        if (firstLine === firstLine.toUpperCase() && firstLine.length > 2 && /[A-Z]/.test(firstLine)) {
          return (
            <h2
              key={i}
              className="mt-10 font-display text-xs font-bold uppercase tracking-widest text-brand-500 first:mt-0"
            >
              {firstLine}
            </h2>
          );
        }

        // Emoji-leading line → feature card
        if (/^\p{Emoji}/u.test(firstLine)) {
          const lines = block.split("\n");
          const title = lines[0].trim();
          const body = lines.slice(1).join("\n").trim();
          return (
            <div key={i} className="mt-6 rounded-card bg-white p-5 shadow-sm">
              <p className="font-display text-base font-bold text-gray-900">{title}</p>
              {body && (
                <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-gray-600">
                  {body}
                </p>
              )}
            </div>
          );
        }

        // Regular paragraph
        return (
          <p
            key={i}
            className="mt-4 whitespace-pre-line text-sm leading-relaxed text-gray-700 first:mt-0"
          >
            {block}
          </p>
        );
      })}
    </div>
  );
}
