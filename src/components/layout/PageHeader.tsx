import React from "react";
import { Breadcrumbs } from "./Breadcrumbs";
import { BreadcrumbItem } from "@/types";

export interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
  className?: string;
  headingLevel?: 1 | 2;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  breadcrumbs,
  actions,
  className = "",
  headingLevel = 1,
}) => {
  const Heading = headingLevel === 1 ? "h1" : "h2";
  return (
    <div
      className={`flex flex-col gap-3 pb-6 border-b border-[#DED8CF]/60 ${className}`}
    >
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumbs items={breadcrumbs} className="mb-1" />
      )}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Heading className="font-heading text-2xl sm:text-3xl font-extrabold text-[#2C2C24] tracking-tight">
            {title}
          </Heading>
          {description && (
            <p className="text-sm text-[#78786C] mt-1 font-sans font-medium max-w-2xl">
              {description}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex flex-wrap items-center gap-3">{actions}</div>
        )}
      </div>
    </div>
  );
};
