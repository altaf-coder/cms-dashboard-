import { useState, useRef, useEffect } from "react";
import { EyeIcon, PencilIcon, TrashIcon, DocumentIcon } from '@heroicons/react/24/outline';
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../../../components/ui/table";
import Badge from "../../../../components/badge/Badge";
import PageBreadcrumb from "../../../../components/common/PageBreadCrumb";
import PageMeta from "../../../Dashboard/PageMeta";
import adminData from '../../../../../data/admins.json';

interface Admin {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  linkedCustomers: number;
  linkedVendors: number;
  status: "Active" | "Suspended" | "Inactive";
}

// Function to get and map admin data from JSON
const getAdminsData = (): Admin[] => {
  if (!adminData || !adminData.admins) return [];
  
  return adminData.admins.map(admin => ({
    id: admin.id || '',
    firstName: admin.firstName || '',
    lastName: admin.lastName || '',
    email: admin.email || '',
    phone: admin.phone || '',
    role: admin.role || 'Admin',
    linkedCustomers: admin.linkedCustomers || 0,
    linkedVendors: admin.linkedVendors || 0,
    status: (admin.status === "Active" || admin.status === "Suspended" || admin.status === "Inactive") 
      ? admin.status as Admin['status']
      : "Active" as const
  }));
};

