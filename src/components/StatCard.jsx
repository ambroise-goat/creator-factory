export default function StatCard({ label, value }) {
  return (
    <div className="rounded-card bg-white p-5 shadow-sm">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-1 font-display text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}
