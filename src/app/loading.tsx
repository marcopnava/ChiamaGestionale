import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-3">
      <div className="rounded-2xl border p-4">
        <Skeleton className="h-[24px] w-[180px]" />
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl border p-4">
          <Skeleton className="h-[220px] w-full" />
        </div>
        <div className="rounded-2xl border p-4">
          <Skeleton className="h-[220px] w-full" />
        </div>
      </div>
      <div className="rounded-2xl border p-4">
        <Skeleton className="h-[16px] w-[120px]" />
        <div className="mt-2">
          <Skeleton className="h-2 w-full" />
        </div>
      </div>
    </div>
  );
} 