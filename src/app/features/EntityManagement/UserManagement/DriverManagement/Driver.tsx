import { useState, useEffect } from "react";
import { EyeIcon, PencilIcon, TrashIcon, DocumentIcon, CheckCircleIcon, NoSymbolIcon, ArrowDownTrayIcon, TruckIcon } from '@heroicons/react/24/outline';
import { Link } from "react-router-dom";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../../../components/ui/table";
import driverData from '../../../../../data/admins.json';
import PageBreadcrumb from "../../../../components/common/PageBreadCrumb";
import PageMeta from "../../../Dashboard/PageMeta";

interface Driver {
  id: string;
  firstName: string;
  lastName: string;
  vendor: string;
  email: string;
  phone: string;
  licenseNumber: string;
  assignedTruck: string;
  lastActive: string;
  status: "Pending" | "Approved" | "Suspended" | "Blacklisted";
  licenseExpiry?: string;
  documents?: Array<{
    name: string;
    type: string;
    expiry: string;
  }>;
}

// Get drivers data from JSON file
const getDriversData = (): Driver[] => {
  if (!driverData || !driverData.drivers) return [];
  
  return driverData.drivers.map((driver, index) => ({
    id: driver.id || `V-CMS-${String(index + 1).padStart(3, '0')}`,
    firstName: driver.firstName || 'Doe',
    lastName: driver.lastName || 'John',
    vendor: (driver as any).vendor || 'Vendor 2',
    email: driver.email || 'driver@gmail.com',
    phone: driver.phone || '+97122334456',
    licenseNumber: driver.licenseNumber || 'COMM12345678',
    assignedTruck: driver.assignedTruck || 'A12345',
    lastActive: (driver as any).lastActive || '21/2/2025',
    status: (driver.status as 'Pending' | 'Approved' | 'Suspended' | 'Blacklisted') || 'Approved',
    licenseExpiry: driver.licenseExpiry || '12/12/2025',
    documents: (driver as any).documents || [
      { name: 'License Copy', type: 'License', expiry: '12/12/2025' },
      { name: 'Passport Copy', type: 'Passport', expiry: '12/12/2027' },
      { name: 'Visa Copy', type: 'Visa', expiry: '12/12/2026' }
    ]
  }));
};

