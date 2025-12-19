import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  DocumentArrowUpIcon, 
  XCircleIcon, 
  CheckCircleIcon 
} from '@heroicons/react/24/outline';

interface DocumentFormData {
  documentCategory: string;
  documentType: string;
  documentBelongsTo: string;
  shipmentId: string;
  containerId: string;
  driverId: string;
  customerId: string;
  truckId: string;
  uploadedBy: string;
  uploadDate: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  notes: string;
  file: File | null;
}

interface Option {
  id: string;
  name: string;
}

export default function AddDocument() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<DocumentFormData>({
    documentCategory: "",
    documentType: "",
    documentBelongsTo: "Shipment",
    shipmentId: "SHP-00125",
    containerId: "",
    driverId: "",
    customerId: "",
    truckId: "",
    uploadedBy: "Admin",
    uploadDate: new Date().toISOString().split('T')[0],
    status: "Pending",
    notes: "",
    file: null,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof DocumentFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileError, setFileError] = useState("");
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  // Mock data for dropdowns - using const arrays instead of state since they don't change
  const containers: Option[] = [
    { id: "CONT-001", name: "CONT-001" },
    { id: "CONT-002", name: "CONT-002" },
    { id: "CONT-003", name: "CONT-003" },
  ];

  const drivers: Option[] = [
    { id: "V-CMS-001", name: "John Doe" },
    { id: "V-CMS-002", name: "Ahmed Al Mansoori" },
    { id: "V-CMS-003", name: "Fatima Khalid" },
  ];

  const customers: Option[] = [
    { id: "CUST-001", name: "ABC Corporation" },
    { id: "CUST-002", name: "XYZ Ltd" },
    { id: "CUST-003", name: "Global Traders" },
  ];

  const trucks: Option[] = [
    { id: "TRK-789", name: "TRK-789" },
    { id: "TRK-790", name: "TRK-790" },
    { id: "TRK-791", name: "TRK-791" },
  ];

  // Document types based on category
  const documentTypes: Record<string, string[]> = {
    "Shipment": ["Bill of Lading", "Shipping Invoice", "Packing List", "Certificate of Origin", "Insurance Certificate"],
    "Customer": ["Purchase Order", "Customer Agreement", "Credit Application", "Identification Document", "Business License"],
    "Vendor": ["Vendor Contract", "Service Agreement", "Insurance Certificate", "Tax Registration", "Bank Details"],
    "Driver": ["Driving License", "ID Card", "Medical Certificate", "Training Certificate", "Employment Contract"],
    "Truck": ["Registration Certificate", "Insurance Certificate", "Inspection Report", "Maintenance Record", "GPS Tracking Agreement"],
  };

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      setFileError("Only PDF, JPG, and PNG files are allowed");
      return;
    }

    // Validate file size (10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      setFileError("File size must be less than 10MB");
      return;
    }

    setFileError("");
    setFormData(prev => ({ ...prev, file }));

    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }
  };

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is changed
    if (errors[name as keyof DocumentFormData]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }

    // Reset document type when category changes
    if (name === "documentCategory") {
      setFormData(prev => ({ ...prev, documentType: "" }));
    }
  };

  // Handle searchable dropdown changes
  const handleSearchableChange = (field: keyof DocumentFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when field is changed
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors: Partial<Record<keyof DocumentFormData, string>> = {};

    if (!formData.documentCategory) {
      newErrors.documentCategory = "Document category is required";
    }

    if (!formData.documentType) {
      newErrors.documentType = "Document type is required";
    }

    if (!formData.shipmentId) {
      newErrors.shipmentId = "Shipment ID is required";
    }

    // Validate that at least one related entity is selected
    if (!formData.containerId && !formData.driverId && !formData.customerId && !formData.truckId) {
      newErrors.containerId = "At least one related entity (Container, Driver, Customer, or Truck) is required";
    }

    if (!formData.file) {
      newErrors.file = "File upload is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log("Document submitted:", formData);
      setIsSubmitting(false);
      // Show success popup instead of navigating immediately
      setShowSuccessPopup(true);
    }, 1500);
  };

  // Remove file
  const removeFile = () => {
    setFormData(prev => ({ ...prev, file: null }));
    setFilePreview(null);
    setFileError("");
  };

  // Handle OK button - resets form and closes popup
  const handleOk = () => {
    setShowSuccessPopup(false);
    // Reset form for new upload
    setFormData({
      documentCategory: "",
      documentType: "",
      documentBelongsTo: "Shipment",
      shipmentId: "SHP-00125",
      containerId: "",
      driverId: "",
      customerId: "",
      truckId: "",
      uploadedBy: "Admin",
      uploadDate: new Date().toISOString().split('T')[0],
      status: "Pending",
      notes: "",
      file: null,
    });
    setFilePreview(null);
    setFileError("");
    setErrors({});
  };

  // Handle Close button - just closes the popup without resetting
  const handleClose = () => {
    setShowSuccessPopup(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3">
            {/* <button
              onClick={() => navigate("/view-documents")}
              className="p-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-50"
            >
              <ArrowLeftIcon className="w-5 h-5 text-gray-700" />
            </button> */}
            <h1 className="text-2xl font-bold text-gray-900">
              Add Document 
            </h1>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="space-y-6">
            {/* Document Category & Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Document Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Document Category *
                </label>
                <select
                  name="documentCategory"
                  value={formData.documentCategory}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border ${errors.documentCategory ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Shipment">Shipment</option>
                  <option value="Customer">Customer</option>
                  <option value="Vendor">Vendor</option>
                  <option value="Driver">Driver</option>
                  <option value="Truck">Truck</option>
                </select>
                {errors.documentCategory && (
                  <p className="mt-1 text-sm text-red-600">{errors.documentCategory}</p>
                )}
              </div>

              {/* Document Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Document Type *
                </label>
                <select
                  name="documentType"
                  value={formData.documentType}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border ${errors.documentType ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  required
                  disabled={!formData.documentCategory}
                >
                  <option value="">Select Type</option>
                  {formData.documentCategory && 
                    documentTypes[formData.documentCategory]?.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))
                  }
                </select>
                {errors.documentType && (
                  <p className="mt-1 text-sm text-red-600">{errors.documentType}</p>
                )}
              </div>
            </div>

            {/* Document Belongs to (Auto-filled) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Document Belongs to *
              </label>
              <input
                type="text"
                name="documentBelongsTo"
                value={formData.documentBelongsTo}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                readOnly
              />
              <p className="mt-1 text-xs text-gray-500">Auto-filled based on current context</p>
            </div>

            {/* Shipment ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Shipment ID *
              </label>
              <input
                type="text"
                name="shipmentId"
                value={formData.shipmentId}
                onChange={handleChange}
                className={`w-full px-4 py-2 border ${errors.shipmentId ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                required
              />
              {errors.shipmentId && (
                <p className="mt-1 text-sm text-red-600">{errors.shipmentId}</p>
              )}
            </div>

            {/* Related Entities */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Related Entities (At least one required)
              </label>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Container ID */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Container ID
                  </label>
                  <select
                    value={formData.containerId}
                    onChange={(e) => handleSearchableChange("containerId", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Search or Select Container</option>
                    {containers.map((container) => (
                      <option key={container.id} value={container.id}>
                        {container.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Driver */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Driver
                  </label>
                  <select
                    value={formData.driverId}
                    onChange={(e) => handleSearchableChange("driverId", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Search or Select Driver</option>
                    {drivers.map((driver) => (
                      <option key={driver.id} value={driver.id}>
                        {driver.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Customer */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Customer
                  </label>
                  <select
                    value={formData.customerId}
                    onChange={(e) => handleSearchableChange("customerId", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Search or Select Customer</option>
                    {customers.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Truck */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Truck
                  </label>
                  <select
                    value={formData.truckId}
                    onChange={(e) => handleSearchableChange("truckId", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Search or Select Truck</option>
                    {trucks.map((truck) => (
                      <option key={truck.id} value={truck.id}>
                        {truck.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              {errors.containerId && (
                <p className="mt-1 text-sm text-red-600">{errors.containerId}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">Entities will be auto-fetched if assigned to shipment</p>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload File (PDF/JPG/PNG) *
              </label>
              
              {!formData.file ? (
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                  <div className="space-y-1 text-center">
                    <DocumentArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                        <span>Upload a file</span>
                        <input
                          type="file"
                          className="sr-only"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={handleFileChange}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PDF, JPG or PNG up to 10MB
                    </p>
                  </div>
                </div>
              ) : (
                <div className="mt-1 p-4 border border-gray-300 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {filePreview ? (
                        <img
                          src={filePreview}
                          alt="Preview"
                          className="h-12 w-12 object-cover rounded"
                        />
                      ) : (
                        <div className="h-12 w-12 bg-red-100 rounded flex items-center justify-center">
                          <span className="text-red-600 font-bold">PDF</span>
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {formData.file.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(formData.file.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removeFile}
                      className="text-red-600 hover:text-red-800"
                    >
                      <XCircleIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
              
              {(errors.file || fileError) && (
                <p className="mt-1 text-sm text-red-600">{errors.file || fileError}</p>
              )}
            </div>

            {/* Upload Info (Auto-filled) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Uploaded By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Uploaded By
                </label>
                <input
                  type="text"
                  name="uploadedBy"
                  value={formData.uploadedBy}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  readOnly
                />
              </div>

              {/* Upload Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Date
                </label>
                <input
                  type="text"
                  name="uploadDate"
                  value={formData.uploadDate}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  readOnly
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Add any additional notes or comments..."
              />
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-6">
              <button
                type="button"
                onClick={() => navigate("/view-documents")}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Uploading...
                  </>
                ) : (
                  "Upload Document"
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Validation Summary (only show if there are errors) */}
        {Object.keys(errors).length > 0 && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="text-sm font-medium text-red-800 mb-2">
              Please fix the following errors:
            </h3>
            <ul className="list-disc list-inside text-sm text-red-700">
              {Object.entries(errors).map(([field, message]) => (
                <li key={field}>{message}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white p-8 rounded-xl shadow-xl w-96 text-center mt-10">
            {/* Success Icon */}
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <CheckCircleIcon className="h-10 w-10 text-green-600" />
            </div>
            
            {/* Success Title */}
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Document Uploaded Successfully!
            </h2>
            
            {/* Success Message */}
            <p className="text-sm text-gray-600 mb-6">
              Your document <span className="font-semibold">{formData.file?.name}</span> has been successfully uploaded and is now pending review.
            </p>
            
            {/* Document Details */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg text-left">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-600">Document Type:</div>
                <div className="font-medium">{formData.documentType}</div>
                
                <div className="text-gray-600">Shipment ID:</div>
                <div className="font-medium">{formData.shipmentId}</div>
                
                <div className="text-gray-600">Status:</div>
                <div className="font-medium text-yellow-600">{formData.status}</div>
                
                <div className="text-gray-600">Upload Date:</div>
                <div className="font-medium">{formData.uploadDate}</div>
              </div>
            </div>
            
            {/* Action Buttons - OK and Close */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                 <button
                onClick={handleClose}
                className="px-6 py-2 border border-gray-300  text-gray-700 rounded-lg hover:bg-gray-50 flex-1"
              >
                Close
              </button>
              <button
                onClick={handleOk}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex-1"
              >
                OK
              </button>
             
            </div>
          </div>
        </div>
      )}
    </div>
  );
}