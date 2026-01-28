import { Award, Crosshair, Gauge, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

interface PerformanceBadgeProps {
  title: string;
  className?: string;
}

const badgeIcons: { [key: string]: React.ReactNode } = {
  "Match Winner": <Trophy className="h-8 w-8" />,
  "Most Shooter": <Crosshair className="h-8 w-8" />,
  "Fastest Driver": <Gauge className="h-8 w-8" />,
  "default": <Award className="h-8 w-8" />,
};

export function PerformanceBadge({ title, className }: PerformanceBadgeProps) {
  const icon = badgeIcons[title] || badgeIcons.default;

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-primary bg-primary/10 p-6 box-glow-primary transition-all duration-300",
        className
      )}
    >
      <div className="text-primary text-glow-primary">{icon}</div>
      <h3 className="font-headline text-xl font-bold uppercase tracking-widest text-primary text-glow-primary">
        {title}
      </h3>
    </div>
  );
}
