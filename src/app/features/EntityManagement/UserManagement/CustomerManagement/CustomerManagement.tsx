import { useState, useEffect } from "react";
import { EyeIcon, PencilIcon, TrashIcon, DocumentIcon } from '@heroicons/react/24/outline';
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../../../components/ui/table";
import PageBreadcrumb from "../../../../components/common/PageBreadCrumb";
import PageMeta from "../../../Dashboard/PageMeta";

// Import customer data from JSON file
import customerData from '../../../../../data/admins.json';

interface Customer {
  id: string;
  companyName: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  tradeLicenseNo: string;
  trn: string;
  trnExpiry: string;
  paymentTerms: string;
  outstandingBalance: number;
  status: "Pending" | "Active" | "Suspended";
  createdAt: string;
}

// Map the customer data from JSON to match the Customer interface
const customersData: Customer[] = (customerData.customers || []).map(customer => ({
  id: customer.id || '',
  companyName: customer.companyName || 'N/A',
  firstName: customer.firstName || '',
  lastName: customer.lastName || '',
  email: customer.email || '',
  phone: customer.phone || '',
  tradeLicenseNo: customer.tradeLicense || 'N/A',
  trn: customer.trn || 'N/A',
  trnExpiry: customer.trnExpiry || 'N/A',
  paymentTerms: customer.paymentTerms || 'N/A',
  outstandingBalance: parseInt(customer.outstandingBalance?.replace('AED ', '').replace(/,/g, '') || '0'),
  status: customer.status as 'Active' | 'Pending' | 'Suspended',
  createdAt: customer.createdAt || new Date().toISOString().split('T')[0]
}));

