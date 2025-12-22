import { useState, useEffect, useMemo, useCallback } from "react";
// @ts-ignore - JSON import is handled by TypeScript config
import portsData from '../../../../data/admins.json';
import { EyeIcon, PencilIcon, TrashIcon, NoSymbolIcon, CheckCircleIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { Link } from "react-router-dom";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../../components/ui/table";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../Dashboard/PageMeta";

interface Port {
  id: string;
  portName: string;
  emirate: string;
  freeDays: number;
  returnDeadlineRule: string;
  demurragePerDay: string;
  toll: string;
  movementRestrictions: string;
  status: "Active" | "Inactive";
  lastUpdate: string;
  tollEnabled: boolean;
  tradeLicenseNumbers?: string;
}

// Function to get and map port data from JSON
const getPortsData = (): Port[] => {
  if (!portsData || !portsData.portConfigurations) return [];

  return portsData.portConfigurations.map(port => ({
    id: port.id || 'N/A',
    portName: port.portName || 'N/A',
    emirate: port.emirate || 'N/A',
    freeDays: port.freeDays || 0,
    returnDeadlineRule: port.returnDeadlineRule || 'N/A',
    demurragePerDay: port.demurragePerDay || 'N/A',
    toll: port.toll || 'N/A',
    movementRestrictions: port.movementRestrictions || 'N/A',
    status: (port.status as Port['status']) || 'Active',
    lastUpdate: port.lastUpdate || 'N/A',
    tollEnabled: port.tollEnabled || false,
    tradeLicenseNumbers: port.tradeLicenseNumbers
  }));
};

export default function PortConfigurations() {
  const [ports, setPorts] = useState<Port[]>([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);

  // Load port data on component mount
  useEffect(() => {
    const data = getPortsData();
    setPorts(data);
  }, []);

  const [searchTerm, setSearchTerm] = useState("");
  const [portNameFilter, setPortNameFilter] = useState("");
  const [emirateFilter, setEmirateFilter] = useState("");
  const [tollEnabledFilter, setTollEnabledFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [movementRestrictedFilter, setMovementRestrictedFilter] = useState("");
  const [selectedPorts, setSelectedPorts] = useState<string[]>([]);

  const [showDisablePopup, setShowDisablePopup] = useState(false);
  const [selectedPort, setSelectedPort] = useState<Port | null>(null);

  // Get unique values for dropdowns
  const uniquePortNames = [...new Set(ports.map(port => port.portName))];
  const uniqueEmirates = [...new Set(ports.map(port => port.emirate))];

  // Format toll data for display (two-line format)
  // Memoized formatToll function
  const formatToll = useCallback((toll: string) => {
    if (toll === "None") return { firstLine: "None", secondLine: "" };

    // Split by space to get type and price
    const parts = toll.split(' ');
    if (parts.length >= 2) {
      const type = parts[0];
      const price = parts.slice(1).join(' ');
      return { firstLine: type, secondLine: price };
    }

    return { firstLine: toll, secondLine: "" };
  }, []);

  // Handle search and filtering - memoized for performance
  const filteredPorts = useMemo(() => {
    return ports.filter((port) => {
      // Search term filtering
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        searchTerm === "" ||
        port.portName.toLowerCase().includes(term) ||
        port.emirate.toLowerCase().includes(term) ||
        (port.tradeLicenseNumbers && port.tradeLicenseNumbers.toLowerCase().includes(term)) ||
        port.id.toLowerCase().includes(term);

      const matchesPortName = portNameFilter ? port.portName === portNameFilter : true;
      const matchesEmirate = emirateFilter ? port.emirate === emirateFilter : true;
      const matchesTollEnabled = tollEnabledFilter ?
        (tollEnabledFilter === "Yes" ? port.tollEnabled : !port.tollEnabled) : true;
      const matchesStatus = statusFilter ? port.status === statusFilter : true;
      const matchesMovementRestricted = movementRestrictedFilter ?
        (movementRestrictedFilter === "Yes" ? port.movementRestrictions !== "None" : port.movementRestrictions === "None") : true;

      return matchesSearch && matchesPortName && matchesEmirate && matchesTollEnabled && matchesStatus && matchesMovementRestricted;
    });
  }, [ports, searchTerm, portNameFilter, emirateFilter, tollEnabledFilter, statusFilter, movementRestrictedFilter]);

  // Pagination logic
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredPorts.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredPorts.length / recordsPerPage);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, portNameFilter, emirateFilter, tollEnabledFilter, statusFilter, movementRestrictedFilter]);

  // Handle selection
  const togglePortSelection = (portId: string) => {
    setSelectedPorts(prev =>
      prev.includes(portId)
        ? prev.filter(id => id !== portId)
        : [...prev, portId]
    );
  };

  const toggleSelectAll = () => {
    setSelectedPorts(
      selectedPorts.length === currentRecords.length
        ? []
        : currentRecords.map(port => port.id)
    );
  };

  // Disable/Enable port
  const handleToggleStatus = () => {
    if (selectedPort) {
      setPorts(prev => prev.map(p =>
        p.id === selectedPort.id ? {
          ...p,
          status: p.status === "Active" ? "Inactive" as const : "Active" as const
        } : p
      ));
      setSelectedPort(null);
      setShowDisablePopup(false);
    }
  };

  // Bulk Actions Functions
  const handleBulkDisable = () => {
    if (selectedPorts.length > 0) {
      setPorts(prev => prev.map(p =>
        selectedPorts.includes(p.id) ? { ...p, status: "Inactive" as const } : p
      ));
      setSelectedPorts([]);
    }
  };

  const handleBulkEnable = () => {
    if (selectedPorts.length > 0) {
      setPorts(prev => prev.map(p =>
        selectedPorts.includes(p.id) ? { ...p, status: "Active" as const } : p
      ));
      setSelectedPorts([]);
    }
  };

  const handleBulkDelete = () => {
    if (selectedPorts.length > 0) {
      setPorts(prev => prev.filter(port => !selectedPorts.includes(port.id)));
      setSelectedPorts([]);
    }
  };

  const handleBulkExport = () => {
    if (selectedPorts.length > 0) {
      const selectedPortData = ports.filter(port => selectedPorts.includes(port.id));

      // Convert to CSV format
      const headers = ['Port Name', 'Emirate', 'Free Days', 'Return Deadline Rule', 'Demurrage/Day', 'Toll', 'Toll Enabled', 'Movement Restrictions', 'Status', 'Last Update'];
      const csvRows = selectedPortData.map(port => [
        port.portName,
        port.emirate,
        port.freeDays,
        port.returnDeadlineRule,
        port.demurragePerDay,
        port.toll,
        port.tollEnabled ? 'Yes' : 'No',
        port.movementRestrictions,
        port.status,
        port.lastUpdate
      ]);

      const csvContent = [
        headers.join(','),
        ...csvRows.map(row => row.join(','))
      ].join('\n');

      // Create and download CSV file
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.setAttribute('hidden', '');
      a.setAttribute('href', url);
      a.setAttribute('download', `ports_export_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  // Status badge colors
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 border border-green-200";
      case "Inactive":
        return "bg-red-100 text-red-800 border border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  // Toll badge colors
  const getTollColor = (enabled: boolean) => {
    return enabled ? "bg-blue-100 text-blue-800 border border-blue-200" : "bg-gray-100 text-gray-800 border border-gray-200";
  };

  // Movement restriction badge colors
  const getMovementColor = (restriction: string) => {
    return restriction === "None" ? "bg-gray-100 text-gray-800 border border-gray-200" : "bg-yellow-100 text-yellow-800 border border-yellow-200";
  };

  // Handle pagination buttons
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Handle records per page change
  const handleRecordsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRecordsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  return (
    <>
      <PageMeta
        title="Port Configurations | CMS Dashboard"
        description="Manage port configurations and rules"
      />
      <PageBreadcrumb pageTitle="Port Configurations" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="overflow-hidden w-full rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">

          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-white/[0.05] gap-3 sm:gap-0">
            <h2 className="font-bold text-lg text-gray-900 dark:text-white">Manage Ports</h2>
            <Link to="/add-port-rule-forms">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                <span className="text-xl">+</span> Add Port
              </button>
            </Link>
          </div>

          {/* Search & Filters */}
          <div className="px-5 py-3 space-y-3">
            {/* Search Box */}
            <input
              type="text"
              placeholder="Search Port name, Emirate, Trade license numbers"
              className="w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-white/[0.05] dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {/* 5 Filters */}
            <div className="flex flex-wrap gap-2 items-center">
              {/* Port Name Filter */}
              <select
                value={portNameFilter}
                onChange={(e) => setPortNameFilter(e.target.value)}
                className="px-3 py-1 border bg-gray-200 rounded-lg text-sm dark:bg-white/[0.05] dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Port Name</option>
                {uniquePortNames.map(name => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>

              {/* Emirate Filter */}
              <select
                value={emirateFilter}
                onChange={(e) => setEmirateFilter(e.target.value)}
                className="px-3 py-1 border bg-gray-200 rounded-lg text-sm dark:bg-white/[0.05] dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Emirate</option>
                {uniqueEmirates.map(emirate => (
                  <option key={emirate} value={emirate}>{emirate}</option>
                ))}
              </select>

              {/* Toll Enabled Filter */}
              <select
                value={tollEnabledFilter}
                onChange={(e) => setTollEnabledFilter(e.target.value)}
                className="px-3 py-1 border bg-gray-200 rounded-lg text-sm dark:bg-white/[0.05] dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Toll enabled?</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-1 border bg-gray-200 rounded-lg text-sm dark:bg-white/[0.05] dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Active/Inactive</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>

              {/* Movement Restricted Filter */}
              <select
                value={movementRestrictedFilter}
                onChange={(e) => setMovementRestrictedFilter(e.target.value)}
                className="px-3 py-1 border bg-gray-200 rounded-lg text-sm dark:bg-white/[0.05] dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Movement restricted?</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

            {/* Bulk Actions */}
            {selectedPorts.length > 0 && (
              <div className="flex flex-wrap gap-2 items-center pt-2 border-t border-gray-100">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedPorts.length} selected
                </span>
                <button
                  onClick={handleBulkEnable}
                  className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 flex items-center gap-1"
                >
                  <CheckCircleIcon className="w-4 h-4" /> Enable Selected
                </button>
                <button
                  onClick={handleBulkDisable}
                  className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 flex items-center gap-1"
                >
                  <NoSymbolIcon className="w-4 h-4" /> Disable Selected
                </button>
                <button
                  onClick={handleBulkExport}
                  className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 flex items-center gap-1"
                >
                  <ArrowDownTrayIcon className="w-4 h-4" /> Export CSV
                </button>
              </div>
            )}
          </div>

          {/* Table */}
          <div className="w-full overflow-x-auto">
            <Table className="w-full table-auto border border-gray-200 dark:border-white/10">
              <TableHeader className="border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-gray-900">
                <TableRow>
                  <TableCell className="px-5 py-3 text-start text-gray-500 font-medium text-xs dark:text-gray-400 border-r border-gray-200 dark:border-white/10">
                    <input
                      type="checkbox"
                      className="accent-blue-600"
                      checked={selectedPorts.length === currentRecords.length && currentRecords.length > 0}
                      onChange={toggleSelectAll}
                    />
                  </TableCell>
                  <TableCell className="px-5 py-3 text-start text-gray-500 font-medium text-xs dark:text-gray-400 border-r border-gray-200 dark:border-white/10">Port Name</TableCell>
                  <TableCell className="px-5 py-3 text-start text-gray-500 font-medium text-xs dark:text-gray-400 border-r border-gray-200 dark:border-white/10">Emirate</TableCell>
                  <TableCell className="px-5 py-3 text-start text-gray-500 font-medium text-xs dark:text-gray-400 border-r border-gray-200 dark:border-white/10">Free Days</TableCell>
                  <TableCell className="px-5 py-3 text-start text-gray-500 font-medium text-xs dark:text-gray-400 border-r border-gray-200 dark:border-white/10">Return Deadline Rule</TableCell>
                  <TableCell className="px-5 py-3 text-start text-gray-500 font-medium text-xs dark:text-gray-400 border-r border-gray-200 dark:border-white/10">Demurrage / Day</TableCell>
                  <TableCell className="px-5 py-3 text-start text-gray-500 font-medium text-xs dark:text-gray-400 border-r border-gray-200 dark:border-white/10">Toll</TableCell>
                  <TableCell className="px-5 py-3 text-start text-gray-500 font-medium text-xs dark:text-gray-400 border-r border-gray-200 dark:border-white/10">Movement Restrictions</TableCell>
                  <TableCell className="px-5 py-3 text-start text-gray-500 font-medium text-xs dark:text-gray-400 border-r border-gray-200 dark:border-white/10">Status</TableCell>
                  <TableCell className="px-5 py-3 text-start text-gray-500 font-medium text-xs dark:text-gray-400 border-r border-gray-200 dark:border-white/10">Last Update</TableCell>
                  <TableCell className="px-5 py-3 text-start text-gray-500 font-medium text-xs dark:text-gray-400">Actions</TableCell>
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-gray-200 dark:divide-white/10">
                {currentRecords.map((port) => {
                  const formattedToll = formatToll(port.toll);
                  return (
                    <TableRow key={port.id} className="hover:bg-gray-50 dark:hover:bg-white/5 border-b border-gray-200 dark:border-white/10">
                      <TableCell className="px-5 py-4 border-r border-gray-200 dark:border-white/10">
                        <input
                          type="checkbox"
                          className="accent-blue-600"
                          checked={selectedPorts.includes(port.id)}
                          onChange={() => togglePortSelection(port.id)}
                        />
                      </TableCell>
                      <TableCell className="px-5 py-4 font-medium border-r border-gray-200 dark:border-white/10">{port.portName}</TableCell>
                      <TableCell className="px-5 py-4 border-r border-gray-200 dark:border-white/10">{port.emirate}</TableCell>
                      <TableCell className="px-5 py-4 border-r border-gray-200 dark:border-white/10">{port.freeDays} days</TableCell>
                      <TableCell className="px-5 py-4 border-r border-gray-200 dark:border-white/10">{port.returnDeadlineRule}</TableCell>
                      <TableCell className="px-5 py-4 border-r border-gray-200 dark:border-white/10">{port.demurragePerDay}</TableCell>

                      {/* Toll */}
                      <TableCell className="px-5 py-4 border-r border-gray-200 dark:border-white/10">
                        <div className={`inline-flex flex-col items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTollColor(port.tollEnabled)} min-w-[80px]`}>
                          <span className="font-semibold">{formattedToll.firstLine}</span>
                          {formattedToll.secondLine && <span className="text-[10px] mt-0.5">{formattedToll.secondLine}</span>}
                        </div>
                      </TableCell>

                      {/* Movement Restrictions */}
                      <TableCell className="px-5 py-4 border-r border-gray-200 dark:border-white/10">
                        <div className={`inline-flex flex-col items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getMovementColor(port.movementRestrictions)} min-w-[100px]`}>
                          {port.movementRestrictions.includes(' ') ? (
                            <>
                              <span>{port.movementRestrictions.split(' ')[0]}</span>
                              <span className="text-[10px] mt-0.5">{port.movementRestrictions.split(' ').slice(1).join(' ')}</span>
                            </>
                          ) : (
                            <span>{port.movementRestrictions}</span>
                          )}
                        </div>
                      </TableCell>

                      <TableCell className="px-5 py-4 border-r border-gray-200 dark:border-white/10">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(port.status)}`}>
                          {port.status}
                        </span>
                      </TableCell>

                      <TableCell className="px-5 py-4 border-r border-gray-200 dark:border-white/10">{port.lastUpdate}</TableCell>

                      {/* Actions */}
                      <TableCell className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          {/* View */}
                          <div className="relative group">
                            <Link to={`/view-port-Rule-Forms/${port.id}`}>
                              <EyeIcon className="w-5 h-5 text-blue-600 group-hover:text-blue-800" />
                            </Link>
                            <span className="absolute left-1/2 -bottom-6 -translate-x-1/2 text-xs text-black dark:text-white px-2 py-1 opacity-0 group-hover:opacity-100 transition-all">
                              View
                            </span>
                          </div>

                          {/* Edit */}
                          <div className="relative group">
                            <Link to={`/edit-port-rule-forms/${port.id}`}>
                              <PencilIcon className="w-5 h-5 text-black group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-200" />
                            </Link>
                            <span className="absolute left-1/2 -bottom-6 -translate-x-1/2 text-xs text-black dark:text-white px-2 py-1 opacity-0 group-hover:opacity-100 transition-all">
                              Edit
                            </span>
                          </div>

                          {/* Enable/Disable */}
                          <div className="relative group">
                            <button
                              className={port.status === "Active" ? "text-red-600 hover:text-red-800" : "text-green-600 hover:text-green-800"}
                              onClick={() => {
                                setSelectedPort(port);
                                setShowDisablePopup(true);
                              }}
                            >
                              {port.status === "Active" ? <NoSymbolIcon className="w-5 h-5" /> : <CheckCircleIcon className="w-5 h-5" />}
                            </button>
                            <span className="absolute left-1/2 -bottom-6 -translate-x-1/2 text-xs text-black dark:text-white px-2 py-1 opacity-0 group-hover:opacity-100 transition-all">
                              {port.status === "Active" ? "Disable" : "Enable"}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            {filteredPorts.length === 0 && (
              <p className="text-center py-4 text-gray-500">No matching ports found.</p>
            )}
          </div>


          {/* Footer with Pagination */}
          <div className="px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 border-t border-gray-100 dark:border-white/[0.05]">
            <div className="flex items-center gap-4">
              <button
                className="flex items-center gap-2 text-red-500"
                onClick={handleBulkDelete}
                disabled={selectedPorts.length === 0}
              >
                <TrashIcon className="w-5 h-5" /> Delete Selected ({selectedPorts.length} records)
              </button>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Rows per page:</span>
                <select
                  value={recordsPerPage}
                  onChange={handleRecordsPerPageChange}
                  className="px-2 py-1 border rounded text-sm dark:bg-white/[0.05] dark:text-white"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {filteredPorts.length === 0 ? 0 : indexOfFirstRecord + 1}-{Math.min(indexOfLastRecord, filteredPorts.length)} of {filteredPorts.length}
              </span>

              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className={`px-2 py-1 border rounded-l ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                title="First page"
              >
                {"«"}
              </button>

              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-2 py-1 border-t border-b ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                title="Previous page"
              >
                {"<"}
              </button>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNumber;
                if (totalPages <= 5) {
                  pageNumber = i + 1;
                } else if (currentPage <= 3) {
                  pageNumber = i + 1;
                } else if (currentPage > totalPages - 3) {
                  pageNumber = totalPages - 4 + i;
                } else {
                  pageNumber = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`px-3 py-1 border-t border-b ${currentPage === pageNumber
                        ? 'bg-blue-600 text-white'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || totalPages === 0}
                className={`px-2 py-1 border-t border-b ${(currentPage === totalPages || totalPages === 0) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                title="Next page"
              >
                {">"}
              </button>

              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages || totalPages === 0}
                className={`px-2 py-1 border rounded-r ${(currentPage === totalPages || totalPages === 0) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                title="Last page"
              >
                {"»"}
              </button>
            </div>
          </div>

          {/* Disable/Enable Confirmation Popup */}
          {showDisablePopup && selectedPort && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
              <div className="bg-white p-6 rounded-xl shadow-xl w-80 text-center">
                <h2 className="text-lg font-semibold text-gray-800">
                  {selectedPort.status === "Active" ? "Disable Port?" : "Enable Port?"}
                </h2>
                <p className="text-sm text-gray-600 mt-2">
                  Are you sure you want to {selectedPort.status === "Active" ? "disable" : "enable"} <b>{selectedPort.portName}</b>?
                </p>
                {selectedPort.status === "Active" && (
                  <div className="mt-4">
                    <textarea
                      placeholder="Reason for disabling..."
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                      rows={3}
                    />
                  </div>
                )}
                <div className="flex justify-center gap-4 mt-6">
                  <button
                    className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-black rounded-md"
                    onClick={() => setShowDisablePopup(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className={`px-4 py-2 ${selectedPort.status === "Active" ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"} text-white rounded-md`}
                    onClick={handleToggleStatus}
                  >
                    Yes, {selectedPort.status === "Active" ? "Disable" : "Enable"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}