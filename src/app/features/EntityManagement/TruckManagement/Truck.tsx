import { useState, useEffect } from "react";
import { EyeIcon, PencilIcon, TrashIcon, CheckCircleIcon, NoSymbolIcon, ArrowDownTrayIcon, UserIcon, TruckIcon } from '@heroicons/react/24/outline';
import { Link } from "react-router-dom";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../../components/ui/table";
import truckData from '../../../../data/admins.json';
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../Dashboard/PageMeta";
import { useTranslation } from 'react-i18next';

interface Truck {
  id: string;
  plateNo: string;
  vendor: string;
  assignedDriver: string;
  currentJob: string;
  registrationExpiry: string;
  insuranceExpiry: string;
  status: "Pending" | "Approved" | "Suspended" | "Maintenance";
  truckName?: string;
  mobile?: string;
  drivingLicense?: string;
  driverId?: string;
  type?: string;
  capacity?: string;
  lastMaintenance?: string;
  fuelType?: string;
  year?: number;
  mileage?: number;
  location?: string;
}

// Function to get and map truck data from JSON
const getTrucksData = (): Truck[] => {
  if (!truckData || !truckData.trucks) return [];
  
  return truckData.trucks.map((truck, index) => ({
    id: truck.id || `T-CMS-${String(index + 1).padStart(3, '0')}`,
    plateNo: truck.truckNumber || `ABC${Math.floor(1000 + Math.random() * 9000)}`,
    vendor: truck.company || 'Vendor 2',
    assignedDriver: truck.driver || t('notAssigned'),
    currentJob: truck.location || t('noCurrentJob'),
    registrationExpiry: truck.lastMaintenance || '12/12/2025',
    insuranceExpiry: truck.insuranceExpiry || '12/12/2025',
    status: (truck.status as "Pending" | "Approved" | "Suspended" | "Maintenance") || 'Approved',
    truckName: truck.type || 'Heavy Duty Truck',
    mobile: '+97122334456',
    drivingLicense: `DL${Math.floor(10000000 + Math.random() * 90000000)}`,
    driverId: `D-CMS-${Math.floor(100 + Math.random() * 900)}`,
    type: truck.type || 'Container',
    capacity: truck.capacity || '10 Tons',
    lastMaintenance: truck.lastMaintenance || '12/12/2024',
    fuelType: truck.fuelType || 'Diesel',
    year: truck.year || 2022,
    mileage: truck.mileage || 50000,
    location: truck.location || 'Dubai'
  }));
};

