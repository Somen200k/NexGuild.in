import { cn } from "@/lib/utils";

type AvatarSize = "sm" | "md" | "lg";

interface AvatarProps {
  src?: string | null;
  name?: string;
  size?: AvatarSize;
  className?: string;
}

const sizeClasses: Record<AvatarSize, string> = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-20 w-20 text-2xl",
};

const bgColors = [
  "bg-violet-500",
  "bg-indigo-500",
  "bg-blue-500",
  "bg-teal-500",
  "bg-emerald-500",
  "bg-amber-500",
];

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function getBgColor(name: string): string {
  const index = name.charCodeAt(0) % bgColors.length;
  return bgColors[index];
}

export function Avatar({ src, name = "User", size = "md", className }: AvatarProps) {
  const initials = getInitials(name);
  const bgColor = getBgColor(name);

  if (src) {
    return (
      <div className={cn("rounded-full overflow-hidden flex-shrink-0", sizeClasses[size], className)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={name} className="h-full w-full object-cover" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-full flex-shrink-0 flex items-center justify-center font-semibold text-white",
        sizeClasses[size],
        bgColor,
        className
      )}
      aria-label={name}
    >
      {initials}
    </div>
  );
}
