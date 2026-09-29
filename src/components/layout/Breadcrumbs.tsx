import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { BreadcrumbItem } from "@/types";

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = "" }) => {
  return (
    <nav aria-label="Breadcrumb" className={`flex items-center text-xs text-[#78786C] ${className}`}>
      <ol className="inline-flex items-center space-x-1.5 flex-wrap">
        <li className="inline-flex items-center">
          <Link
            href="/"
            className="inline-flex items-center text-[#78786C] hover:text-[#5D7052] transition-colors"
          >
            <Home className="w-3.5 h-3.5 mr-1" />
            Home
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="inline-flex items-center">
              <ChevronRight className="w-3.5 h-3.5 text-[#DED8CF] mx-1 shrink-0" />
              {isLast || !item.href ? (
                <span className="font-semibold text-[#2C2C24]">{item.label}</span>
              ) : (
                <Link
                  href={item.href}
                  className="hover:text-[#5D7052] transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
