import { useState, useEffect } from "react";
import { EyeIcon, PencilIcon, TrashIcon, DocumentIcon, CheckCircleIcon, XCircleIcon, ArrowDownTrayIcon, UserIcon, TruckIcon } from '@heroicons/react/24/outline';
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../../../components/ui/table";
import vendorData from '../../../../../data/admins.json';
import PageBreadcrumb from "../../../../components/common/PageBreadCrumb";
import PageMeta from "../../../Dashboard/PageMeta";

interface Vendor {
  id: string;
  companyName: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  tradeLicenseNo: string;
  insuranceExpiry: string;
  linkedDrivers: number;
  linkedTrucks: number;
  payables: number;
  status: "Pending" | "Active" | "Suspended";
  tradeLicenseExpiry?: string;
  createdAt?: string;
}

// Get vendors data from JSON file
const getVendorsData = (): Vendor[] => {
  if (!vendorData || !vendorData.vendors) return [];
  
  return vendorData.vendors.map(vendor => ({
    id: vendor.id || `V-CMS-${String(vendorData.vendors.indexOf(vendor) + 1).padStart(3, '0')}`,
    companyName: vendor.companyName || 'My Company',
    firstName: (vendor as any).firstName || vendor.contactPerson?.split(' ')[0] || 'Doe',
    lastName: (vendor as any).lastName || vendor.contactPerson?.split(' ')[1] || 'John',
    email: vendor.email || 'vendor@gmail.com',
    phone: vendor.phone || '+97122334456',
    tradeLicenseNo: (vendor as any).tradeLicenseNo || `COMM${Math.floor(10000000 + Math.random() * 90000000)}`,
    insuranceExpiry: (vendor as any).insuranceExpiry || '12/12/2025',
    linkedDrivers: (vendor as any).linkedDrivers || 2,
    linkedTrucks: (vendor as any).linkedTrucks || 3,
    payables: (vendor as any).payables || 20,
    status: (vendor as any).status as 'Pending' | 'Active' | 'Suspended' || 'Active',
    tradeLicenseExpiry: (vendor as any).tradeLicenseExpiry || '12/12/2025',
    createdAt: (vendor as any).createdAt || new Date().toLocaleDateString('en-GB')
  }));
};

