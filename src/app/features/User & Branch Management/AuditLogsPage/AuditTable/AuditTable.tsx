"use client";

import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  Globe,
  Search,
  FileSearch,
} from "lucide-react";
import { AuditLog } from "../../../../../lib/audit";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../components/ui/table";
import { Skeleton } from "../../../../components/ui/skeleton";
import { Avatar, AvatarFallback } from "../../../../components/ui/avatar";
import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";

interface AuditTableProps {
  logs: AuditLog[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function getActionColor(action: string) {
  switch (action.toLowerCase()) {
    case "create":
      return "bg-green-100 text-green-800 border-green-200";
    case "update":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "delete":
      return "bg-red-100 text-red-800 border-red-200";
    case "login":
      return "bg-[#104e90]/10 text-[#0c3469] border-[#104e90]/20";
    default:
      return "bg-gray-100 text-[#434343] border-gray-200";
  }
}

function TableSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <TableRow
          key={i}
          className="border-gray-200 hover:bg-[#ecf3ff]/30 transition-colors duration-300"
        >
          <TableCell>
            <Skeleton className="h-4 w-32 bg-gray-200 transition-colors duration-300" />
          </TableCell>
          <TableCell>
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-full bg-gray-200 transition-colors duration-300" />
              <div className="space-y-1">
                <Skeleton className="h-3 w-24 bg-gray-200 transition-colors duration-300" />
                <Skeleton className="h-3 w-32 bg-gray-200 transition-colors duration-300" />
              </div>
            </div>
          </TableCell>
          <TableCell>
            <Skeleton className="h-6 w-20 rounded-full bg-gray-200 transition-colors duration-300" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-6 w-16 rounded-full bg-gray-200 transition-colors duration-300" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-48 bg-gray-200 transition-colors duration-300" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-28 bg-gray-200 transition-colors duration-300" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center justify-center py-16 px-4 relative overflow-hidden"
    >
      <motion.div
        initial={{ scale: 0.5 }}
        animate={{ scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 15,
          delay: 0.1,
        }}
        className="relative mb-6"
      >
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "loop",
          }}
          className="absolute inset-0 rounded-full bg-gradient-to-r from-[#519fcc]/30 to-[#104e90]/30 blur-lg"
        />

        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "loop",
            ease: "linear",
          }}
          className="absolute -inset-2 rounded-full border-2 border-dashed border-[#519fcc]/20"
        />

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="relative flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-[#ecf3ff] to-white shadow-lg border border-gray-200"
        >
          <div className="relative">
            <FileSearch className="h-12 w-12 text-[#104e90]" />

            <motion.div
              animate={{
                rotate: [0, -10, 10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "loop",
              }}
              className="absolute -right-1 -top-1"
            >
              <Search className="h-5 w-5 text-[#519fcc]" />
            </motion.div>
          </div>

          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 0 }}
              animate={{
                opacity: [0, 1, 0],
                y: [-5, 5],
                x: Math.random() * 10 - 5,
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "loop",
                delay: i * 0.5,
              }}
              className={`absolute h-1 w-1 rounded-full ${
                i === 1
                  ? "bg-[#104e90]"
                  : i === 2
                  ? "bg-[#519fcc]"
                  : "bg-[#0c3469]"
              }`}
              style={{
                left: `${Math.random() * 60 + 20}%`,
                top: `${Math.random() * 60 + 20}%`,
              }}
            />
          ))}
        </motion.div>
      </motion.div>

      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-xl font-semibold text-[#434343] mb-2 text-center"
      >
        No Audit Logs Found
      </motion.h3>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-sm text-gray-600 text-center max-w-md mb-6"
      >
        We couldn't find any audit logs matching your current filters. Try
        adjusting your search criteria, date range, or clear filters to see all
        logs.
      </motion.p>

      <div className="absolute -z-10 w-40 h-40 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-10">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path
            fill="#519fcc"
            d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.6,90,-16.3,89.9,-0.1C89.8,16.2,86.9,32.4,80.1,47.1C73.3,61.8,62.6,75,48.9,83.4C35.2,91.8,18.6,95.4,1.9,92.9C-14.8,90.4,-29.6,81.9,-41.9,71.9C-54.3,62,-64.1,50.6,-71.9,37.6C-79.7,24.6,-85.5,10.1,-85.4,-4.4C-85.3,-19,-79.4,-33.6,-70.1,-45.9C-60.7,-58.2,-48,-68.2,-34.5,-75.8C-21,-83.4,-10.5,-88.5,2.1,-91.8C14.7,-95.1,29.4,-96.6,44.7,-76.4Z"
            transform="translate(100 100)"
          />
        </svg>
      </div>
    </motion.div>
  );
}

