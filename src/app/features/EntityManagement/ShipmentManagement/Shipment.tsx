import { useState, useRef, useEffect } from "react";
// @ts-ignore - JSON import is handled by TypeScript config
import shipmentData from '../../../../data/admins.json';
import { 
  EyeIcon, 
  PencilIcon, 
  DocumentIcon, 
  CurrencyDollarIcon, 
  TruckIcon, 
  ArrowDownTrayIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  CalendarIcon,
  DocumentArrowUpIcon,
  ChevronDownIcon,
  XMarkIcon,
  BellIcon
} from '@heroicons/react/24/outline';
import { Link } from "react-router-dom";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../../components/ui/table";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../Dashboard/PageMeta";
import { useTranslation } from 'react-i18next';

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

// REMOVED the unused ShipmentData interface

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
  const { t } = useTranslation();
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
  
  // Popup states
  const [showAssignPopup, setShowAssignPopup] = useState(false);
  const [showStatusChangePopup, setShowStatusChangePopup] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [newStatus, setNewStatus] = useState<Shipment['status']>("Documents Pending");
  
  // Notification Popup State
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);
  
  // Form states
  const [arrivalDate, setArrivalDate] = useState("");
  const [doUploads, setDoUploads] = useState<File[]>([]);
  const [manifestFile, setManifestFile] = useState<File | null>(null);
  const [billOfLadingFile, setBillOfLadingFile] = useState<File | null>(null);
  const [deliveryNoteFile, setDeliveryNoteFile] = useState<File | null>(null);
  const [currentStep, setCurrentStep] = useState<'status-select' | 'arrival-form' | 'manifest-upload' | 'delivery-note'>('status-select');

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

  // Handle filtering with global search
  const filteredShipments = shipments.filter((shipment) => {
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

  // Handle file uploads
  const handleDoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setDoUploads(prev => [...prev, ...files]);
    }
  };

  const handleManifestUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setManifestFile(e.target.files[0]);
    }
  };

  const handleBillOfLadingUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setBillOfLadingFile(e.target.files[0]);
    }
  };

  const handleDeliveryNoteUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setDeliveryNoteFile(e.target.files[0]);
    }
  };

  // Handle status change from table dropdown
  const handleStatusChangeInTable = (shipment: Shipment, newStatus: Shipment['status']) => {
    setSelectedShipment(shipment);
    setNewStatus(newStatus);
    
    if (newStatus === "Arrived") {
      // Open popup for Arrived status with full flow
      setCurrentStep('status-select');
      setShowStatusChangePopup(true);
    } else {
      // Direct status change for other statuses
      setShipments(prev => prev.map(s => 
        s.id === shipment.id ? { ...s, status: newStatus } : s
      ));
    }
  };

  // Handle status change from popup
  const handleStatusSelection = () => {
    if (!selectedShipment) return;

    if (newStatus === "Arrived") {
      // If changing to Arrived, show arrival form
      setCurrentStep('arrival-form');
      setArrivalDate("");
      setDoUploads([]);
    } else {
      // For other statuses, update directly
      setShipments(prev => prev.map(s => 
        s.id === selectedShipment.id ? { ...s, status: newStatus } : s
      ));
      setShowStatusChangePopup(false);
      setNewStatus("Documents Pending");
    }
  };

  // Submit Arrival Form
  const submitArrivalForm = () => {
    if (!selectedShipment || !arrivalDate) {
      alert(t('pleaseSelectArrivalDate'));
      return;
    }

    // Update shipment with arrival date and DO uploads
    setShipments(prev => prev.map(s => {
      if (s.id === selectedShipment.id) {
        return {
          ...s,
          arrivalDate: arrivalDate,
          doDocuments: doUploads.map(f => f.name)
        };
      }
      return s;
    }));

    // Move to manifest upload step
    setCurrentStep('manifest-upload');
  };

  // Generate TXT File
  const generateTxtFile = () => {
    if (!selectedShipment || !manifestFile || !billOfLadingFile) {
      // Show notification popup if files are missing
      setShowNotificationPopup(true);
      return;
    }

    // Generate TXT file content
    const txtContent = `
MANIFEST DETAILS
================
Shipment #: ${selectedShipment.id}
Container(s): ${selectedShipment.containerNo.join(', ')}

BILL OF LADING INFORMATION
==========================
Document: ${billOfLadingFile.name}
Upload Date: ${new Date().toLocaleDateString()}

ARRIVAL DETAILS
===============
Arrival Date: ${arrivalDate}
Port: ${selectedShipment.port}
Vendor: ${selectedShipment.vendor}

Generated on: ${new Date().toISOString()}
    `.trim();

    // Create and download TXT file
    const blob = new Blob([txtContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Manifest_${selectedShipment.id}_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // Update shipment with TXT file info
    setShipments(prev => prev.map(s => {
      if (s.id === selectedShipment.id) {
        return {
          ...s,
          status: "Arrived" as const,
          manifestTxtFile: `Manifest_${selectedShipment.id}_${Date.now()}.txt`
        };
      }
      return s;
    }));

    // Move to delivery note step
    setCurrentStep('delivery-note');
  };

  // Submit Delivery Note
  const submitDeliveryNote = () => {
    if (!selectedShipment) return;

    // Update shipment with delivery note
    setShipments(prev => prev.map(s => {
      if (s.id === selectedShipment.id) {
        return {
          ...s,
          deliveryNote: deliveryNoteFile?.name || 'Not provided'
        };
      }
      return s;
    }));

    // Close all popups
    setShowStatusChangePopup(false);
    setCurrentStep('status-select');
    setArrivalDate("");
    setDoUploads([]);
    setManifestFile(null);
    setBillOfLadingFile(null);
    setDeliveryNoteFile(null);

    alert("Shipment status updated to Arrived successfully!");
  };

  // Cancel status change
  const cancelStatusChange = () => {
    setShowStatusChangePopup(false);
    setCurrentStep('status-select');
    setNewStatus("Documents Pending");
    setArrivalDate("");
    setDoUploads([]);
    setManifestFile(null);
    setBillOfLadingFile(null);
    setDeliveryNoteFile(null);
  };

  // Bulk actions
  const handleBulkAssign = (): void => {
    console.log('Assigning selected shipments:', selectedShipments);
    // Implement bulk assign logic
  };

  const handleBulkExport = (): void => {
    console.log('Exporting selected shipments:', selectedShipments);
    // Implement bulk export logic
  };

  // Function to render uploaded files list
  const renderUploadedFiles = (files: File[]) => {
    return (
      <div className="mt-2 max-h-40 overflow-y-auto">
        {files.map((file, index) => (
          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded mb-1">
            <span className="text-sm text-gray-600 truncate">{file.name}</span>
            <button
              type="button"
              onClick={() => setDoUploads(files.filter((_, i) => i !== index))}
              className="text-red-500 hover:text-red-700"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    );
  };

  // Render action buttons based on status
  const renderActionButtons = (shipment: Shipment) => {
    switch (shipment.status) {
      case "Documents Pending":
        return (
          <>
            {/* View */}
            <div className="relative group">
              <Link to={`/view-shipment/${shipment.id}`}>
                <EyeIcon className="w-5 h-5 text-blue-600 group-hover:text-blue-800" />
              </Link>
            </div>

            {/* Edit */}
            <div className="relative group">
              <Link to={`/edit-shipment/${shipment.id}`}>
                <PencilIcon className="w-5 h-5 text-black group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-200" />
              </Link>
            </div>

            {/* Docs */}
            <div className="relative group">
              <Link to="/documents">
                <DocumentIcon className="w-5 h-5 text-gray-600 group-hover:text-gray-800 dark:text-gray-400 dark:group-hover:text-gray-200" />
              </Link>
            </div>

            {/* Assign */}
            <div className="relative group">
              <button
                className="text-green-600 hover:text-green-800"
                onClick={() => {
                  setSelectedShipment(shipment);
                  setShowAssignPopup(true);
                }}
              >
                <TruckIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Pay */}
            <div className="relative group">
              <Link to={`/payment/${shipment.id}`}>
                <CurrencyDollarIcon className="w-5 h-5 text-yellow-600 group-hover:text-yellow-800" />
              </Link>
            </div>

            {/* Update Cars */}
            <span className="text-gray-400 mx-1">•</span>
            <div className="relative group">
              <button
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                onClick={() => console.log('Update cars for shipment:', shipment.id)}
              >
                {t('updateCars')}
              </button>
            </div>
          </>
        );

      case "Arrived":
        return (
          <>
            {/* View Details */}
            <div className="relative group">
              <Link to={`/view-shipment/${shipment.id}`}>
                <button className="text-sm font-medium text-blue-600 hover:text-blue-800">
                  {t('viewDetails')}
                </button>
              </Link>
            </div>

            <span className="text-gray-400 mx-1">|</span>

            {/* Edit */}
            <div className="relative group">
              <Link to={`/edit-shipment/${shipment.id}`}>
                <button className="text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                  {t('edit')}
                </button>
              </Link>
            </div>

            <span className="text-gray-400 mx-1">|</span>

            {/* Assign Clearance Agent */}
            <div className="relative group">
              <button
                className="text-sm font-medium text-green-600 hover:text-green-800"
                onClick={() => console.log('Assign clearance agent:', shipment.id)}
              >
                {t('assignClearanceAgent')}
              </button>
            </div>

            <span className="text-gray-400 mx-1">|</span>

            {/* Assign Transport */}
            <div className="relative group">
              <button
                className="text-sm font-medium text-green-600 hover:text-green-800"
                onClick={() => {
                  setSelectedShipment(shipment);
                  setShowAssignPopup(true);
                }}
              >
                {t('assignTransport')}
              </button>
            </div>

            <span className="text-gray-400 mx-1">|</span>

            {/* Override Demurrage */}
            <div className="relative group">
              <button
                className="text-sm font-medium text-orange-600 hover:text-orange-800"
                onClick={() => console.log('Override demurrage:', shipment.id)}
              >
                {t('overrideDemurrage')}
              </button>
            </div>

            <span className="text-gray-400 mx-1">|</span>

            {/* Close Shipment */}
            <div className="relative group">
              <button
                className="text-sm font-medium text-red-600 hover:text-red-800"
                onClick={() => console.log('Close shipment:', shipment.id)}
              >
                {t('closeShipment')}
              </button>
            </div>
          </>
        );

      default:
        return (
          <>
            {/* View */}
            <div className="relative group">
              <Link to={`/view-shipment/${shipment.id}`}>
                <EyeIcon className="w-5 h-5 text-blue-600 group-hover:text-blue-800" />
              </Link>
            </div>

            {/* Edit */}
            <div className="relative group">
              <Link to={`/edit-shipment/${shipment.id}`}>
                <PencilIcon className="w-5 h-5 text-black group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-200" />
              </Link>
            </div>
          </>
        );
    }
  };

  return (
    <>
      <PageMeta
        title={t('shipmentManagement') + ' | CMS Dashboard'}
        description={t('manageShipments')}
      />
      <PageBreadcrumb pageTitle={t('shipmentManagement')} />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="overflow-hidden w-full rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">

          {/* Header with Add Button */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-white/[0.05] gap-3 sm:gap-0">
            <h2 className="font-bold text-lg text-gray-900 dark:text-white">{t('manageShipments')}</h2>
            
            {/* Add Shipment Button */}
          <Link to="/edit-shipment/new">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 whitespace-nowrap min-w-[140px]">
            <span className="text-xl">+</span> {t('addShipments')}
          </button>
        </Link>
          </div>

          {/* Global Search */}
          <div className="px-5 py-3">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder={t('searchShipmentsByIdContainerNoBlDoNoVin')}
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
                <label className="text-xs text-gray-500 mb-1">{t('byVin')}</label>
                <input
                  type="text"
                  placeholder={t('enterVin')}
                  className="px-3 py-2 border bg-gray-200 rounded-lg text-sm dark:bg-white/[0.05] dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={vinFilter}
                  onChange={(e) => setVinFilter(e.target.value)}
                />
              </div>

              {/* Customer Filter */}
              <div className="flex flex-col">
                <label className="text-xs text-gray-500 mb-1">{t('byCustomer')}</label>
                <input
                  type="text"
                  placeholder={t('enterCustomer')}
                  className="px-3 py-2 border bg-gray-200 rounded-lg text-sm dark:bg-white/[0.05] dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={customerFilter}
                  onChange={(e) => setCustomerFilter(e.target.value)}
                />
              </div>

              {/* B/L No Filter */}
              <div className="flex flex-col">
                <label className="text-xs text-gray-500 mb-1">{t('byBlNo')}</label>
                <input
                  type="text"
                  placeholder={t('enterBlNo')}
                  className="px-3 py-2 border bg-gray-200 rounded-lg text-sm dark:bg-white/[0.05] dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={blFilter}
                  onChange={(e) => setBlFilter(e.target.value)}
                />
              </div>

              {/* DO No Filter */}
              <div className="flex flex-col">
                <label className="text-xs text-gray-500 mb-1">{t('byDoNo')}</label>
                <input
                  type="text"
                  placeholder={t('enterDoNo')}
                  className="px-3 py-2 border bg-gray-200 rounded-lg text-sm dark:bg-white/[0.05] dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={doFilter}
                  onChange={(e) => setDoFilter(e.target.value)}
                />
              </div>

              {/* Status Filter */}
              <div className="flex flex-col">
                <label className="text-xs text-gray-500 mb-1">{t('byStatus')}</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border bg-gray-200 rounded-lg text-sm dark:bg-white/[0.05] dark:text-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">{t('allStatus')}</option>
                  <option value="Documents Pending">{t('documentsPending')}</option>
                  <option value="Arrived">{t('arrived')}</option>
                  <option value="In Transit">{t('inTransit')}</option>
                  <option value="Cleared">{t('cleared')}</option>
                  <option value="Delayed">{t('delayed')}</option>
                  <option value="Cancelled">{t('cancelled')}</option>
                </select>
              </div>

              {/* Port Filter */}
              <div className="flex flex-col">
                <label className="text-xs text-gray-500 mb-1">{t('byPort')}</label>
                <select
                  value={portFilter}
                  onChange={(e) => setPortFilter(e.target.value)}
                  className="px-3 py-2 border bg-gray-200 rounded-lg text-sm dark:bg-white/[0.05] dark:text-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">{t('allPorts')}</option>
                  <option value="Jebel Ali">Jebel Ali</option>
                  <option value="Khalifa">Khalifa</option>
                  <option value="Mina Rashid">Mina Rashid</option>
                  <option value="Sharjah">Sharjah</option>
                </select>
              </div>

              {/* ETA Range Filter */}
              <div className="flex flex-col col-span-2">
                <label className="text-xs text-gray-500 mb-1">{t('byEtaRange')}</label>
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
                  
                  <span className="text-gray-500">{t('to')}</span>
                  
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
                  {selectedShipments.length} {t('selected')}
                </span>
                
                <button
                  onClick={handleBulkAssign}
                  className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 flex items-center gap-1"
                >
                  <TruckIcon className="w-4 h-4" />
                  {t('bulkAssign')}
                </button>
                
                <button
                  onClick={handleBulkExport}
                  className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 flex items-center gap-1"
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
                      checked={selectedShipments.length === currentRecords.length && currentRecords.length > 0}
                      onChange={toggleSelectAll}
                    />
                  </TableCell>
                  <TableCell className="px-5 py-3 text-start text-gray-500 font-medium text-xs dark:text-gray-400">{t('shipmentId')}</TableCell>
                  <TableCell className="px-5 py-3 text-start text-gray-500 font-medium text-xs dark:text-gray-400">{t('containerNo')}</TableCell>
                  <TableCell className="px-5 py-3 text-start text-gray-500 font-medium text-xs dark:text-gray-400">{t('blDoNo')}</TableCell>
                  <TableCell className="px-5 py-3 text-start text-gray-500 font-medium text-xs dark:text-gray-400">{t('eta')}</TableCell>
                  <TableCell className="px-5 py-3 text-start text-gray-500 font-medium text-xs dark:text-gray-400">{t('port')}</TableCell>
                  <TableCell className="px-5 py-3 text-start text-gray-500 font-medium text-xs dark:text-gray-400">{t('status')}</TableCell>
                  <TableCell className="px-5 py-3 text-start text-gray-500 font-medium text-xs dark:text-gray-400">{t('vendor')}</TableCell>
                  <TableCell className="px-5 py-3 text-start text-gray-500 font-medium text-xs dark:text-gray-400">{t('lastUpdated')}</TableCell>
                  <TableCell className="px-5 py-3 text-start text-gray-500 font-medium text-xs dark:text-gray-400">{t('action')}</TableCell>
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {currentRecords.map((shipment) => (
                  <TableRow key={shipment.id} className="hover:bg-gray-50 dark:hover:bg-white/5">
                    <TableCell className="px-5 py-4">
                      <input 
                        type="checkbox" 
                        className="accent-blue-600" 
                        checked={selectedShipments.includes(shipment.id)}
                        onChange={() => toggleShipmentSelection(shipment.id)}
                      />
                    </TableCell>
                    <TableCell className="px-5 py-4 font-medium">{shipment.id}</TableCell>
                    <TableCell className="px-5 py-4">
                      {shipment.containerNo.map((container, index) => (
                        <div key={index} className="text-sm">
                          {container}
                          {index < shipment.containerNo.length - 1 && ", "}
                        </div>
                      ))}
                    </TableCell>
                    <TableCell className="px-5 py-4">{shipment.blDoNo}</TableCell>
                    <TableCell className="px-5 py-4">{shipment.eta}</TableCell>
                    <TableCell className="px-5 py-4">{shipment.port}</TableCell>
                    
                    {/* Status Column with Dropdown */}
                    <TableCell className="px-5 py-4">
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
                                <option value="Documents Pending">{t('documentsPending')}</option>
                                <option value="Arrived">{t('arrived')}</option>
                                <option value="In Transit">{t('inTransit')}</option>
                                <option value="Cleared">{t('cleared')}</option>
                                <option value="Delayed">{t('delayed')}</option>
                                <option value="Cancelled">{t('cancelled')}</option>
                              </select>
                              <ChevronDownIcon className="w-3 h-3 text-gray-500" />
                            </div>
                          </div>
                        </div>
                        
                        {/* Arrival Details */}
                        {shipment.status === "Arrived" && shipment.arrivalDate && (
                          <div className="text-xs text-gray-500">
                            <div>{t('arrived')}: {shipment.arrivalDate}</div>
                            {shipment.doDocuments && shipment.doDocuments.length > 0 && (
                              <div className="flex items-center gap-1 mt-1">
                                <DocumentArrowUpIcon className="w-3 h-3" />
                                <span>DO: {shipment.doDocuments.length} {t('files')}</span>
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
                                <span>{t('deliveryNote')}: {shipment.deliveryNote}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    
                    <TableCell className="px-5 py-4">{shipment.vendor}</TableCell>
                    <TableCell className="px-5 py-4">{shipment.lastUpdated}</TableCell>
                    
                    {/* Action Buttons */}
                    <TableCell className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        {renderActionButtons(shipment)}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredShipments.length === 0 && (
              <p className="text-center py-4 text-gray-500">{t('noMatchingRecords')}</p>
            )}
          </div>

          {/* Pagination Controls */}
          {filteredShipments.length > 0 && (
            <div className="px-5 py-4 border-t border-gray-100 dark:border-white/[0.05]">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {t('showing')} {indexOfFirstRecord + 1} {t('to')} {Math.min(indexOfLastRecord, filteredShipments.length)} {t('of')} {filteredShipments.length} {t('entries')}
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
                    {t('previous')}
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
                    {t('next')}
                  </button>
                </div>
              </div>
            </div>
          )}
          {/* Status Change Popup (for Arrived status only) */}
          {showStatusChangePopup && selectedShipment && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
              <div className="bg-white rounded-xl shadow-xl w-[600px] max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                  <h2 className="text-lg font-semibold text-gray-800">
                    {currentStep === 'status-select' && t('markAsArrived') + ' - Step 1/3'}
                    {currentStep === 'arrival-form' && t('arrivalDetails') + ' - Step 2/3'}
                    {currentStep === 'manifest-upload' && t('generateTxt') + ' - Step 3/3'}
                    {currentStep === 'delivery-note' && t('uploadDeliveryNote') + ' - Complete'}
                  </h2>
                  <button
                    onClick={cancelStatusChange}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>

                {/* Progress Steps */}
                <div className="px-6 py-4 border-b">
                  <div className="flex items-center justify-between">
                    {['status-select', 'arrival-form', 'manifest-upload', 'delivery-note'].map((step, index) => (
                      <div key={step} className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          currentStep === step ? 'bg-blue-600 text-white' :
                          ['arrival-form', 'manifest-upload', 'delivery-note'].indexOf(currentStep) >= index ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-400'
                        }`}>
                          {index + 1}
                        </div>
                        {index < 3 && (
                          <div className={`w-16 h-1 mx-2 ${
                            ['arrival-form', 'manifest-upload', 'delivery-note'].indexOf(currentStep) > index ? 'bg-green-500' : 'bg-gray-200'
                          }`} />
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>{t('confirm')}</span>
                    <span>{t('arrivalDetails')}</span>
                    <span>{t('generateTxt')}</span>
                    <span>{t('deliveryNote')}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {currentStep === 'status-select' && (
                    <div className="space-y-4">
                      <div className="bg-green-50 p-4 rounded-lg">
                        <p className="text-sm text-green-800">
                          {t('changingStatusToArrived')} <b>{t('arrived')}</b> {t('forShipment')} <b>{selectedShipment.id}</b>
                        </p>
                        <p className="text-sm text-green-700 mt-2">
                          {t('currentStatus')} <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedShipment.status)}`}>
                            {selectedShipment.status === 'Documents Pending' ? t('documentsPending') :
                             selectedShipment.status === 'Arrived' ? t('arrived') :
                             selectedShipment.status === 'In Transit' ? t('inTransit') :
                             selectedShipment.status === 'Cleared' ? t('cleared') :
                             selectedShipment.status === 'Delayed' ? t('delayed') :
                             selectedShipment.status === 'Cancelled' ? t('cancelled') : selectedShipment.status}
                          </span>
                        </p>
                      </div>

                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h3 className="text-sm font-medium text-blue-800 mb-2">{t('importantNotice')}</h3>
                        <p className="text-sm text-blue-700">
                          {t('whenChangingStatusToArrived')}
                        </p>
                        <ul className="text-sm text-blue-700 mt-2 list-disc pl-5 space-y-1">
                          <li>{t('provideDateOfArrival')}</li>
                          <li>{t('uploadDoDocuments')}</li>
                          <li>{t('generateTxtFileFromManifest')}</li>
                          <li>{t('optionallyUploadDeliveryNote')}</li>
                        </ul>
                      </div>
                    </div>
                  )}

                  {currentStep === 'arrival-form' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('dateOfArrival')} <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          value={arrivalDate}
                          onChange={(e) => setArrivalDate(e.target.value)}
                          className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('uploadDoDocuments')} <span className="text-red-500">*</span>
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                          <input
                            type="file"
                            multiple
                            accept=".pdf,.doc,.docx,.jpg,.png"
                            onChange={handleDoUpload}
                            className="w-full"
                          />
                          <p className="text-xs text-gray-500 mt-2">
                            {t('uploadBillOfLadingAndOtherDoDocuments')}
                          </p>
                        </div>
                        {doUploads.length > 0 && renderUploadedFiles(doUploads)}
                      </div>

                      {/* Manifest Preview */}
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-sm font-medium text-gray-700 mb-2">{t('manifestInformation')}</h3>
                        <div className="text-sm space-y-1">
                          <div className="flex justify-between">
                            <span className="text-gray-600">{t('shipment')}</span>
                            <span className="font-medium">{selectedShipment.id}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">{t('containers')}</span>
                            <span className="font-medium">{selectedShipment.containerNo.join(', ')}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {currentStep === 'manifest-upload' && (
                    <div className="space-y-4">
                      {/* Notification Popup Trigger */}
                      {!manifestFile && !billOfLadingFile && (
                        <div 
                          className="bg-blue-50 border border-blue-200 rounded-lg p-4 cursor-pointer hover:bg-blue-100 transition-colors"
                          onClick={() => setShowNotificationPopup(true)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <BellIcon className="w-5 h-5 text-blue-600 mr-2" />
                              <div>
                                <p className="text-sm text-blue-800 font-medium">
                                  {t('attention')}
                                </p>
                                <p className="text-sm text-blue-700">
                                  "{t('pleaseGenerateTxtFileByChoosingManifest')}"
                                </p>
                              </div>
                            </div>
                            <button
                              className="text-blue-600 hover:text-blue-800 font-medium"
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowNotificationPopup(true);
                              }}
                            >
                              {t('linkToGenerateTxtFile')}
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Manifest Details */}
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Manifest Details</h3>
                        <div className="text-sm space-y-1">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Shipment #:</span>
                            <span className="font-medium">{selectedShipment.id}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Container(s):</span>
                            <span className="font-medium">{selectedShipment.containerNo.join(', ')}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Arrival Date:</span>
                            <span className="font-medium">{arrivalDate}</span>
                          </div>
                        </div>
                      </div>

                      {/* Manifest Upload */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('uploadManifestFile')} <span className="text-red-500">*</span>
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                          <input
                            type="file"
                            accept=".txt"
                            onChange={handleManifestUpload}
                            className="w-full"
                          />
                          <p className="text-xs text-gray-500 mt-2">
                            {t('uploadManifestTxtFile')}
                          </p>
                        </div>
                        {manifestFile && (
                          <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded">
                            <span className="text-sm text-green-700">{t('selected')} {manifestFile.name}</span>
                          </div>
                        )}
                      </div>

                      {/* Bill of Lading Upload */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('uploadBillOfLading')} <span className="text-red-500">*</span>
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={handleBillOfLadingUpload}
                            className="w-full"
                          />
                          <p className="text-xs text-gray-500 mt-2">
                            {t('uploadBillOfLadingDocument')}
                          </p>
                        </div>
                        {billOfLadingFile && (
                          <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded">
                            <span className="text-sm text-green-700">{t('selected')} {billOfLadingFile.name}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {currentStep === 'delivery-note' && (
                    <div className="space-y-4">
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 text-green-800">
                          <CheckCircleIcon className="w-5 h-5" />
                          <span className="font-medium">{t('txtFileGeneratedSuccessfully')}</span>
                        </div>
                        <p className="text-sm text-green-700 mt-2">
                          {t('shipment')} <b>{selectedShipment.id}</b> {t('hasBeenMarkedAsArrived')}
                        </p>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-700">
                          {t('processAfterShipmentBeforeClearance')}
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('uploadDeliveryNoteOptional')}
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx,.jpg,.png"
                            onChange={handleDeliveryNoteUpload}
                            className="w-full"
                          />
                          <p className="text-xs text-gray-500 mt-2">
                            {t('uploadDeliveryNoteDocument')}
                          </p>
                        </div>
                        {deliveryNoteFile && (
                          <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded">
                            <span className="text-sm text-green-700">{t('selected')} {deliveryNoteFile.name}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Buttons */}
                <div className="flex justify-between p-6 border-t">
                  <div>
                    {currentStep !== 'status-select' && (
                      <button
                        onClick={() => {
                          if (currentStep === 'delivery-note') {
                            setCurrentStep('manifest-upload');
                          } else if (currentStep === 'manifest-upload') {
                            setCurrentStep('arrival-form');
                          } else if (currentStep === 'arrival-form') {
                            setCurrentStep('status-select');
                          }
                        }}
                        className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-black rounded-md text-sm"
                      >
                        {t('back')}
                      </button>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={cancelStatusChange}
                      className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-black rounded-md text-sm"
                    >
                      {t('cancel')}
                    </button>
                    
                    {currentStep === 'status-select' && (
                      <button
                        onClick={handleStatusSelection}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm"
                      >
                        {t('continue')}
                      </button>
                    )}
                    
                    {currentStep === 'arrival-form' && (
                      <button
                        onClick={submitArrivalForm}
                        disabled={!arrivalDate}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {t('continueToGenerateTxt')}
                      </button>
                    )}
                    
                    {currentStep === 'manifest-upload' && (
                      <button
                        onClick={generateTxtFile}
                        disabled={!manifestFile || !billOfLadingFile}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {t('generateTxtFile')}
                      </button>
                    )}
                    
                    {currentStep === 'delivery-note' && (
                      <button
                        onClick={submitDeliveryNote}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm"
                      >
                        {t('completeProcess')}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notification Popup */}
          {showNotificationPopup && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
              <div className="bg-white rounded-xl shadow-xl w-[500px]">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                  <div className="flex items-center">
                    <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600 mr-3" />
                    <h2 className="text-lg font-semibold text-gray-800">
                      {t('attention')}
                    </h2>
                  </div>
                  <button
                    onClick={() => setShowNotificationPopup(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                    <p className="text-sm text-yellow-800">
                      "{t('pleaseGenerateTxtFileByChoosingManifest')}"
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">{t('requiredFiles')}</h3>
                      <ul className="text-sm text-gray-600 space-y-2">
                        <li className="flex items-center">
                          <DocumentIcon className="w-4 h-4 mr-2 text-blue-500" />
                          <span>{t('manifestTxtFileContainsShipmentDetails')}</span>
                        </li>
                        <li className="flex items-center">
                          <DocumentArrowUpIcon className="w-4 h-4 mr-2 text-green-500" />
                          <span>{t('billOfLadingDocument')}</span>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-blue-800 mb-2">{t('quickSteps')}</h3>
                      <ol className="text-sm text-blue-700 space-y-1">
                        <li>{t('clickOnUploadManifestFileField')}</li>
                        <li>{t('clickOnUploadBillOfLadingField')}</li>
                        <li>{t('bothFilesWillAppearAsSelected')}</li>
                        <li>{t('clickGenerateTxtFileButton')}</li>
                      </ol>
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex justify-end p-6 border-t">
                  <button
                    onClick={() => {
                      setShowNotificationPopup(false);
                      // Focus on the manifest upload input when returning
                      setTimeout(() => {
                        const manifestInput = document.querySelector('input[type="file"][accept=".txt"]');
                        if (manifestInput) (manifestInput as HTMLElement).focus();
                      }, 100);
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm"
                  >
                    {t('gotItTakeMeToUpload')}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Assign Shipment Popup */}
          {showAssignPopup && selectedShipment && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
              <div className="bg-white p-6 rounded-xl shadow-xl w-96">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">{t('assignVendor')}</h2>
                  <button
                    onClick={() => setShowAssignPopup(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  {t('assignVendor')} {t('to')} {t('shipment')} <b>{selectedShipment.id}</b>
                </p>
                
                <div className="space-y-3">
                  <select className="w-full px-3 py-2 border rounded-lg text-sm">
                    <option value="">{t('selectVendor')}</option>
                    <option value="SpeedTrans LLC">SpeedTrans LLC</option>
                    <option value="Desert Logistics">Desert Logistics</option>
                    <option value="Gulf Shipping Co">Gulf Shipping Co</option>
                  </select>
                  
                  <input
                    type="text"
                    placeholder={t('cost') + ' (AED)'}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />

                  <textarea
                    placeholder={t('notes')}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                    rows={3}
                  />
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-black rounded-md"
                    onClick={() => setShowAssignPopup(false)}
                  >
                    {t('cancel')}
                  </button>
                  <button
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
                    onClick={() => {
                      console.log('Assigning shipment:', selectedShipment.id);
                      setShowAssignPopup(false);
                    }}
                  >
                    {t('assignVendor')}
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































// import { useState, useRef, useEffect } from "react";
// // @ts-ignore - JSON import is handled by TypeScript config
// import shipmentData from '../../../../data/admins.json';
// import { 
//   EyeIcon, 
//   PencilIcon, 
//   DocumentIcon, 
//   CurrencyDollarIcon, 
//   TruckIcon, 
//   ArrowDownTrayIcon,
//   ExclamationTriangleIcon,
//   CheckCircleIcon,
//   CalendarIcon,
//   DocumentArrowUpIcon,
//   ChevronDownIcon,
//   XMarkIcon,
//   BellIcon,
//   BuildingOfficeIcon,
//   UserGroupIcon,
//   ClipboardDocumentCheckIcon,
//   LockClosedIcon
// } from '@heroicons/react/24/outline';
// import { Link } from "react-router-dom";
// import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../../components/ui/table";
// import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
// import PageMeta from "../../Dashboard/PageMeta";

// interface Shipment {
//   id: string;
//   containerNo: string[];
//   blDoNo: string;
//   vin: string;
//   eta: string;
//   port: string;
//   status: "Documents Pending" | "Arrived" | "In Transit" | "Cleared" | "Delayed" | "Cancelled";
//   vendor: string;
//   lastUpdated: string;
//   customer?: string;
//   cars?: number;
//   arrivalDate?: string;
//   doDocuments?: string[];
//   manifestTxtFile?: string;
//   deliveryNote?: string;
// }

// // Helper function to validate and convert status
// const getValidStatus = (status: string): Shipment['status'] => {
//   const validStatuses: Shipment['status'][] = [
//     "Documents Pending", 
//     "Arrived", 
//     "In Transit", 
//     "Cleared", 
//     "Delayed", 
//     "Cancelled"
//   ];
  
//   if (validStatuses.includes(status as Shipment['status'])) {
//     return status as Shipment['status'];
//   }
  
//   return "Documents Pending";
// };

// // Function to get and map shipment data from JSON
// const getShipmentsData = (): Shipment[] => {
//   if (!shipmentData || !Array.isArray(shipmentData.shipments)) return [];
  
//   return shipmentData.shipments.map((shipment: any) => {
//     const validStatus = getValidStatus(shipment.status || 'Documents Pending');
    
//     const containerNumbers = shipment.containerId 
//       ? shipment.containerId.split(',').map((c: string) => c.trim())
//       : [shipment.containerId || 'N/A'];
    
//     return {
//       id: shipment.id || '',
//       containerNo: containerNumbers,
//       blDoNo: shipment.trackingNumber || '',
//       vin: shipment.vin || '', // Default to empty string if not in data
//       eta: shipment.deliveryDate || 'N/A',
//       port: shipment.destination || 'N/A',
//       status: validStatus,
//       vendor: shipment.origin || '—',
//       lastUpdated: shipment.shipmentDate || 'N/A',
//       customer: shipment.customer || 'N/A',
//       cars: shipment.weight ? parseInt(shipment.weight) || 0 : 0,
//       arrivalDate: '',
//       doDocuments: [],
//       manifestTxtFile: '',
//       deliveryNote: ''
//     };
//   });
// };

// export default function Shipment() {
//   const [shipments, setShipments] = useState<Shipment[]>([]);
//   const [globalSearch, setGlobalSearch] = useState("");
//   const [vinFilter, setVinFilter] = useState("");
//   const [customerFilter, setCustomerFilter] = useState("");
//   const [blFilter, setBlFilter] = useState("");
//   const [doFilter, setDoFilter] = useState("");
//   const [statusFilter, setStatusFilter] = useState("");
//   const [portFilter, setPortFilter] = useState("");
//   const [etaStartFilter, setEtaStartFilter] = useState("");
//   const [etaEndFilter, setEtaEndFilter] = useState("");
//   const [selectedShipments, setSelectedShipments] = useState<string[]>([]);
  
//   // Pagination state
//   const [currentPage, setCurrentPage] = useState(1);
//   const [recordsPerPage, setRecordsPerPage] = useState(10);
  
//   // Popup states
//   const [showAssignPopup, setShowAssignPopup] = useState(false);
//   const [showStatusChangePopup, setShowStatusChangePopup] = useState(false);
//   const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
//   const [newStatus, setNewStatus] = useState<Shipment['status']>("Documents Pending");
  
//   // Notification Popup State
//   const [showNotificationPopup, setShowNotificationPopup] = useState(false);
  
//   // Form states
//   const [arrivalDate, setArrivalDate] = useState("");
//   const [doUploads, setDoUploads] = useState<File[]>([]);
//   const [manifestFile, setManifestFile] = useState<File | null>(null);
//   const [billOfLadingFile, setBillOfLadingFile] = useState<File | null>(null);
//   const [deliveryNoteFile, setDeliveryNoteFile] = useState<File | null>(null);
//   const [currentStep, setCurrentStep] = useState<'status-select' | 'arrival-form' | 'manifest-upload' | 'delivery-note'>('status-select');

//   // Load shipment data on component mount
//   useEffect(() => {
//     const data = getShipmentsData();
//     setShipments(data);
//   }, []);

//   // Refs for date inputs
//   const etaStartRef = useRef<HTMLInputElement | null>(null);
//   const etaEndRef = useRef<HTMLInputElement | null>(null);

//   // Handle calendar icon click
//   const handleCalendarClick = (ref: React.RefObject<HTMLInputElement | null>): void => {
//     if (ref.current) {
//       ref.current.showPicker();
//     }
//   };

//   // Handle filtering with global search
//   const filteredShipments = shipments.filter((shipment) => {
//     // Global search across multiple fields
//     const matchesGlobalSearch = globalSearch 
//       ? shipment.id.toLowerCase().includes(globalSearch.toLowerCase()) ||
//         shipment.blDoNo.toLowerCase().includes(globalSearch.toLowerCase()) ||
//         shipment.vin.toLowerCase().includes(globalSearch.toLowerCase()) ||
//         shipment.containerNo.some(container => container.toLowerCase().includes(globalSearch.toLowerCase())) ||
//         (shipment.customer || '').toLowerCase().includes(globalSearch.toLowerCase()) ||
//         shipment.port.toLowerCase().includes(globalSearch.toLowerCase())
//       : true;
    
//     const matchesVIN = vinFilter ? shipment.vin.toLowerCase().includes(vinFilter.toLowerCase()) : true;
//     const matchesCustomer = customerFilter ? (shipment.customer || '').toLowerCase().includes(customerFilter.toLowerCase()) : true;
//     const matchesBL = blFilter ? shipment.blDoNo.toLowerCase().includes(blFilter.toLowerCase()) : true;
//     const matchesDO = doFilter ? shipment.blDoNo.toLowerCase().includes(doFilter.toLowerCase()) : true;
//     const matchesStatus = statusFilter ? shipment.status === statusFilter : true;
//     const matchesPort = portFilter ? shipment.port === portFilter : true;
    
//     // ETA Range filter
//     let matchesEta = true;
//     if (etaStartFilter || etaEndFilter) {
//       const shipmentDate = new Date(shipment.eta);
//       const startDate = etaStartFilter ? new Date(etaStartFilter) : null;
//       const endDate = etaEndFilter ? new Date(etaEndFilter) : null;
      
//       if (startDate && shipmentDate < startDate) matchesEta = false;
//       if (endDate && shipmentDate > endDate) matchesEta = false;
//     }

//     return matchesGlobalSearch && matchesVIN && matchesCustomer && matchesBL && matchesDO && matchesStatus && matchesPort && matchesEta;
//   });

//   // Pagination logic
//   const indexOfLastRecord = currentPage * recordsPerPage;
//   const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
//   const currentRecords = filteredShipments.slice(indexOfFirstRecord, indexOfLastRecord);
//   const totalPages = Math.ceil(filteredShipments.length / recordsPerPage);

//   // Reset to page 1 when filters change
//   useEffect(() => {
//     setCurrentPage(1);
//   }, [globalSearch, vinFilter, customerFilter, blFilter, doFilter, statusFilter, portFilter, etaStartFilter, etaEndFilter]);

//   // Handle selection
//   const toggleShipmentSelection = (shipmentId: string): void => {
//     setSelectedShipments(prev =>
//       prev.includes(shipmentId)
//         ? prev.filter(id => id !== shipmentId)
//         : [...prev, shipmentId]
//     );
//   };

//   const toggleSelectAll = (): void => {
//     setSelectedShipments(
//       selectedShipments.length === currentRecords.length
//         ? []
//         : currentRecords.map(shipment => shipment.id)
//     );
//   };

//   // Status badge colors
//   const getStatusColor = (status: string): string => {
//     switch (status) {
//       case "Documents Pending":
//         return "bg-yellow-100 text-yellow-800 border border-yellow-200";
//       case "Arrived":
//         return "bg-green-100 text-green-800 border border-green-200";
//       case "In Transit":
//         return "bg-blue-100 text-blue-800 border border-blue-200";
//       case "Cleared":
//         return "bg-emerald-100 text-emerald-800 border border-emerald-200";
//       case "Delayed":
//         return "bg-orange-100 text-orange-800 border border-orange-200";
//       case "Cancelled":
//         return "bg-red-100 text-red-800 border border-red-200";
//       default:
//         return "bg-gray-100 text-gray-800 border border-gray-200";
//     }
//   };

//   // Handle file uploads
//   const handleDoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) {
//       const files = Array.from(e.target.files);
//       setDoUploads(prev => [...prev, ...files]);
//     }
//   };

//   const handleManifestUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files?.[0]) {
//       setManifestFile(e.target.files[0]);
//     }
//   };

//   const handleBillOfLadingUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files?.[0]) {
//       setBillOfLadingFile(e.target.files[0]);
//     }
//   };

//   const handleDeliveryNoteUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files?.[0]) {
//       setDeliveryNoteFile(e.target.files[0]);
//     }
//   };

//   // Handle status change from table dropdown
//   const handleStatusChangeInTable = (shipment: Shipment, newStatus: Shipment['status']) => {
//     setSelectedShipment(shipment);
//     setNewStatus(newStatus);
    
//     if (newStatus === "Arrived") {
//       // Open popup for Arrived status with full flow
//       setCurrentStep('status-select');
//       setShowStatusChangePopup(true);
//     } else {
//       // Direct status change for other statuses
//       setShipments(prev => prev.map(s => 
//         s.id === shipment.id ? { ...s, status: newStatus } : s
//       ));
//     }
//   };

//   // Handle status change from popup
//   const handleStatusSelection = () => {
//     if (!selectedShipment) return;

//     if (newStatus === "Arrived") {
//       // If changing to Arrived, show arrival form
//       setCurrentStep('arrival-form');
//       setArrivalDate("");
//       setDoUploads([]);
//     } else {
//       // For other statuses, update directly
//       setShipments(prev => prev.map(s => 
//         s.id === selectedShipment.id ? { ...s, status: newStatus } : s
//       ));
//       setShowStatusChangePopup(false);
//       setNewStatus("Documents Pending");
//     }
//   };

//   // Submit Arrival Form
//   const submitArrivalForm = () => {
//     if (!selectedShipment || !arrivalDate) {
//       alert("Please select arrival date");
//       return;
//     }

//     // Update shipment with arrival date and DO uploads
//     setShipments(prev => prev.map(s => {
//       if (s.id === selectedShipment.id) {
//         return {
//           ...s,
//           arrivalDate: arrivalDate,
//           doDocuments: doUploads.map(f => f.name)
//         };
//       }
//       return s;
//     }));

//     // Move to manifest upload step
//     setCurrentStep('manifest-upload');
//   };

//   // Generate TXT File
//   const generateTxtFile = () => {
//     if (!selectedShipment || !manifestFile || !billOfLadingFile) {
//       // Show notification popup if files are missing
//       setShowNotificationPopup(true);
//       return;
//     }

//     // Generate TXT file content
//     const txtContent = `
// MANIFEST DETAILS
// ================
// Shipment #: ${selectedShipment.id}
// Container(s): ${selectedShipment.containerNo.join(', ')}

// BILL OF LADING INFORMATION
// ==========================
// Document: ${billOfLadingFile.name}
// Upload Date: ${new Date().toLocaleDateString()}

// ARRIVAL DETAILS
// ===============
// Arrival Date: ${arrivalDate}
// Port: ${selectedShipment.port}
// Vendor: ${selectedShipment.vendor}

// Generated on: ${new Date().toISOString()}
//     `.trim();

//     // Create and download TXT file
//     const blob = new Blob([txtContent], { type: 'text/plain' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `Manifest_${selectedShipment.id}_${Date.now()}.txt`;
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//     URL.revokeObjectURL(url);

//     // Update shipment with TXT file info
//     setShipments(prev => prev.map(s => {
//       if (s.id === selectedShipment.id) {
//         return {
//           ...s,
//           status: "Arrived" as const,
//           manifestTxtFile: `Manifest_${selectedShipment.id}_${Date.now()}.txt`
//         };
//       }
//       return s;
//     }));

//     // Move to delivery note step
//     setCurrentStep('delivery-note');
//   };

//   // Submit Delivery Note
//   const submitDeliveryNote = () => {
//     if (!selectedShipment) return;

//     // Update shipment with delivery note
//     setShipments(prev => prev.map(s => {
//       if (s.id === selectedShipment.id) {
//         return {
//           ...s,
//           deliveryNote: deliveryNoteFile?.name || 'Not provided'
//         };
//       }
//       return s;
//     }));

//     // Close all popups
//     setShowStatusChangePopup(false);
//     setCurrentStep('status-select');
//     setArrivalDate("");
//     setDoUploads([]);
//     setManifestFile(null);
//     setBillOfLadingFile(null);
//     setDeliveryNoteFile(null);

//     alert("Shipment status updated to Arrived successfully!");
//   };

//   // Cancel status change
//   const cancelStatusChange = () => {
//     setShowStatusChangePopup(false);
//     setCurrentStep('status-select');
//     setNewStatus("Documents Pending");
//     setArrivalDate("");
//     setDoUploads([]);
//     setManifestFile(null);
//     setBillOfLadingFile(null);
//     setDeliveryNoteFile(null);
//   };

//   // Bulk actions
//   const handleBulkAssign = (): void => {
//     console.log('Assigning selected shipments:', selectedShipments);
//     // Implement bulk assign logic
//   };

//   const handleBulkExport = (): void => {
//     console.log('Exporting selected shipments:', selectedShipments);
//     // Implement bulk export logic
//   };

//   // Function to render uploaded files list
//   const renderUploadedFiles = (files: File[]) => {
//     return (
//       <div className="mt-2 max-h-40 overflow-y-auto">
//         {files.map((file, index) => (
//           <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded mb-1">
//             <span className="text-sm text-gray-600 truncate">{file.name}</span>
//             <button
//               type="button"
//               onClick={() => setDoUploads(files.filter((_, i) => i !== index))}
//               className="text-red-500 hover:text-red-700"
//             >
//               <XMarkIcon className="w-4 h-4" />
//             </button>
//           </div>
//         ))}
//       </div>
//     );
//   };

//   // Render action icons with colorful icons
//   const renderActionIcons = (shipment: Shipment) => {
//     const actionButtons = [
//       // First Row - 6 Icons
//       { 
//         icon: EyeIcon, 
//         color: "text-blue-600 hover:text-blue-800", 
//         label: "View", 
//         onClick: () => window.location.href = `/view-shipment/${shipment.id}`,
//       },
//       { 
//         icon: PencilIcon, 
//         color: "text-gray-700 hover:text-gray-900", 
//         label: "Edit", 
//         onClick: () => window.location.href = `/edit-shipment/${shipment.id}`,
//       },
//       { 
//         icon: DocumentIcon, 
//         color: "text-purple-600 hover:text-purple-800", 
//         label: "Docs", 
//         onClick: () => window.location.href = "/documents",
//       },
//       { 
//         icon: TruckIcon, 
//         color: "text-green-600 hover:text-green-800", 
//         label: "Assign", 
//         onClick: () => {
//           setSelectedShipment(shipment);
//           setShowAssignPopup(true);
//         },
//       },
//       { 
//         icon: CurrencyDollarIcon, 
//         color: "text-yellow-600 hover:text-yellow-800", 
//         label: "Pay", 
//         onClick: () => window.location.href = `/payment/${shipment.id}`,
//       },
//       { 
//         icon: UserGroupIcon, 
//         color: "text-indigo-600 hover:text-indigo-800", 
//         label: "Update Cars", 
//         onClick: () => console.log('Update cars for shipment:', shipment.id),
//       },
//       // Second Row - 6 Icons
//       { 
//         icon: EyeIcon, 
//         color: "text-blue-500 hover:text-blue-700", 
//         label: "View Details", 
//         onClick: () => window.location.href = `/view-shipment/${shipment.id}`,
//       },
//       { 
//         icon: PencilIcon, 
//         color: "text-gray-600 hover:text-gray-800", 
//         label: "Edit", 
//         onClick: () => window.location.href = `/edit-shipment/${shipment.id}`,
//       },
//       { 
//         icon: BuildingOfficeIcon, 
//         color: "text-teal-600 hover:text-teal-800", 
//         label: "Assign Clearance", 
//         onClick: () => console.log('Assign clearance agent:', shipment.id),
//       },
//       { 
//         icon: TruckIcon, 
//         color: "text-emerald-600 hover:text-emerald-800", 
//         label: "Assign Transport", 
//         onClick: () => {
//           setSelectedShipment(shipment);
//           setShowAssignPopup(true);
//         },
//       },
//       { 
//         icon: ClipboardDocumentCheckIcon, 
//         color: "text-orange-600 hover:text-orange-800", 
//         label: "Override Demurrage", 
//         onClick: () => console.log('Override demurrage:', shipment.id),
//       },
//       { 
//         icon: LockClosedIcon, 
//         color: "text-red-600 hover:text-red-800", 
//         label: "Close Shipment", 
//         onClick: () => console.log('Close shipment:', shipment.id),
//       },
//     ];

//     return (
//       <div className="flex flex-col gap-2">
//         {/* First Row */}
//         <div className="flex items-center gap-2">
//           {actionButtons.slice(0, 6).map((action, index) => (
//             <div key={index} className="relative group">
//               <button
//                 onClick={action.onClick}
//                 className={`p-2 rounded-lg ${action.color} transition-all duration-200 hover:scale-105`}
//               >
//                 <action.icon className="w-4 h-4" />
//               </button>
//               <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs mb-2 text-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
//                 {action.label}
//               </span>
//             </div>
//           ))}
//         </div>
        
//         {/* Second Row */}
//         <div className="flex items-center gap-2">
//           {actionButtons.slice(6, 12).map((action, index) => (
//             <div key={index + 6} className="relative group">
//               <button
//                 onClick={action.onClick}
//                 className={`p-2 rounded-lg ${action.color} transition-all duration-200 hover:scale-105`}
//               >
//                 <action.icon className="w-4 h-4" />
//               </button>
//               <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs  text-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
//                 {action.label}
//               </span> 
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   };

//   return (
//     <>
//       <PageMeta
//         title="Shipment Management | CMS Dashboard"
//         description="Manage shipments and containers"
//       />
//       <PageBreadcrumb pageTitle="Shipment Management" />
//       <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
//         <div className="w-full rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">

//           {/* Header with Add Button */}
//           <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-white/[0.05] gap-3 sm:gap-0">
//             <h2 className="font-bold text-lg text-gray-900 dark:text-white">Manage Shipments</h2>
            
//             {/* Add Shipment Button */}
//             <Link to="/edit-shipment/new">
//               <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors">
//                 <span className="text-xl">+</span> Add Shipments
//               </button>
//             </Link>
//           </div>

//           {/* Global Search */}
//           <div className="px-5 py-3">
//             <div className="flex flex-col">
//               <div className="flex items-center gap-2">
//                 <input
//                   type="text"
//                   placeholder="Search Shipments by ID, Container No., BL/DO No., VIN, etc."
//                   className="flex-1 px-3 py-2 border bg-white rounded-lg text-sm dark:bg-white/[0.05] dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   value={globalSearch}
//                   onChange={(e) => setGlobalSearch(e.target.value)}
//                 />
//                 {globalSearch && (
//                   <button
//                     onClick={() => setGlobalSearch("")}
//                     className="px-3 py-2 text-gray-500 hover:text-gray-700 transition-colors"
//                   >
//                     <XMarkIcon className="w-4 h-4" />
//                   </button>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Filters */}
//           <div className="px-5 py-3 space-y-3 border-t border-gray-100 dark:border-white/[0.05]">
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//               {/* VIN Filter */}
//               <div className="flex flex-col">
//                 <label className="text-xs text-gray-500 mb-1">By VIN</label>
//                 <input
//                   type="text"
//                   placeholder="Enter VIN"
//                   className="px-3 py-2 border bg-white rounded-lg text-sm dark:bg-white/[0.05] dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   value={vinFilter}
//                   onChange={(e) => setVinFilter(e.target.value)}
//                 />
//               </div>

//               {/* Customer Filter */}
//               <div className="flex flex-col">
//                 <label className="text-xs text-gray-500 mb-1">By Customer</label>
//                 <input
//                   type="text"
//                   placeholder="Enter Customer"
//                   className="px-3 py-2 border bg-white rounded-lg text-sm dark:bg-white/[0.05] dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   value={customerFilter}
//                   onChange={(e) => setCustomerFilter(e.target.value)}
//                 />
//               </div>

//               {/* B/L No Filter */}
//               <div className="flex flex-col">
//                 <label className="text-xs text-gray-500 mb-1">By B/L No.</label>
//                 <input
//                   type="text"
//                   placeholder="Enter B/L No."
//                   className="px-3 py-2 border bg-white rounded-lg text-sm dark:bg-white/[0.05] dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   value={blFilter}
//                   onChange={(e) => setBlFilter(e.target.value)}
//                 />
//               </div>

//               {/* DO No Filter */}
//               <div className="flex flex-col">
//                 <label className="text-xs text-gray-500 mb-1">By DO No.</label>
//                 <input
//                   type="text"
//                   placeholder="Enter DO No."
//                   className="px-3 py-2 border bg-white rounded-lg text-sm dark:bg-white/[0.05] dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   value={doFilter}
//                   onChange={(e) => setDoFilter(e.target.value)}
//                 />
//               </div>

//               {/* Status Filter */}
//               <div className="flex flex-col">
//                 <label className="text-xs text-gray-500 mb-1">By Status</label>
//                 <select
//                   value={statusFilter}
//                   onChange={(e) => setStatusFilter(e.target.value)}
//                   className="px-3 py-2 border bg-white rounded-lg text-sm dark:bg-white/[0.05] dark:text-white focus:ring-2 focus:ring-blue-500"
//                 >
//                   <option value="">All Status</option>
//                   <option value="Documents Pending">Documents Pending</option>
//                   <option value="Arrived">Arrived</option>
//                   <option value="In Transit">In Transit</option>
//                   <option value="Cleared">Cleared</option>
//                   <option value="Delayed">Delayed</option>
//                   <option value="Cancelled">Cancelled</option>
//                 </select>
//               </div>

//               {/* Port Filter */}
//               <div className="flex flex-col">
//                 <label className="text-xs text-gray-500 mb-1">By Port</label>
//                 <select
//                   value={portFilter}
//                   onChange={(e) => setPortFilter(e.target.value)}
//                   className="px-3 py-2 border bg-white rounded-lg text-sm dark:bg-white/[0.05] dark:text-white focus:ring-2 focus:ring-blue-500"
//                 >
//                   <option value="">All Ports</option>
//                   <option value="Jebel Ali">Jebel Ali</option>
//                   <option value="Khalifa">Khalifa</option>
//                   <option value="Mina Rashid">Mina Rashid</option>
//                   <option value="Sharjah">Sharjah</option>
//                 </select>
//               </div>

//               {/* ETA Range Filter */}
//               <div className="flex flex-col col-span-2">
//                 <label className="text-xs text-gray-500 mb-1">By ETA Range</label>
//                 <div className="flex items-center gap-2">
//                   <div className="relative flex-1">
//                     <input
//                       type="date"
//                       ref={etaStartRef}
//                       className="w-full px-3 py-2 pl-10 pr-3 border bg-white rounded-lg text-sm dark:bg-white/[0.05] dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       value={etaStartFilter}
//                       onChange={(e) => setEtaStartFilter(e.target.value)}
//                     />
//                     <div
//                       className="absolute left-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
//                       onClick={() => handleCalendarClick(etaStartRef)}
//                     >
//                       <CalendarIcon className="h-5 w-5 text-gray-500" />
//                     </div>
//                   </div>
                  
//                   <span className="text-gray-500">to</span>
                  
//                   <div className="relative flex-1">
//                     <input
//                       type="date"
//                       ref={etaEndRef}
//                       className="w-full px-3 py-2 pl-10 pr-3 border bg-white rounded-lg text-sm dark:bg-white/[0.05] dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       value={etaEndFilter}
//                       onChange={(e) => setEtaEndFilter(e.target.value)}
//                     />
//                     <div
//                       className="absolute left-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
//                       onClick={() => handleCalendarClick(etaEndRef)}
//                     >
//                       <CalendarIcon className="h-5 w-5 text-gray-500" />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Bulk Actions */}
//             {selectedShipments.length > 0 && (
//               <div className="flex flex-wrap gap-2 items-center pt-2 border-t border-gray-100">
//                 <span className="text-sm text-gray-600 dark:text-gray-400">
//                   {selectedShipments.length} selected
//                 </span>
                
//                 <button
//                   onClick={handleBulkAssign}
//                   className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 flex items-center gap-1 transition-colors"
//                 >
//                   <TruckIcon className="w-4 h-4" />
//                   Assign
//                 </button>
                
//                 <button
//                   onClick={handleBulkExport}
//                   className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 flex items-center gap-1 transition-colors"
//                 >
//                   <ArrowDownTrayIcon className="w-4 h-4" />
//                   Export CSV
//                 </button>
//               </div>
//             )}
//           </div>

//           {/* Table Container with Horizontal Scroll ONLY */}
//           <div className="overflow-x-auto">
//             <div className="min-w-[1500px] ">
//               <Table className="w-full h-[1300px]">
//                 <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
//                   <TableRow>
//                     <TableCell className="px-5 py-3 text-start text-gray-500 font-medium text-xs dark:text-gray-400">
//                       <input 
//                         type="checkbox" 
//                         className="accent-blue-600" 
//                         checked={selectedShipments.length === currentRecords.length && currentRecords.length > 0}
//                         onChange={toggleSelectAll}
//                       />
//                     </TableCell>
//                     <TableCell className="px-5 py-3 text-start text-gray-500 font-medium text-xs dark:text-gray-400">Shipment ID</TableCell>
//                     <TableCell className="px-5 py-3 text-start text-gray-500 font-medium text-xs dark:text-gray-400">Container No.</TableCell>
//                     <TableCell className="px-5 py-3 text-start text-gray-500 font-medium text-xs dark:text-gray-400">BL/DO No.</TableCell>
//                     <TableCell className="px-5 py-3 text-start text-gray-500 font-medium text-xs dark:text-gray-400">ETA</TableCell>
//                     <TableCell className="px-5 py-3 text-start text-gray-500 font-medium text-xs dark:text-gray-400">Port</TableCell>
//                     <TableCell className="px-5 py-3 text-start text-gray-500 font-medium text-xs dark:text-gray-400">Status</TableCell>
//                     <TableCell className="px-5 py-3 text-start text-gray-500 font-medium text-xs dark:text-gray-400">Vendor</TableCell>
//                     <TableCell className="px-5 py-3 text-start text-gray-500 font-medium text-xs dark:text-gray-400">Last Updated</TableCell>
//                     <TableCell className="px-5 py-3 text-start text-gray-500 font-medium text-xs dark:text-gray-400">Action</TableCell>
//                   </TableRow>
//                 </TableHeader>

//                 <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
//                   {currentRecords.map((shipment) => (
//                     <TableRow key={shipment.id} className="hover:bg-gray-50 dark:hover:bg-white/5">
//                       <TableCell className="px-5 py-4">
//                         <input 
//                           type="checkbox" 
//                           className="accent-blue-600" 
//                           checked={selectedShipments.includes(shipment.id)}
//                           onChange={() => toggleShipmentSelection(shipment.id)}
//                         />
//                       </TableCell>
//                       <TableCell className="px-5 py-4 font-medium">{shipment.id}</TableCell>
//                       <TableCell className="px-5 py-4">
//                         {shipment.containerNo.map((container, index) => (
//                           <div key={index} className="text-sm">
//                             {container}
//                             {index < shipment.containerNo.length - 1 && ", "}
//                           </div>
//                         ))}
//                       </TableCell>
//                       <TableCell className="px-5 py-4">{shipment.blDoNo}</TableCell>
//                       <TableCell className="px-5 py-4">{shipment.eta}</TableCell>
//                       <TableCell className="px-5 py-4">{shipment.port}</TableCell>
                      
//                       {/* Status Column with Dropdown */}
//                       <TableCell className="px-5 py-4">
//                         <div className="space-y-1">
//                           <div className="relative inline-block">
//                             <div className="flex items-center gap-1">
//                               <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(shipment.status)}`}>
//                                 {shipment.status}
//                               </span>
//                               <div className="relative">
//                                 <select
//                                   value={shipment.status}
//                                   onChange={(e) => handleStatusChangeInTable(shipment, e.target.value as Shipment['status'])}
//                                   className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
//                                 >
//                                   <option value="Documents Pending">Documents Pending</option>
//                                   <option value="Arrived">Arrived</option>
//                                   <option value="In Transit">In Transit</option>
//                                   <option value="Cleared">Cleared</option>
//                                   <option value="Delayed">Delayed</option>
//                                   <option value="Cancelled">Cancelled</option>
//                                 </select>
//                                 <ChevronDownIcon className="w-3 h-3 text-gray-500" />
//                               </div>
//                             </div>
//                           </div>
                          
//                           {/* Arrival Details */}
//                           {shipment.status === "Arrived" && shipment.arrivalDate && (
//                             <div className="text-xs text-gray-500">
//                               <div>Arrived: {shipment.arrivalDate}</div>
//                               {shipment.doDocuments && shipment.doDocuments.length > 0 && (
//                                 <div className="flex items-center gap-1 mt-1">
//                                   <DocumentArrowUpIcon className="w-3 h-3" />
//                                   <span>DO: {shipment.doDocuments.length} files</span>
//                                 </div>
//                               )}
//                               {shipment.manifestTxtFile && (
//                                 <div className="flex items-center gap-1 mt-1">
//                                   <CheckCircleIcon className="w-3 h-3 text-green-500" />
//                                   <span>TXT: {shipment.manifestTxtFile}</span>
//                                 </div>
//                               )}
//                               {shipment.deliveryNote && (
//                                 <div className="flex items-center gap-1 mt-1">
//                                   <DocumentIcon className="w-3 h-3 text-blue-500" />
//                                   <span>Delivery note: {shipment.deliveryNote}</span>
//                                 </div>
//                               )}
//                             </div>
//                           )}
//                         </div>
//                       </TableCell>
                      
//                       <TableCell className="px-5 py-4">{shipment.vendor}</TableCell>
//                       <TableCell className="px-5 py-4">{shipment.lastUpdated}</TableCell>
                      
//                       {/* Action Icons - Now using colorful icons with hover effects */}
//                       <TableCell className="px-5 py-4">
//                         {renderActionIcons(shipment)}
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>

//               {filteredShipments.length === 0 && (
//                 <p className="text-center py-4 text-gray-500">No matching records found.</p>
//               )}
//             </div>
//           </div>

//           {/* Pagination Controls */}
//           {filteredShipments.length > 0 && (
//             <div className="px-5 py-4 border-t border-gray-100 dark:border-white/[0.05]">
//               <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
//                 <div className="flex items-center gap-2">
//                   <span className="text-sm text-gray-600 dark:text-gray-400">
//                     Showing {indexOfFirstRecord + 1} to {Math.min(indexOfLastRecord, filteredShipments.length)} of {filteredShipments.length} entries
//                   </span>
//                   <select
//                     value={recordsPerPage}
//                     onChange={(e) => {
//                       setRecordsPerPage(Number(e.target.value));
//                       setCurrentPage(1);
//                     }}
//                     className="px-2 py-1 border rounded text-sm bg-white dark:bg-white/[0.05] dark:text-white"
//                   >
//                     <option value={5}>5</option>
//                     <option value={10}>10</option>
//                     <option value={20}>20</option>
//                     <option value={50}>50</option>
//                   </select>
//                 </div>
                
//                 <div className="flex items-center gap-2">
//                   <button
//                     onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//                     disabled={currentPage === 1}
//                     className="px-3 py-1 border rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-white/[0.05] dark:text-white transition-colors"
//                   >
//                     Previous
//                   </button>
                  
//                   <div className="flex items-center gap-1">
//                     {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//                       let pageNumber;
//                       if (totalPages <= 5) {
//                         pageNumber = i + 1;
//                       } else if (currentPage <= 3) {
//                         pageNumber = i + 1;
//                       } else if (currentPage >= totalPages - 2) {
//                         pageNumber = totalPages - 4 + i;
//                       } else {
//                         pageNumber = currentPage - 2 + i;
//                       }
                      
//                       return (
//                         <button
//                           key={pageNumber}
//                           onClick={() => setCurrentPage(pageNumber)}
//                           className={`px-3 py-1 border rounded text-sm transition-colors ${
//                             currentPage === pageNumber
//                               ? 'bg-blue-600 text-white border-blue-600'
//                               : 'hover:bg-gray-100 dark:hover:bg-white/[0.05] dark:text-white'
//                           }`}
//                         >
//                           {pageNumber}
//                         </button>
//                       );
//                     })}
//                   </div>
                  
//                   <button
//                     onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
//                     disabled={currentPage === totalPages}
//                     className="px-3 py-1 border rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-white/[0.05] dark:text-white transition-colors"
//                   >
//                     Next
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}
          
//           {/* Status Change Popup (for Arrived status only) */}
//           {showStatusChangePopup && selectedShipment && (
//             <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
//               <div className="bg-white rounded-xl shadow-xl w-[600px] max-h-[90vh] overflow-y-auto">
//                 {/* Header */}
//                 <div className="flex items-center justify-between p-6 border-b">
//                   <h2 className="text-lg font-semibold text-gray-800">
//                     {currentStep === 'status-select' && 'Mark as Arrived - Step 1/3'}
//                     {currentStep === 'arrival-form' && 'Arrival Details - Step 2/3'}
//                     {currentStep === 'manifest-upload' && 'Generate TXT File - Step 3/3'}
//                     {currentStep === 'delivery-note' && 'Upload Delivery Note - Complete'}
//                   </h2>
//                   <button
//                     onClick={cancelStatusChange}
//                     className="text-gray-400 hover:text-gray-600 transition-colors"
//                   >
//                     <XMarkIcon className="w-6 h-6" />
//                   </button>
//                 </div>

//                 {/* Progress Steps */}
//                 <div className="px-6 py-4 border-b">
//                   <div className="flex items-center justify-between">
//                     {['status-select', 'arrival-form', 'manifest-upload', 'delivery-note'].map((step, index) => (
//                       <div key={step} className="flex items-center">
//                         <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
//                           currentStep === step ? 'bg-blue-600 text-white' :
//                           ['arrival-form', 'manifest-upload', 'delivery-note'].indexOf(currentStep) >= index ? 'bg-green-100 text-green-800' :
//                           'bg-gray-100 text-gray-400'
//                         }`}>
//                           {index + 1}
//                         </div>
//                         {index < 3 && (
//                           <div className={`w-16 h-1 mx-2 ${
//                             ['arrival-form', 'manifest-upload', 'delivery-note'].indexOf(currentStep) > index ? 'bg-green-500' : 'bg-gray-200'
//                           }`} />
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                   <div className="flex justify-between text-xs text-gray-500 mt-2">
//                     <span>Confirm</span>
//                     <span>Arrival Details</span>
//                     <span>Generate TXT</span>
//                     <span>Delivery Note</span>
//                   </div>
//                 </div>

//                 {/* Content */}
//                 <div className="p-6">
//                   {currentStep === 'status-select' && (
//                     <div className="space-y-4">
//                       <div className="bg-green-50 p-4 rounded-lg">
//                         <p className="text-sm text-green-800">
//                           Changing status to <b>Arrived</b> for shipment: <b>{selectedShipment.id}</b>
//                         </p>
//                         <p className="text-sm text-green-700 mt-2">
//                           Current status: <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedShipment.status)}`}>
//                             {selectedShipment.status}
//                           </span>
//                         </p>
//                       </div>

//                       <div className="bg-blue-50 p-4 rounded-lg">
//                         <h3 className="text-sm font-medium text-blue-800 mb-2">Important Notice:</h3>
//                         <p className="text-sm text-blue-700">
//                           When changing status to "Arrived", you will need to:
//                         </p>
//                         <ul className="text-sm text-blue-700 mt-2 list-disc pl-5 space-y-1">
//                           <li>Provide date of arrival</li>
//                           <li>Upload DO documents</li>
//                           <li>Generate TXT file from Manifest & Bill of Lading</li>
//                           <li>Optionally upload delivery note</li>
//                         </ul>
//                       </div>
//                     </div>
//                   )}

//                   {currentStep === 'arrival-form' && (
//                     <div className="space-y-4">
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                           Date of Arrival <span className="text-red-500">*</span>
//                         </label>
//                         <input
//                           type="date"
//                           value={arrivalDate}
//                           onChange={(e) => setArrivalDate(e.target.value)}
//                           className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                           required
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                           Upload DO Documents <span className="text-red-500">*</span>
//                         </label>
//                         <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
//                           <input
//                             type="file"
//                             multiple
//                             accept=".pdf,.doc,.docx,.jpg,.png"
//                             onChange={handleDoUpload}
//                             className="w-full"
//                           />
//                           <p className="text-xs text-gray-500 mt-2">
//                             Upload Bill of Lading and other DO documents
//                           </p>
//                         </div>
//                         {doUploads.length > 0 && renderUploadedFiles(doUploads)}
//                       </div>

//                       {/* Manifest Preview */}
//                       <div className="bg-gray-50 p-4 rounded-lg">
//                         <h3 className="text-sm font-medium text-gray-700 mb-2">Manifest Information</h3>
//                         <div className="text-sm space-y-1">
//                           <div className="flex justify-between">
//                             <span className="text-gray-600">Shipment #:</span>
//                             <span className="font-medium">{selectedShipment.id}</span>
//                           </div>
//                           <div className="flex justify-between">
//                             <span className="text-gray-600">Container(s):</span>
//                             <span className="font-medium">{selectedShipment.containerNo.join(', ')}</span>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   )}

//                   {currentStep === 'manifest-upload' && (
//                     <div className="space-y-4">
//                       {/* Notification Popup Trigger */}
//                       {!manifestFile && !billOfLadingFile && (
//                         <div 
//                           className="bg-blue-50 border border-blue-200 rounded-lg p-4 cursor-pointer hover:bg-blue-100 transition-colors"
//                           onClick={() => setShowNotificationPopup(true)}
//                         >
//                           <div className="flex items-center justify-between">
//                             <div className="flex items-center">
//                               <BellIcon className="w-5 h-5 text-blue-600 mr-2" />
//                               <div>
//                                 <p className="text-sm text-blue-800 font-medium">
//                                   Attention!
//                                 </p>
//                                 <p className="text-sm text-blue-700">
//                                   "Please generate TXT File by choosing Manifest & uploading Bill of Lading"
//                                 </p>
//                               </div>
//                             </div>
//                             <button
//                               className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 setShowNotificationPopup(true);
//                               }}
//                             >
//                               Link to Generate Txt file
//                             </button>
//                           </div>
//                         </div>
//                       )}

//                       {/* Manifest Details */}
//                       <div className="bg-blue-50 p-4 rounded-lg">
//                         <h3 className="text-sm font-medium text-gray-700 mb-2">Manifest Details</h3>
//                         <div className="text-sm space-y-1">
//                           <div className="flex justify-between">
//                             <span className="text-gray-600">Shipment #:</span>
//                             <span className="font-medium">{selectedShipment.id}</span>
//                           </div>
//                           <div className="flex justify-between">
//                             <span className="text-gray-600">Container(s):</span>
//                             <span className="font-medium">{selectedShipment.containerNo.join(', ')}</span>
//                           </div>
//                           <div className="flex justify-between">
//                             <span className="text-gray-600">Arrival Date:</span>
//                             <span className="font-medium">{arrivalDate}</span>
//                           </div>
//                         </div>
//                       </div>

//                       {/* Manifest Upload */}
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                           Upload Manifest File <span className="text-red-500">*</span>
//                         </label>
//                         <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
//                           <input
//                             type="file"
//                             accept=".txt"
//                             onChange={handleManifestUpload}
//                             className="w-full"
//                           />
//                           <p className="text-xs text-gray-500 mt-2">
//                             Upload Manifest TXT file
//                           </p>
//                         </div>
//                         {manifestFile && (
//                           <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded">
//                             <span className="text-sm text-green-700">Selected: {manifestFile.name}</span>
//                           </div>
//                         )}
//                       </div>

//                       {/* Bill of Lading Upload */}
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                           Upload Bill of Lading <span className="text-red-500">*</span>
//                         </label>
//                         <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
//                           <input
//                             type="file"
//                             accept=".pdf,.doc,.docx"
//                             onChange={handleBillOfLadingUpload}
//                             className="w-full"
//                           />
//                           <p className="text-xs text-gray-500 mt-2">
//                             Upload Bill of Lading document
//                           </p>
//                         </div>
//                         {billOfLadingFile && (
//                           <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded">
//                             <span className="text-sm text-green-700">Selected: {billOfLadingFile.name}</span>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   )}

//                   {currentStep === 'delivery-note' && (
//                     <div className="space-y-4">
//                       <div className="bg-green-50 p-4 rounded-lg">
//                         <div className="flex items-center gap-2 text-green-800">
//                           <CheckCircleIcon className="w-5 h-5" />
//                           <span className="font-medium">TXT File Generated Successfully!</span>
//                         </div>
//                         <p className="text-sm text-green-700 mt-2">
//                           Shipment <b>{selectedShipment.id}</b> has been marked as Arrived.
//                         </p>
//                       </div>

//                       <div className="bg-gray-50 p-4 rounded-lg">
//                         <p className="text-sm text-gray-700">
//                           Process after shipment & before clearance "to take delivery note"
//                         </p>
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                           Upload Delivery Note (Optional)
//                         </label>
//                         <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
//                           <input
//                             type="file"
//                             accept=".pdf,.doc,.docx,.jpg,.png"
//                             onChange={handleDeliveryNoteUpload}
//                             className="w-full"
//                           />
//                           <p className="text-xs text-gray-500 mt-2">
//                             Upload delivery note document
//                           </p>
//                         </div>
//                         {deliveryNoteFile && (
//                           <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded">
//                             <span className="text-sm text-green-700">Selected: {deliveryNoteFile.name}</span>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   )}
//                 </div>

//                 {/* Footer Buttons */}
//                 <div className="flex justify-between p-6 border-t">
//                   <div>
//                     {currentStep !== 'status-select' && (
//                       <button
//                         onClick={() => {
//                           if (currentStep === 'delivery-note') {
//                             setCurrentStep('manifest-upload');
//                           } else if (currentStep === 'manifest-upload') {
//                             setCurrentStep('arrival-form');
//                           } else if (currentStep === 'arrival-form') {
//                             setCurrentStep('status-select');
//                           }
//                         }}
//                         className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-black rounded-md text-sm transition-colors"
//                       >
//                         Back
//                       </button>
//                     )}
//                   </div>

//                   <div className="flex gap-3">
//                     <button
//                       onClick={cancelStatusChange}
//                       className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-black rounded-md text-sm transition-colors"
//                     >
//                       Cancel
//                     </button>
                    
//                     {currentStep === 'status-select' && (
//                       <button
//                         onClick={handleStatusSelection}
//                         className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm transition-colors"
//                       >
//                         Continue
//                       </button>
//                     )}
                    
//                     {currentStep === 'arrival-form' && (
//                       <button
//                         onClick={submitArrivalForm}
//                         disabled={!arrivalDate}
//                         className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                       >
//                         Continue to Generate TXT
//                       </button>
//                     )}
                    
//                     {currentStep === 'manifest-upload' && (
//                       <button
//                         onClick={generateTxtFile}
//                         disabled={!manifestFile || !billOfLadingFile}
//                         className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                       >
//                         Generate TXT File
//                       </button>
//                     )}
                    
//                     {currentStep === 'delivery-note' && (
//                       <button
//                         onClick={submitDeliveryNote}
//                         className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm transition-colors"
//                       >
//                         Complete Process
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Notification Popup */}
//           {showNotificationPopup && (
//             <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
//               <div className="bg-white rounded-xl shadow-xl w-[500px]">
//                 {/* Header */}
//                 <div className="flex items-center justify-between p-6 border-b">
//                   <div className="flex items-center">
//                     <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600 mr-3" />
//                     <h2 className="text-lg font-semibold text-gray-800">
//                       Attention!
//                     </h2>
//                   </div>
//                   <button
//                     onClick={() => setShowNotificationPopup(false)}
//                     className="text-gray-400 hover:text-gray-600 transition-colors"
//                   >
//                     <XMarkIcon className="w-6 h-6" />
//                   </button>
//                 </div>

//                 {/* Content */}
//                 <div className="p-6">
//                   <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
//                     <p className="text-sm text-yellow-800">
//                       "Please generate TXT File by choosing Manifest & uploading Bill of Lading"
//                     </p>
//                   </div>
                  
//                   <div className="space-y-4">
//                     <div>
//                       <h3 className="text-sm font-medium text-gray-700 mb-2">Required Files:</h3>
//                       <ul className="text-sm text-gray-600 space-y-2">
//                         <li className="flex items-center">
//                           <DocumentIcon className="w-4 h-4 mr-2 text-blue-500" />
//                           <span>Manifest TXT file (contains shipment details)</span>
//                         </li>
//                         <li className="flex items-center">
//                           <DocumentArrowUpIcon className="w-4 h-4 mr-2 text-green-500" />
//                           <span>Bill of Lading document</span>
//                         </li>
//                       </ul>
//                     </div>

//                     <div className="bg-blue-50 p-4 rounded-lg">
//                       <h3 className="text-sm font-medium text-blue-800 mb-2">Quick Steps:</h3>
//                       <ol className="text-sm text-blue-700 space-y-1">
//                         <li>1. Click on "Upload Manifest File" field and select your TXT file</li>
//                         <li>2. Click on "Upload Bill of Lading" field and select your document</li>
//                         <li>3. Both files will appear as selected when uploaded</li>
//                         <li>4. Click "Generate TXT File" button to create final document</li>
//                       </ol>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Footer Buttons */}
//                 <div className="flex justify-end p-6 border-t">
//                   <button
//                     onClick={() => {
//                       setShowNotificationPopup(false);
//                       // Focus on the manifest upload input when returning
//                       setTimeout(() => {
//                         const manifestInput = document.querySelector('input[type="file"][accept=".txt"]');
//                         if (manifestInput) (manifestInput as HTMLElement).focus();
//                       }, 100);
//                     }}
//                     className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm transition-colors"
//                   >
//                     Got it! Take me to upload
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Assign Shipment Popup */}
//           {showAssignPopup && selectedShipment && (
//             <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
//               <div className="bg-white p-6 rounded-xl shadow-xl w-96">
//                 <div className="flex justify-between items-center mb-4">
//                   <h2 className="text-lg font-semibold text-gray-800">Assign Vendor</h2>
//                   <button
//                     onClick={() => setShowAssignPopup(false)}
//                     className="text-gray-400 hover:text-gray-600 transition-colors"
//                   >
//                     <XMarkIcon className="w-6 h-6" />
//                   </button>
//                 </div>
//                 <p className="text-sm text-gray-600 mb-4">
//                   Assign vendor to shipment <b>{selectedShipment.id}</b>
//                 </p>
                
//                 <div className="space-y-3">
//                   <select className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
//                     <option value="">Select Vendor</option>
//                     <option value="SpeedTrans LLC">SpeedTrans LLC</option>
//                     <option value="Desert Logistics">Desert Logistics</option>
//                     <option value="Gulf Shipping Co">Gulf Shipping Co</option>
//                   </select>
                  
//                   <input
//                     type="text"
//                     placeholder="Cost (AED)"
//                     className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />

//                   <textarea
//                     placeholder="Notes"
//                     className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     rows={3}
//                   />
//                 </div>

//                 <div className="flex justify-end gap-3 mt-6">
//                   <button
//                     className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-black rounded-md transition-colors"
//                     onClick={() => setShowAssignPopup(false)}
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
//                     onClick={() => {
//                       console.log('Assigning shipment:', selectedShipment.id);
//                       setShowAssignPopup(false);
//                     }}
//                   >
//                     Assign Vendor
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// }