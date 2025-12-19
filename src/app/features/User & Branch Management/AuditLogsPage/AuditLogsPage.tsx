"use client"

import { useState, useEffect, useMemo } from "react"
import { motion } from "framer-motion"
import { Activity, RefreshCw } from "lucide-react"
import type { DateRange } from "react-day-picker"
import { Button } from "../../../components/ui/button"
import { AuditFilters } from "./AuditFilter/AuditFilter"
import { AuditTable } from "./AuditTable/AuditTable"
import { AuditLog, mockAuditLogs } from "../../../../lib/audit"

const ITEMS_PER_PAGE = 5

export function AuditLogs() {
  const [logs, setLogs] = useState<AuditLog[]>(mockAuditLogs)
  const [isLoading, setIsLoading] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const [selectedModule, setSelectedModule] = useState<string | null>(null)
  const [selectedAction, setSelectedAction] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState<DateRange | undefined>()

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setLogs(mockAuditLogs)
      setIsRefreshing(false)
    }, 800)
  }

  const handleReset = () => {
    setSearchQuery("")
    setSelectedUser(null)
    setSelectedModule(null)
    setSelectedAction(null)
    setDateRange(undefined)
    setCurrentPage(1)
  }

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesSearch =
          log.user.name.toLowerCase().includes(query) ||
          log.user.email.toLowerCase().includes(query) ||
          log.module.toLowerCase().includes(query) ||
          log.action.toLowerCase().includes(query) ||
          log.description.toLowerCase().includes(query) ||
          log.ipAddress.includes(query)
        if (!matchesSearch) return false
      }

      if (selectedUser && log.user.name !== selectedUser) return false
      if (selectedModule && log.module !== selectedModule) return false
      if (selectedAction && log.action !== selectedAction) return false

      if (dateRange?.from) {
        const logDate = new Date(log.timestamp)
        if (logDate < dateRange.from) return false
        if (dateRange.to && logDate > dateRange.to) return false
      }

      return true
    })
  }, [logs, searchQuery, selectedUser, selectedModule, selectedAction, dateRange])

  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / ITEMS_PER_PAGE))
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, selectedUser, selectedModule, selectedAction, dateRange])

  return (
    <div className="min-h-screen bg-gray-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#104e90]/10 transition-colors duration-300">
              <Activity className="h-5 w-5 text-[#104e90] transition-colors duration-300" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-[#434343] transition-colors duration-300">
                Audit Logs
              </h1>
              <p className="text-sm text-gray-600 transition-colors duration-300">
                Track system activities and changes
              </p>
            </div>
          </div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="bg-white border border-gray-300 hover:bg-[#ecf3ff] hover:border-[#104e90] hover:text-[#104e90] transition-all duration-300 self-start sm:self-auto"
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 transition-transform duration-300 ${
                  isRefreshing ? "animate-spin" : ""
                }`}
              />
              Refresh
            </Button>
          </motion.div>
        </motion.div>

        {/* Filters */}
        <div className="mb-6">
          <AuditFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedUser={selectedUser}
            onUserChange={setSelectedUser}
            selectedModule={selectedModule}
            onModuleChange={setSelectedModule}
            selectedAction={selectedAction}
            onActionChange={setSelectedAction}
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            onReset={handleReset}
          />
        </div>

        {/* Results count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-4 flex items-center gap-2 transition-colors duration-300"
        >
          <span className="text-sm text-gray-600 transition-colors duration-300">
            Showing{" "}
            <span className="font-medium text-[#434343] transition-colors duration-300">
              {paginatedLogs.length}
            </span>{" "}
            of{" "}
            <span className="font-medium text-[#434343] transition-colors duration-300">
              {filteredLogs.length}
            </span>{" "}
            logs
          </span>
          {(searchQuery || selectedUser || selectedModule || selectedAction || dateRange) && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#104e90]/10 text-[#0c3469] border border-[#104e90]/20 transition-all duration-300">
              Filtered
            </span>
          )}
        </motion.div>

        {/* Table */}
        <AuditTable
          logs={paginatedLogs}
          isLoading={isLoading}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  )
}