export default function DriverTable() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  // Load drivers data on component mount
  useEffect(() => {
    const data = getDriversData();
    setDrivers(data);
  }, []);

  const [searchTerm, setSearchTerm] = useState("");
  const [vendorFilter, setVendorFilter] = useState("");
  const [licenseExpiryFilter, setLicenseExpiryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [assignedTruckFilter, setAssignedTruckFilter] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedDrivers, setSelectedDrivers] = useState<string[]>([]);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showAssignTruckPopup, setShowAssignTruckPopup] = useState(false);
  const [showSuspendPopup, setShowSuspendPopup] = useState(false);
  const [showViewDocumentsPopup, setShowViewDocumentsPopup] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);

  // Get unique vendors for filter
  const vendors = Array.from(new Set(drivers.map(driver => driver.vendor)));

  // Handle search and filtering
  const filteredDrivers = drivers.filter((driver) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      `${driver.firstName} ${driver.lastName}`.toLowerCase().includes(term) ||
      driver.phone.toLowerCase().includes(term) ||
      driver.licenseNumber.toLowerCase().includes(term) ||
      driver.id.toLowerCase().includes(term);

    const matchesVendor = vendorFilter ? driver.vendor === vendorFilter : true;
    const matchesStatus = statusFilter ? driver.status === statusFilter : true;
    
    // License expiry filter (within X days)
    const matchesLicenseExpiry = licenseExpiryFilter ? {
      "30": isExpiringWithinDays(driver.licenseExpiry || '', 30),
      "60": isExpiringWithinDays(driver.licenseExpiry || '', 60),
      "90": isExpiringWithinDays(driver.licenseExpiry || '', 90)
    }[licenseExpiryFilter] || true : true;
    
    // Assigned truck filter
    const matchesAssignedTruck = assignedTruckFilter ? {
      "Assigned": driver.assignedTruck && driver.assignedTruck !== 'N/A',
      "Unassigned": !driver.assignedTruck || driver.assignedTruck === 'N/A'
    }[assignedTruckFilter] || true : true;

    return matchesSearch && matchesVendor && matchesLicenseExpiry && matchesStatus && matchesAssignedTruck;
  });

  // Check if date is expiring within X days
  const isExpiringWithinDays = (dateStr: string, days: number) => {
    if (dateStr === 'N/A' || !dateStr) return false;
    
    const [day, month, year] = dateStr.split('/').map(Number);
    const expiryDate = new Date(year, month - 1, day);
    const today = new Date();
    const daysFromNow = new Date();
    daysFromNow.setDate(today.getDate() + days);
    
    return expiryDate <= daysFromNow && expiryDate >= today;
  };

  // Handle sorting
  const sortedDrivers = [...filteredDrivers].sort((a, b) => {
    if (!sortBy) return 0;

    let aValue: any;
    let bValue: any;

    if (sortBy === "name") {
      aValue = `${a.firstName} ${a.lastName}`;
      bValue = `${b.firstName} ${b.lastName}`;
    } else if (sortBy === "lastActive") {
      const [aDay, aMonth, aYear] = a.lastActive.split('/').map(Number);
      const [bDay, bMonth, bYear] = b.lastActive.split('/').map(Number);
      aValue = new Date(aYear, aMonth - 1, aDay);
      bValue = new Date(bYear, bMonth - 1, bDay);
    } else if (sortBy === "licenseExpiry") {
      if (!a.licenseExpiry || !b.licenseExpiry) return 0;
      const [aDay, aMonth, aYear] = a.licenseExpiry.split('/').map(Number);
      const [bDay, bMonth, bYear] = b.licenseExpiry.split('/').map(Number);
      aValue = new Date(aYear, aMonth - 1, aDay);
      bValue = new Date(bYear, bMonth - 1, bDay);
    }

    if (sortOrder === "asc") {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  // Pagination logic
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = sortedDrivers.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredDrivers.length / recordsPerPage);

  // Handle selection
  const toggleDriverSelection = (driverId: string) => {
    setSelectedDrivers(prev =>
      prev.includes(driverId)
        ? prev.filter(id => id !== driverId)
        : [...prev, driverId]
    );
  };

  const toggleSelectAll = () => {
    setSelectedDrivers(
      selectedDrivers.length === currentRecords.length
        ? []
        : currentRecords.map(driver => driver.id)
    );
  };

  // Delete confirmation handlers
  const handleDelete = () => {
    if (selectedDriver) {
      setDrivers(prev => prev.filter(driver => driver.id !== selectedDriver.id));
      setSelectedDriver(null);
      setShowDeletePopup(false);
    }
  };

  // Approve driver
  const handleApprove = (driver: Driver) => {
    setDrivers(prev => prev.map(d => 
      d.id === driver.id ? { ...d, status: "Approved" as const } : d
    ));
  };

  // Suspend driver
  const handleSuspend = () => {
    if (selectedDriver) {
      setDrivers(prev => prev.map(d => 
        d.id === selectedDriver.id ? { ...d, status: "Suspended" as const } : d
      ));
      setSelectedDriver(null);
      setShowSuspendPopup(false);
    }
  };

  // Blacklist driver
  const handleBlacklist = (driver: Driver) => {
    setDrivers(prev => prev.map(d => 
      d.id === driver.id ? { ...d, status: "Blacklisted" as const } : d
    ));
  };

  // Export driver data
  const handleExport = (driver: Driver) => {
    console.log('Exporting driver data:', driver);
    // Implement export logic here
  };

  // Bulk actions
  const handleBulkAssignVendor = () => {
    console.log('Assigning selected to vendor:', selectedDrivers);
    // Implement bulk assign vendor logic
  };

  const handleBulkSuspend = () => {
    setDrivers(prev => prev.map(driver => 
      selectedDrivers.includes(driver.id) ? { ...driver, status: "Suspended" } : driver
    ));
    setSelectedDrivers([]);
  };

  const handleBulkExport = () => {
    console.log('Exporting selected:', selectedDrivers);
    // Implement bulk export logic
  };

  // Status badge colors
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800 border border-green-200";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border border-yellow-200";
      case "Suspended":
        return "bg-red-100 text-red-800 border border-red-200";
      case "Blacklisted":
        return "bg-gray-800 text-white border border-gray-900";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  // Get date color for expiry
  const getDateColor = (dateStr: string) => {
    if (isExpired(dateStr)) {
      return "text-red-600 font-medium";
    } else if (isExpiringWithinDays(dateStr, 30)) {
      return "text-yellow-600 font-medium";
    } else if (isExpiringWithinDays(dateStr, 60)) {
      return "text-orange-600 font-medium";
    } else if (isExpiringWithinDays(dateStr, 90)) {
      return "text-blue-600 font-medium";
    } else {
      return "text-green-600";
    }
  };

  // Check if date is expired
  const isExpired = (dateStr: string) => {
    if (dateStr === 'N/A' || !dateStr) return false;
    
    const [day, month, year] = dateStr.split('/').map(Number);
    const expiryDate = new Date(year, month - 1, day);
    const today = new Date();
    return expiryDate < today;
  };

  const handleRecordsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRecordsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <PageMeta
        title="Driver Management | CMS Dashboard"
        description="Manage drivers and their information"
      />
      <PageBreadcrumb pageTitle="Driver Management" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="overflow-hidden w-full rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-white/[0.05] gap-3 sm:gap-0">
        <h2 className="font-bold text-lg text-gray-900 dark:text-white">Manage Drivers</h2>
        <Link to="/add-driver">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <span className="text-xl">+</span> Add Driver
          </button>
        </Link>
      </div>

      {/* Search & Filters */}
      <div className="px-5 py-3 space-y-3">
        <input
          type="text"
          placeholder="Search Driver Name, Mobile, Driving License, Driver ID"
          className="w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-white/[0.05] dark:text-white"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Filters */}
        <div className="flex flex-wrap gap-2 items-center">
          {/* Vendor Filter */}
          <select
            value={vendorFilter}
            onChange={(e) => setVendorFilter(e.target.value)}
            className="px-3 py-1 border bg-gray-200 rounded-lg text-sm dark:bg-white/[0.05] dark:text-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Vendors</option>
            {vendors.map(vendor => (
              <option key={vendor} value={vendor}>{vendor}</option>
            ))}
          </select>

          {/* License Expiry Filter */}
          <select
            value={licenseExpiryFilter}
            onChange={(e) => setLicenseExpiryFilter(e.target.value)}
            className="px-3 py-1 border bg-gray-200 rounded-lg text-sm dark:bg-white/[0.05] dark:text-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="">License Expiry</option>
            <option value="30">Next 30 days</option>
            <option value="60">Next 60 days</option>
            <option value="90">Next 90 days</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1 border bg-gray-200 rounded-lg text-sm dark:bg-white/[0.05] dark:text-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Suspended">Suspended</option>
            <option value="Blacklisted">Blacklisted</option>
          </select>

          {/* Assigned Truck Filter */}
          <select
            value={assignedTruckFilter}
            onChange={(e) => setAssignedTruckFilter(e.target.value)}
            className="px-3 py-1 border bg-gray-200 rounded-lg text-sm dark:bg-white/[0.05] dark:text-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Assigned Truck</option>
            <option value="Assigned">Assigned</option>
            <option value="Unassigned">Unassigned</option>
          </select>

          {/* Sorting */}
          <select
            value={sortBy}
            onChange={(e) => {
              const value = e.target.value;
              if (value) {
                setSortBy(value);
                setSortOrder(sortOrder === "asc" ? "desc" : "asc");
              }
            }}
            className="px-3 py-1 border bg-gray-200 rounded-lg text-sm dark:bg-white/[0.05] dark:text-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Sort By</option>
            <option value="name">Name</option>
            <option value="lastActive">Last Active</option>
            <option value="licenseExpiry">License Expiry</option>
          </select>
        </div>

        {/* Bulk Actions */}
        {selectedDrivers.length > 0 && (
          <div className="flex flex-wrap gap-2 items-center pt-2 border-t border-gray-100">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {selectedDrivers.length} selected
            </span>
            <button
              onClick={handleBulkAssignVendor}
              className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
            >
              Assign Selected to Vendor
            </button>
            <button
              onClick={handleBulkSuspend}
              className="px-3 py-1 bg-yellow-600 text-white rounded-lg text-sm hover:bg-yellow-700"
            >
              Suspend Selected
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
        <Table className="w-full table-auto">
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell className="px-5 py-3 text-start text-gray-500 font-medium text-xs dark:text-gray-400">
                <input 
                  type="checkbox" 
                  className="accent-blue-600" 
                  checked={selectedDrivers.length === currentRecords.length && currentRecords.length > 0}
                  onChange={toggleSelectAll}
                />
              </TableCell>
              <TableCell className="px-5 py-3 text-start text-gray-500 font-medium text-xs dark:text-gray-400">ID</TableCell>
              <TableCell className="px-5 py-3 text-start text-gray-500 font-medium text-xs dark:text-gray-400">First Name</TableCell>
              <TableCell className="px-5 py-3 text-start text-gray-500 font-medium text-xs dark:text-gray-400">Last Name</TableCell>
              <TableCell className="px-5 py-3 text-start text-gray-500 font-medium text-xs dark:text-gray-400">Vendor</TableCell>
              <TableCell className="px-5 py-3 text-start text-gray-500 font-medium text-xs dark:text-gray-400">Email</TableCell>
              <TableCell className="px-5 py-3 text-start text-gray-500 font-medium text-xs dark:text-gray-400">Phone</TableCell>
              <TableCell className="px-5 py-3 text-start text-gray-500 font-medium text-xs dark:text-gray-400">Driving License No.</TableCell>
              <TableCell className="px-5 py-3 text-start text-gray-500 font-medium text-xs dark:text-gray-400">Assigned Truck</TableCell>
              <TableCell className="px-5 py-3 text-start text-gray-500 font-medium text-xs dark:text-gray-400">Last Active</TableCell>
              <TableCell className="px-5 py-3 text-start text-gray-500 font-medium text-xs dark:text-gray-400">Status</TableCell>
              <TableCell className="px-5 py-3 text-start text-gray-500 font-medium text-xs dark:text-gray-400">Actions</TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {currentRecords.map((driver) => (
              <TableRow key={driver.id} className="hover:bg-gray-50 dark:hover:bg-white/5">
                <TableCell className="px-5 py-4">
                  <input 
                    type="checkbox" 
                    className="accent-blue-600" 
                    checked={selectedDrivers.includes(driver.id)}
                    onChange={() => toggleDriverSelection(driver.id)}
                  />
                </TableCell>
                <TableCell className="px-5 py-4 font-medium">{driver.id}</TableCell>
                <TableCell className="px-5 py-4">{driver.firstName}</TableCell>
                <TableCell className="px-5 py-4">{driver.lastName}</TableCell>
                <TableCell className="px-5 py-4">{driver.vendor}</TableCell>
                <TableCell className="px-5 py-4">
                  <a href={`mailto:${driver.email}`} className="underline text-blue-600">{driver.email}</a>
                </TableCell>
                <TableCell className="px-5 py-4">{driver.phone}</TableCell>
                <TableCell className="px-5 py-4">
                  <div className="flex flex-col">
                    <span>{driver.licenseNumber}</span>
                    {driver.licenseExpiry && (
                      <span className={`text-xs ${getDateColor(driver.licenseExpiry)}`}>
                        Exp: {driver.licenseExpiry}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="px-5 py-4">
                  <div className="flex items-center gap-1">
                    {driver.assignedTruck && driver.assignedTruck !== 'N/A' ? (
                      <>
                        <TruckIcon className="w-4 h-4" />
                        {driver.assignedTruck}
                      </>
                    ) : (
                      <span className="text-gray-400">Not Assigned</span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="px-5 py-4">{driver.lastActive}</TableCell>
                <TableCell className="px-5 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(driver.status)}`}>
                    {driver.status}
                  </span>
                </TableCell>

                {/* Action Icons - All requested actions */}
                <TableCell className="px-5 py-4">
                  <div className="flex items-center gap-1">
                    {/* View */}
                    <div className="relative group">
                      <button
                        onClick={() => {
                          // Open side panel with driver details
                          console.log('View driver:', driver.id);
                        }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <EyeIcon className="w-5 h-5" />
                      </button>
                      <span className="absolute left-1/2 -bottom-6 -translate-x-1/2 text-xs text-black dark:text-white px-2 py-1 opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap">
                        View
                      </span>
                    </div>

                    {/* Edit */}
                    <div className="relative group">
                      <Link to={`/edit-driver/${driver.id}`}>
                        <PencilIcon className="w-5 h-5 text-black group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-200" />
                      </Link>
                      <span className="absolute left-1/2 -bottom-6 -translate-x-1/2 text-xs text-black dark:text-white px-2 py-1 opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap">
                        Edit
                      </span>
                    </div>

                    {/* Delete */}
                    <div className="relative group">
                      <button
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                        onClick={() => {
                          setSelectedDriver(driver);
                          setShowDeletePopup(true);
                        }}
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                      <span className="absolute left-1/2 -bottom-6 -translate-x-1/2 text-xs text-black dark:text-white px-2 py-1 opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap">
                        Delete
                      </span>
                    </div>

                    {/* Approve - Show for Pending drivers */}
                    {driver.status === "Pending" && (
                      <div className="relative group">
                        <button
                          className="text-green-600 hover:text-green-800"
                          onClick={() => handleApprove(driver)}
                        >
                          <CheckCircleIcon className="w-5 h-5" />
                        </button>
                        <span className="absolute left-1/2 -bottom-6 -translate-x-1/2 text-xs text-black dark:text-white px-2 py-1 opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap">
                          Approve
                        </span>
                      </div>
                    )}

                    {/* Suspend - Show for Approved drivers */}
                    {driver.status === "Approved" && (
                      <div className="relative group">
                        <button
                          className="text-yellow-600 hover:text-yellow-800"
                          onClick={() => {
                            setSelectedDriver(driver);
                            setShowSuspendPopup(true);
                          }}
                        >
                          <NoSymbolIcon className="w-5 h-5" />
                        </button>
                        <span className="absolute left-1/2 -bottom-6 -translate-x-1/2 text-xs text-black dark:text-white px-2 py-1 opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap">
                          Suspend
                        </span>
                      </div>
                    )}

                    {/* Export */}
                    <div className="relative group">
                      <button
                        className="text-blue-600 hover:text-blue-800"
                        onClick={() => handleExport(driver)}
                      >
                        <ArrowDownTrayIcon className="w-5 h-5" />
                      </button>
                      <span className="absolute left-1/2 -bottom-6 -translate-x-1/2 text-xs text-black dark:text-white px-2 py-1 opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap">
                        Export
                      </span>
                    </div>

                    {/* View Documents */}
                    <div className="relative group">
                      <button
                        className="text-purple-600 hover:text-purple-800"
                        onClick={() => {
                          setSelectedDriver(driver);
                          setShowViewDocumentsPopup(true);
                        }}
                      >
                        <DocumentIcon className="w-5 h-5" />
                      </button>
                      <span className="absolute left-1/2 -bottom-6 -translate-x-1/2 text-xs text-black dark:text-white px-2 py-1 opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap">
                        View Docs
                      </span>
                    </div>

                    {/* Blacklist - Optional: Show for Suspended drivers if needed */}
                    {driver.status === "Suspended" && (
                      <div className="relative group">
                        <button
                          className="text-gray-800 hover:text-gray-900"
                          onClick={() => handleBlacklist(driver)}
                        >
                          <NoSymbolIcon className="w-5 h-5" />
                        </button>
                        <span className="absolute left-1/2 -bottom-6 -translate-x-1/2 text-xs text-black dark:text-white px-2 py-1 opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap">
                          Blacklist
                        </span>
                      </div>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {currentRecords.length === 0 && (
          <p className="text-center py-4 text-gray-500">No matching records found.</p>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 border-t border-gray-100 dark:border-white/[0.05]">
        <div className="flex items-center gap-4">
          <button 
            className="flex items-center gap-2 text-red-500 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={selectedDrivers.length === 0}
            onClick={() => {
              if (selectedDrivers.length > 0) {
                setShowDeletePopup(true);
              }
            }}
          >
            <TrashIcon className="w-5 h-5" /> Delete Selected ({selectedDrivers.length} records)
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
            {filteredDrivers.length === 0 ? 0 : indexOfFirstRecord + 1}-{Math.min(indexOfLastRecord, filteredDrivers.length)} of {filteredDrivers.length}
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
                onClick={() => paginate(pageNumber)}
                className={`px-3 py-1 border-t border-b ${
                  currentPage === pageNumber 
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

      {/* Delete Confirmation Popup */}
      {showDeletePopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-80 text-center">
            <h2 className="text-lg font-semibold text-gray-800">Delete Driver?</h2>
            <p className="text-sm text-gray-600 mt-2">
              Are you sure you want to delete <b>{selectedDriver?.firstName} {selectedDriver?.lastName}</b>?
            </p>
            <div className="flex justify-center gap-4 mt-6">
              <button
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-black rounded-md"
                onClick={() => setShowDeletePopup(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
                onClick={handleDelete}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Suspend Confirmation Popup */}
      {showSuspendPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-96 text-center">
            <h2 className="text-lg font-semibold text-gray-800">Suspend Driver?</h2>
            <p className="text-sm text-gray-600 mt-2">
              Are you sure you want to suspend <b>{selectedDriver?.firstName} {selectedDriver?.lastName}</b>?
            </p>
            <div className="mt-4">
              <textarea
                placeholder="Reason for suspension..."
                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                rows={3}
              />
            </div>
            <div className="flex justify-center gap-4 mt-6">
              <button
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-black rounded-md"
                onClick={() => setShowSuspendPopup(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md"
                onClick={handleSuspend}
              >
                Yes, Suspend
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Truck Popup */}
      {showAssignTruckPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-96 text-center">
            <h2 className="text-lg font-semibold text-gray-800">Assign Truck</h2>
            <p className="text-sm text-gray-600 mt-2">
              Assign truck to <b>{selectedDriver?.firstName} {selectedDriver?.lastName}</b>
            </p>
            
            <div className="mt-4 space-y-3">
              <select className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select Vendor</option>
                <option value="Vendor 1">Vendor 1</option>
                <option value="Vendor 2">Vendor 2</option>
                <option value="Vendor 3">Vendor 3</option>
                <option value="Vendor 4">Vendor 4</option>
              </select>
              
              <select className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select Available Truck</option>
                <option value="A12345">A12345 (Available)</option>
                <option value="B67890">B67890 (Available)</option>
                <option value="F24680">F24680 (Available)</option>
              </select>
              
              <div className="text-xs text-gray-500 mt-2">
                * Only showing trucks with valid documents and active status
              </div>
            </div>

            <div className="flex justify-center gap-4 mt-6">
              <button
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-black rounded-md"
                onClick={() => setShowAssignTruckPopup(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                onClick={() => setShowAssignTruckPopup(false)}
              >
                Assign Truck
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Documents Popup */}
      {showViewDocumentsPopup && selectedDriver && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-96 max-h-[80vh] overflow-y-auto">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Driver Documents</h2>
            <p className="text-sm text-gray-600 mb-4">
              Documents for <b>{selectedDriver.firstName} {selectedDriver.lastName}</b>
            </p>
            
            <div className="space-y-3">
              {selectedDriver.documents?.map((doc, index) => (
                <div key={index} className="border rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">{doc.name}</h4>
                      <p className="text-sm text-gray-500">{doc.type}</p>
                    </div>
                    <div className={`text-sm ${getDateColor(doc.expiry)}`}>
                      Exp: {doc.expiry}
                    </div>
                  </div>
                  <div className="mt-2 flex justify-end">
                    <button className="text-blue-600 text-sm hover:text-blue-800">
                      View
                    </button>
                    <button className="text-green-600 text-sm ml-3 hover:text-green-800">
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center gap-4 mt-6">
              <button
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-black rounded-md"
                onClick={() => setShowViewDocumentsPopup(false)}
              >
                Close
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