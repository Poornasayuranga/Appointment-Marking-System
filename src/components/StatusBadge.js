const STATUS_STYLES = {
  PENDING: "bg-amber-100 text-amber-700 ring-amber-200",
  CONFIRMED: "bg-green-100 text-green-700 ring-green-200",
  REJECTED: "bg-red-100 text-red-700 ring-red-200",
  COMPLETED: "bg-sky-100 text-sky-700 ring-sky-200",
  CANCELLED: "bg-gray-100 text-gray-600 ring-gray-200",
};

export default function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || "bg-gray-100 text-gray-700 ring-gray-200";

  return (
    <span
      className={`inline-flex items-center gap-1 text-[11px] font-semibold tracking-wide px-2.5 py-0.5 rounded-full ring-1 ring-inset ${style}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
}
