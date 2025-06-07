import { cn } from "@/lib/utils";
import { LoadingSpinner } from "./spinner";

export default function Loading({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex h-[80dvh] w-full items-center justify-center",
        className,
      )}
    >
      <LoadingSpinner className="size-8 animate-spin" />
    </div>
  );
}
