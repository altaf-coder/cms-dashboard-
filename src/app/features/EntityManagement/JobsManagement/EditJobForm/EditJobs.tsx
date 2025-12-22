import { useState, useEffect, useRef } from "react";
import { CalendarIcon, ClockIcon, ExclamationTriangleIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useNavigate, useParams } from "react-router-dom";
// @ts-ignore - JSON import is handled by TypeScript config
import jobsData from '../../../../../data/admins.json';

// Mock data - in real app, this would come from API
const activeShipments = [
  { id: "SHP-00125", containerNo: "ABCD1234567", customer: "Al-Futtaim Motors", port: "Jebel Ali", status: "Arrived", lastReturnDate: "30 Nov 2025" },
  { id: "SHP-00126", containerNo: "EFGH9876543", customer: "Al Naboodah", port: "Khalifa", status: "Released", lastReturnDate: "01 Dec 2025" },
  { id: "SHP-00127", containerNo: "IJKL4567890", customer: "Arabian Automobiles", port: "Jebel Ali", status: "Cleared", lastReturnDate: "03 Dec 2025" },
  { id: "SHP-00128", containerNo: "MNOP1230987", customer: "Tamer Group", port: "Mina Rashid", status: "Delivered", lastReturnDate: "05 Dec 2025" },
  { id: "SHP-00129", containerNo: "QRST7890123", customer: "Al Futtaim Group", port: "Khalifa", status: "Arrived", lastReturnDate: "07 Dec 2025" },
];

const approvedVendors = [
  { id: "VND-001", name: "SpeedTrans LLC", drivers: ["D001", "D002"], trucks: ["TRK-7890", "TRK-7891"] },
  { id: "VND-002", name: "Desert Logistics", drivers: ["D003", "D004"], trucks: ["TRK-3456", "TRK-3457"] },
  { id: "VND-003", name: "Gulf Shipping Co", drivers: ["D005"], trucks: ["TRK-9012"] },
  { id: "VND-004", name: "Trans Gulf Logistics", drivers: ["D006", "D007", "D008"], trucks: ["TRK-5678", "TRK-5679"] },
];

const driversData = [
  { id: "D001", name: "Ahmed Hassan", vendorId: "VND-001" },
  { id: "D002", name: "Mohammed Ali", vendorId: "VND-001" },
  { id: "D003", name: "Omar Khalid", vendorId: "VND-002" },
  { id: "D004", name: "Khalid Mohammed", vendorId: "VND-002" },
  { id: "D005", name: "Salem Rashid", vendorId: "VND-003" },
  { id: "D006", name: "Abdullah Salem", vendorId: "VND-004" },
  { id: "D007", name: "Yousef Ahmed", vendorId: "VND-004" },
  { id: "D008", name: "Rashid Omar", vendorId: "VND-004" },
];

const trucksData = [
  { id: "TRK-7890", plateNumber: "DXB-7890", vendorId: "VND-001", status: "Active" },
  { id: "TRK-7891", plateNumber: "SHJ-7891", vendorId: "VND-001", status: "Active" },
  { id: "TRK-3456", plateNumber: "DXB-3456", vendorId: "VND-002", status: "Active" },
  { id: "TRK-3457", plateNumber: "AUH-3457", vendorId: "VND-002", status: "Inactive" },
  { id: "TRK-9012", plateNumber: "DXB-9012", vendorId: "VND-003", status: "Active" },
  { id: "TRK-5678", plateNumber: "SHJ-5678", vendorId: "VND-004", status: "Active" },
  { id: "TRK-5679", plateNumber: "AUH-5679", vendorId: "VND-004", status: "Active" },
];

const existingJobs = [
  { jobId: "J-CMS-001", driverId: "D001", jobDateTime: "2025-11-25T09:00", duration: 2 },
  { jobId: "J-CMS-002", driverId: "D003", jobDateTime: "2025-11-26T14:00", duration: 3 },
];

interface FormData {
  jobId: string;
  shipmentId: string;
  containerNo: string;
  customer: string;
  vendorId: string;
  driverId: string;
  truckId: string;
  jobType: string;
  pickupLocation: string;
  dropLocation: string;
  jobDateTime: string;
  portLastReturnDate: string;
  specialInstructions: string;
  status: string;
}

