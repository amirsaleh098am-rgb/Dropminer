import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  className?: string;
  trend?: string;
}

export function StatCard({ title, value, icon, className, trend }: StatCardProps) {
  return (
    <div className={cn("glass-panel rounded-2xl p-5 relative overflow-hidden", className)}>
      <div className="relative z-10 flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <h4 className="text-2xl font-bold tracking-tight text-foreground">{value}</h4>
          {trend && <p className="text-xs text-emerald-400 mt-1">{trend}</p>}
        </div>
        {icon && (
          <div className="p-2.5 bg-primary/10 rounded-xl text-primary ring-1 ring-primary/20">
            {icon}
          </div>
        )}
      </div>
      {/* Decorative gradient blob */}
      <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
    </div>
  );
}
