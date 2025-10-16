"use client";

import { ReactNode, useState } from "react";
import { ChevronDown, ChevronUp, Check, X } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface InlineTableRowProps {
  isEditing: boolean;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onSave: () => void;
  onCancel: () => void;
  visibleFields: ReactNode[];
  expandedContent?: ReactNode;
  actionButtons?: ReactNode;
  className?: string;
}

export function InlineTableRow({
  isEditing,
  isExpanded,
  onToggleExpand,
  onSave,
  onCancel,
  visibleFields,
  expandedContent,
  actionButtons,
  className,
}: InlineTableRowProps) {
  if (!isEditing) {
    // Modo lectura normal
    return (
      <TableRow className={className}>
        {visibleFields.map((field, index) => (
          <TableCell key={index}>{field}</TableCell>
        ))}
        <TableCell className="text-right">{actionButtons}</TableCell>
      </TableRow>
    );
  }

  // Modo edición
  return (
    <>
      <TableRow className={cn("bg-blue-50 dark:bg-blue-950", className)}>
        {visibleFields.map((field, index) => (
          <TableCell key={index}>{field}</TableCell>
        ))}
        <TableCell className="text-right">
          <div className="flex justify-end gap-2">
            {expandedContent && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleExpand}
                className="h-8 w-8 p-0"
              >
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onSave}
              className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancel}
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </TableCell>
      </TableRow>
      {isExpanded && expandedContent && (
        <TableRow className="bg-blue-50 dark:bg-blue-950">
          <TableCell colSpan={visibleFields.length + 1} className="p-4">
            <div className="rounded-lg border border-blue-200 bg-white dark:bg-gray-900 p-4">
              <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-blue-700 dark:text-blue-400">
                <ChevronDown className="h-4 w-4" />
                Campos Adicionales
              </div>
              {expandedContent}
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

