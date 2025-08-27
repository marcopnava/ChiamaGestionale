export function StatusBadge({ status }: { status: "lead" | "active" | "churn" }) {
  const map = {
    lead: "bg-secondary text-blue-900",
    active: "bg-green-100 text-green-800",
    churn: "bg-red-100 text-red-800",
  } as const;
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs ${map[status]}`}>
      {status}
    </span>
  );
} 