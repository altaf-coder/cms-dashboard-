import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { CalendarIcon } from '@heroicons/react/24/outline';

// Mock data for viewing
const viewJobData = {
  jobId: "J-CMS-003",
  shipmentId: "SHP-00125",
  containerNo: "ABCD1234567",
  customer: "Al-Futtaim Motors",
  vendorId: "VND-001",
  vendorName: "SpeedTrans LLC",
  driverId: "D001",
  driverName: "Ahmed Hassan",
  truckId: "TRK-7890",
  truckPlate: "DXB-7890",
  jobType: "Pickup",
  pickupLocation: "Jebel Ali Port, Terminal 4, Gate 7, Dubai, UAE",
  dropLocation: "",
  jobDateTime: "2025-11-28T10:00",
  portLastReturnDate: "30 Nov 2025",
  specialInstructions: "Please ensure container seals are intact before pickup. Customer representative will be available at gate 4. Special handling required for fragile items.",
  status: "Assigned",
  createdDate: "2025-11-27",
  createdBy: "John Smith (Admin)",
  lastUpdated: "2025-11-27 14:30",
  estimatedDuration: "2 hours",
  priority: "Medium",
  notes: "Customer requested morning delivery if possible"
};

// Helper functions
const formatDateForDisplay = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export default function ViewJob() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => navigate('/jobs')}
                  className="text-gray-400 hover:text-gray-600"
                >
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{t('viewJobDetails')}</h1>
                  <p className="text-sm text-gray-600 mt-1">{t('completeTransportationJobInformation')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <form className="p-6 space-y-6">
            {/* Basic Information Section - FIXED ALIGNMENT */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('basicInformation')}</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column - All single line fields */}
                <div className="space-y-5">
                  {/* Job ID */}
                  <div className="h-[70px]">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('jobId')}
                    </label>
                    <input
                      type="text"
                      value={viewJobData.jobId}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900"
                    />
                  </div>

                  {/* Shipment */}
                  <div className="h-[70px]">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('shipmentId')}
                    </label>
                    <input
                      type="text"
                      value={viewJobData.shipmentId}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900"
                    />
                  </div>

                  {/* Container No. */}
                  <div className="h-[70px]">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('containerNo')}
                    </label>
                    <input
                      type="text"
                      value={viewJobData.containerNo}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900 font-mono"
                    />
                  </div>

                  {/* Customer */}
                  <div className="h-[70px]">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('customer')}
                    </label>
                    <input
                      type="text"
                      value={viewJobData.customer}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900"
                    />
                  </div>
                </div>

                {/* Right Column - Fields with ID lines */}
                <div className="space-y-5">
                  {/* Vendor - Fixed height to match left */}
                  <div className="h-[70px]">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('vendor')}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={viewJobData.vendorName}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900"
                      />
                      <div className="absolute top-2 right-3">
                        <span className="text-xs text-gray-500">{t('id')}: {viewJobData.vendorId}</span>
                      </div>
                    </div>
                  </div>

                  {/* Driver - Fixed height to match left */}
                  <div className="h-[70px]">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('driver')}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={viewJobData.driverName}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900"
                      />
                      <div className="absolute top-2 right-3">
                        <span className="text-xs text-gray-500">{t('id')}: {viewJobData.driverId}</span>
                      </div>
                    </div>
                  </div>

                  {/* Truck - Fixed height to match left */}
                  <div className="h-[70px]">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('truck')}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={viewJobData.truckPlate}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900"
                      />
                      <div className="absolute top-2 right-3">
                        <span className="text-xs text-gray-500">{t('id')}: {viewJobData.truckId}</span>
                      </div>
                    </div>
                  </div>

                  {/* Job Type - Fixed height to match left */}
                  <div className="h-[70px]">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('jobType')}
                    </label>
                    <input
                      type="text"
                      value={viewJobData.jobType === 'Pickup' ? t('pickup') : viewJobData.jobType === 'Delivery' ? t('delivery') : viewJobData.jobType}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Job Details Section */}
            <div className="border-t pt-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('jobDetails')}</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-5">
                  {/* Pickup Location */}
                  {viewJobData.jobType === "Pickup" && (
                    <div className="h-[70px]">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('pickupLocation')}
                      </label>
                      <input
                        type="text"
                        value={viewJobData.pickupLocation}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900"
                      />
                    </div>
                  )}

                  {/* Drop Location */}
                  {viewJobData.jobType === "Delivery" && viewJobData.dropLocation && (
                    <div className="h-[70px]">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('dropLocation')}
                      </label>
                      <input
                        type="text"
                        value={viewJobData.dropLocation}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900"
                      />
                    </div>
                  )}

                  {/* Port Last Return Date */}
                  <div className="h-[70px]">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('portLastReturnDate')}
                    </label>
                    <input
                      type="text"
                      value={viewJobData.portLastReturnDate}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900"
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-5">
                  {/* Scheduled Date & Time */}
                  <div className="h-[70px]">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('scheduledDateAndTime')}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formatDateForDisplay(viewJobData.jobDateTime)}
                        readOnly
                        className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md bg-gray-50 text-gray-900"
                      />
                      <CalendarIcon 
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                      />
                    </div>
                  </div>

                  {/* Estimated Duration */}
                  <div className="h-[70px]">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('estimatedDuration')}
                    </label>
                    <input
                      type="text"
                      value={viewJobData.estimatedDuration}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900"
                    />
                  </div>

                  {/* Priority */}
                  <div className="h-[70px]">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('priority')}
                    </label>
                    <input
                      type="text"
                      value={viewJobData.priority}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900"
                    />
                  </div>
                </div>
              </div>

              {/* Special Instructions */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('specialInstructions')}
                </label>
                <div className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50 min-h-[100px]">
                  <p className="text-gray-900 whitespace-pre-line">
                    {viewJobData.specialInstructions || t('noSpecialInstructionsProvided')}
                  </p>
                </div>
              </div>

              {/* Additional Notes */}
              {viewJobData.notes && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('additionalNotes')}
                  </label>
                  <div className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                    <p className="text-gray-900">{viewJobData.notes}</p>
                  </div>
                </div>
              )}
            </div>

            {/* System Information Section */}
            <div className="border-t pt-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('systemInformation')}</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="h-[70px]">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('createdDate')}
                  </label>
                  <input
                    type="text"
                    value={viewJobData.createdDate}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900"
                  />
                </div>
                
                <div className="h-[70px]">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('createdBy')}
                  </label>
                  <input
                    type="text"
                    value={viewJobData.createdBy}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900"
                  />
                </div>
                
                <div className="h-[70px]">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('lastUpdated')}
                  </label>
                  <input
                    type="text"
                    value={viewJobData.lastUpdated}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900"
                  />
                </div>
              </div>
            </div>
          </form>
      </div>
      </div>
    </div>
  );
}