import { cn } from "@/lib/utils";
import { ChevronLeftIcon } from "lucide-react";
import Link from "next/link";

type HeaderProps = {
  backLink?: {
    text: string;
    href: string;
  };
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
};

export default function Header({
  backLink,
  title,
  description,
  actions,
  className,
}: HeaderProps) {
  return (
    <header
      className={cn("z-10 mt-2 flex justify-between bg-white", className)}
    >
      <div>
        {backLink?.text && (
          <Link
            href={backLink?.href}
            className="-ml-0.5 mb-1 flex items-center gap-1 text-xs capitalize tracking-wide text-gray-500 transition-all hover:text-gray-800"
          >
            <ChevronLeftIcon className="size-3" />
            {backLink.text}
          </Link>
        )}
        <div className="text-2xl font-bold capitalize">{title}</div>
        {description && <p className="mt-1.5 text-gray-500">{description}</p>}
      </div>
      {actions && actions}
    </header>
  );
}
