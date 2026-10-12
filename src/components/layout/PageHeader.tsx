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
    <div className={`admin-page-header ${className}`}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumbs items={breadcrumbs} className="mb-1" />
      )}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Heading className="admin-page-title">{title}</Heading>
          {description && (
            <p className="admin-page-description">{description}</p>
          )}
        </div>
        {actions && (
          <div className="flex flex-wrap items-center gap-3">{actions}</div>
        )}
      </div>
    </div>
  );
};