export default function VendorTable() {
  const { t } = useTranslation();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  // Load vendors data on component mount
  useEffect(() => {
    const data = getVendorsData();
    setVendors(data);
  }, []);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [insuranceExpiryFilter, setInsuranceExpiryFilter] = useState("");
  const [tradeLicenseExpiryFilter, setTradeLicenseExpiryFilter] = useState("");
  const [payablesRange, setPayablesRange] = useState<{ min: string; max: string }>({ min: "", max: "" });
  
  const [selectedVendors, setSelectedVendors] = useState<string[]>([]);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [showActionPopup, setShowActionPopup] = useState(false);
  const [actionType, setActionType] = useState<"approve" | "suspend" | "activate" | "">("");

  // Handle search and filtering
  const filteredVendors = vendors.filter((vendor) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      vendor.companyName.toLowerCase().includes(term) ||
      vendor.firstName.toLowerCase().includes(term) ||
      vendor.lastName.toLowerCase().includes(term) ||
      vendor.email.toLowerCase().includes(term) ||
      vendor.phone.toLowerCase().includes(term) ||
      vendor.id.toLowerCase().includes(term) ||
      vendor.tradeLicenseNo.toLowerCase().includes(term);

    const matchesStatus = statusFilter ? vendor.status === statusFilter : true;
    
    // Insurance expiry filter
    const matchesInsuranceExpiry = insuranceExpiryFilter ? {
      "30": isExpiringWithinDays(vendor.insuranceExpiry, 30),
      "60": isExpiringWithinDays(vendor.insuranceExpiry, 60),
      "90": isExpiringWithinDays(vendor.insuranceExpiry, 90)
    }[insuranceExpiryFilter] || true : true;
    
    // Trade license expiry filter
    const matchesTradeLicenseExpiry = tradeLicenseExpiryFilter ? {
      "30": isExpiringWithinDays(vendor.tradeLicenseExpiry || '', 30),
      "60": isExpiringWithinDays(vendor.tradeLicenseExpiry || '', 60),
      "90": isExpiringWithinDays(vendor.tradeLicenseExpiry || '', 90)
    }[tradeLicenseExpiryFilter] || true : true;
    
    // Payables range filter
    const matchesPayables = 
      (payablesRange.min === "" || vendor.payables >= parseFloat(payablesRange.min)) &&
      (payablesRange.max === "" || vendor.payables <= parseFloat(payablesRange.max));

    return matchesSearch && matchesStatus && matchesInsuranceExpiry && matchesTradeLicenseExpiry && matchesPayables;
  });

  // Check if date is expiring within X days
  const isExpiringWithinDays = (dateStr: string, days: number) => {
    if (dateStr === 'N/A') return false;
    
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
  const currentRecords = filteredVendors.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredVendors.length / recordsPerPage);

  // Handle selection
  const toggleVendorSelection = (vendorId: string) => {
    setSelectedVendors(prev =>
      prev.includes(vendorId)
        ? prev.filter(id => id !== vendorId)
        : [...prev, vendorId]
    );
  };

  const toggleSelectAll = () => {
    setSelectedVendors(
      selectedVendors.length === currentRecords.length
        ? []
        : currentRecords.map(vendor => vendor.id)
    );
  };

  // Delete confirmation handlers
  const handleDelete = () => {
    if (selectedVendor) {
      setVendors(prev => prev.filter(vendor => vendor.id !== selectedVendor.id));
      setSelectedVendor(null);
      setShowDeletePopup(false);
    }
  };

  // Action handlers
  const handleAction = () => {
    if (selectedVendor && actionType) {
      let newStatus: "Pending" | "Active" | "Suspended" = selectedVendor.status;
      
      if (actionType === "approve") {
        newStatus = "Active";
      } else if (actionType === "suspend") {
        newStatus = "Suspended";
      } else if (actionType === "activate") {
        newStatus = "Active";
      }
      
      setVendors(prev => prev.map(vendor => 
        vendor.id === selectedVendor.id 
          ? { ...vendor, status: newStatus }
          : vendor
      ));
      setSelectedVendor(null);
      setShowActionPopup(false);
      setActionType("");
    }
  };

  // Bulk actions
  const handleBulkApprove = () => {
    setVendors(prev => prev.map(vendor => 
      selectedVendors.includes(vendor.id) ? { ...vendor, status: "Active" } : vendor
    ));
    setSelectedVendors([]);
  };

  const handleBulkSuspend = () => {
    setVendors(prev => prev.map(vendor => 
      selectedVendors.includes(vendor.id) ? { ...vendor, status: "Suspended" } : vendor
    ));
    setSelectedVendors([]);
  };

  const handleBulkActivate = () => {
    setVendors(prev => prev.map(vendor => 
      selectedVendors.includes(vendor.id) ? { ...vendor, status: "Active" } : vendor
    ));
    setSelectedVendors([]);
  };

  const handleBulkExport = () => {
    console.log('Exporting selected:', selectedVendors);
    // Implement bulk export logic
  };

  // Individual export
  const handleExport = (vendor: Vendor) => {
    console.log('Exporting vendor:', vendor.id);
    // Implement individual export logic
  };

  // Status badge colors
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 border border-green-200";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border border-yellow-200";
      case "Suspended":
        return "bg-red-100 text-red-800 border border-red-200";
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

  // Apply payables filter
  const applyPayablesFilter = () => {
    setCurrentPage(1);
  };

  // Clear payables filter
  const clearPayablesFilter = () => {
    setPayablesRange({ min: "", max: "" });
    setCurrentPage(1);
  };

  return (
    <>
      <PageMeta
        title={`${t("vendorManagement")} | CMS Dashboard`}
        description={t("manageVendors")}
      />
      <PageBreadcrumb pageTitle={t("vendorManagement")} />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="overflow-hidden w-full rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-white/[0.05] gap-3 sm:gap-0">
        <h2 className="font-bold text-lg text-gray-900 dark:text-white">{t("manageVendors")}</h2>
        <Link to="/add-vendor">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 whitespace-nowrap min-w-[140px]">
            <span className="text-xl">+</span> {t("addVendor")}
          </button>
        </Link>
      </div>

      {/* Search & Filters */}
      <div className="px-5 py-3 space-y-3">
        <input
          type="text"
          placeholder={t("searchVendors")}
          className="w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-white/[0.05] dark:text-white"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Filters */}
        <div className="flex flex-wrap gap-2 items-center">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1 border bg-gray-200 rounded-lg text-sm dark:bg-white/[0.05] dark:text-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="">{t("allStatus")}</option>
            <option value="Pending">{t("pending")}</option>
            <option value="Active">{t("active")}</option>
            <option value="Suspended">{t("suspended")}</option>
          </select>

          {/* Insurance Expiry Filter */}
          <select
            value={insuranceExpiryFilter}
            onChange={(e) => setInsuranceExpiryFilter(e.target.value)}
            className="px-3 py-1 border bg-gray-200 rounded-lg text-sm dark:bg-white/[0.05] dark:text-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="">{t("insuranceExpiryFilter")}</option>
            <option value="30">{t("next30Days")}</option>
            <option value="60">{t("next60Days")}</option>
            <option value="90">{t("next90Days")}</option>
          </select>

          {/* Trade License Expiry Filter */}
          <select
            value={tradeLicenseExpiryFilter}
            onChange={(e) => setTradeLicenseExpiryFilter(e.target.value)}
            className="px-3 py-1 border bg-gray-200 rounded-lg text-sm dark:bg-white/[0.05] dark:text-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="">{t("tradeLicenseExpiry")}</option>
            <option value="30">{t("next30Days")}</option>
            <option value="60">{t("next60Days")}</option>
            <option value="90">{t("next90Days")}</option>
          </select>

          {/* Payables Range Filter */}
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder={t("minAED")}
              value={payablesRange.min}
              onChange={(e) => setPayablesRange({...payablesRange, min: e.target.value})}
              className="px-3 py-1 border bg-gray-200 rounded-lg text-sm dark:bg-white/[0.05] dark:text-white w-24"
            />
            <span className="text-gray-500">{t("of")}</span>
            <input
              type="number"
              placeholder={t("maxAED")}
              value={payablesRange.max}
              onChange={(e) => setPayablesRange({...payablesRange, max: e.target.value})}
              className="px-3 py-1 border bg-gray-200 rounded-lg text-sm dark:bg-white/[0.05] dark:text-white w-24"
            />
            <button
              onClick={applyPayablesFilter}
              className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
            >
              {t("apply")}
            </button>
            {(payablesRange.min !== "" || payablesRange.max !== "") && (
              <button
                onClick={clearPayablesFilter}
                className="px-3 py-1 bg-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-400"
              >
                {t("clear")}
              </button>
            )}
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedVendors.length > 0 && (
          <div className="flex flex-wrap gap-2 items-center pt-2 border-t border-gray-100">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {selectedVendors.length} {t("selected")}
            </span>
            <button
              onClick={handleBulkApprove}
              className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 flex items-center gap-1"
            >
              <CheckCircleIcon className="w-4 h-4" />
              {t("approveSelected")}
            </button>
            <button
              onClick={handleBulkSuspend}
              className="px-3 py-1 bg-yellow-600 text-white rounded-lg text-sm hover:bg-yellow-700 flex items-center gap-1"
            >
              <XCircleIcon className="w-4 h-4" />
              {t("suspendSelected")}
            </button>
            <button
              onClick={handleBulkActivate}
              className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 flex items-center gap-1"
            >
              <CheckCircleIcon className="w-4 h-4" />
              {t("activateSelected")}
            </button>
            <button
              onClick={handleBulkExport}
              className="px-3 py-1 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 flex items-center gap-1"
            >
              <ArrowDownTrayIcon className="w-4 h-4" />
              {t("exportSelected")}
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
                  checked={selectedVendors.length === currentRecords.length && currentRecords.length > 0}
                  onChange={toggleSelectAll}
                />
              </TableCell>
              <TableCell className="px-5 py-3 text-start text-gray-500 font-medium text-xs dark:text-gray-400">{t("id")}</TableCell>
              <TableCell className="px-5 py-3 text-start text-gray-500 font-medium text-xs dark:text-gray-400">{t("companyName")}</TableCell>
              <TableCell className="px-5 py-3 text-start text-gray-500 font-medium text-xs dark:text-gray-400">{t("firstName")}</TableCell>
              <TableCell className="px-5 py-3 text-start text-gray-500 font-medium text-xs dark:text-gray-400">{t("lastName")}</TableCell>
              <TableCell className="px-5 py-3 text-start text-gray-500 font-medium text-xs dark:text-gray-400">{t("email")}</TableCell>
              <TableCell className="px-5 py-3 text-start text-gray-500 font-medium text-xs dark:text-gray-400">{t("phone")}</TableCell>
              <TableCell className="px-5 py-3 text-start text-gray-500 font-medium text-xs dark:text-gray-400">{t("tradeLicenseNo")}</TableCell>
              <TableCell className="px-5 py-3 text-start text-gray-500 font-medium text-xs dark:text-gray-400">{t("insuranceExpiry")}</TableCell>
              <TableCell className="px-5 py-3 text-start text-gray-500 font-medium text-xs dark:text-gray-400">{t("linkedDrivers")}</TableCell>
              <TableCell className="px-5 py-3 text-start text-gray-500 font-medium text-xs dark:text-gray-400">{t("linkedTrucks")}</TableCell>
              <TableCell className="px-5 py-3 text-start text-gray-500 font-medium text-xs dark:text-gray-400">{t("payables")}</TableCell>
              <TableCell className="px-5 py-3 text-start text-gray-500 font-medium text-xs dark:text-gray-400">{t("status")}</TableCell>
              <TableCell className="px-5 py-3 text-start text-gray-500 font-medium text-xs dark:text-gray-400">{t("action")}</TableCell>
              <TableCell className="px-5 py-3 text-start text-gray-500 font-medium text-xs dark:text-gray-400">{t("activityLog")}</TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {currentRecords.map((vendor) => (
              <TableRow key={vendor.id} className="hover:bg-gray-50 dark:hover:bg-white/5">
                <TableCell className="px-5 py-4">
                  <input 
                    type="checkbox" 
                    className="accent-blue-600" 
                    checked={selectedVendors.includes(vendor.id)}
                    onChange={() => toggleVendorSelection(vendor.id)}
                  />
                </TableCell>
                <TableCell className="px-5 py-4 font-medium">{vendor.id}</TableCell>
                <TableCell className="px-5 py-4 font-medium">{vendor.companyName}</TableCell>
                <TableCell className="px-5 py-4">{vendor.firstName}</TableCell>
                <TableCell className="px-5 py-4">{vendor.lastName}</TableCell>
                <TableCell className="px-5 py-4">
                  <a href={`mailto:${vendor.email}`} className="underline text-blue-600">{vendor.email}</a>
                </TableCell>
                <TableCell className="px-5 py-4">{vendor.phone}</TableCell>
                <TableCell className="px-5 py-4">{vendor.tradeLicenseNo}</TableCell>
                <TableCell className="px-5 py-4">
                  <span className={getDateColor(vendor.insuranceExpiry)}>
                    {vendor.insuranceExpiry}
                  </span>
                </TableCell>
                <TableCell className="px-5 py-4">
                  <div className="flex items-center gap-1">
                    <UserIcon className="w-4 h-4" />
                    {vendor.linkedDrivers}
                  </div>
                </TableCell>
                <TableCell className="px-5 py-4">
                  <div className="flex items-center gap-1">
                    <TruckIcon className="w-4 h-4" />
                    {vendor.linkedTrucks}
                  </div>
                </TableCell>
                <TableCell className="px-5 py-4">AED{vendor.payables}</TableCell>
                <TableCell className="px-5 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(vendor.status)}`}>
                    {vendor.status === "Active" && (
                      <CheckCircleIcon className="w-3 h-3 mr-1" />
                    )}
                    {vendor.status}
                  </span>
                </TableCell>

                {/* Action Icons */}
                <TableCell className="px-5 py-4">
                  <div className="flex items-center gap-1">
                    {/* View */}
                    <div className="relative group">
                      <Link to={`/view-vendor/${vendor.id}`}>
                        <EyeIcon className="w-5 h-5 text-blue-600 group-hover:text-blue-800" />
                      </Link>
                      <span className="absolute left-1/2 -bottom-6 -translate-x-1/2 text-xs text-black dark:text-white px-2 py-1 opacity-0 group-hover:opacity-100 transition-all">
                        {t("view")}
                      </span>
                    </div>

                    {/* Edit */}
                    <div className="relative group">
                      <Link to={`/edit-vendor/${vendor.id}`}>
                        <PencilIcon className="w-5 h-5 text-black group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-200" />
                      </Link>
                      <span className="absolute left-1/2 -bottom-6 -translate-x-1/2 text-xs text-black dark:text-white px-2 py-1 opacity-0 group-hover:opacity-100 transition-all">
                        {t("edit")}
                      </span>
                    </div>

                    {/* Delete */}
                    <div className="relative group">
                      <button
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                        onClick={() => {
                          setSelectedVendor(vendor);
                          setShowDeletePopup(true);
                        }}
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                      <span className="absolute left-1/2 -bottom-6 -translate-x-1/2 text-xs text-black dark:text-white px-2 py-1 opacity-0 group-hover:opacity-100 transition-all">
                        {t("delete")}
                      </span>
                    </div>

                    {/* Approve - Show for Pending vendors */}
                    {vendor.status === "Pending" && (
                      <div className="relative group">
                        <button
                          className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                          onClick={() => {
                            setSelectedVendor(vendor);
                            setActionType("approve");
                            setShowActionPopup(true);
                          }}
                        >
                          <CheckCircleIcon className="w-5 h-5" />
                        </button>
                        <span className="absolute left-1/2 -bottom-6 -translate-x-1/2 text-xs text-black dark:text-white px-2 py-1 opacity-0 group-hover:opacity-100 transition-all">
                          {t("approve")}
                        </span>
                      </div>
                    )}

                    {/* Suspend - Show for Active vendors */}
                    {vendor.status === "Active" && (
                      <div className="relative group">
                        <button
                          className="text-yellow-600 hover:text-yellow-800 dark:text-yellow-400 dark:hover:text-yellow-300"
                          onClick={() => {
                            setSelectedVendor(vendor);
                            setActionType("suspend");
                            setShowActionPopup(true);
                          }}
                        >
                          <XCircleIcon className="w-5 h-5" />
                        </button>
                        <span className="absolute left-1/2 -bottom-6 -translate-x-1/2 text-xs text-black dark:text-white px-2 py-1 opacity-0 group-hover:opacity-100 transition-all">
                          {t("suspendSelected")}
                        </span>
                      </div>
                    )}

                    {/* Activate - Show for Suspended vendors */}
                    {vendor.status === "Suspended" && (
                      <div className="relative group">
                        <button
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                          onClick={() => {
                            setSelectedVendor(vendor);
                            setActionType("activate");
                            setShowActionPopup(true);
                          }}
                        >
                          <CheckCircleIcon className="w-5 h-5" />
                        </button>
                        <span className="absolute left-1/2 -bottom-6 -translate-x-1/2 text-xs text-black dark:text-white px-2 py-1 opacity-0 group-hover:opacity-100 transition-all">
                          {t("activateSelected")}
                        </span>
                      </div>
                    )}

                    {/* Export - Always visible */}
                    <div className="relative group">
                      <button 
                        className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300"
                        onClick={() => handleExport(vendor)}
                      >
                        <ArrowDownTrayIcon className="w-5 h-5" />
                      </button>
                      <span className="absolute left-1/2 -bottom-6 -translate-x-1/2 text-xs text-black dark:text-white px-2 py-1 opacity-0 group-hover:opacity-100 transition-all">
                        {t("export")}
                      </span>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="px-5 py-4">
                  <Link to={`/vendor-activity/${vendor.id}`}>
                    <button className="flex items-center gap-1 text-gray-600 dark:text-gray-300 hover:text-blue-600">
                      <DocumentIcon className="w-5 h-5" />
                      <span className="text-xs">{t("viewActivityLog")}</span>
                    </button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {currentRecords.length === 0 && (
          <p className="text-center py-4 text-gray-500 text">{t("noMatchingRecords")}</p>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 border-t border-gray-100 dark:border-white/[0.05]">
        <button 
          className="flex items-center gap-2 text-red-500 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={selectedVendors.length === 0}
          onClick={() => {
            if (selectedVendors.length > 0) {
              setShowDeletePopup(true);
            }
          }}
        >
          <TrashIcon className="w-5 h-5" /> {t("deleteSelected")} ({selectedVendors.length} {t("records")})
        </button>
        
        {/* Pagination Controls */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">{t("rowsPerPage")}:</span>
            <select 
              value={recordsPerPage}
              onChange={handleRecordsPerPageChange}
              className="px-2 py-1 border rounded text-sm dark:bg-white/[0.05] dark:text-white"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {indexOfFirstRecord + 1}-{Math.min(indexOfLastRecord, filteredVendors.length)} {t("of")} {filteredVendors.length}
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
            <h2 className="text-lg font-semibold text-gray-800">{t("deleteVendor")}</h2>
            <p className="text-sm text-gray-600 mt-2">
              {t("deleteVendorConfirm")} <b>{selectedVendor?.companyName}</b>?
            </p>
            <div className="flex justify-center gap-4 mt-6">
              <button
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-black rounded-md"
                onClick={() => setShowDeletePopup(false)}
              >
                {t("cancel")}
              </button>
              <button
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
                onClick={handleDelete}
              >
                {t("yesDelete")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Action Confirmation Popup */}
      {showActionPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-80 text-center">
            <h2 className="text-lg font-semibold text-gray-800">
              {actionType === "approve" ? t("approveVendor") : 
               actionType === "suspend" ? t("suspendVendor") : 
               t("activateVendor")}
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              {actionType === "approve" 
                ? `${t("approveVendorConfirm")} ${selectedVendor?.companyName}? ${t("approveVendorMessage")}`
                : actionType === "suspend"
                ? `${t("suspendVendorConfirm")} ${selectedVendor?.companyName}? ${t("suspendVendorMessage")}`
                : `${t("activateVendorConfirm")} ${selectedVendor?.companyName}? ${t("activateVendorMessage")}`
              }
            </p>
            <div className="flex justify-center gap-4 mt-6">
              <button
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-black rounded-md"
                onClick={() => {
                  setShowActionPopup(false);
                  setActionType("");
                }}
              >
                {t("cancel")}
              </button>
              <button
                className={`px-4 py-2 ${
                  actionType === "approve" 
                    ? "bg-green-600 hover:bg-green-700" 
                    : actionType === "suspend"
                    ? "bg-yellow-600 hover:bg-yellow-700"
                    : "bg-blue-600 hover:bg-blue-700"
                } text-white rounded-md`}
                onClick={handleAction}
              >
                {actionType === "approve" ? t("yesApprove") : actionType === "suspend" ? t("yesSuspend") : t("yesActivate")}
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