// src/NewPages/ViewDocuments.tsx
import { useState, useEffect } from "react";
// @ts-ignore - JSON import is handled by TypeScript config
import documentsData from '../../../../data/admins.json';
import { 
  EyeIcon, 
  ArrowDownTrayIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  TrashIcon,
  DocumentIcon,
  PhotoIcon,
  DocumentTextIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { Link } from "react-router-dom";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../Dashboard/PageMeta";

interface Document {
  id: number;
  documentCategory: string;
  documentType: string;
  documentAttachment: string;
  shipmentId: string;
  containerId: string;
  driver: string;
  customer: string;
  truck: string;
  status: 'Approved' | 'Pending' | 'Rejected';
}

// Function to get and map document data from JSON
const getDocumentsData = (): Document[] => {
  if (!documentsData || !documentsData.documents) return [];
  
  return documentsData.documents.map(doc => ({
    id: doc.id || 0,
    documentCategory: doc.documentCategory || 'N/A',
    documentType: doc.documentType || 'N/A',
    documentAttachment: doc.documentAttachment || 'N/A',
    shipmentId: doc.shipmentId || 'N/A',
    containerId: doc.containerId || 'N/A',
    driver: doc.driver || 'N/A',
    customer: doc.customer || 'N/A',
    truck: doc.truck || 'N/A',
    status: (doc.status as 'Approved' | 'Pending' | 'Rejected') || 'Pending'
  }));
};

export default function Documents() {
  const [documents, setDocuments] = useState<Document[]>([]);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  
  // Load document data on component mount
  useEffect(() => {
    const data = getDocumentsData();
    setDocuments(data);
  }, []);
  
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showApprovePopup, setShowApprovePopup] = useState(false);
  const [showRejectPopup, setShowRejectPopup] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const handleView = (id: number) => {
    console.log(`View document ${id}`);
    // Implement view logic
  };

  const handleDownload = (id: number) => {
    console.log(`Download document ${id}`);
    // Implement download logic
  };

  const handleApprove = () => {
    if (selectedDocument) {
      setDocuments(docs => 
        docs.map(doc => 
          doc.id === selectedDocument.id ? { ...doc, status: 'Approved' } : doc
        )
      );
      setSelectedDocument(null);
      setShowApprovePopup(false);
      console.log(`Approve document ${selectedDocument.id}`);
    }
  };

  const handleReject = () => {
    if (selectedDocument) {
      setDocuments(docs => 
        docs.map(doc => 
          doc.id === selectedDocument.id ? { ...doc, status: 'Rejected' } : doc
        )
      );
      setSelectedDocument(null);
      setRejectReason("");
      setShowRejectPopup(false);
      console.log(`Reject document ${selectedDocument.id}`);
    }
  };

  const handleDelete = () => {
    if (selectedDocument) {
      setDocuments(docs => docs.filter(doc => doc.id !== selectedDocument.id));
      setSelectedDocument(null);
      setShowDeletePopup(false);
      console.log(`Delete document ${selectedDocument.id}`);
    }
  };

  const getFileIcon = (fileName: string) => {
    if (fileName.endsWith('.pdf')) {
      return <DocumentTextIcon className="w-5 h-5 text-red-500" />;
    }
    if (fileName.endsWith('.jpg') || fileName.endsWith('.png') || fileName.endsWith('.jpeg')) {
      return <PhotoIcon className="w-5 h-5 text-blue-500" />;
    }
    return <DocumentIcon className="w-5 h-5 text-gray-500" />;
  };

  const getStatusBadge = (status: Document['status']) => {
    const baseClass = "px-2 py-1 rounded-full text-xs font-medium";
    switch(status) {
      case 'Approved':
        return <span className={`${baseClass} bg-green-100 text-green-800`}>Approved</span>;
      case 'Pending':
        return <span className={`${baseClass} bg-yellow-100 text-yellow-800`}>Pending</span>;
      case 'Rejected':
        return <span className={`${baseClass} bg-red-100 text-red-800`}>Rejected</span>;
      default:
        return null;
    }
  };

  // Pagination logic
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = documents.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(documents.length / recordsPerPage);

  return (
    <>
      <PageMeta
        title="Documents Management | CMS Dashboard"
        description="Manage and review all documents"
      />
      <PageBreadcrumb pageTitle="Documents Management" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        {/* Header with Add Button */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 lg:mb-7">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              View Documents
            </h1>
            <p className="text-gray-600 mt-2">Manage and review all documents</p>
          </div>
          <Link to="/add-document">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 w-full sm:w-auto justify-center">
              <PlusIcon className="w-5 h-5" />
              Add Document
            </button>
          </Link>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Document Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Document Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Document / Attachment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Shipment ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Container ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Driver
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Truck
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentRecords.map((doc) => (
                  <tr key={doc.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{doc.documentCategory}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{doc.documentType}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {getFileIcon(doc.documentAttachment)}
                        <span 
                          className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer"
                          onClick={() => handleView(doc.id)}
                        >
                          {doc.documentAttachment}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{doc.shipmentId}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{doc.containerId}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{doc.driver}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{doc.customer}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{doc.truck}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(doc.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        {/* View Button */}
                        <div className="relative group">
                         <Link to="/view-document">
                          <button
                            onClick={() => handleView(doc.id)}
                            className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md"
                            title="View"
                          >
                            <EyeIcon className="w-4 h-4" />
                          </button>
                            </Link>
                          <span className="absolute left-1/2 -bottom-6 -translate-x-1/2 text-xs text-black px-2 py-1 opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap">
                            View
                          </span>
                        </div>
                        
                        {/* Download Button */}
                        <div className="relative group">
                          <button
                            onClick={() => handleDownload(doc.id)}
                            className="p-1.5 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-md"
                            title="Download"
                          >
                            <ArrowDownTrayIcon className="w-4 h-4" />
                          </button>
                          <span className="absolute left-1/2 -bottom-6 -translate-x-1/2 text-xs text-black px-2 py-1 opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap">
                            Download
                          </span>
                        </div>
                        
                        {/* Approve Button - Only if not already approved */}
                        {doc.status !== 'Approved' && (
                          <div className="relative group">
                            <button
                              onClick={() => {
                                setSelectedDocument(doc);
                                setShowApprovePopup(true);
                              }}
                              className="p-1.5 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-md"
                              title="Approve"
                            >
                              <CheckCircleIcon className="w-4 h-4" />
                            </button>
                            <span className="absolute left-1/2 -bottom-6 -translate-x-1/2 text-xs text-black px-2 py-1 opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap">
                              Approve
                            </span>
                          </div>
                        )}
                        
                        {/* Reject Button - Only if not already rejected */}
                        {doc.status !== 'Rejected' && (
                          <div className="relative group">
                            <button
                              onClick={() => {
                                setSelectedDocument(doc);
                                setShowRejectPopup(true);
                              }}
                              className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md"
                              title="Reject"
                            >
                              <XCircleIcon className="w-4 h-4" />
                            </button>
                            <span className="absolute left-1/2 -bottom-6 -translate-x-1/2 text-xs text-black px-2 py-1 opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap">
                              Reject
                            </span>
                          </div>
                        )}
                        
                        {/* Delete Button - Only if not approved */}
                        {doc.status !== 'Approved' && (
                          <div className="relative group">
                            <button
                              onClick={() => {
                                setSelectedDocument(doc);
                                setShowDeletePopup(true);
                              }}
                              className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md"
                              title="Delete"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                            <span className="absolute left-1/2 -bottom-6 -translate-x-1/2 text-xs text-black px-2 py-1 opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap">
                              Delete
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {documents.length === 0 && (
            <div className="text-center py-12">
              <DocumentIcon className="w-12 h-12 text-gray-400 mx-auto" />
              <h3 className="mt-4 text-sm font-medium text-gray-900">No documents</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by uploading a new document.</p>
            </div>
          )}

          {/* Pagination Controls */}
          {documents.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">
                    Showing {indexOfFirstRecord + 1} to {Math.min(indexOfLastRecord, documents.length)} of {documents.length} documents
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
                          className={`px-3 py-1 border rounded text-sm ${
                            currentPage === pageNumber
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
            </div>
          )}
        </div>
      </div>

      {/* Approve Confirmation Popup */}
      {showApprovePopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-96">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Approve Document?</h2>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to approve <b>{selectedDocument?.documentAttachment}</b>?
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                onClick={() => setShowApprovePopup(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                onClick={handleApprove}
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Confirmation Popup */}
      {showRejectPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-96">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Reject Document?</h2>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to reject <b>{selectedDocument?.documentAttachment}</b>?
            </p>
            <div className="mb-4">
              <textarea
                placeholder="Reason for rejection (optional)"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                rows={3}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                onClick={() => setShowRejectPopup(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                onClick={handleReject}
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Popup */}
      {showDeletePopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-96">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Delete Document?</h2>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to delete <b>{selectedDocument?.documentAttachment}</b>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                onClick={() => setShowDeletePopup(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}