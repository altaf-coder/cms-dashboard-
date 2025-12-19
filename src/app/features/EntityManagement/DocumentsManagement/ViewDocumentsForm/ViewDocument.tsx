import { useState } from 'react';

interface DocumentData {
  id: string;
  documentCategory: string;
  documentType: string;
  documentAttachment: string;
  shipmentId: string;
  containerId: string;
  driver: string;
  customer: string;
  truck: string;
  status: string;
}

export default function ViewDocuments() {
  const [formData] = useState<DocumentData>({
    id: 'DOC-001',
    documentCategory: 'Shipping',
    documentType: 'Bill of Lading',
    documentAttachment: 'bill-of-lading.pdf',
    shipmentId: 'SH-789456',
    containerId: 'CNTR-12345',
    driver: 'Mohammed Ahmed',
    customer: 'ABC Trading LLC',
    truck: 'TRK-2024-001',
    status: 'Approved'
  });

  const renderFileField = (label: string, fileName: string) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="border border-gray-300 rounded-lg px-3 py-2 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-gray-700">{fileName}</span>
          </div>
          <button className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer">
            Download
          </button>
        </div>
      </div>
    </div>
  );

  const renderDropdownField = (label: string, value: string) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 relative">
        <span className="text-gray-700">{value}</span>
        <svg 
          className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  );

  const renderStatusField = (label: string, value: string) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 relative">
        <div className="flex items-center justify-between">
          <span className={`font-medium ${
            value === 'Approved' ? 'text-gray-600' : 
            value === 'Pending' ? 'text-yellow-600' : 
            value === 'Rejected' ? 'text-red-600' : 
            value === 'In Review' ? 'text-blue-600' : 
            'text-gray-600'
          }`}>
            {value}
          </span>
          <svg 
            className="w-5 h-5 text-gray-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    </div>
  );

  const renderInputField = (label: string, value: string) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="border border-gray-300 rounded-lg px-3 py-2 bg-gray-50">
        <span className="text-gray-700">{value}</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-white p-6 border-b">
          <h1 className="text-2xl font-bold text-center text-gray-800">VIEW DOCUMENT DETAILS</h1>
          <p className="text-center text-gray-600 mt-2">Document Information and Status</p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. Document Category */}
            {renderDropdownField('Document Category', formData.documentCategory)}
            
            {/* 2. Document Type */}
            {renderDropdownField('Document Type', formData.documentType)}
            
            {/* 3. Document / Attachment */}
            {renderFileField('Document / Attachment', formData.documentAttachment)}
            
            {/* 4. Shipment ID */}
            {renderInputField('Shipment ID', formData.shipmentId)}
            
            {/* 5. Container ID */}
            {renderInputField('Container ID', formData.containerId)}
            
            {/* 6. Driver */}
            {renderInputField('Driver', formData.driver)}
            
            {/* 7. Customer */}
            {renderInputField('Customer', formData.customer)}
            
            {/* 8. Truck */}
            {renderInputField('Truck', formData.truck)}
            
            {/* 9. Status */}
            {renderStatusField('Status', formData.status)}
          </div>
        </div>
      </div>
    </div>
  );
}
