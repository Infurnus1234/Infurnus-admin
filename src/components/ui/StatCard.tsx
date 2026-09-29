import React from "react";
import { Card } from "./Card";
import { Badge } from "./Badge";

export interface StatCardProps {
  title: string;
  value: string | number;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  icon?: React.ReactNode;
  subtitle?: string;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  trend,
  icon,
  subtitle,
  className = "",
}) => {
  return (
    <Card variant="elevated" rounded="3xl" padding="lg" className={className}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#78786C]">
            {title}
          </p>
          <h3 className="font-heading text-3xl font-bold text-[#2C2C24] mt-2">
            {value}
          </h3>
        </div>
        {icon && (
          <div className="p-3 rounded-2xl bg-[#F0EBE5] text-[#5D7052] shrink-0">
            {icon}
          </div>
        )}
      </div>

      {(trend || subtitle) && (
        <div className="mt-4 pt-3 border-t border-[#DED8CF]/60 flex items-center justify-between text-xs">
          {trend && (
            <Badge variant={trend.isPositive ? "moss" : "destructive"} size="sm">
              {trend.isPositive ? "↑ " : "↓ "}
              {trend.value}
            </Badge>
          )}
          {subtitle && <span className="text-[#78786C] font-medium">{subtitle}</span>}
        </div>
      )}
    </Card>
  );
};