export default function AdminTable() {
  const { t } = useTranslation();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const dateInputRef = useRef<HTMLInputElement>(null);

  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  
  // Bulk Actions State
  const [selectedAdmins, setSelectedAdmins] = useState<string[]>([]);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);

  // Load admin data from JSON file on component mount
  useEffect(() => {
    const data = getAdminsData();
    setAdmins(data);
  }, []);

  const openDatePicker = () => {
    dateInputRef.current?.showPicker?.();
    dateInputRef.current?.focus();
  };

  const handleDelete = () => {
    if (selectedAdmin) {
      setAdmins(prev => prev.filter(admin => admin.id !== selectedAdmin.id));
      setSelectedAdmin(null);
      setShowDeletePopup(false);
    }
  };

  // Handle Bulk Delete
  const handleBulkDelete = () => {
    if (selectedAdmins.length > 0) {
      setAdmins(prev => prev.filter(admin => !selectedAdmins.includes(admin.id)));
      setSelectedAdmins([]);
    }
  };

  // Handle Bulk Status Update
  const handleBulkStatusUpdate = (newStatus: Admin['status']) => {
    if (selectedAdmins.length > 0) {
      setAdmins(prev => 
        prev.map(admin => 
          selectedAdmins.includes(admin.id) 
            ? { ...admin, status: newStatus }
            : admin
        )
      );
      setSelectedAdmins([]);
    }
  };

  // Handle Bulk Export
  const handleBulkExport = () => {
    if (selectedAdmins.length > 0) {
      const selectedAdminData = admins.filter(admin => selectedAdmins.includes(admin.id));
      console.log('Exporting selected admins:', selectedAdminData);
      // Here you would typically implement CSV export logic
      // For now, we'll just log the data
      
      // Convert to CSV format
      const headers = ['ID', 'First Name', 'Last Name', 'Email', 'Phone', 'Role', 'Status'];
      const csvRows = selectedAdminData.map(admin => [
        admin.id,
        admin.firstName,
        admin.lastName,
        admin.email,
        admin.phone,
        admin.role,
        admin.status
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
      a.setAttribute('download', `admins_export_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  // Toggle individual admin selection
  const toggleAdminSelection = (adminId: string) => {
    setSelectedAdmins(prev =>
      prev.includes(adminId)
        ? prev.filter(id => id !== adminId)
        : [...prev, adminId]
    );
  };

  // Toggle select all on current page
  const toggleSelectAll = () => {
    if (selectedAdmins.length === currentAdmins.length) {
      setSelectedAdmins([]);
    } else {
      const allIds = currentAdmins.map(admin => admin.id);
      setSelectedAdmins(allIds);
    }
  };

  // Pagination logic
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;

  // Handle search and filtering
  const filteredAdmins = admins.filter((admin) => {
    const term = searchTerm.toLowerCase();

    const matchesSearch =
      admin.id.toLowerCase().includes(term) ||
      admin.firstName.toLowerCase().includes(term) ||
      admin.lastName.toLowerCase().includes(term) ||
      admin.email.toLowerCase().includes(term) ||
      admin.phone.toLowerCase().includes(term);

    const matchesRole = roleFilter ? admin.role === roleFilter : true;
    const matchesStatus = statusFilter ? admin.status === statusFilter : true;

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Get current records for pagination
  const currentAdmins = filteredAdmins.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredAdmins.length / recordsPerPage);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, roleFilter, statusFilter, dateFilter]);

  // Handle pagination
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

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

  return (
    <>
      <PageMeta
        title={`${t("adminManagement")} | CMS Dashboard`}
        description={t("manageAdmins")}
      />
      <PageBreadcrumb pageTitle={t("adminManagement")} />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-">
        <div className="overflow-hidden w-full rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-white/[0.05] gap-3 sm:gap-0">
        <h2 className="font-bold text-lg text-gray-900 dark:text-white">{t("manageAdmins")}</h2>
        <Link to="/add-admin">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 whitespace-nowrap min-w-[140px]">
            <span className="text-xl">+</span> {t("addAdmin")}
          </button>
        </Link>
      </div>

      {/* Search & Filters */}
      <div className="px-5 py-3 space-y-3">
        <input
          type="text"
          placeholder={t("searchAdmins")}
          className="w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-white/[0.05] dark:text-white"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="flex flex-wrap gap-2 items-center">

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-1 border bg-gray-200 rounded-lg text-sm dark:bg-white/[0.05] dark:text-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="">{t("role")}</option>
            <option value="Admin">Admin</option>
            <option value="Clearance Agent">{t("clearanceAgent")}</option>
            <option value="Transport Coordinator">{t("transportCoordinator")}</option>
            <option value="Finance">{t("finance")}</option>
          </select>

          {/* Date Picker */}
          <div className="relative w-48">
            <input
              ref={dateInputRef}
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full pl-10 pr-3 py-1 border bg-gray-200 rounded-lg text-sm dark:bg-white/[0.05] dark:text-white focus:ring-2 focus:ring-blue-500"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-white cursor-pointer"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              onClick={openDatePicker}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1 border bg-gray-200 rounded-lg text-sm dark:bg-white/[0.05] dark:text-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="">{t("status")}</option>
            <option value="Active">{t("active")}</option>
            <option value="Suspended">{t("suspended")}</option>
            <option value="Inactive">{t("inactive")}</option>
          </select>

        </div>

        {/* Bulk Actions */}
        {selectedAdmins.length > 0 && (
          <div className="flex flex-wrap gap-2 items-center pt-2 border-t border-gray-100">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {selectedAdmins.length} {t("selected")}
            </span>
            <button
              onClick={() => handleBulkStatusUpdate("Active")}
              className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
            >
              {t("activateSelected")}
            </button>
            <button
              onClick={() => handleBulkStatusUpdate("Suspended")}
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
      <div className="w-full overflow-x-hidden no-scrollbar">
        <Table className="w-full table-auto">
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell className="px-2 py-2 text-start text-gray-500 font-medium text-[10px] dark:text-gray-400">
                <input 
                  type="checkbox" 
                  className="accent-blue-600"
                  checked={selectedAdmins.length === currentAdmins.length && currentAdmins.length > 0}
                  onChange={toggleSelectAll}
                />
              </TableCell>
              <TableCell className="px-2 py-2 text-start text-gray-500 font-medium text-[10px] dark:text-gray-400 whitespace-nowrap">{t("id")}</TableCell>
              <TableCell className="px-2 py-2 text-start text-gray-500 font-medium text-[10px] dark:text-gray-400 whitespace-nowrap">{t("firstName")}</TableCell>
              <TableCell className="px-2 py-2 text-start text-gray-500 font-medium text-[10px] dark:text-gray-400 whitespace-nowrap">{t("lastName")}</TableCell>
              <TableCell className="px-2 py-2 text-start text-gray-500 font-medium text-[10px] dark:text-gray-400 whitespace-nowrap">{t("email")}</TableCell>
              <TableCell className="px-2 py-2 text-start text-gray-500 font-medium text-[10px] dark:text-gray-400 whitespace-nowrap">{t("phone")}</TableCell>
              <TableCell className="px-2 py-2 text-start text-gray-500 font-medium text-[10px] dark:text-gray-400 whitespace-nowrap">{t("role")}</TableCell>
              <TableCell className="px-2 py-2 text-start text-gray-500 font-medium text-[10px] dark:text-gray-400 whitespace-nowrap">{t("linkedCustomers")}</TableCell>
              <TableCell className="px-2 py-2 text-start text-gray-500 font-medium text-[10px] dark:text-gray-400 whitespace-nowrap">{t("linkedVendors")}</TableCell>
              <TableCell className="px-2 py-2 text-start text-gray-500 font-medium text-[10px] dark:text-gray-400 whitespace-nowrap">{t("status")}</TableCell>
              <TableCell className="px-2 py-2 text-start text-gray-500 font-medium text-[10px] dark:text-gray-400 whitespace-nowrap">{t("action")}</TableCell>
              <TableCell className="px-2 py-2 text-start text-gray-500 font-medium text-[10px] dark:text-gray-400 whitespace-nowrap">{t("activityLog")}</TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {currentAdmins.map((admin) => (
              <TableRow key={admin.id} className="hover:bg-gray-50 dark:hover:bg-white/5">
                <TableCell className="px-2 py-2">
                  <input 
                    type="checkbox" 
                    className="accent-blue-600"
                    checked={selectedAdmins.includes(admin.id)}
                    onChange={() => toggleAdminSelection(admin.id)}
                  />
                </TableCell>
                <TableCell className="px-2 py-2 font-medium text-xs whitespace-nowrap">{admin.id}</TableCell>
                <TableCell className="px-2 py-2 text-xs whitespace-nowrap">{admin.firstName}</TableCell>
                <TableCell className="px-2 py-2 text-xs whitespace-nowrap">{admin.lastName}</TableCell>
                <TableCell className="px-2 py-2 text-xs whitespace-nowrap">
                  <a href={`mailto:${admin.email}`} className="underline text-blue-600">{admin.email}</a>
                </TableCell>
                <TableCell className="px-2 py-2 text-xs whitespace-nowrap">{admin.phone}</TableCell>
                <TableCell className="px-2 py-2 text-xs whitespace-nowrap">{admin.role}</TableCell>
                <TableCell className="px-2 py-2 text-xs text-blue-600 underline whitespace-nowrap">{admin.linkedCustomers}</TableCell>
                <TableCell className="px-2 py-2 text-xs text-blue-600 underline whitespace-nowrap">{admin.linkedVendors}</TableCell>
                <TableCell className="px-2 py-2 whitespace-nowrap">
                  <Badge color={
                    admin.status === "Active" ? "success" : 
                    admin.status === "Suspended" ? "error" : 
                    "warning"
                  } size="sm">
                    {admin.status}
                  </Badge>
                </TableCell>
                <TableCell className="px-2 py-2 whitespace-nowrap">
                  <div className="flex items-center gap-0.5">

                    {/* View */}
                    <div className="relative group">
                      <Link to={`/view-admin/${admin.id}`}>
                        <EyeIcon className="w-4 h-4 text-blue-600 group-hover:text-blue-800" />
                      </Link>
                      <span className="absolute left-1/2 -bottom-6 -translate-x-1/2 text-[10px] text-black dark:text-white px-1 py-0.5 opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap">
                        {t("view")}
                      </span>
                    </div>

                    {/* Edit */}
                    <div className="relative group">
                      <Link to={`/edit-admin/${admin.id}`}>
                        <PencilIcon className="w-4 h-4 text-black group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-200" />
                      </Link>
                      <span className="absolute left-1/2 -bottom-6 -translate-x-1/2 text-[10px] text-black dark:text-white px-1 py-0.5 opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap">
                        {t("edit")}
                      </span>
                    </div>

                    {/* Delete */}
                    <div className="relative group">
                      <button
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                        onClick={() => {
                          setSelectedAdmin(admin);
                          setShowDeletePopup(true);
                        }}
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                      <span className="absolute left-1/2 -bottom-6 -translate-x-1/2 text-[10px] text-black dark:text-white px-1 py-0.5 opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap">
                        {t("delete")}
                      </span>
                    </div>

                  </div>
                </TableCell>

                <TableCell className="px-2 py-2 whitespace-nowrap">
                  <DocumentIcon className="w-4 h-4 cursor-pointer text-gray-600 dark:text-gray-300" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredAdmins.length === 0 && (
          <p className="text-center py-4 text-gray-500">{t("noMatchingRecords")}</p>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 border-t border-gray-100 dark:border-white/[0.05]">
        <div className="flex items-center gap-4">
          <button 
            className="flex items-center gap-2 text-red-500"
            onClick={handleBulkDelete}
            disabled={selectedAdmins.length === 0}
          >
            <TrashIcon className="w-5 h-5" /> {t("deleteSelected")} ({selectedAdmins.length} {t("records")})
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
            {filteredAdmins.length === 0 ? 0 : indexOfFirstRecord + 1}-{Math.min(indexOfLastRecord, filteredAdmins.length)} {t("of")} {filteredAdmins.length}
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
            <h2 className="text-lg font-semibold text-gray-800">{t("deleteAdmin")}</h2>
            <p className="text-sm text-gray-600 mt-2">
              {t("deleteAdminConfirm")} <b>{selectedAdmin?.firstName}</b>?
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