export default function TruckTable() {
  const { t } = useTranslation();
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [vendorFilter, setVendorFilter] = useState("");
  const [expiryWindowFilter, setExpiryWindowFilter] = useState("");
  const [selectedTrucks, setSelectedTrucks] = useState<string[]>([]);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showAssignDriverPopup, setShowAssignDriverPopup] = useState(false);
  const [showSuspendPopup, setShowSuspendPopup] = useState(false);
  const [selectedTruck, setSelectedTruck] = useState<Truck | null>(null);
  const [assignDriverReason, setAssignDriverReason] = useState("");

  // Load truck data on component mount
  useEffect(() => {
    const data = getTrucksData();
    setTrucks(data);
  }, []);
  
  // Get unique vendors for filter
  const vendors = Array.from(new Set(trucks.map(truck => truck.vendor)));

  // Handle search and filtering
  const filteredTrucks = trucks.filter((truck) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      (truck.truckName || '').toLowerCase().includes(term) ||
      (truck.mobile || '').toLowerCase().includes(term) ||
      (truck.drivingLicense || '').toLowerCase().includes(term) ||
      (truck.driverId || '').toLowerCase().includes(term) ||
      truck.plateNo.toLowerCase().includes(term) ||
      truck.id.toLowerCase().includes(term);

    const matchesStatus = statusFilter ? truck.status === statusFilter : true;
    const matchesVendor = vendorFilter ? truck.vendor === vendorFilter : true;
    
    // Expiry windows filter - checks BOTH registration and insurance
    const matchesExpiryWindow = expiryWindowFilter ? {
      "30": isExpiringWithinDays(truck.registrationExpiry, 30) || isExpiringWithinDays(truck.insuranceExpiry, 30),
      "60": isExpiringWithinDays(truck.registrationExpiry, 60) || isExpiringWithinDays(truck.insuranceExpiry, 60),
      "90": isExpiringWithinDays(truck.registrationExpiry, 90) || isExpiringWithinDays(truck.insuranceExpiry, 90)
    }[expiryWindowFilter] || true : true;

    return matchesSearch && matchesStatus && matchesVendor && matchesExpiryWindow;
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

  // Pagination logic
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredTrucks.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredTrucks.length / recordsPerPage);

  // Handle selection
  const toggleTruckSelection = (truckId: string) => {
    setSelectedTrucks(prev =>
      prev.includes(truckId)
        ? prev.filter(id => id !== truckId)
        : [...prev, truckId]
    );
  };

  const toggleSelectAll = () => {
    setSelectedTrucks(
      selectedTrucks.length === currentRecords.length
        ? []
        : currentRecords.map(truck => truck.id)
    );
  };

  // Delete confirmation handlers
  const handleDelete = () => {
    if (selectedTruck) {
      setTrucks(prev => prev.filter(truck => truck.id !== selectedTruck.id));
      setSelectedTruck(null);
      setShowDeletePopup(false);
    }
  };

  // Approve truck
  const handleApprove = (truck: Truck) => {
    setTrucks(prev => prev.map(t => 
      t.id === truck.id ? { ...t, status: "Approved" } : t
    ));
  };

  // Suspend truck
  const handleSuspend = () => {
    if (selectedTruck) {
      setTrucks(prev => prev.map(t => 
        t.id === selectedTruck.id ? { ...t, status: "Suspended" } : t
      ));
      setSelectedTruck(null);
      setShowSuspendPopup(false);
    }
  };

  // Assign driver
  const handleAssignDriver = () => {
    if (selectedTruck) {
      setTrucks(prev => prev.map(t => 
        t.id === selectedTruck.id ? { 
          ...t, 
          assignedDriver: t('driverAssigned'),
          driverId: "D-CMS-001"
        } : t
      ));
      setSelectedTruck(null);
      setAssignDriverReason("");
      setShowAssignDriverPopup(false);
    }
  };

  // Export truck data
  const handleExport = (truck: Truck) => {
    console.log('Exporting truck data:', truck);
    // Implement export logic here
  };

  // Bulk actions
  const handleBulkAssignDriver = () => {
    setTrucks(prev => prev.map(t => 
      selectedTrucks.includes(t.id) ? { 
        ...t, 
        assignedDriver: "Driver Assigned",
        driverId: "D-CMS-001"
      } : t
    ));
    setSelectedTrucks([]);
  };

  const handleBulkApprove = () => {
    setTrucks(prev => prev.map(t => 
      selectedTrucks.includes(t.id) ? { ...t, status: "Approved" } : t
    ));
    setSelectedTrucks([]);
  };

  const handleBulkSuspend = () => {
    setTrucks(prev => prev.map(t => 
      selectedTrucks.includes(t.id) ? { ...t, status: "Suspended" } : t
    ));
    setSelectedTrucks([]);
  };

  const handleBulkExport = () => {
    console.log('Exporting selected:', selectedTrucks);
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
      case "Maintenance":
        return "bg-blue-100 text-blue-800 border border-blue-200";
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

  return (
    <>
      <PageMeta
        title={t('truckManagement') + ' | CMS Dashboard'}
        description={t('manageTrucks')}
      />
      <PageBreadcrumb pageTitle={t('truckManagement')} />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="overflow-hidden w-full rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-white/[0.05] gap-3 sm:gap-0">
        <h2 className="font-bold text-lg text-gray-900 dark:text-white">{t('manageTrucks')}</h2>
        <Link to="/add-truck">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2  whitespace-nowrap min-w-[140px]">
            <span className="text-xl">+</span> {t('addTruck')}
          </button>
        </Link>
      </div>

      {/* Search & Filters */}
      <div className="px-5 py-3 space-y-3">
        <input
          type="text"
          placeholder={t('searchTruckNameMobileDrivingLicenseDriverId')}
          className="w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-white/[0.05] dark:text-white"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Filters - Only 3 as requested */}
        <div className="flex flex-wrap gap-2 items-center">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1 border bg-gray-200 rounded-lg text-sm dark:bg-white/[0.05] dark:text-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="">{t('allStatus')}</option>
            <option value="Pending">{t('pending')}</option>
            <option value="Approved">{t('approved')}</option>
            <option value="Suspended">{t('suspended')}</option>
            <option value="Maintenance">{t('maintenance')}</option>
          </select>

          {/* Vendor Filter */}
          <select
            value={vendorFilter}
            onChange={(e) => setVendorFilter(e.target.value)}
            className="px-3 py-1 border bg-gray-200 rounded-lg text-sm dark:bg-white/[0.05] dark:text-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="">{t('allVendors')}</option>
            {vendors.map(vendor => (
              <option key={vendor} value={vendor}>{vendor}</option>
            ))}
          </select>

          {/* Expiry Windows Filter - Single filter for both registration and insurance */}
          <select
            value={expiryWindowFilter}
            onChange={(e) => setExpiryWindowFilter(e.target.value)}
            className="px-3 py-1 border bg-gray-200 rounded-lg text-sm dark:bg-white/[0.05] dark:text-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="">{t('expiryWindows')}</option>
            <option value="30">{t('next30DaysRegistrationInsurance')}</option>
            <option value="60">{t('next60DaysRegistrationInsurance')}</option>
            <option value="90">{t('next90DaysRegistrationInsurance')}</option>
          </select>
        </div>

        {/* Bulk Actions */}
        {selectedTrucks.length > 0 && (
          <div className="flex flex-wrap gap-2 items-center pt-2 border-t border-gray-100">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {selectedTrucks.length} {t('selected')}
            </span>
            <button
              onClick={handleBulkAssignDriver}
              className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 flex items-center gap-1"
            >
              <UserIcon className="w-4 h-4" />
              {t('bulkAssignDriver')}
            </button>
            <button
              onClick={handleBulkApprove}
              className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 flex items-center gap-1"
            >
              <CheckCircleIcon className="w-4 h-4" />
              {t('approveSelected')}
            </button>
            <button
              onClick={handleBulkSuspend}
              className="px-3 py-1 bg-yellow-600 text-white rounded-lg text-sm hover:bg-yellow-700 flex items-center gap-1"
            >
              <NoSymbolIcon className="w-4 h-4" />
              {t('suspendSelected')}
            </button>
            <button
              onClick={handleBulkExport}
              className="px-3 py-1 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 flex items-center gap-1"
            >
              <ArrowDownTrayIcon className="w-4 h-4" />
              {t('exportCSV')}
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
                  checked={selectedTrucks.length === currentRecords.length && currentRecords.length > 0}
                  onChange={toggleSelectAll}
                />
              </TableCell>
              <TableCell className="px-5 py-3 text-start text-gray-500 font-medium text-xs dark:text-gray-400">{t('id')}</TableCell>
              <TableCell className="px-5 py-3 text-start text-gray-500 font-medium text-xs dark:text-gray-400">{t('plateNo')}</TableCell>
              <TableCell className="px-5 py-3 text-start text-gray-500 font-medium text-xs dark:text-gray-400">{t('vendor')}</TableCell>
              <TableCell className="px-5 py-3 text-start text-gray-500 font-medium text-xs dark:text-gray-400">{t('assignedDriver')}</TableCell>
              <TableCell className="px-5 py-3 text-start text-gray-500 font-medium text-xs dark:text-gray-400">{t('currentJob')}</TableCell>
              <TableCell className="px-5 py-3 text-start text-gray-500 font-medium text-xs dark:text-gray-400">{t('registrationExpiry')}</TableCell>
              <TableCell className="px-5 py-3 text-start text-gray-500 font-medium text-xs dark:text-gray-400">{t('insuranceExpiry')}</TableCell>
              <TableCell className="px-5 py-3 text-start text-gray-500 font-medium text-xs dark:text-gray-400">{t('status')}</TableCell>
              <TableCell className="px-5 py-3 text-start text-gray-500 font-medium text-xs dark:text-gray-400">{t('action')}</TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {currentRecords.map((truck) => (
              <TableRow key={truck.id} className="hover:bg-gray-50 dark:hover:bg-white/5">
                <TableCell className="px-5 py-4">
                  <input 
                    type="checkbox" 
                    className="accent-blue-600" 
                    checked={selectedTrucks.includes(truck.id)}
                    onChange={() => toggleTruckSelection(truck.id)}
                  />
                </TableCell>
                <TableCell className="px-5 py-4 font-medium">{truck.id}</TableCell>
                <TableCell className="px-5 py-4 font-semibold">
                  <div className="flex items-center gap-1">
                    <TruckIcon className="w-4 h-4" />
                    {truck.plateNo}
                  </div>
                </TableCell>
                <TableCell className="px-5 py-4">{truck.vendor}</TableCell>
                <TableCell className="px-5 py-4">
                  <div className="flex items-center gap-1">
                    {truck.assignedDriver !== t('notAssigned') ? (
                      <>
                        <UserIcon className="w-4 h-4" />
                        <span className="text-blue-600">{truck.assignedDriver}</span>
                      </>
                    ) : (
                      <span className="text-gray-400">{truck.assignedDriver}</span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="px-5 py-4">
                  <span className={truck.currentJob === t('noCurrentJob') ? "text-gray-500" : "text-green-600"}>
                    {truck.currentJob}
                  </span>
                </TableCell>
                <TableCell className="px-5 py-4">
                  <span className={getDateColor(truck.registrationExpiry)}>
                    {truck.registrationExpiry}
                  </span>
                </TableCell>
                <TableCell className="px-5 py-4">
                  <span className={getDateColor(truck.insuranceExpiry)}>
                    {truck.insuranceExpiry}
                  </span>
                </TableCell>
                <TableCell className="px-5 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(truck.status)}`}>
                    {truck.status === "Approved" && (
                      <CheckCircleIcon className="w-3 h-3 mr-1" />
                    )}
                    {truck.status === "Suspended" && (
                      <NoSymbolIcon className="w-3 h-3 mr-1" />
                    )}
                    {truck.status === "Pending" ? t('pending') : 
                     truck.status === "Approved" ? t('approved') :
                     truck.status === "Suspended" ? t('suspended') :
                     truck.status === "Maintenance" ? t('maintenance') : truck.status}
                  </span>
                </TableCell>

                {/* Action Icons */}
                <TableCell className="px-5 py-4">
                  <div className="flex items-center gap-1">
                    {/* View */}
                    <div className="relative group">
                      <Link to={`/view-truck/${truck.id}`}>
                        <EyeIcon className="w-5 h-5 text-blue-600 group-hover:text-blue-800" />
                      </Link>
                      <span className="absolute left-1/2 -bottom-6 -translate-x-1/2 text-xs text-black dark:text-white px-2 py-1 opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap">
                        {t('view')}
                      </span>
                    </div>

                    {/* Edit */}
                    <div className="relative group">
                      <Link to={`/edit-truck/${truck.id}`}>
                        <PencilIcon className="w-5 h-5 text-black group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-200" />
                      </Link>
                      <span className="absolute left-1/2 -bottom-6 -translate-x-1/2 text-xs text-black dark:text-white px-2 py-1 opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap">
                        {t('edit')}
                      </span>
                    </div>

                    {/* Delete */}
                    <div className="relative group">
                      <button
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                        onClick={() => {
                          setSelectedTruck(truck);
                          setShowDeletePopup(true);
                        }}
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                      <span className="absolute left-1/2 -bottom-6 -translate-x-1/2 text-xs text-black dark:text-white px-2 py-1 opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap">
                        {t('delete')}
                      </span>
                    </div>

                    {/* Approve - Show for Pending trucks */}
                    {truck.status === "Pending" && (
                      <div className="relative group">
                        <button
                          className="text-green-600 hover:text-green-800"
                          onClick={() => handleApprove(truck)}
                        >
                          <CheckCircleIcon className="w-5 h-5" />
                        </button>
                        <span className="absolute left-1/2 -bottom-6 -translate-x-1/2 text-xs text-black dark:text-white px-2 py-1 opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap">
                          {t('approve')}
                        </span>
                      </div>
                    )}

                    {/* Suspend - Show for Approved trucks */}
                    {truck.status === "Approved" && (
                      <div className="relative group">
                        <button
                          className="text-yellow-600 hover:text-yellow-800"
                          onClick={() => {
                            setSelectedTruck(truck);
                            setShowSuspendPopup(true);
                          }}
                        >
                          <NoSymbolIcon className="w-5 h-5" />
                        </button>
                        <span className="absolute left-1/2 -bottom-6 -translate-x-1/2 text-xs text-black dark:text-white px-2 py-1 opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap">
                          {t('suspend')}
                        </span>
                      </div>
                    )}

                    {/* Assign Driver - Show for trucks without driver */}
                    {truck.assignedDriver === t('notAssigned') && (
                      <div className="relative group">
                        <button
                          className="text-blue-600 hover:text-blue-800"
                          onClick={() => {
                            setSelectedTruck(truck);
                            setShowAssignDriverPopup(true);
                          }}
                        >
                          <UserIcon className="w-5 h-5" />
                        </button>
                        <span className="absolute left-1/2 -bottom-6 -translate-x-1/2 text-xs text-black dark:text-white px-2 py-1 opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap">
                          {t('assignDriver')}
                        </span>
                      </div>
                    )}

                    {/* Export */}
                    <div className="relative group">
                      <button
                        className="text-blue-600 hover:text-blue-800"
                        onClick={() => handleExport(truck)}
                      >
                        <ArrowDownTrayIcon className="w-5 h-5" />
                      </button>
                      <span className="absolute left-1/2 -bottom-6 -translate-x-1/2 text-xs text-black dark:text-white px-2 py-1 opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap">
                        {t('export')}
                      </span>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {currentRecords.length === 0 && (
          <p className="text-center py-4 text-gray-500">{t('noMatchingRecords')}</p>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 border-t border-gray-100 dark:border-white/[0.05]">
        <button 
          className="flex items-center gap-2 text-red-500 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={selectedTrucks.length === 0}
          onClick={() => {
            if (selectedTrucks.length > 0) {
              setShowDeletePopup(true);
            }
          }}
        >
          <TrashIcon className="w-5 h-5" /> {t('deleteSelected')} ({selectedTrucks.length} {t('records')})
        </button>
        
        {/* Pagination Controls */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">{t('rowsPerPage')}:</span>
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
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {indexOfFirstRecord + 1}-{Math.min(indexOfLastRecord, filteredTrucks.length)} of {filteredTrucks.length}
            </span>
          </div>
          
          <div className="flex items-center gap-1">
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className="px-2 py-1 border rounded-l disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {"<<"}
            </button>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-2 py-1 border disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {"<"}
            </button>
            
            {/* Page Numbers */}
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
                  onClick={() => handlePageChange(pageNumber)}
                  className={`px-2 py-1 border text-sm ${
                    currentPage === pageNumber 
                      ? 'bg-blue-600 text-white' 
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-2 py-1 border disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {">"}
            </button>
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              className="px-2 py-1 border rounded-r disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {">>"}
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Popup */}
      {showDeletePopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
            <h2 className="text-lg font-semibold text-gray-800">{t('deleteTruck')}?</h2>
            <p className="text-sm text-gray-600 mt-2">
              {t('deleteTruckConfirm')} <b>{selectedTruck?.plateNo}</b>?
            </p>
            <div className="flex justify-center gap-4 mt-6">
              <button
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-black rounded-md"
                onClick={() => setShowDeletePopup(false)}
              >
                {t('cancel')}
              </button>
              <button
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
                onClick={handleDelete}
              >
                {t('yesDelete')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Suspend Confirmation Popup */}
      {showSuspendPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-96 text-center">
            <h2 className="text-lg font-semibold text-gray-800">{t('suspendTruck')}?</h2>
            <p className="text-sm text-gray-600 mt-2">
              {t('suspendTruckConfirm')} <b>{selectedTruck?.plateNo}</b>?
            </p>
            <div className="mt-4">
              <textarea
                placeholder={t('reasonForSuspension')}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                rows={3}
                onChange={(e) => setAssignDriverReason(e.target.value)}
              />
            </div>
            <div className="flex justify-center gap-4 mt-6">
              <button
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-black rounded-md"
                onClick={() => setShowSuspendPopup(false)}
              >
                {t('cancel')}
              </button>
              <button
                className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md"
                onClick={handleSuspend}
              >
                {t('yesSuspend')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Driver Popup */}
      {showAssignDriverPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-96 text-center">
            <h2 className="text-lg font-semibold text-gray-800">{t('assignDriver')}</h2>
            <p className="text-sm text-gray-600 mt-2">
              {t('assignDriverConfirm')} <b>{selectedTruck?.plateNo}</b>
            </p>
            
            <div className="mt-4 space-y-3">
              <select className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">{t('selectAvailableDriver')}</option>
                <option value="Driver 1">Driver 1 ({t('available')})</option>
                <option value="Driver 2">Driver 2 ({t('available')})</option>
                <option value="Driver 3">Driver 3 ({t('available')})</option>
              </select>
              
              <textarea
                placeholder={t('reasonForAssignment')}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={2}
                value={assignDriverReason}
                onChange={(e) => setAssignDriverReason(e.target.value)}
              />
            </div>

            <div className="flex justify-center gap-4 mt-6">
              <button
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-black rounded-md"
                onClick={() => {
                  setShowAssignDriverPopup(false);
                  setAssignDriverReason("");
                }}
              >
                {t('cancel')}
              </button>
              <button
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                onClick={handleAssignDriver}
              >
                {t('assignDriver')}
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