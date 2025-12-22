import { useState, useRef, useEffect, useMemo } from "react";
// @ts-ignore - JSON import is handled by TypeScript config
import shipmentData from '../../../../data/admins.json';
import { 
  EyeIcon, 
  PencilIcon, 
  DocumentIcon, 
  CurrencyDollarIcon, 
  TruckIcon, 
  ArrowDownTrayIcon,
  CheckCircleIcon,
  CalendarIcon,
  DocumentArrowUpIcon,
  ChevronDownIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { Link } from "react-router-dom";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../../components/ui/table";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../Dashboard/PageMeta";

interface Shipment {
  id: string;
  containerNo: string[];
  blDoNo: string;
  vin: string;
  eta: string;
  port: string;
  status: "Documents Pending" | "Arrived" | "In Transit" | "Cleared" | "Delayed" | "Cancelled";
  vendor: string;
  lastUpdated: string;
  customer?: string;
  cars?: number;
  arrivalDate?: string;
  doDocuments?: string[];
  manifestTxtFile?: string;
  deliveryNote?: string;
}

// Helper function to validate and convert status
const getValidStatus = (status: string): Shipment['status'] => {
  const validStatuses: Shipment['status'][] = [
    "Documents Pending", 
    "Arrived", 
    "In Transit", 
    "Cleared", 
    "Delayed", 
    "Cancelled"
  ];
  
  if (validStatuses.includes(status as Shipment['status'])) {
    return status as Shipment['status'];
  }
  
  return "Documents Pending";
};

// Function to get and map shipment data from JSON
const getShipmentsData = (): Shipment[] => {
  if (!shipmentData || !Array.isArray(shipmentData.shipments)) return [];
  
  return shipmentData.shipments.map((shipment: any) => {
    const validStatus = getValidStatus(shipment.status || 'Documents Pending');
    
    const containerNumbers = shipment.containerId 
      ? shipment.containerId.split(',').map((c: string) => c.trim())
      : [shipment.containerId || 'N/A'];
    
    return {
      id: shipment.id || '',
      containerNo: containerNumbers,
      blDoNo: shipment.trackingNumber || '',
      vin: shipment.vin || '', // Default to empty string if not in data
      eta: shipment.deliveryDate || 'N/A',
      port: shipment.destination || 'N/A',
      status: validStatus,
      vendor: shipment.origin || '—',
      lastUpdated: shipment.shipmentDate || 'N/A',
      customer: shipment.customer || 'N/A',
      cars: shipment.weight ? parseInt(shipment.weight) || 0 : 0,
      arrivalDate: '',
      doDocuments: [],
      manifestTxtFile: '',
      deliveryNote: ''
    };
  });
};

export default function Shipment() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [globalSearch, setGlobalSearch] = useState("");
  const [vinFilter, setVinFilter] = useState("");
  const [customerFilter, setCustomerFilter] = useState("");
  const [blFilter, setBlFilter] = useState("");
  const [doFilter, setDoFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [portFilter, setPortFilter] = useState("");
  const [etaStartFilter, setEtaStartFilter] = useState("");
  const [etaEndFilter, setEtaEndFilter] = useState("");
  const [selectedShipments, setSelectedShipments] = useState<string[]>([]);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  
  // Popup state (only keeping setShowAssignPopup for functionality)
  const [, setShowAssignPopup] = useState(false);

  // Load shipment data on component mount
  useEffect(() => {
    const data = getShipmentsData();
    setShipments(data);
  }, []);

  // Refs for date inputs
  const etaStartRef = useRef<HTMLInputElement | null>(null);
  const etaEndRef = useRef<HTMLInputElement | null>(null);

  // Handle calendar icon click
  const handleCalendarClick = (ref: React.RefObject<HTMLInputElement | null>): void => {
    if (ref.current) {
      ref.current.showPicker();
    }
  };

  // Handle filtering with global search - memoized for performance
  const filteredShipments = useMemo(() => {
    return shipments.filter((shipment) => {
      // Global search across multiple fields
      const matchesGlobalSearch = globalSearch 
        ? shipment.id.toLowerCase().includes(globalSearch.toLowerCase()) ||
          shipment.blDoNo.toLowerCase().includes(globalSearch.toLowerCase()) ||
          shipment.vin.toLowerCase().includes(globalSearch.toLowerCase()) ||
          shipment.containerNo.some(container => container.toLowerCase().includes(globalSearch.toLowerCase())) ||
          (shipment.customer || '').toLowerCase().includes(globalSearch.toLowerCase()) ||
          shipment.port.toLowerCase().includes(globalSearch.toLowerCase())
        : true;
      
      const matchesVIN = vinFilter ? shipment.vin.toLowerCase().includes(vinFilter.toLowerCase()) : true;
      const matchesCustomer = customerFilter ? (shipment.customer || '').toLowerCase().includes(customerFilter.toLowerCase()) : true;
      const matchesBL = blFilter ? shipment.blDoNo.toLowerCase().includes(blFilter.toLowerCase()) : true;
      const matchesDO = doFilter ? shipment.blDoNo.toLowerCase().includes(doFilter.toLowerCase()) : true;
      const matchesStatus = statusFilter ? shipment.status === statusFilter : true;
      const matchesPort = portFilter ? shipment.port === portFilter : true;
      
      // ETA Range filter
      let matchesEta = true;
      if (etaStartFilter || etaEndFilter) {
        const shipmentDate = new Date(shipment.eta);
        const startDate = etaStartFilter ? new Date(etaStartFilter) : null;
        const endDate = etaEndFilter ? new Date(etaEndFilter) : null;
        
        if (startDate && shipmentDate < startDate) matchesEta = false;
        if (endDate && shipmentDate > endDate) matchesEta = false;
      }

      return matchesGlobalSearch && matchesVIN && matchesCustomer && matchesBL && matchesDO && matchesStatus && matchesPort && matchesEta;
    });
  }, [shipments, globalSearch, vinFilter, customerFilter, blFilter, doFilter, statusFilter, portFilter, etaStartFilter, etaEndFilter]);

  // Pagination logic
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredShipments.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredShipments.length / recordsPerPage);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [globalSearch, vinFilter, customerFilter, blFilter, doFilter, statusFilter, portFilter, etaStartFilter, etaEndFilter]);

  // Handle selection
  const toggleShipmentSelection = (shipmentId: string): void => {
    setSelectedShipments(prev =>
      prev.includes(shipmentId)
        ? prev.filter(id => id !== shipmentId)
        : [...prev, shipmentId]
    );
  };

  const toggleSelectAll = (): void => {
    setSelectedShipments(
      selectedShipments.length === currentRecords.length
        ? []
        : currentRecords.map(shipment => shipment.id)
    );
  };

  // Status badge colors
  const getStatusColor = (status: string): string => {
    switch (status) {
      case "Documents Pending":
        return "bg-yellow-100 text-yellow-800 border border-yellow-200";
      case "Arrived":
        return "bg-green-100 text-green-800 border border-green-200";
      case "In Transit":
        return "bg-blue-100 text-blue-800 border border-blue-200";
      case "Cleared":
        return "bg-emerald-100 text-emerald-800 border border-emerald-200";
      case "Delayed":
        return "bg-orange-100 text-orange-800 border border-orange-200";
      case "Cancelled":
        return "bg-red-100 text-red-800 border border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  // Handle status change from table dropdown
  const handleStatusChangeInTable = (shipment: Shipment, newStatus: Shipment['status']) => {
    // Update status directly
    setShipments(prev => prev.map(s => 
      s.id === shipment.id ? { ...s, status: newStatus } : s
    ));
  };

  // Bulk actions
  const handleBulkAssign = (): void => {
    // TODO: Implement bulk assignment functionality
    // Implement bulk assign logic
  };

  const handleBulkExport = (): void => {
    // TODO: Implement bulk export functionality
    // Implement bulk export logic
  };

  // Render action buttons with hover tooltip
  const renderActionButtons = (shipment: Shipment) => {
    switch (shipment.status) {
      case "Documents Pending":
        return (
          <div className="flex items-center gap-2">
            {/* View */}
            <div className="relative group">
              <Link to={`/view-shipment/${shipment.id}`}>
                <EyeIcon className="w-5 h-5 text-blue-600 group-hover:text-blue-800 transition-colors" />
              </Link>
              <span className="absolute top-full mt-1 left-1/2 -translate-x-1/2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                View
              </span>
            </div>

            {/* Edit */}
            <div className="relative group">
              <Link to={`/edit-shipment/${shipment.id}`}>
                <PencilIcon className="w-5 h-5 text-black group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-200 transition-colors" />
              </Link>
              <span className="absolute top-full mt-1 left-1/2 -translate-x-1/2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                Edit
              </span>
            </div>

            {/* Docs */}
            <div className="relative group">
              <Link to="/documents">
                <DocumentIcon className="w-5 h-5 text-gray-600 group-hover:text-gray-800 dark:text-gray-400 dark:group-hover:text-gray-200 transition-colors" />
              </Link>
              <span className="absolute top-full mt-1 left-1/2 -translate-x-1/2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                Docs
              </span>
            </div>

            {/* Assign */}
            <div className="relative group">
              <button
                className="text-green-600 hover:text-green-800 transition-colors"
                onClick={() => {
                  setShowAssignPopup(true);
                }}
              >
                <TruckIcon className="w-5 h-5" />
              </button>
              <span className="absolute top-full mt-1 left-1/2 -translate-x-1/2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                Assign
              </span>
            </div>

            {/* Pay */}
            <div className="relative group">
              <Link to={`/payment/${shipment.id}`}>
                <CurrencyDollarIcon className="w-5 h-5 text-yellow-600 group-hover:text-yellow-800 transition-colors" />
              </Link>
              <span className="absolute top-full mt-1 left-1/2 -translate-x-1/2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                Pay
              </span>
            </div>

            {/* Update Cars */}
            <span className="text-gray-400 mx-1">•</span>
            <div className="relative group">
              <button
                className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                onClick={() => {
                  // TODO: Implement update cars functionality
                }}
              >
                Update Cars
              </button>
              <span className="absolute top-full mt-1 left-1/2 -translate-x-1/2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                Update Cars
              </span>
            </div>
          </div>
        );

      case "Arrived":
        return (
          <div className="flex flex-wrap items-center gap-1">
            {/* View Details */}
            <div className="relative group">
              <Link to={`/view-shipment/${shipment.id}`}>
                <button className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">
                  View Details
                </button>
              </Link>
              <span className="absolute top-full mt-1 left-1/2 -translate-x-1/2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                View Details
              </span>
            </div>

            <span className="text-gray-400 mx-1">|</span>

            {/* Edit */}
            <div className="relative group">
              <Link to={`/edit-shipment/${shipment.id}`}>
                <button className="text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">
                  Edit
                </button>
              </Link>
              <span className="absolute top-full mt-1 left-1/2 -translate-x-1/2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                Edit
              </span>
            </div>

            <span className="text-gray-400 mx-1">|</span>

            {/* Assign Clearance Agent */}
            <div className="relative group">
              <button
                className="text-sm font-medium text-green-600 hover:text-green-800 transition-colors"
                onClick={() => {
                  // TODO: Implement assign clearance agent functionality
                }}
              >
                Assign Clearance Agent
              </button>
              <span className="absolute top-full mt-1 left-1/2 -translate-x-1/2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                Assign Clearance
              </span>
            </div>

            <span className="text-gray-400 mx-1">|</span>

            {/* Assign Transport */}
            <div className="relative group">
              <button
                className="text-sm font-medium text-green-600 hover:text-green-800 transition-colors"
                onClick={() => {
                  setShowAssignPopup(true);
                }}
              >
                Assign Transport
              </button>
              <span className="absolute top-full mt-1 left-1/2 -translate-x-1/2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                Assign Transport
              </span>
            </div>

            <span className="text-gray-400 mx-1">|</span>

            {/* Override Demurrage */}
            <div className="relative group">
              <button
                className="text-sm font-medium text-orange-600 hover:text-orange-800 transition-colors"
                onClick={() => {
                  // TODO: Implement override demurrage functionality
                }}
              >
                Override Demurrage
              </button>
              <span className="absolute top-full mt-1 left-1/2 -translate-x-1/2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                Override Demurrage
              </span>
            </div>

            <span className="text-gray-400 mx-1">|</span>

            {/* Close Shipment */}
            <div className="relative group">
              <button
                className="text-sm font-medium text-red-600 hover:text-red-800 transition-colors"
                onClick={() => {
                  // TODO: Implement close shipment functionality
                }}
              >
                Close Shipment
              </button>
              <span className="absolute top-full mt-1 left-1/2 -translate-x-1/2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                Close Shipment
              </span>
            </div>
          </div>
        );

      default:
        return (
          <div className="flex items-center gap-2">
            {/* View */}
            <div className="relative group">
              <Link to={`/view-shipment/${shipment.id}`}>
                <EyeIcon className="w-5 h-5 text-blue-600 group-hover:text-blue-800 transition-colors" />
              </Link>
              <span className="absolute top-full mt-1 left-1/2 -translate-x-1/2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                View
              </span>
            </div>

            {/* Edit */}
            <div className="relative group">
              <Link to={`/edit-shipment/${shipment.id}`}>
                <PencilIcon className="w-5 h-5 text-black group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-200 transition-colors" />
              </Link>
              <span className="absolute top-full mt-1 left-1/2 -translate-x-1/2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                Edit
              </span>
            </div>
          </div>
        );
    }
  };

  return (
    <>
      <PageMeta
        title="Shipment Management | CMS Dashboard"
        description="Manage shipments and containers"
      />
      <PageBreadcrumb pageTitle="Shipment Management" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="overflow-hidden w-full rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">

          {/* Header with Add Button */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-white/[0.05] gap-3 sm:gap-0">
            <h2 className="font-bold text-lg text-gray-900 dark:text-white">Manage Shipments</h2>
            
            {/* Add Shipment Button */}
          <Link to="/edit-shipment/new">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <span className="text-xl">+</span> Add Shipments
          </button>
        </Link>
          </div>

          {/* Global Search */}
          <div className="px-5 py-3">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Search Shipments by ID, Container No., BL/DO No., VIN, etc."
                  className="flex-1 px-3 py-2 border bg-white-200 rounded-lg text-sm dark:bg-white/[0.05] dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={globalSearch}
                  onChange={(e) => setGlobalSearch(e.target.value)}
                />
                {globalSearch && (
                  <button
                    onClick={() => setGlobalSearch("")}
                    className="px-3 py-2 text-gray-500 hover:text-gray-700"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="px-5 py-3 space-y-3 border-t border-gray-100 dark:border-white/[0.05]">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* VIN Filter */}
              <div className="flex flex-col">
                <label className="text-xs text-gray-500 mb-1">By VIN</label>
                <input
                  type="text"
                  placeholder="Enter VIN"
                  className="px-3 py-2 border bg-gray-200 rounded-lg text-sm dark:bg-white/[0.05] dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={vinFilter}
                  onChange={(e) => setVinFilter(e.target.value)}
                />
              </div>

              {/* Customer Filter */}
              <div className="flex flex-col">
                <label className="text-xs text-gray-500 mb-1">By Customer</label>
                <input
                  type="text"
                  placeholder="Enter Customer"
                  className="px-3 py-2 border bg-gray-200 rounded-lg text-sm dark:bg-white/[0.05] dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={customerFilter}
                  onChange={(e) => setCustomerFilter(e.target.value)}
                />
              </div>

              {/* B/L No Filter */}
              <div className="flex flex-col">
                <label className="text-xs text-gray-500 mb-1">By B/L No.</label>
                <input
                  type="text"
                  placeholder="Enter B/L No."
                  className="px-3 py-2 border bg-gray-200 rounded-lg text-sm dark:bg-white/[0.05] dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={blFilter}
                  onChange={(e) => setBlFilter(e.target.value)}
                />
              </div>

              {/* DO No Filter */}
              <div className="flex flex-col">
                <label className="text-xs text-gray-500 mb-1">By DO No.</label>
                <input
                  type="text"
                  placeholder="Enter DO No."
                  className="px-3 py-2 border bg-gray-200 rounded-lg text-sm dark:bg-white/[0.05] dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={doFilter}
                  onChange={(e) => setDoFilter(e.target.value)}
                />
              </div>

              {/* Status Filter */}
              <div className="flex flex-col">
                <label className="text-xs text-gray-500 mb-1">By Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border bg-gray-200 rounded-lg text-sm dark:bg-white/[0.05] dark:text-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Status</option>
                  <option value="Documents Pending">Documents Pending</option>
                  <option value="Arrived">Arrived</option>
                  <option value="In Transit">In Transit</option>
                  <option value="Cleared">Cleared</option>
                  <option value="Delayed">Delayed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              {/* Port Filter */}
              <div className="flex flex-col">
                <label className="text-xs text-gray-500 mb-1">By Port</label>
                <select
                  value={portFilter}
                  onChange={(e) => setPortFilter(e.target.value)}
                  className="px-3 py-2 border bg-gray-200 rounded-lg text-sm dark:bg-white/[0.05] dark:text-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Ports</option>
                  <option value="Jebel Ali">Jebel Ali</option>
                  <option value="Khalifa">Khalifa</option>
                  <option value="Mina Rashid">Mina Rashid</option>
                  <option value="Sharjah">Sharjah</option>
                </select>
              </div>

              {/* ETA Range Filter */}
              <div className="flex flex-col col-span-2">
                <label className="text-xs text-gray-500 mb-1">By ETA Range</label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type="date"
                      ref={etaStartRef}
                      className="w-full px-3 py-2 pl-10 pr-3 border bg-gray-200 rounded-lg text-sm dark:bg-white/[0.05] dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={etaStartFilter}
                      onChange={(e) => setEtaStartFilter(e.target.value)}
                    />
                    <div
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                      onClick={() => handleCalendarClick(etaStartRef)}
                    >
                      <CalendarIcon className="h-5 w-5 text-gray-500" />
                    </div>
                  </div>
                  
                  <span className="text-gray-500">to</span>
                  
                  <div className="relative flex-1">
                    <input
                      type="date"
                      ref={etaEndRef}
                      className="w-full px-3 py-2 pl-10 pr-3 border bg-gray-200 rounded-lg text-sm dark:bg-white/[0.05] dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={etaEndFilter}
                      onChange={(e) => setEtaEndFilter(e.target.value)}
                    />
                    <div
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                      onClick={() => handleCalendarClick(etaEndRef)}
                    >
                      <CalendarIcon className="h-5 w-5 text-gray-500" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bulk Actions */}
            {selectedShipments.length > 0 && (
              <div className="flex flex-wrap gap-2 items-center pt-2 border-t border-gray-100">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedShipments.length} selected
                </span>
                
                <button
                  onClick={handleBulkAssign}
                  className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 flex items-center gap-1"
                >
                  <TruckIcon className="w-4 h-4" />
                  Assign
                </button>
                
                <button
                  onClick={handleBulkExport}
                  className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 flex items-center gap-1"
                >
                  <ArrowDownTrayIcon className="w-4 h-4" />
                  Export CSV
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
                      checked={selectedShipments.length === currentRecords.length && currentRecords.length > 0}
                      onChange={toggleSelectAll}
                    />
                  </TableCell>
                  <TableCell className="px-5 py-3 text-start text-gray-500 font-medium text-xs dark:text-gray-400 border-r border-gray-200 dark:border-white/10">Shipment ID</TableCell>
                  <TableCell className="px-5 py-3 text-start text-gray-500 font-medium text-xs dark:text-gray-400 border-r border-gray-200 dark:border-white/10">Container No.</TableCell>
                  <TableCell className="px-5 py-3 text-start text-gray-500 font-medium text-xs dark:text-gray-400 border-r border-gray-200 dark:border-white/10">BL/DO No.</TableCell>
                  <TableCell className="px-5 py-3 text-start text-gray-500 font-medium text-xs dark:text-gray-400 border-r border-gray-200 dark:border-white/10">ETA</TableCell>
                  <TableCell className="px-5 py-3 text-start text-gray-500 font-medium text-xs dark:text-gray-400 border-r border-gray-200 dark:border-white/10">Port</TableCell>
                  <TableCell className="px-5 py-3 text-start text-gray-500 font-medium text-xs dark:text-gray-400 border-r border-gray-200 dark:border-white/10">Status</TableCell>
                  <TableCell className="px-5 py-3 text-start text-gray-500 font-medium text-xs dark:text-gray-400 border-r border-gray-200 dark:border-white/10">Vendor</TableCell>
                  <TableCell className="px-5 py-3 text-start text-gray-500 font-medium text-xs dark:text-gray-400 border-r border-gray-200 dark:border-white/10">Last Updated</TableCell>
                  <TableCell className="px-5 py-3 text-start text-gray-500 font-medium text-xs dark:text-gray-400">Action</TableCell>
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-gray-200 dark:divide-white/10">
                {currentRecords.map((shipment) => (
                  <TableRow key={shipment.id} className="hover:bg-gray-50 dark:hover:bg-white/5 border-b border-gray-200 dark:border-white/10">
                    <TableCell className="px-5 py-4 border-r border-gray-200 dark:border-white/10">
                      <input 
                        type="checkbox" 
                        className="accent-blue-600" 
                        checked={selectedShipments.includes(shipment.id)}
                        onChange={() => toggleShipmentSelection(shipment.id)}
                      />
                    </TableCell>
                    <TableCell className="px-5 py-4 font-medium border-r border-gray-200 dark:border-white/10">{shipment.id}</TableCell>
                    <TableCell className="px-5 py-4 border-r border-gray-200 dark:border-white/10">
                      {shipment.containerNo.map((container, index) => (
                        <div key={index} className="text-sm">
                          {container}
                          {index < shipment.containerNo.length - 1 && ", "}
                        </div>
                      ))}
                    </TableCell>
                    <TableCell className="px-5 py-4 border-r border-gray-200 dark:border-white/10">{shipment.blDoNo}</TableCell>
                    <TableCell className="px-5 py-4 border-r border-gray-200 dark:border-white/10">{shipment.eta}</TableCell>
                    <TableCell className="px-5 py-4 border-r border-gray-200 dark:border-white/10">{shipment.port}</TableCell>
                    
                    {/* Status Column with Dropdown */}
                    <TableCell className="px-5 py-4 border-r border-gray-200 dark:border-white/10">
                      <div className="space-y-1">
                        <div className="relative inline-block">
                          <div className="flex items-center gap-1">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(shipment.status)}`}>
                              {shipment.status}
                            </span>
                            <div className="relative">
                              <select
                                value={shipment.status}
                                onChange={(e) => handleStatusChangeInTable(shipment, e.target.value as Shipment['status'])}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              >
                                <option value="Documents Pending">Documents Pending</option>
                                <option value="Arrived">Arrived</option>
                                <option value="In Transit">In Transit</option>
                                <option value="Cleared">Cleared</option>
                                <option value="Delayed">Delayed</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>
                              <ChevronDownIcon className="w-3 h-3 text-gray-500" />
                            </div>
                          </div>
                        </div>
                        
                        {/* Arrival Details */}
                        {shipment.status === "Arrived" && shipment.arrivalDate && (
                          <div className="text-xs text-gray-500">
                            <div>Arrived: {shipment.arrivalDate}</div>
                            {shipment.doDocuments && shipment.doDocuments.length > 0 && (
                              <div className="flex items-center gap-1 mt-1">
                                <DocumentArrowUpIcon className="w-3 h-3" />
                                <span>DO: {shipment.doDocuments.length} files</span>
                              </div>
                            )}
                            {shipment.manifestTxtFile && (
                              <div className="flex items-center gap-1 mt-1">
                                <CheckCircleIcon className="w-3 h-3 text-green-500" />
                                <span>TXT: {shipment.manifestTxtFile}</span>
                              </div>
                            )}
                            {shipment.deliveryNote && (
                              <div className="flex items-center gap-1 mt-1">
                                <DocumentIcon className="w-3 h-3 text-blue-500" />
                                <span>Delivery note: {shipment.deliveryNote}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    
                    <TableCell className="px-5 py-4 border-r border-gray-200 dark:border-white/10">{shipment.vendor}</TableCell>
                    <TableCell className="px-5 py-4 border-r border-gray-200 dark:border-white/10">{shipment.lastUpdated}</TableCell>
                    
                    {/* Action Buttons with Hover Tooltip */}
                    <TableCell className="px-5 py-4">
                      {renderActionButtons(shipment)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredShipments.length === 0 && (
              <p className="text-center py-4 text-gray-500">No matching records found.</p>
            )}
          </div>

          {/* Pagination Controls */}
          {filteredShipments.length > 0 && (
            <div className="px-5 py-4 border-t border-gray-100 dark:border-white/[0.05]">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Showing {indexOfFirstRecord + 1} to {Math.min(indexOfLastRecord, filteredShipments.length)} of {filteredShipments.length} entries
                  </span>
                  <select
                    value={recordsPerPage}
                    onChange={(e) => {
                      setRecordsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="px-2 py-1 border rounded text-sm dark:bg-white/[0.05] dark:text-white"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-white/[0.05] dark:text-white"
                  >
                    Previous
                  </button>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNumber;
                      if (totalPages <= 5) {
                        pageNumber = i + 1;
                      } else if (currentPage <= 3) {
                        pageNumber = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNumber = totalPages - 4 + i;
                      } else {
                        pageNumber = currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => setCurrentPage(pageNumber)}
                          className={`px-3 py-1 border rounded text-sm ${
                            currentPage === pageNumber
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'hover:bg-gray-100 dark:hover:bg-white/[0.05] dark:text-white'
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    })}
                  </div>
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-white/[0.05] dark:text-white"
                  >
                    Next
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