export function AuditTable({
  logs,
  isLoading,
  currentPage,
  totalPages,
  onPageChange,
}: AuditTableProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="rounded-xl border border-gray-300 bg-white shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md"
    >
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-[#ecf3ff] transition-colors duration-300">
            <TableRow className="border-gray-300 hover:bg-[#ecf3ff] transition-colors duration-300">
              <TableHead className="text-[#434343] font-medium sticky top-0 bg-[#ecf3ff] min-w-[140px] transition-colors duration-300">
                Timestamp
              </TableHead>
              <TableHead className="text-[#434343] font-medium sticky top-0 bg-[#ecf3ff] min-w-[180px] transition-colors duration-300">
                User
              </TableHead>
              <TableHead className="text-[#434343] font-medium sticky top-0 bg-[#ecf3ff] min-w-[100px] transition-colors duration-300">
                Module
              </TableHead>
              <TableHead className="text-[#434343] font-medium sticky top-0 bg-[#ecf3ff] min-w-[90px] transition-colors duration-300">
                Action
              </TableHead>
              <TableHead className="text-[#434343] font-medium sticky top-0 bg-[#ecf3ff] min-w-[250px] transition-colors duration-300">
                Description
              </TableHead>
              <TableHead className="text-[#434343] font-medium sticky top-0 bg-[#ecf3ff] min-w-[130px] transition-colors duration-300">
                IP Address
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableSkeleton />
            ) : logs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="p-0">
                  <EmptyState />
                </TableCell>
              </TableRow>
            ) : (
              <AnimatePresence mode="popLayout">
                {logs.map((log, index) => (
                  <motion.tr
                    key={log.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2, delay: index * 0.03 }}
                    className="border-gray-200 hover:bg-[#ecf3ff]/30 transition-colors duration-300 group"
                  >
                    <TableCell className="text-sm text-gray-600 font-mono transition-colors duration-300">
                      <div className="flex flex-col">
                        <span>
                          {format(new Date(log.timestamp), "MMM d, yyyy")}
                        </span>
                        <span className="text-xs text-gray-400">
                          {format(new Date(log.timestamp), "HH:mm:ss")}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 border border-gray-200 transition-colors duration-300">
                          <AvatarFallback className="bg-[#519fcc]/10 text-[#104e90] text-xs transition-colors duration-300">
                            {log.user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm font-medium text-[#434343] truncate transition-colors duration-300">
                            {log.user.name}
                          </span>
                          <span className="text-xs text-gray-500 truncate transition-colors duration-300">
                            {log.user.email}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="bg-gray-50 text-[#434343] border-gray-200 font-normal transition-all duration-300"
                      >
                        {log.module}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`${getActionColor(
                          log.action
                        )} font-normal transition-all duration-300`}
                      >
                        {log.action}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600 max-w-[300px] transition-colors duration-300">
                      <span className="line-clamp-2">{log.description}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm text-gray-600 font-mono transition-colors duration-300">
                        <Globe className="h-3 w-3 text-gray-400 transition-opacity duration-300" />
                        {log.ipAddress}
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {!isLoading && logs.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-gray-200 bg-gray-50 transition-colors duration-300">
          <p className="text-xs sm:text-sm text-gray-600 transition-colors duration-300 text-center sm:text-left">
            Page{" "}
            <span className="font-medium text-[#434343] transition-colors duration-300">
              {currentPage}
            </span>{" "}
            of{" "}
            <span className="font-medium text-[#434343] transition-colors duration-300">
              {totalPages}
            </span>
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="bg-white border border-gray-300 hover:bg-[#ecf3ff] hover:border-[#104e90] hover:text-[#104e90] disabled:opacity-50 transition-all duration-300"
            >
              <ChevronLeft className="h-4 w-4 transition-colors duration-300" />
              <span className="hidden sm:inline ml-1">Previous</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="bg-white border border-gray-300 hover:bg-[#ecf3ff] hover:border-[#104e90] hover:text-[#104e90] disabled:opacity-50 transition-all duration-300"
            >
              <span className="hidden sm:inline mr-1">Next</span>
              <ChevronRight className="h-4 w-4 transition-colors duration-300" />
            </Button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