export default function EditJobs() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  // Generate next Job ID
  const generateJobId = () => {
    const lastId = 1; // In real app, get from API
    const nextId = lastId + 1;
    return `J-CMS-${nextId.toString().padStart(3, '0')}`;
  };

  // Function to get job data from JSON
  const getJobById = (jobId: string) => {
    if (!jobsData || !jobsData.jobs) return null;
    return jobsData.jobs.find((job: any) => job.id === jobId);
  };

  const [formData, setFormData] = useState<FormData>({
    jobId: id || generateJobId(),
    shipmentId: "",
    containerNo: "",
    customer: "",
    vendorId: "",
    driverId: "",
    truckId: "",
    jobType: "",
    pickupLocation: "",
    dropLocation: "",
    jobDateTime: "",
    portLastReturnDate: "",
    specialInstructions: "",
    status: "draft"
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [warnings, setWarnings] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filtered data based on selections
  const [filteredDrivers, setFilteredDrivers] = useState(driversData);
  const [filteredTrucks, setFilteredTrucks] = useState(trucksData);

  const dateInputRef = useRef<HTMLInputElement>(null);
  const timeInputRef = useRef<HTMLInputElement>(null);
  const timeoutRefs = useRef<NodeJS.Timeout[]>([]);

  // Load job data when component mounts or ID changes
  useEffect(() => {
    if (id) {
      setIsLoading(true);
      // TODO: Replace with actual API call
      const job = getJobById(id);
      
      if (job) {
        // Find corresponding shipment to get customer and container info
        const shipment = activeShipments.find(s => s.id === job.shipmentId);
        
        // Find vendor by name
        const vendor = approvedVendors.find(v => v.name === job.vendor);
        
        // Find driver by name
        const driver = driversData.find(d => d.name === job.driver);
        
        // Find truck by plate number or ID
        const truck = trucksData.find(t => t.plateNumber === job.truckNo || t.id === job.truckNo);
        
        // Parse job date time - handle different formats
        let jobDateTime = "";
        if (job.jobDateTime) {
          // If it's already in ISO format
          if (job.jobDateTime.includes('T')) {
            jobDateTime = job.jobDateTime;
          } else {
            // Try to parse common date formats
            const date = new Date(job.jobDateTime);
            if (!isNaN(date.getTime())) {
              const dateStr = date.toISOString().split('T')[0];
              jobDateTime = `${dateStr}T09:00`; // Default to 9 AM if time not provided
            }
          }
        }
        
        setFormData({
          jobId: job.id || id,
          shipmentId: job.shipmentId || "",
          containerNo: shipment?.containerNo || job.containerNo || "",
          customer: shipment?.customer || "",
          vendorId: vendor?.id || "",
          driverId: driver?.id || "",
          truckId: truck?.id || "",
          jobType: job.jobType || "",
          pickupLocation: shipment?.port || "",
          dropLocation: "",
          jobDateTime: jobDateTime,
          portLastReturnDate: job.lastReturnDate || shipment?.lastReturnDate || "",
          specialInstructions: "",
          status: job.status || "draft"
        });
      }
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, [id]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      timeoutRefs.current.forEach(timeout => clearTimeout(timeout));
      timeoutRefs.current = [];
    };
  }, []);

  // Handle shipment selection
  useEffect(() => {
    if (formData.shipmentId) {
      const selectedShipment = activeShipments.find(s => s.id === formData.shipmentId);
      if (selectedShipment) {
        setFormData(prev => ({
          ...prev,
          containerNo: selectedShipment.containerNo,
          customer: selectedShipment.customer,
          portLastReturnDate: selectedShipment.lastReturnDate,
          pickupLocation: selectedShipment.port
        }));
      }
    }
  }, [formData.shipmentId]); // activeShipments is a constant

  // Handle vendor selection
  useEffect(() => {
    if (formData.vendorId) {
      // Filter drivers by vendor
      const vendorDrivers = driversData.filter(d => d.vendorId === formData.vendorId);
      setFilteredDrivers(vendorDrivers);
      
      // Filter trucks by vendor and active status
      const vendorTrucks = trucksData.filter(t => 
        t.vendorId === formData.vendorId && t.status === "Active"
      );
      setFilteredTrucks(vendorTrucks);
      
      // Reset driver and truck if they don't belong to new vendor
      if (formData.driverId && !vendorDrivers.some(d => d.id === formData.driverId)) {
        setFormData(prev => ({ ...prev, driverId: "" }));
      }
      if (formData.truckId && !vendorTrucks.some(t => t.id === formData.truckId)) {
        setFormData(prev => ({ ...prev, truckId: "" }));
      }
    } else {
      setFilteredDrivers([]);
      setFilteredTrucks([]);
      setFormData(prev => ({ ...prev, driverId: "", truckId: "" }));
    }
  }, [formData.vendorId, formData.driverId, formData.truckId]); // driversData and trucksData are constants

  // Check for overlapping jobs
  const checkDriverAvailability = () => {
    if (!formData.driverId || !formData.jobDateTime) return true;
    
    const selectedDateTime = new Date(formData.jobDateTime);
    const jobDuration = 2; // Assuming 2 hours duration
    
    const hasOverlap = existingJobs.some(job => {
      if (job.driverId !== formData.driverId) return false;
      
      const existingStart = new Date(job.jobDateTime);
      const existingEnd = new Date(existingStart.getTime() + job.duration * 60 * 60 * 1000);
      const selectedEnd = new Date(selectedDateTime.getTime() + jobDuration * 60 * 60 * 1000);
      
      // Check if time ranges overlap
      return selectedDateTime < existingEnd && selectedEnd > existingStart;
    });
    
    return !hasOverlap;
  };

  // Check job type validation based on shipment status
  const validateJobType = () => {
    if (!formData.shipmentId || !formData.jobType) return true;
    
    const selectedShipment = activeShipments.find(s => s.id === formData.shipmentId);
    if (!selectedShipment) return true;
    
    const shipmentStatus = selectedShipment.status;
    
    switch (formData.jobType) {
      case "Pickup":
        return shipmentStatus === "Arrived" || shipmentStatus === "Released";
      case "Delivery":
        return shipmentStatus === "Cleared";
      case "Empty Return":
        return shipmentStatus === "Delivered";
      default:
        return true;
    }
  };

  // Check port last return date
  const checkPortReturnDate = () => {
    if (!formData.portLastReturnDate || !formData.jobDateTime) return true;
    
    const lastReturnDate = new Date(formData.portLastReturnDate);
    const jobDate = new Date(formData.jobDateTime.split('T')[0]); // Get date part only
    
    return jobDate <= lastReturnDate;
  };

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
    // Special handling for job type
    if (name === "jobType") {
      if (value === "Pickup") {
        const selectedShipment = activeShipments.find(s => s.id === formData.shipmentId);
        setFormData(prev => ({
          ...prev,
          dropLocation: "",
          pickupLocation: selectedShipment?.port || ""
        }));
      } else if (value === "Delivery") {
        setFormData(prev => ({
          ...prev,
          pickupLocation: "",
          dropLocation: ""
        }));
      }
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const newWarnings: Record<string, string> = {};
    
    // Required fields validation
    if (!formData.shipmentId) newErrors.shipmentId = "Shipment is required";
    if (!formData.vendorId) newErrors.vendorId = "Vendor is required";
    if (!formData.driverId) newErrors.driverId = "Driver is required";
    if (!formData.truckId) newErrors.truckId = "Truck is required";
    if (!formData.jobType) newErrors.jobType = "Job type is required";
    if (!formData.jobDateTime) newErrors.jobDateTime = "Job date & time is required";
    
    // Job type specific validations
    if (formData.jobType === "Pickup" && !formData.pickupLocation) {
      newErrors.pickupLocation = "Pickup location is required for Pickup jobs";
    }
    if (formData.jobType === "Delivery" && !formData.dropLocation) {
      newErrors.dropLocation = "Drop location is required for Delivery jobs";
    }
    
    // Job date validation
    if (formData.jobDateTime) {
      const selectedDate = new Date(formData.jobDateTime);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.jobDateTime = "Job date must be today or in the future";
      }
    }
    
    // Special instructions length
    if (formData.specialInstructions.length > 3000) {
      newErrors.specialInstructions = "Special instructions cannot exceed 3000 characters";
    }
    
    // Business rule validations
    if (!checkDriverAvailability()) {
      newErrors.driverId = "Driver is not available at selected timeslot. Change time or select another driver";
    }
    
    if (!validateJobType()) {
      const selectedShipment = activeShipments.find(s => s.id === formData.shipmentId);
      newErrors.jobType = `Job type "${formData.jobType}" is not allowed for shipment status "${selectedShipment?.status}"`;
    }
    
    if (!checkPortReturnDate()) {
      newWarnings.portLastReturnDate = "Job date exceeds Port Last Return Date";
    }
    
    setErrors(newErrors);
    setWarnings(newWarnings);
    
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In real app, send data to API
      // TODO: Replace with actual API call
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Send email notification (simulated)
      // TODO: Replace with actual email notification service
      
      // Show success popup
      setSuccessMessage('Job created successfully! Email notifications sent to driver and vendor.');
      
    } catch (error) {
      // Error handling - in production, use proper error logging service
      setErrors(prev => ({
        ...prev,
        submit: "Failed to create job. Please try again."
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form after successful submission
  const resetFormAfterSuccess = () => {
    setFormData({
      jobId: generateJobId(),
      shipmentId: "",
      containerNo: "",
      customer: "",
      vendorId: "",
      driverId: "",
      truckId: "",
      jobType: "",
      pickupLocation: "",
      dropLocation: "",
      jobDateTime: "",
      portLastReturnDate: "",
      specialInstructions: "",
      status: "draft"
    });
    setErrors({});
    setWarnings({});
    setSuccessMessage('');
  };

  // Handle delete job - Form reset karega
  const handleDelete = async () => {
    setIsDeleting(true);
    
    try {
      // In real app, send delete request to API (if draft was saved)
      // TODO: Replace with actual API call
      
      // Simulate API call
      await new Promise(resolve => {
        const timeout = setTimeout(resolve, 1000);
        timeoutRefs.current.push(timeout);
      });
      
      // Reset form to initial state
      setFormData({
        jobId: generateJobId(),
        shipmentId: "",
        containerNo: "",
        customer: "",
        vendorId: "",
        driverId: "",
        truckId: "",
        jobType: "",
        pickupLocation: "",
        dropLocation: "",
        jobDateTime: "",
        portLastReturnDate: "",
        specialInstructions: "",
        status: "draft"
      });
      setErrors({});
      setWarnings({});
      
      // Close delete confirmation
      setShowDeleteConfirm(false);
      
      // Form reset to initial state
      
    } catch (error) {
      // Error handling - in production, use proper error logging service
      setErrors(prev => ({
        ...prev,
        delete: "Failed to delete job draft. Please try again."
      }));
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle calendar icon click
  const handleCalendarClick = () => {
    if (dateInputRef.current) {
      dateInputRef.current.showPicker();
    }
  };

  // Handle time icon click
  const handleTimeClick = () => {
    if (timeInputRef.current) {
      timeInputRef.current.showPicker();
    }
  };

  // Get current date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
          </svg>
          <p className="mt-4 text-gray-600">Loading job data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      {/* Success Popup Modal - CHANGED: Navigation removed */}
      {successMessage && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
          <div className="bg-white p-6 rounded-xl shadow-lg z-10 text-center max-w-sm mx-auto">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-green-600 text-xl font-semibold mb-2">Success!</h2>
            <p className="text-gray-700 mb-4">{successMessage}</p>
            <button
              onClick={resetFormAfterSuccess}
              className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Popup Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
          <div className="bg-white p-6 rounded-xl shadow-lg z-10 text-center max-w-sm mx-auto">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
              </div>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Clear Job Draft</h2>
            <p className="text-gray-700 mb-6">Are you sure you want to clear this job draft? All entered data will be lost.</p>
            <div className="flex justify-center space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    Clearing...
                  </span>
                ) : (
                  'Clear Draft'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Edit New Job</h1>
                {/* <p className="text-sm text-gray-600 mt-1">Create and assign a new transportation job</p> */}
              </div>
              <button
                onClick={() => navigate('/jobs')}
                className="text-gray-400 hover:text-gray-600"
              >
                {/* <XMarkIcon className="w-6 h-6" /> */}
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Two Column Layout for Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-5">
                {/* Job ID (Auto-generated) */}
                <div className="h-[80px]">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job ID
                  </label>
                  <input
                    type="text"
                    value={formData.jobId}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1">Auto-generated</p>
                </div>

                {/* Shipment (Required Dropdown) */}
                <div className="h-[80px]">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Shipment <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="shipmentId"
                    value={formData.shipmentId}
                    onChange={handleChange}
                    required
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.shipmentId ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select Shipment</option>
                    {activeShipments.map(shipment => (
                      <option key={shipment.id} value={shipment.id}>
                        {shipment.id} - {shipment.customer}
                      </option>
                    ))}
                  </select>
                  {errors.shipmentId && (
                    <p className="text-sm text-red-600 mt-1">{errors.shipmentId}</p>
                  )}
                </div>

                {/* Container No. (Auto-filled from shipment) */}
                <div className="h-[80px]">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Container No. <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="containerNo"
                    value={formData.containerNo}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                  />
                </div>

                {/* Customer (Auto-filled from shipment) */}
                <div className="h-[80px]">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Customer <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="customer"
                    value={formData.customer}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-5">
                {/* Vendor (Required Dropdown) */}
                <div className="h-[80px]">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vendor <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="vendorId"
                    value={formData.vendorId}
                    onChange={handleChange}
                    required
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.vendorId ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select Vendor</option>
                    {approvedVendors.map(vendor => (
                      <option key={vendor.id} value={vendor.id}>
                        {vendor.name}
                      </option>
                    ))}
                  </select>
                  {errors.vendorId && (
                    <p className="text-sm text-red-600 mt-1">{errors.vendorId}</p>
                  )}
                </div>

                {/* Driver (Dropdown based on vendor) */}
                <div className="h-[80px]">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Driver <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="driverId"
                    value={formData.driverId}
                    onChange={handleChange}
                    required
                    disabled={!formData.vendorId}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.driverId ? 'border-red-500' : 'border-gray-300'
                    } ${!formData.vendorId ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                  >
                    <option value="">Select Driver</option>
                    {filteredDrivers.map(driver => (
                      <option key={driver.id} value={driver.id}>
                        {driver.name}
                      </option>
                    ))}
                  </select>
                  {errors.driverId && (
                    <p className="text-sm text-red-600 mt-1">{errors.driverId}</p>
                  )}
                </div>

                {/* Truck (Dropdown based on vendor) */}
                <div className="h-[80px]">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Truck <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="truckId"
                    value={formData.truckId}
                    onChange={handleChange}
                    required
                    disabled={!formData.vendorId}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.truckId ? 'border-red-500' : 'border-gray-300'
                    } ${!formData.vendorId ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                  >
                    <option value="">Select Truck</option>
                    {filteredTrucks.map(truck => (
                      <option key={truck.id} value={truck.id}>
                        {truck.plateNumber} - {truck.id}
                      </option>
                    ))}
                  </select>
                  {errors.truckId && (
                    <p className="text-sm text-red-600 mt-1">{errors.truckId}</p>
                  )}
                </div>

                {/* Job Type (Required Dropdown) */}
                <div className="h-[80px]">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="jobType"
                    value={formData.jobType}
                    onChange={handleChange}
                    required
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.jobType ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select Job Type</option>
                    <option value="Pickup">Pickup</option>
                    <option value="Delivery">Delivery</option>
                    <option value="Empty Return">Empty Return</option>
                  </select>
                  {errors.jobType && (
                    <p className="text-sm text-red-600 mt-1">{errors.jobType}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Job Details Section */}
            <div className="border-t pt-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Pickup Location (Conditional) */}
                {formData.jobType === "Pickup" && (
                  <div className="h-[80px]">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pick up Location <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="pickupLocation"
                      value={formData.pickupLocation}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                    />
                  </div>
                )}

                {/* Drop Location (Conditional) */}
                {formData.jobType === "Delivery" && (
                  <div className="h-[80px]">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Drop Location <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="dropLocation"
                      value={formData.dropLocation}
                      onChange={handleChange}
                      placeholder="Enter customer address"
                      className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.dropLocation ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.dropLocation && (
                      <p className="text-sm text-red-600 mt-1">{errors.dropLocation}</p>
                    )}
                  </div>
                )}

                {/* Job Date & Time */}
                <div className="h-[80px]">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job Date & Time <span className="text-red-500">*</span>
                  </label>
                  <div className="flex space-x-2">
                    <div className="relative flex-1">
                      <input
                        ref={dateInputRef}
                        type="date"
                        name="jobDate"
                        min={getTodayDate()}
                        value={formData.jobDateTime.split('T')[0]}
                        onChange={(e) => {
                          const date = e.target.value;
                          const time = formData.jobDateTime.split('T')[1] || "09:00";
                          setFormData(prev => ({
                            ...prev,
                            jobDateTime: `${date}T${time}`
                          }));
                        }}
                        className={`w-full px-3 py-2 pl-10 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.jobDateTime ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      <CalendarIcon 
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 cursor-pointer"
                        onClick={handleCalendarClick}
                      />
                    </div>
                    
                    <div className="relative flex-1">
                      <input
                        ref={timeInputRef}
                        type="time"
                        name="jobTime"
                        value={formData.jobDateTime.split('T')[1]}
                        onChange={(e) => {
                          const time = e.target.value;
                          const date = formData.jobDateTime.split('T')[0] || getTodayDate();
                          setFormData(prev => ({
                            ...prev,
                            jobDateTime: `${date}T${time}`
                          }));
                        }}
                        className={`w-full px-3 py-2 pl-10 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.jobDateTime ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      <ClockIcon 
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 cursor-pointer"
                        onClick={handleTimeClick}
                      />
                    </div>
                  </div>
                  {errors.jobDateTime && (
                    <p className="text-sm text-red-600 mt-1 absolute">{errors.jobDateTime}</p>
                  )}
                </div>

                {/* Port Last Return Date */}
                <div className="h-[80px]">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Port Last Return Date
                  </label>
                  <input
                    type="text"
                    name="portLastReturnDate"
                    value={formData.portLastReturnDate}
                    readOnly
                    className={`w-full px-3 py-2 border rounded-md bg-gray-50 ${
                      warnings.portLastReturnDate ? 'border-yellow-500' : 'border-gray-300'
                    }`}
                  />
                  {warnings.portLastReturnDate && (
                    <div className="flex items-center mt-1">
                      <ExclamationTriangleIcon className="h-4 w-4 text-yellow-500 mr-1" />
                      <p className="text-sm text-yellow-600">{warnings.portLastReturnDate}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Special Instructions */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Special Instructions (Optional)
                </label>
                <textarea
                  name="specialInstructions"
                  value={formData.specialInstructions}
                  onChange={handleChange}
                  rows={4}
                  maxLength={3000}
                  placeholder="Enter any special instructions for the driver..."
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.specialInstructions ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                <div className="flex justify-between mt-1">
                  <p className="text-xs text-gray-500">
                    Maximum 3000 characters
                  </p>
                  <p className="text-xs text-gray-500">
                    {formData.specialInstructions.length}/3000
                  </p>
                </div>
                {errors.specialInstructions && (
                  <p className="text-sm text-red-600 mt-1">{errors.specialInstructions}</p>
                )}
              </div>

              {/* Status */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="draft">Draft</option>
                  <option value="Assigned">Assigned</option>
                  <option value="In-Transit">In-Transit</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Returned">Returned</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  If no status selected, job will be saved as "draft"
                </p>
              </div>
            </div>

            {/* Form Actions */}
            <div className="border-t pt-6 mt-6">
              <div className="flex justify-end space-x-3">
                {/* Clear Draft button - CHANGED: Now with red background */}
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 flex items-center space-x-2"
                >
                  <TrashIcon className="w-4 h-4" />
                  <span>Clear Draft</span>
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                      </svg>
                      Creating...
                    </span>
                  ) : (
                    ' Update Job'
                  )}
                </button>
              </div>
              {errors.submit && (
                <p className="text-sm text-red-600 mt-2 text-center">{errors.submit}</p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}