export default function Customers() {
  const { t } = useTranslation();
  const [customers, setCustomers] = useState<Customer[]>([]);
  
  // Load customer data from JSON file on component mount
  useEffect(() => {
    setCustomers(customersData);
  }, []);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentTermsFilter, setPaymentTermsFilter] = useState("");
  const [tradeLicenseExpiryFilter, setTradeLicenseExpiryFilter] = useState("");
  const [outstandingBalanceFilter, setOutstandingBalanceFilter] = useState("");
  const [sortBy] = useState("");
  const [sortOrder] = useState<"asc" | "desc">("asc");
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Pagination logic
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;

  // Handle search and filtering
  const filteredCustomers = customers.filter((customer) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      customer.companyName.toLowerCase().includes(term) ||
      customer.firstName.toLowerCase().includes(term) ||
      customer.lastName.toLowerCase().includes(term) ||
      customer.email.toLowerCase().includes(term) ||
      customer.phone.toLowerCase().includes(term) ||
      customer.tradeLicenseNo.toLowerCase().includes(term);

    const matchesStatus = statusFilter ? customer.status === statusFilter : true;
    const matchesPaymentTerms = paymentTermsFilter ? customer.paymentTerms === paymentTermsFilter : true;

    // Trade License Expiry filter (simplified - you can enhance with actual date calculations)
    const matchesTradeLicenseExpiry = tradeLicenseExpiryFilter ? true : true;

    // Outstanding Balance filter (simplified - you can enhance with range logic)
    const matchesOutstandingBalance = outstandingBalanceFilter ? true : true;

    return matchesSearch && matchesStatus && matchesPaymentTerms && matchesTradeLicenseExpiry && matchesOutstandingBalance;
  });

  // Get current records for pagination
  const currentCustomers = filteredCustomers.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredCustomers.length / recordsPerPage);

  // Handle pagination
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Handle sorting
  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    if (!sortBy) return 0;

    let aValue: any = a;
    let bValue: any = b;

    if (sortBy === "companyName") {
      aValue = a.companyName;
      bValue = b.companyName;
    } else if (sortBy === "outstandingBalance") {
      aValue = a.outstandingBalance;
      bValue = b.outstandingBalance;
    } else if (sortBy === "createdAt") {
      aValue = new Date(a.createdAt.split('/').reverse().join('-'));
      bValue = new Date(b.createdAt.split('/').reverse().join('-'));
    }

    if (sortOrder === "asc") {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  // Handle selection
  const toggleCustomerSelection = (customerId: string) => {
    setSelectedCustomers(prev =>
      prev.includes(customerId)
        ? prev.filter(id => id !== customerId)
        : [...prev, customerId]
    );
  };

  const toggleSelectAll = () => {
    setSelectedCustomers(
      selectedCustomers.length === sortedCustomers.length
        ? []
        : sortedCustomers.map(customer => customer.id)
    );
  };

  // Delete confirmation handlers
  const handleDelete = () => {
    if (selectedCustomer) {
      setCustomers(prev => prev.filter(customer => customer.id !== selectedCustomer.id));
      setSelectedCustomer(null);
      setShowDeletePopup(false);
    }
  };

  // Bulk actions
  const handleBulkApprove = () => {
    console.log('Approving selected:', selectedCustomers);
    // Implement bulk approve logic
  };

  const handleBulkSuspend = () => {
    console.log('Suspending selected:', selectedCustomers);
    // Implement bulk suspend logic
  };

  const handleBulkExport = () => {
    console.log('Exporting selected:', selectedCustomers);
    // Implement bulk export logic
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Handle records per page change
  const handleRecordsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRecordsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when changing records per page
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

  return (
    <>
      <PageMeta
        title={`${t("customerManagement")} | CMS Dashboard`}
        description={t("manageCustomers")}
      />
      <PageBreadcrumb pageTitle={t("customerManagement")} />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="overflow-hidden w-full rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-white/[0.05] gap-3 sm:gap-0">
        <h2 className="font-bold text-lg text-gray-900 dark:text-white">{t("manageCustomers")}</h2>
        <Link to="/add-customers">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <span className="text-xl">+</span> {t("addCustomer")}
          </button>
        </Link>
      </div>

      {/* Search & Filters */}
      <div className="px-5 py-3 space-y-3">
        <input
          type="text"
          placeholder={t("searchCustomers")}
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

          {/* Payment Terms Filter */}
          <select
            value={paymentTermsFilter}
            onChange={(e) => setPaymentTermsFilter(e.target.value)}
            className="px-3 py-1 border bg-gray-200 rounded-lg text-sm dark:bg-white/[0.05] dark:text-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="">{t("paymentTerms")}</option>
            <option value="Prepaid">{t("prepaid")}</option>
            <option value="Net 15">{t("net15")}</option>
            <option value="Net 30">{t("net30")}</option>
            <option value="Net 60">{t("net60")}</option>
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

          {/* Outstanding Balance Filter */}
          <select
            value={outstandingBalanceFilter}
            onChange={(e) => setOutstandingBalanceFilter(e.target.value)}
            className="px-3 py-1 border bg-gray-200 rounded-lg text-sm dark:bg-white/[0.05] dark:text-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="">{t("outstandingBalanceRange")}</option>
            <option value="0-5000">0 - 5,000 AED</option>
            <option value="5000-15000">5,000 - 15,000 AED</option>
            <option value="15000+">15,000+ AED</option>
          </select>
        </div>

        {/* Bulk Actions */}
        {selectedCustomers.length > 0 && (
          <div className="flex flex-wrap gap-2 items-center pt-2 border-t border-gray-100">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {selectedCustomers.length} {t("selected")}
            </span>
            <button
              onClick={handleBulkApprove}
              className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
            >
              {t("approveSelected")}
            </button>
            <button
              onClick={handleBulkSuspend}
              className="px-3 py-1 bg-yellow-600 text-white rounded-lg text-sm hover:bg-yellow-700"
            >
              {t("suspendSelected")}
            </button>
            <button
              onClick={handleBulkExport}
              className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
            >
              {t("exportCSV")}
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
                  checked={selectedCustomers.length === sortedCustomers.length && sortedCustomers.length > 0}
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
              <TableCell className="px-5 py-3 text-start text-gray-500 font-medium text-xs dark:text-gray-400">{t("trn")}</TableCell>
              <TableCell className="px-5 py-3 text-start text-gray-500 font-medium text-xs dark:text-gray-400">{t("trnExpiry")}</TableCell>
              <TableCell className="px-5 py-3 text-start text-gray-500 font-medium text-xs dark:text-gray-400">{t("paymentTerms")}</TableCell>
              <TableCell className="px-5 py-3 text-start text-gray-500 font-medium text-xs dark:text-gray-400">{t("outstandingBalance")}</TableCell>
              <TableCell className="px-5 py-3 text-start text-gray-500 font-medium text-xs dark:text-gray-400">{t("status")}</TableCell>
              <TableCell className="px-5 py-3 text-start text-gray-500 font-medium text-xs dark:text-gray-400">{t("createdAt")}</TableCell>
              <TableCell className="px-5 py-3 text-start text-gray-500 font-medium text-xs dark:text-gray-400">{t("action")}</TableCell>
              <TableCell className="px-5 py-3 text-start text-gray-500 font-medium text-xs dark:text-gray-400">{t("activityLog")}</TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {currentCustomers.map((customer) => (
              <TableRow key={customer.id} className="hover:bg-gray-50 dark:hover:bg-white/5">
                <TableCell className="px-5 py-4">
                  <input
                    type="checkbox"
                    className="accent-blue-600"
                    checked={selectedCustomers.includes(customer.id)}
                    onChange={() => toggleCustomerSelection(customer.id)}
                  />
                </TableCell>
                <TableCell className="px-5 py-4 font-medium">{customer.id}</TableCell>
                <TableCell className="px-5 py-4 font-medium">{customer.companyName}</TableCell>
                <TableCell className="px-5 py-4">{customer.firstName}</TableCell>
                <TableCell className="px-5 py-4">{customer.lastName}</TableCell>
                <TableCell className="px-5 py-4">
                  <a href={`mailto:${customer.email}`} className="underline text-blue-600">{customer.email}</a>
                </TableCell>
                <TableCell className="px-5 py-4">{customer.phone}</TableCell>
                <TableCell className="px-5 py-4">{customer.tradeLicenseNo}</TableCell>
                <TableCell className="px-5 py-4">{customer.trn}</TableCell>
                <TableCell className="px-5 py-4">{customer.trnExpiry}</TableCell>
                <TableCell className="px-5 py-4">{customer.paymentTerms}</TableCell>
                <TableCell className="px-5 py-4">
                  <span className={customer.outstandingBalance > 0 ? "text-red-600 font-medium" : "text-green-600"}>
                    AED {customer.outstandingBalance.toLocaleString()}
                  </span>
                </TableCell>
                <TableCell className="px-5 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(customer.status)}`}>
                    {customer.status}
                  </span>
                </TableCell>
                <TableCell className="px-5 py-4">{customer.createdAt}</TableCell>

                {/* Action Icons */}
                <TableCell className="px-5 py-4">
                  <div className="flex items-center gap-1">
                    {/* View */}
                    <div className="relative group">
                      <Link to={`/view-customers/${customer.id}`}>
                        <EyeIcon className="w-5 h-5 text-blue-600 group-hover:text-blue-800" />
                      </Link>
                      <span className="absolute left-1/2 -bottom-6 -translate-x-1/2 text-xs text-black dark:text-white px-2 py-1 opacity-0 group-hover:opacity-100 transition-all">
                        {t("view")}
                      </span>
                    </div>

                    {/* Edit */}
                    <div className="relative group">
                      <Link to={`/edit-customers/${customer.id}`}>
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
                          setSelectedCustomer(customer);
                          setShowDeletePopup(true);
                        }}
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                      <span className="absolute left-1/2 -bottom-6 -translate-x-1/2 text-xs text-black dark:text-white px-2 py-1 opacity-0 group-hover:opacity-100 transition-all">
                        {t("delete")}
                      </span>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="px-5 py-4">
                  <DocumentIcon className="w-5 h-5 cursor-pointer text-gray-600 dark:text-gray-300" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {sortedCustomers.length === 0 && (
          <p className="text-center py-4 text-gray-500">{t("noMatchingRecords")}</p>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 border-t border-gray-100 dark:border-white/[0.05]">
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 text-red-500">
            <TrashIcon className="w-5 h-5" /> {t("deleteSelected")} ({selectedCustomers.length} {t("records")})
          </button>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">{t("rowsPerPage")}:</span>
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
            {filteredCustomers.length === 0 ? 0 : indexOfFirstRecord + 1}-{Math.min(indexOfLastRecord, filteredCustomers.length)} {t("of")} {filteredCustomers.length}
          </span>
          
          <button 
            onClick={() => handlePageChange(1)} 
            disabled={currentPage === 1}
            className={`px-2 py-1 border rounded-l ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            title={t("firstPage")}
          >
            {"«"}
          </button>
          
          <button 
            onClick={() => handlePageChange(currentPage - 1)} 
            disabled={currentPage === 1}
            className={`px-2 py-1 border-t border-b ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            title={t("previousPage")}
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
            title={t("nextPage")}
          >
            {">"}
          </button>
          
          <button 
            onClick={() => handlePageChange(totalPages)} 
            disabled={currentPage === totalPages || totalPages === 0}
            className={`px-2 py-1 border rounded-r ${(currentPage === totalPages || totalPages === 0) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            title={t("lastPage")}
          >
            {"»"}
          </button>
        </div>
      </div>

      {/* Delete Confirmation Popup */}
      {showDeletePopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-80 text-center">
            <h2 className="text-lg font-semibold text-gray-800">{t("deleteCustomer")}</h2>
            <p className="text-sm text-gray-600 mt-2">
              {t("deleteCustomerConfirm")} <b>{selectedCustomer?.companyName}</b>?
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
        </div>
      </div>
    </>
  );
}

