import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  variant?: "default" | "success" | "warning" | "fraud" | "accent";
}

const StatsCard = ({
  title,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
  variant = "default",
}: StatsCardProps) => {
  const variantStyles = {
    default: "bg-card border-border",
    success: "bg-success/10 border-success/20",
    warning: "bg-warning/10 border-warning/20",
    fraud: "bg-fraud/10 border-fraud/20",
    accent: "bg-accent/10 border-accent/20",
  };

  const iconStyles = {
    default: "bg-primary/10 text-primary",
    success: "bg-success/20 text-success",
    warning: "bg-warning/20 text-warning",
    fraud: "bg-fraud/20 text-fraud",
    accent: "bg-accent/20 text-accent",
  };

  const changeStyles = {
    positive: "text-success",
    negative: "text-fraud",
    neutral: "text-muted-foreground",
  };

  return (
    <div
      className={`p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow ${variantStyles[variant]}`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold text-foreground">{value}</p>
          {change && (
            <p className={`text-sm font-medium ${changeStyles[changeType]}`}>
              {change}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${iconStyles[variant]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
