import React from "react";
import { ChartDataPoint } from "@/lib/dashboardData";

export interface ChartProps {
  data: ChartDataPoint[];
  title: string;
  subtitle?: string;
  color?: "moss" | "terracotta" | "sand";
}

export const OrganicAreaChart: React.FC<ChartProps> = ({
  data,
  title,
  subtitle,
  color = "moss",
}) => {
  const maxValue = Math.max(...data.map((d) => d.value), 1);
  const strokeColor = color === "moss" ? "#5D7052" : color === "terracotta" ? "#C18C5D" : "#78786C";
  const fillColor = color === "moss" ? "rgba(93, 112, 82, 0.15)" : color === "terracotta" ? "rgba(193, 140, 93, 0.15)" : "rgba(230, 220, 205, 0.3)";

  const width = 500;
  const height = 180;
  const padding = 20;

  const points = data.map((d, index) => {
    const x = padding + (index / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - (d.value / maxValue) * (height - padding * 2);
    return { x, y, value: d.value, label: d.label };
  });

  const pathD = points.reduce((acc, point, i, a) => {
    if (i === 0) return `M ${point.x},${point.y}`;
    const prev = a[i - 1];
    const cx = (prev.x + point.x) / 2;
    return `${acc} C ${cx},${prev.y} ${cx},${point.y} ${point.x},${point.y}`;
  }, "");

  const areaD = `${pathD} L ${points[points.length - 1].x},${height - padding} L ${points[0].x},${height - padding} Z`;

  return (
    <div className="w-full flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="font-heading text-lg font-bold text-[#2C2C24]">{title}</h4>
          {subtitle && <p className="text-xs text-[#78786C] mt-0.5">{subtitle}</p>}
        </div>
        <span className="text-xs font-bold font-mono px-2.5 py-1 rounded-full bg-[#F0EBE5] text-[#5D7052]">
          Max: {data[data.length - 1].value.toLocaleString()}
        </span>
      </div>

      <div className="relative w-full overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
          <defs>
            <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={strokeColor} stopOpacity="0.3" />
              <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Area Fill */}
          <path d={areaD} fill={`url(#grad-${color})`} />

          {/* Curve Line */}
          <path d={pathD} fill="none" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />

          {/* Data Nodes */}
          {points.map((pt, idx) => (
            <g key={idx} className="group cursor-pointer">
              <circle
                cx={pt.x}
                cy={pt.y}
                r="5"
                fill="#FDFCF8"
                stroke={strokeColor}
                strokeWidth="2.5"
                className="transition-transform duration-200 group-hover:scale-150"
              />
            </g>
          ))}
        </svg>
      </div>

      {/* Labels */}
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#DED8CF]/60 text-[11px] text-[#78786C] font-semibold">
        {data.map((d, i) => (
          <span key={i}>{d.label}</span>
        ))}
      </div>
    </div>
  );
};

export const OrganicBarChart: React.FC<ChartProps> = ({
  data,
  title,
  subtitle,
  color = "terracotta",
}) => {
  const maxValue = Math.max(...data.map((d) => d.value), 1);
  const barBg = color === "terracotta" ? "bg-[#C18C5D]" : color === "moss" ? "bg-[#5D7052]" : "bg-[#E6DCCD]";

  return (
    <div className="w-full flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="font-heading text-lg font-bold text-[#2C2C24]">{title}</h4>
          {subtitle && <p className="text-xs text-[#78786C] mt-0.5">{subtitle}</p>}
        </div>
      </div>

      <div className="h-44 flex items-end justify-between gap-2 pt-6">
        {data.map((pt, idx) => {
          const heightPercent = Math.round((pt.value / maxValue) * 100);
          return (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
              <div className="text-[10px] font-bold text-[#78786C] opacity-0 group-hover:opacity-100 transition-opacity">
                {pt.value >= 1000 ? `${(pt.value / 1000).toFixed(1)}k` : pt.value}
              </div>
              <div className="w-full bg-[#F0EBE5] rounded-2xl h-full flex items-end p-1">
                <div
                  style={{ height: `${heightPercent}%` }}
                  className={`w-full ${barBg} rounded-xl transition-all duration-500 group-hover:brightness-110`}
                />
              </div>
              <span className="text-[11px] font-semibold text-[#78786C]">{pt.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
