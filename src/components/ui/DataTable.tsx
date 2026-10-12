import React from "react";
import { Column } from "@/types";

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string | number;
  emptyMessage?: string;
  className?: string;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  emptyMessage = "No records found.",
  className = "",
}: DataTableProps<T>) {
  return (
    <div
      className={`w-full overflow-x-auto rounded-3xl border border-[#E5EAF0] bg-white shadow-organic ${className}`}
    >
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-[#E5EAF0] bg-[#FFFFFF]">
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-6 py-4 text-xs font-semibold text-[#526581] uppercase tracking-wider font-sans"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#E5EAF0]/60">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-12 text-center text-sm text-[#526581]"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr
                key={keyExtractor(row)}
                className="hover:bg-[#F4F6F9]/40 transition-colors duration-150 group"
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className="px-6 py-4 text-sm text-[#101828] font-medium"
                  >
                    {col.render
                      ? col.render(row)
                      : ((row as Record<string, unknown>)[
                          col.key
                        ] as React.ReactNode)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
