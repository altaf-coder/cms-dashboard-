import { useState, useRef, useEffect, useMemo } from "react";
// @ts-ignore - JSON import is handled by TypeScript config
import jobsData from '../../../../data/admins.json';
import {
  EyeIcon,
  PencilIcon,
  XMarkIcon,
  MapPinIcon,
  BellAlertIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../Dashboard/PageMeta";

interface Job {
  id: string;
  shipmentId: string;
  containerNo: string;
  jobType:
  | "Pickup"
  | "Delivery"
  | "Transhipment"
  | "Storage"
  | "Customs Clearance";
  vendor: string;
  driver: string;
  truckNo: string;
  jobDateTime: string;
  status:
  | "Pending"
  | "Assigned"
  | "In Progress"
  | "Completed"
  | "Cancelled"
  | "Overdue";
  lastReturnDate: string;
  autoAlerts: boolean;
  overdue: boolean;
  todaysJob: boolean;
}


// Function to get and map job data from JSON
const getJobsData = (): Job[] => {
  if (!jobsData || !jobsData.jobs) return [];

  return jobsData.jobs.map(job => ({
    id: job.id || 'N/A',
    shipmentId: job.shipmentId || 'N/A',
    containerNo: job.containerNo || 'N/A',
    jobType: (job.jobType as Job['jobType']) || 'Pickup',
    vendor: job.vendor || 'N/A',
    driver: job.driver || '—',
    truckNo: job.truckNo || '—',
    jobDateTime: job.jobDateTime || 'N/A',
    status: (job.status as Job['status']) || 'Pending',
    lastReturnDate: job.lastReturnDate || 'N/A',
    autoAlerts: job.autoAlerts || false,
    overdue: job.overdue || false,
    todaysJob: job.todaysJob || false
  }));
};

export default function ViewJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);

  // Load job data on component mount
  useEffect(() => {
    const data = getJobsData();
    setJobs(data);
  }, []);
  const [jobIdFilter, setJobIdFilter] = useState("");
  const [shipmentIdFilter, setShipmentIdFilter] = useState("");
  const [containerNoFilter, setContainerNoFilter] = useState("");
  const [driverNameFilter, setDriverNameFilter] = useState("");
  const [vendorNameFilter, setVendorNameFilter] = useState("");
  const [jobTypeFilter, setJobTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [jobDateStartFilter, setJobDateStartFilter] = useState("");
  const [jobDateEndFilter, setJobDateEndFilter] = useState("");
  const [showOverdueOnly, setShowOverdueOnly] = useState(false);
  const [showTodaysJobsOnly, setShowTodaysJobsOnly] = useState(false);
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);
  const [showCancelConfirm, setShowCancelConfirm] = useState<string | null>(
    null
  );

  // Refs for date inputs
  const jobDateStartRef = useRef<HTMLInputElement | null>(null);
  const jobDateEndRef = useRef<HTMLInputElement | null>(null);

  // Handle calendar icon click
  const handleCalendarClick = (
    ref: React.RefObject<HTMLInputElement | null>
  ): void => {
    if (ref.current) {
      ref.current.showPicker();
    }
  };

  // Handle filtering - memoized for performance
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesJobID = jobIdFilter
        ? job.id.toLowerCase().includes(jobIdFilter.toLowerCase())
        : true;
      const matchesShipmentID = shipmentIdFilter
        ? job.shipmentId.toLowerCase().includes(shipmentIdFilter.toLowerCase())
        : true;
      const matchesContainerNo = containerNoFilter
        ? job.containerNo.toLowerCase().includes(containerNoFilter.toLowerCase())
        : true;
      const matchesDriverName = driverNameFilter
        ? job.driver.toLowerCase().includes(driverNameFilter.toLowerCase())
        : true;
      const matchesVendorName = vendorNameFilter
        ? job.vendor.toLowerCase().includes(vendorNameFilter.toLowerCase())
        : true;
      const matchesJobType = jobTypeFilter ? job.jobType === jobTypeFilter : true;
      const matchesStatus = statusFilter ? job.status === statusFilter : true;
      const matchesOverdue = showOverdueOnly ? job.overdue === true : true;
      const matchesTodaysJobs = showTodaysJobsOnly
        ? job.todaysJob === true
        : true;

      // Job Date Range filter
      let matchesJobDate = true;
      if (jobDateStartFilter || jobDateEndFilter) {
        const jobDateStr = job.jobDateTime.split(",")[0]; // Extract date part
        const jobDate = new Date(jobDateStr);
        const startDate = jobDateStartFilter
          ? new Date(jobDateStartFilter)
          : null;
        const endDate = jobDateEndFilter ? new Date(jobDateEndFilter) : null;

        if (startDate && jobDate < startDate) matchesJobDate = false;
        if (endDate && jobDate > endDate) matchesJobDate = false;
      }

      return (
        matchesJobID &&
        matchesShipmentID &&
        matchesContainerNo &&
        matchesDriverName &&
        matchesVendorName &&
        matchesJobType &&
        matchesStatus &&
        matchesJobDate &&
        matchesOverdue &&
        matchesTodaysJobs
      );
    });
  }, [jobs, jobIdFilter, shipmentIdFilter, containerNoFilter, driverNameFilter, vendorNameFilter, jobTypeFilter, statusFilter, showOverdueOnly, showTodaysJobsOnly, jobDateStartFilter, jobDateEndFilter]);

  // Pagination logic
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredJobs.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredJobs.length / recordsPerPage);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [jobIdFilter, shipmentIdFilter, containerNoFilter, driverNameFilter, vendorNameFilter, jobTypeFilter, statusFilter, jobDateStartFilter, jobDateEndFilter, showOverdueOnly, showTodaysJobsOnly]);

  // Handle selection
  const toggleJobSelection = (jobId: string): void => {
    setSelectedJobs((prev) =>
      prev.includes(jobId)
        ? prev.filter((id) => id !== jobId)
        : [...prev, jobId]
    );
  };

  const toggleSelectAll = (): void => {
    setSelectedJobs(
      selectedJobs.length === currentRecords.length
        ? []
        : currentRecords.map((job) => job.id)
    );
  };

  // Handle individual job cancellation - यह पूरी लाइन remove करेगा
  const handleCancelJob = (jobId: string): void => {
    setShowCancelConfirm(jobId);
  };

  // Confirm individual job cancellation
  const confirmCancelJob = (jobId: string): void => {
    setJobs((prevJobs) => prevJobs.filter((job) => job.id !== jobId));
    setSelectedJobs((prev) => prev.filter((id) => id !== jobId));
    setShowCancelConfirm(null);
  };

  // Cancel bulk jobs - यह selected सभी jobs remove करेगा
  const handleBulkCancel = (): void => {
    setJobs((prevJobs) =>
      prevJobs.filter((job) => !selectedJobs.includes(job.id))
    );
    setSelectedJobs([]);
  };

  // Status badge colors
  const getStatusColor = (status: string): string => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border border-yellow-200";
      case "Assigned":
        return "bg-blue-100 text-blue-800 border border-blue-200 px-5";
      case "In Progress":
        return "bg-indigo-100 text-indigo-800 border border-indigo-200";
      case "Completed":
        return "bg-green-100 text-green-800 border border-green-200";
      case "Cancelled":
        return "bg-red-100 text-red-800 border border-red-200";
      case "Overdue":
        return "bg-rose-100 text-rose-800 border border-rose-200 font-bold";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  // Job Type badge colors
  const getJobTypeColor = (type: string): string => {
    switch (type) {
      case "Pickup":
        return "bg-blue-50 text-blue-700 border border-blue-200";
      case "Delivery":
        return "bg-green-50 text-green-700 border border-green-200";
      case "Transhipment":
        return "bg-purple-50 text-purple-700 border border-purple-200";
      case "Storage":
        return "bg-amber-50 text-amber-700 border border-amber-200";
      case "Customs Clearance":
        return "bg-cyan-50 text-cyan-700 border border-cyan-200";
      default:
        return "bg-gray-50 text-gray-700 border border-gray-200";
    }
  };

  // Bulk actions
  const handleBulkExport = (): void => {
    // TODO: Implement bulk export functionality
    // Implement bulk export logic
  };

  return (
    <>
      <PageMeta
        title="Jobs Management | CMS Dashboard"
        description="Manage jobs and assignments"
      />
      <PageBreadcrumb pageTitle="Jobs Management" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="overflow-hidden w-full rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-white/[0.05] gap-3 sm:gap-0">
            <h2 className="font-bold text-lg text-gray-900 dark:text-white">
              View Jobs
            </h2>
            <Link to="/add-jobs">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                <span className="text-xl">+</span> Add New Job
              </button>
            </Link>
          </div>

          {/* Confirmation Modal for Single Job Cancellation */}
          {showCancelConfirm && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
              <div className="bg-white p-6 rounded-xl shadow-lg z-10 text-center max-w-sm mx-auto">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <XMarkIcon className="h-6 w-6 text-red-600" />
                  </div>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Delete Job
                </h2>
                <p className="text-gray-700 mb-6">
                  Are you sure you want to delete this job? This action cannot be
                  undone.
                </p>
                <div className="flex justify-center space-x-3">
                  <button
                    onClick={() => setShowCancelConfirm(null)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => confirmCancelJob(showCancelConfirm)}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                  >
                    Delete Job
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="px-5 py-3 space-y-3">
            {/* Search & Filter Row 1 */}
            <div className="flex flex-wrap gap-3 items-center">
              {/* Job ID Filter */}
              <div className="flex flex-col">
                <label className="text-xs text-gray-500 mb-1">Job ID</label>
                <input
                  type="text"
                  placeholder="Enter Job ID"
                  className="w-32 px-3 py-2 border bg-gray-200 rounded-lg text-sm dark:bg-white/[0.05] dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={jobIdFilter}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setJobIdFilter(e.target.value)
                  }
                />
              </div>

              {/* Shipment ID Filter */}
              <div className="flex flex-col">
                <label className="text-xs text-gray-500 mb-1">Shipment ID</label>
                <input
                  type="text"
                  placeholder="Enter Shipment ID"
                  className="w-36 px-3 py-2 border bg-gray-200 rounded-lg text-sm dark:bg-white/[0.05] dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={shipmentIdFilter}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setShipmentIdFilter(e.target.value)
                  }
                />
              </div>

              {/* Container No Filter */}
              <div className="flex flex-col">
                <label className="text-xs text-gray-500 mb-1">Container No.</label>
                <input
                  type="text"
                  placeholder="Enter Container No"
                  className="w-40 px-3 py-2 border bg-gray-200 rounded-lg text-sm dark:bg-white/[0.05] dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={containerNoFilter}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setContainerNoFilter(e.target.value)
                  }
                />
              </div>

              {/* Driver Name Filter */}
              <div className="flex flex-col">
                <label className="text-xs text-gray-500 mb-1">Driver Name</label>
                <input
                  type="text"
                  placeholder="Enter Driver Name"
                  className="w-40 px-3 py-2 border bg-gray-200 rounded-lg text-sm dark:bg-white/[0.05] dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={driverNameFilter}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setDriverNameFilter(e.target.value)
                  }
                />
              </div>

              {/* Vendor Name Filter */}
              <div className="flex flex-col">
                <label className="text-xs text-gray-500 mb-1">Vendor Name</label>
                <input
                  type="text"
                  placeholder="Enter Vendor Name"
                  className="w-40 px-3 py-2 border bg-gray-200 rounded-lg text-sm dark:bg-white/[0.05] dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={vendorNameFilter}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setVendorNameFilter(e.target.value)
                  }
                />
              </div>
            </div>

            {/* Search & Filter Row 2 */}
            <div className="flex flex-wrap gap-3 items-center">
              {/* Job Type Filter */}
              <div className="flex flex-col">
                <label className="text-xs text-gray-500 mb-1">Job Type</label>
                <select
                  value={jobTypeFilter}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setJobTypeFilter(e.target.value)
                  }
                  className="w-40 px-3 py-2 border bg-gray-200 rounded-lg text-sm dark:bg-white/[0.05] dark:text-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Types</option>
                  <option value="Pickup">Pickup</option>
                  <option value="Delivery">Delivery</option>
                  <option value="Transhipment">Transhipment</option>
                  <option value="Storage">Storage</option>
                  <option value="Customs Clearance">Customs Clearance</option>
                </select>
              </div>

              {/* Job Date Range Filter */}
              <div className="flex flex-col">
                <label className="text-xs text-gray-500 mb-1">Job Date Range</label>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <input
                      type="date"
                      ref={jobDateStartRef}
                      className="w-36 px-3 py-2 pl-10 pr-3 border bg-gray-200 rounded-lg text-sm dark:bg-white/[0.05] dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={jobDateStartFilter}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setJobDateStartFilter(e.target.value)
                      }
                    />
                    <div
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                      onClick={() => handleCalendarClick(jobDateStartRef)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  </div>

                  <span className="text-gray-500">to</span>

                  <div className="relative">
                    <input
                      type="date"
                      ref={jobDateEndRef}
                      className="w-36 px-3 py-2 pl-10 pr-3 border bg-gray-200 rounded-lg text-sm dark:bg-white/[0.05] dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={jobDateEndFilter}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setJobDateEndFilter(e.target.value)
                      }
                    />
                    <div
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                      onClick={() => handleCalendarClick(jobDateEndRef)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Filter */}
              <div className="flex flex-col">
                <label className="text-xs text-gray-500 mb-1">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setStatusFilter(e.target.value)
                  }
                  className="w-40 px-3 py-2 border bg-gray-200 rounded-lg text-sm dark:bg-white/[0.05] dark:text-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Assigned">Assigned</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="Overdue">Overdue</option>
                </select>
              </div>

              {/* Checkboxes */}
              <div className="flex items-center gap-4 mt-6">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="accent-red-500"
                    checked={showOverdueOnly}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setShowOverdueOnly(e.target.checked)
                    }
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Overdue Jobs only
                  </span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="accent-blue-500"
                    checked={showTodaysJobsOnly}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setShowTodaysJobsOnly(e.target.checked)
                    }
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Today's Jobs
                  </span>
                </label>
              </div>
            </div>

            {/* Bulk Actions */}
            {selectedJobs.length > 0 && (
              <div className="flex flex-wrap gap-2 items-center pt-2 border-t border-gray-100">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedJobs.length} selected
                </span>

                {/* Cancel Selected Button */}
                <button
                  onClick={handleBulkCancel}
                  className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 flex items-center gap-1"
                  title="Cancel Selected"
                >
                  <XMarkIcon className="w-4 h-4" />
                  Cancel Jobs
                </button>

                {/* Export CSV Button */}
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
                      checked={
                        selectedJobs.length === currentRecords.length &&
                        currentRecords.length > 0
                      }
                      onChange={toggleSelectAll}
                    />
                  </TableCell>
                  <TableCell className="px-5 py-3 text-start text-gray-500 font-medium text-xs dark:text-gray-400 border-r border-gray-200 dark:border-white/10">Job ID</TableCell>
                  <TableCell className="px-5 py-3 text-start text-gray-500 font-medium text-xs dark:text-gray-400 border-r border-gray-200 dark:border-white/10">Shipment ID</TableCell>
                  <TableCell className="px-5 py-3 text-start text-gray-500 font-medium text-xs dark:text-gray-400 border-r border-gray-200 dark:border-white/10">Container No.</TableCell>
                  <TableCell className="px-5 py-3 text-start text-gray-500 font-medium text-xs dark:text-gray-400 border-r border-gray-200 dark:border-white/10">Job Type</TableCell>
                  <TableCell className="px-5 py-3 text-start text-gray-500 font-medium text-xs dark:text-gray-400 border-r border-gray-200 dark:border-white/10">Vendor</TableCell>
                  <TableCell className="px-5 py-3 text-start text-gray-500 font-medium text-xs dark:text-gray-400 border-r border-gray-200 dark:border-white/10">Driver</TableCell>
                  <TableCell className="px-5 py-3 text-start text-gray-500 font-medium text-xs dark:text-gray-400 border-r border-gray-200 dark:border-white/10">Truck No.</TableCell>
                  <TableCell className="px-5 py-3 text-start text-gray-500 font-medium text-xs dark:text-gray-400 border-r border-gray-200 dark:border-white/10">Job Date / Time</TableCell>
                  <TableCell className="px-5 py-3 text-start text-gray-500 font-medium text-xs dark:text-gray-400 border-r border-gray-200 dark:border-white/10">Status</TableCell>
                  <TableCell className="px-5 py-3 text-start text-gray-500 font-medium text-xs dark:text-gray-400 border-r border-gray-200 dark:border-white/10">Last Return Date</TableCell>
                  <TableCell className="px-5 py-3 text-start text-gray-500 font-medium text-xs dark:text-gray-400 border-r border-gray-200 dark:border-white/10">Auto Alerts</TableCell>
                  <TableCell className="px-5 py-3 text-start text-gray-500 font-medium text-xs dark:text-gray-400">Actions</TableCell>
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-gray-200 dark:divide-white/10">
                {currentRecords.map((job) => (
                  <TableRow key={job.id} className="hover:bg-gray-50 dark:hover:bg-white/5 border-b border-gray-200 dark:border-white/10">
                    <TableCell className="px-5 py-4 border-r border-gray-200 dark:border-white/10">
                      <input
                        type="checkbox"
                        className="accent-blue-600"
                        checked={selectedJobs.includes(job.id)}
                        onChange={() => toggleJobSelection(job.id)}
                      />
                    </TableCell>
                    <TableCell className="px-5 py-4 font-medium border-r border-gray-200 dark:border-white/10">{job.id}</TableCell>
                    <TableCell className="px-5 py-4 border-r border-gray-200 dark:border-white/10">{job.shipmentId}</TableCell>
                    <TableCell className="px-5 py-4 border-r border-gray-200 dark:border-white/10">{job.containerNo}</TableCell>
                    <TableCell className="px-5 py-4 border-r border-gray-200 dark:border-white/10">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getJobTypeColor(job.jobType)}`}
                      >
                        {job.jobType}
                      </span>
                    </TableCell>
                    <TableCell className="px-5 py-4 border-r border-gray-200 dark:border-white/10">{job.vendor}</TableCell>
                    <TableCell className={`px-5 py-4 border-r border-gray-200 dark:border-white/10 ${job.driver === "—" ? "text-gray-400" : ""}`}>{job.driver}</TableCell>
                    <TableCell className={`px-5 py-4 border-r border-gray-200 dark:border-white/10 ${job.truckNo === "—" ? "text-gray-400" : ""}`}>{job.truckNo}</TableCell>
                    <TableCell className="px-5 py-4 border-r border-gray-200 dark:border-white/10">
                      <div className={`${job.overdue ? "text-red-600 font-medium" : ""} ${job.todaysJob && !job.overdue ? "text-blue-600 font-medium" : ""}`}>
                        {job.jobDateTime}
                        {job.overdue && <span className="ml-2 text-xs bg-red-100 text-red-800 px-1.5 py-0.5 rounded">OVERDUE</span>}
                        {job.todaysJob && !job.overdue && <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">TODAY</span>}
                      </div>
                    </TableCell>
                    <TableCell className="px-5 py-4 border-r border-gray-200 dark:border-white/10">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                        {job.status}
                      </span>
                    </TableCell>
                    <TableCell className="px-5 py-4 border-r border-gray-200 dark:border-white/10">{job.lastReturnDate}</TableCell>
                    <TableCell className="px-5 py-4 border-r border-gray-200 dark:border-white/10">
                      <div className="flex justify-center">
                        {job.autoAlerts ? <BellAlertIcon className="w-5 h-5 text-green-600" /> : <BellAlertIcon className="w-5 h-5 text-gray-400" />}
                      </div>
                    </TableCell>

                    {/* Actions with hover text */}
                    <TableCell className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        {/* View */}
                        <div className="relative group">
                          <Link to={`/view-jobs/${job.id}`}>
                            <EyeIcon className="w-5 h-5 text-blue-600 group-hover:text-blue-800" />
                          </Link>
                          <span className="absolute left-1/2 -bottom-6 -translate-x-1/2 text-xs text-black dark:text-white px-2 py-1 opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap">
                            View
                          </span>
                        </div>

                        {/* Edit */}
                        <div className="relative group">
                          <Link to={`/edit-jobs/${job.id}`}>
                            <PencilIcon className="w-5 h-5 text-black group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-200" />
                          </Link>
                          <span className="absolute left-1/2 -bottom-6 -translate-x-1/2 text-xs text-black dark:text-white px-2 py-1 opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap">
                            Edit
                          </span>
                        </div>

                        {/* Cancel */}
                        <div className="relative group">
                          <button
                            className="text-red-600 hover:text-red-800 disabled:text-gray-400 disabled:cursor-not-allowed"
                            disabled={job.status === "Completed" || job.status === "Cancelled"}
                            onClick={() => handleCancelJob(job.id)}
                          >
                            <XMarkIcon className="w-5 h-5" />
                          </button>
                          <span className="absolute left-1/2 -bottom-6 -translate-x-1/2 text-xs text-black dark:text-white px-2 py-1 opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap">
                            Cancel
                          </span>
                        </div>

                        {/* Track */}
                        <div className="relative group">
                          <button
                            className="text-green-600 hover:text-green-800 disabled:text-gray-400 disabled:cursor-not-allowed"
                            disabled={!job.driver || job.driver === "—"}
                            onClick={() => {
                              // TODO: Implement job tracking
                            }}
                          >
                            <MapPinIcon className="w-5 h-5" />
                          </button>
                          <span className="absolute left-1/2 -bottom-6 -translate-x-1/2 text-xs text-black dark:text-white px-2 py-1 opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap">
                            Track
                          </span>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredJobs.length === 0 && (
              <p className="text-center py-4 text-gray-500">No matching records found.</p>
            )}
          </div>


          {/* Pagination Controls */}
          {filteredJobs.length > 0 && (
            <div className="px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 border-t border-gray-100 dark:border-white/[0.05]">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Showing {indexOfFirstRecord + 1} to {Math.min(indexOfLastRecord, filteredJobs.length)} of {filteredJobs.length} jobs
                </span>
                <select
                  value={recordsPerPage}
                  onChange={(e) => {
                    setRecordsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-2 py-1 border rounded text-sm"
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
                  className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
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
                        className={`px-3 py-1 border rounded text-sm ${currentPage === pageNumber
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'hover:bg-gray-50'
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
                  className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
