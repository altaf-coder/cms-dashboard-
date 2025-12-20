import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface ReportData {
  id: string;
  truckNo: string;
  vendorId: string;
  registrationExpiry: string;
  insuranceExpiry: string;
  status: string;
  documents: {
    name: string;
    file: File | null;
  } | null;
  [key: string]: any;
}

export default function ViewTruck() {
    const { t } = useTranslation();
    const [formData] = useState<ReportData>({
        id: '1',
        truckId: 'T-CMS-0001',
        truckNo: 'SHJ 12345',
        vendorId: 'VENDOR-001',
        registrationExpiry: '2024-12-31',
        insuranceExpiry: '2024-12-31',
        capacity: '25',
        vehicleType: 'Trailer',
        status: 'Available',
        documents: null,
        requiredBy: '2024-06-30',
        approvalStatus: 'approved',
        notes: 'Regular maintenance required every 5000 km',
        assignedTruck: 'truck-001',
        assignedVendor: 'vendor-001',
        addedBy: 'John Doe'
    });

    // Removed unused fileInputRef

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
                {/* Header */}
                <div className="bg-white p-6 border-b">
                    <h1 className="text-2xl font-bold text-center text-gray-800">{t('viewTruck')}</h1>
                    <p className="text-center text-gray-600 mt-2">{t('truckInformationAndSpecifications')}</p>
                </div>

                <div className="p-6">
                    {/* Truck ID + Truck No */}
                    <div className="mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('truckId')}
                                </label>
                                <div className="border border-gray-300 rounded px-3 py-2 bg-gray-50">
                                    <span className="text-gray-700 font-medium">{formData.truckId}</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('truckNoPlateNo')}
                                </label>
                                <div className="border border-gray-300 rounded px-3 py-2 bg-gray-50">
                                    <span className="text-gray-700 font-medium">{formData.truckNo}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* PERSONAL INFO */}
                    <div className="mb-6">
                        <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">{t('truckInformation')}</h2>

                        {/* Vendor + Reg */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('vendorId')}
                                </label>
                                <div className="border border-gray-300 rounded px-3 py-2 bg-gray-50">
                                    <span className="text-gray-700 font-medium">{formData.vendorId}</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('registrationExpiry')}
                                </label>
                                <div className="border border-gray-300 rounded px-3 py-2 bg-gray-50">
                                    <span className="text-gray-700 font-medium">{formData.registrationExpiry}</span>
                                </div>
                            </div>
                        </div>

                        {/* Insurance + Capacity */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('insuranceExpiry')}
                                </label>
                                <div className="border border-gray-300 rounded px-3 py-2 bg-gray-50">
                                    <span className="text-gray-700 font-medium">{formData.insuranceExpiry}</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('capacityTons')}
                                </label>
                                <div className="border border-gray-300 rounded px-3 py-2 bg-gray-50">
                                    <span className="text-gray-700 font-medium">{formData.capacity} {t('tons')}</span>
                                </div>
                            </div>
                        </div>

                        {/* Vehicle Type + Status */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('vehicleType')}
                                </label>
                                <div className="border border-gray-300 rounded px-3 py-2 bg-gray-50">
                                    <span className="text-gray-700 font-medium">{formData.vehicleType}</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('status')}
                                </label>
                                <div className="border border-gray-300 rounded px-3 py-2 bg-gray-50">
                                    <span className={`font-medium ${
                                        formData.status === 'Available' ? 'text-gray-600' :
                                        formData.status === 'On Trip' ? 'text-blue-600' :
                                        formData.status === 'Maintenance' ? 'text-yellow-600' :
                                        'text-red-600'
                                    }`}>
                                        {formData.status === 'Available' ? t('available') :
                                         formData.status === 'On Trip' ? t('onTrip') :
                                         formData.status === 'Maintenance' ? t('maintenance') :
                                         formData.status}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Documents */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('documents')}
                                </label>
                                <div className="border border-gray-300 rounded px-3 py-2 bg-gray-50">
                                    <div className="flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <span className="text-gray-700">
                                            {formData.documents ? formData.documents.name : 'truck_documents.pdf'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Added by Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('addedBy')}
                                </label>
                                <div className="border border-gray-300 rounded px-3 py-2 bg-gray-50">
                                    <span className="text-gray-700 font-medium">{formData.addedBy}</span>
                                </div>
                            </div>
                        </div>

                        {/* Required By Date */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 mt-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('requiredByDate')}
                                </label>
                                <div className="border border-gray-300 rounded px-3 py-2 bg-gray-50">
                                    <span className="text-gray-700 font-medium">{formData.requiredBy}</span>
                                </div>
                            </div>

                            {/* Approval Status */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('approvalStatus')}
                                </label>
                                <div className="border border-gray-300 rounded px-3 py-2 bg-gray-50">
                                    <span className={`font-medium ${
                                        formData.approvalStatus === 'approved' ? 'text-gray-600' :
                                        formData.approvalStatus === 'pending' ? 'text-gray-600' :
                                        'text-red-600'
                                    }`}>
                                        {formData.approvalStatus === 'approved' ? t('approved') :
                                         formData.approvalStatus === 'pending' ? t('pending') :
                                         formData.approvalStatus === 'rejected' ? t('rejected') :
                                         formData.approvalStatus.charAt(0).toUpperCase() + formData.approvalStatus.slice(1)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Notes */}
                        <div className="">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                             <label className="block text-sm font-medium text-gray-700 mb-1">
                               {t('notesOptional')}
                            </label>
                            </label>
                           
                        </div>
                    </div>

                    {/* Assigned Truck & Vendor */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t('assignedTruck')}
                            </label>
                            <div className="border border-gray-300 rounded px-3 py-2 bg-gray-50">
                                <span className="text-gray-700 font-medium">{formData.assignedTruck}</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t('assignedVendor')}
                            </label>
                            <div className="border border-gray-300 rounded px-3 py-2 bg-gray-50">
                                <span className="text-gray-700 font-medium">{formData.assignedVendor}</span>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    {/* <div className="flex justify-center space-x-4 pt-6 border-t">
                        <button
                            onClick={() => window.print()}
                            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                            </svg>
                            Print Details
                        </button>
                        <button
                            onClick={() => window.history.back()}
                            className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors flex items-center"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to List
                        </button>
                        <button
                            onClick={() => {}}
                            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors flex items-center"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit Truck
                        </button>
                    </div> */}
                </div>
            </div>
        </div>
    );
}