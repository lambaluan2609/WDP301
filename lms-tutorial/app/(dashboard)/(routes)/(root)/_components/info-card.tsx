import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

interface InfoCardProps {
  icon: LucideIcon;
  label: string;
  numberOfItems: number;
  variant?: "default" | "success";
}

export const InfoCard = ({
  icon: Icon,
  label,
  numberOfItems,
  variant = "default",
}: InfoCardProps) => {
  return (
    <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="p-6 flex items-center gap-x-4">
        <div className={`p-3 rounded-full ${
          variant === "success" 
            ? "bg-emerald-100 dark:bg-emerald-900/30" 
            : "bg-blue-100 dark:bg-blue-900/30"
        }`}>
          <Icon className={`h-6 w-6 ${
            variant === "success" 
              ? "text-emerald-600 dark:text-emerald-400" 
              : "text-blue-600 dark:text-blue-400"
          }`} />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground">
            {label}
          </p>
          <p className={`text-2xl font-bold ${
            variant === "success" 
              ? "text-emerald-600 dark:text-emerald-400" 
              : "text-blue-600 dark:text-blue-400"
          }`}>
            {numberOfItems}
          </p>
        </div>
      </div>
      <div className={`absolute bottom-0 left-0 h-1 w-0 ${
        variant === "success" 
          ? "bg-emerald-500" 
          : "bg-blue-500"
      } group-hover:w-full transition-all duration-300`} />
    </Card>
  );
};
