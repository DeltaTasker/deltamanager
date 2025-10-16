"use client";

import { useState } from "react";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type Period = "week" | "biweek" | "month" | "year" | "custom";
export type PeriodValue = Period; // Alias for backward compatibility

export type PeriodFilterProps = {
  value: Period;
  onChange: (period: Period) => void;
  customStartDate?: string;
  customEndDate?: string;
  onCustomDateChange?: (startDate: string, endDate: string) => void;
};

export function PeriodFilter({ 
  value, 
  onChange, 
  customStartDate, 
  customEndDate, 
  onCustomDateChange 
}: PeriodFilterProps) {
  const [showCustom, setShowCustom] = useState(value === "custom");

  const handlePeriodChange = (period: Period) => {
    if (period === "custom") {
      setShowCustom(true);
    } else {
      setShowCustom(false);
    }
    onChange(period);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <Button
          variant={value === "week" ? "default" : "outline"}
          size="sm"
          onClick={() => handlePeriodChange("week")}
          className={cn(
            "transition-colors",
            value === "week" && "bg-blue-600 hover:bg-blue-700"
          )}
        >
          Semana
        </Button>
        <Button
          variant={value === "biweek" ? "default" : "outline"}
          size="sm"
          onClick={() => handlePeriodChange("biweek")}
          className={cn(
            "transition-colors",
            value === "biweek" && "bg-blue-600 hover:bg-blue-700"
          )}
        >
          Quincena
        </Button>
        <Button
          variant={value === "month" ? "default" : "outline"}
          size="sm"
          onClick={() => handlePeriodChange("month")}
          className={cn(
            "transition-colors",
            value === "month" && "bg-blue-600 hover:bg-blue-700"
          )}
        >
          Mes
        </Button>
        <Button
          variant={value === "year" ? "default" : "outline"}
          size="sm"
          onClick={() => handlePeriodChange("year")}
          className={cn(
            "transition-colors",
            value === "year" && "bg-blue-600 hover:bg-blue-700"
          )}
        >
          Año
        </Button>
        <Button
          variant={value === "custom" ? "default" : "outline"}
          size="sm"
          onClick={() => handlePeriodChange("custom")}
          className={cn(
            "transition-colors",
            value === "custom" && "bg-purple-600 hover:bg-purple-700"
          )}
        >
          <Calendar className="mr-2 h-4 w-4" />
          Personalizado
        </Button>
      </div>

      {showCustom && (
        <div className="flex gap-2 items-center">
          <Input
            type="date"
            value={customStartDate}
            onChange={(e) => onCustomDateChange?.(e.target.value, customEndDate || "")}
            className="bg-slate-900 border-white/10 text-white"
          />
          <span className="text-gray-400">hasta</span>
          <Input
            type="date"
            value={customEndDate}
            onChange={(e) => onCustomDateChange?.(customStartDate || "", e.target.value)}
            className="bg-slate-900 border-white/10 text-white"
          />
        </div>
      )}
    </div>
  );
}

// Helper function to calculate date range based on period
export function getDateRangeForPeriod(period: Period, customStart?: string, customEnd?: string): { startDate: Date; endDate: Date } {
  const now = new Date();
  const endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
  let startDate: Date;

  switch (period) {
    case "week":
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 7);
      break;
    case "biweek":
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 15);
      break;
    case "month":
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case "year":
      startDate = new Date(now.getFullYear(), 0, 1);
      break;
    case "custom":
      startDate = customStart ? new Date(customStart) : new Date(now.getFullYear(), 0, 1);
      return {
        startDate,
        endDate: customEnd ? new Date(customEnd) : endDate
      };
    default:
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  }

  return { startDate, endDate };
}

// Helper function to check if a single date is in range
export function isDateInRange(
  date: Date | string,
  period: Period,
  customStartDate?: string,
  customEndDate?: string
): boolean {
  if (!date) return false;
  
  const { startDate, endDate } = getDateRangeForPeriod(period, customStartDate, customEndDate);
  const itemDate = new Date(date);
  
  return itemDate >= startDate && itemDate <= endDate;
}

// Helper function to filter transactions by date range
export function filterByDateRange<T extends { date: string }>(
  items: T[],
  period: Period,
  customStartDate?: string,
  customEndDate?: string
): T[] {
  if (!items || !Array.isArray(items)) {
    return [];
  }
  
  const { startDate, endDate } = getDateRangeForPeriod(period, customStartDate, customEndDate);
  
  return items.filter(item => {
    if (!item || !item.date) return false;
    const itemDate = new Date(item.date);
    return itemDate >= startDate && itemDate <= endDate;
  });
}

