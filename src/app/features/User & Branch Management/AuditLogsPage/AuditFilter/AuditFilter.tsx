"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Calendar,
  User,
  Zap,
  Layers,
  RotateCcw,
  ChevronDown,
} from "lucide-react";
import { Calendar as CalendarComponent } from "../../../../../app/components/ui/calendar";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";
import { actions, modules, users } from "../../../../../lib/audit";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../../components/ui/popover";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../../components/ui/dropdown-menu";

interface AuditFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedUser: string | null;
  onUserChange: (value: string | null) => void;
  selectedModule: string | null;
  onModuleChange: (value: string | null) => void;
  selectedAction: string | null;
  onActionChange: (value: string | null) => void;
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
  onReset: () => void;
}

export function AuditFilters({
  searchQuery,
  onSearchChange,
  selectedUser,
  onUserChange,
  selectedModule,
  onModuleChange,
  selectedAction,
  onActionChange,
  dateRange,
  onDateRangeChange,
  onReset,
}: AuditFiltersProps) {
  const [calendarOpen, setCalendarOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="flex flex-col gap-3 sm:gap-4"
    >
      <div className="flex flex-col lg:flex-row gap-2 sm:gap-3">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 transition-colors duration-300" />
          <Input
            placeholder="Search logs by user, action, module..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-white border border-gray-300 focus:border-[#104e90] focus:ring-[#104e90]/20 h-10 transition-all duration-300 text-[#434343] placeholder:text-gray-400"
          />
        </div>

        <div className="flex flex-wrap gap-2 sm:gap-2">
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="h-10 px-3 bg-white border border-gray-300 hover:bg-[#ecf3ff] hover:border-[#104e90]/50 min-w-[140px] justify-start transition-all duration-300 group"
              >
                <Calendar className="h-4 w-4 mr-2 text-[#519fcc] transition-colors duration-300 group-hover:text-[#104e90]" />
                <span className="text-sm truncate text-[#434343] transition-colors duration-300">
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "MMM d")} -{" "}
                        {format(dateRange.to, "MMM d")}
                      </>
                    ) : (
                      format(dateRange.from, "MMM d, yyyy")
                    )
                  ) : (
                    "Date Range"
                  )}
                </span>
                <ChevronDown className="h-3 w-3 ml-auto text-[#519fcc] transition-colors duration-300 group-hover:text-[#104e90]" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto p-0 bg-white border border-gray-300 shadow-lg transition-all duration-300"
              align="start"
            >
              <CalendarComponent
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={(range) => {
                  onDateRangeChange(range);
                  if (range?.to) setCalendarOpen(false);
                }}
                numberOfMonths={1}
                className="rounded-lg"
              />
            </PopoverContent>
          </Popover>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="h-10 px-3 bg-white border border-gray-300 hover:bg-[#ecf3ff] hover:border-[#104e90]/50 min-w-[120px] justify-start transition-all duration-300 group"
              >
                <User className="h-4 w-4 mr-2 text-[#519fcc] transition-colors duration-300 group-hover:text-[#104e90]" />
                <span className="text-sm truncate text-[#434343] transition-colors duration-300">
                  {selectedUser || "User"}
                </span>
                <ChevronDown className="h-3 w-3 ml-auto text-[#519fcc] transition-colors duration-300 group-hover:text-[#104e90]" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="bg-white border border-gray-300 shadow-lg w-48 transition-all duration-300"
              align="start"
            >
              <DropdownMenuItem
                onSelect={() => onUserChange(null)}
                className="text-[#434343] hover:bg-[#ecf3ff] transition-colors duration-300 cursor-pointer"
              >
                All Users
              </DropdownMenuItem>
              {users.map((user) => (
                <DropdownMenuItem
                  key={user}
                  onSelect={() => onUserChange(user)}
                  className="text-[#434343] hover:bg-[#ecf3ff] transition-colors duration-300 cursor-pointer"
                >
                  {user}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="h-10 px-3 bg-white border border-gray-300 hover:bg-[#ecf3ff] hover:border-[#104e90]/50 min-w-[110px] justify-start transition-all duration-300 group"
              >
                <Zap className="h-4 w-4 mr-2 text-[#519fcc] transition-colors duration-300 group-hover:text-[#104e90]" />
                <span className="text-sm truncate text-[#434343] transition-colors duration-300">
                  {selectedAction || "Action"}
                </span>
                <ChevronDown className="h-3 w-3 ml-auto text-[#519fcc] transition-colors duration-300 group-hover:text-[#104e90]" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="bg-white border border-gray-300 shadow-lg transition-all duration-300"
              align="start"
            >
              <DropdownMenuItem
                onSelect={() => onActionChange(null)}
                className="text-[#434343] hover:bg-[#ecf3ff] transition-colors duration-300 cursor-pointer"
              >
                All Actions
              </DropdownMenuItem>
              {actions.map((action) => (
                <DropdownMenuItem
                  key={action}
                  onSelect={() => onActionChange(action)}
                  className="text-[#434343] hover:bg-[#ecf3ff] transition-colors duration-300 cursor-pointer"
                >
                  {action}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="h-10 px-3 bg-white border border-gray-300 hover:bg-[#ecf3ff] hover:border-[#104e90]/50 min-w-[110px] justify-start transition-all duration-300 group"
              >
                <Layers className="h-4 w-4 mr-2 text-[#519fcc] transition-colors duration-300 group-hover:text-[#104e90]" />
                <span className="text-sm truncate text-[#434343] transition-colors duration-300">
                  {selectedModule || "Module"}
                </span>
                <ChevronDown className="h-3 w-3 ml-auto text-[#519fcc] transition-colors duration-300 group-hover:text-[#104e90]" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="bg-white border border-gray-300 shadow-lg transition-all duration-300"
              align="start"
            >
              <DropdownMenuItem
                onSelect={() => onModuleChange(null)}
                className="text-[#434343] hover:bg-[#ecf3ff] transition-colors duration-300 cursor-pointer"
              >
                All Modules
              </DropdownMenuItem>
              {modules.map((module) => (
                <DropdownMenuItem
                  key={module}
                  onSelect={() => onModuleChange(module)}
                  className="text-[#434343] hover:bg-[#ecf3ff] transition-colors duration-300 cursor-pointer"
                >
                  {module}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="ghost"
            onClick={onReset}
            className="flex items-center justify-center bg-[#104e90] hover:bg-[#0c3469] text-white rounded-lg shadow-md px-4 py-2 transition-all duration-300"
          >
            <RotateCcw className="h-4 w-4 mr-2 transition-colors duration-300 group-hover:text-[#104e90]" />
            <span className="hidden sm:inline">Reset</span>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
