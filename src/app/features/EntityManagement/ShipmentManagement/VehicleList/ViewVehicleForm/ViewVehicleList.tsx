// src/NewPages/ViewVehicleList.tsx
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from 'react-i18next';

interface VehicleData {
  id: string;
  shipmentId: string;
  vinNumber: string;
  make: string;
  model: string;
  modelYear: string;
  color: string;
  vehicleValue: string;
  status: "In Transit" | "Delivered" | "Pending" | "Damaged";
  addedDate: string;
}

export default function ViewVehicleList() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();

  // Mock data - in real app, this would come from an API
  const [vehicleData] = useState<VehicleData>({
    id: id || "1",
    shipmentId: "SHP-00125",
    vinNumber: "12345678912345678",
    make: "Honda",
    model: "Civic",
    modelYear: "2024",
    color: "Silver",
    vehicleValue: "200000",
    status: "In Transit",
    addedDate: "2024-03-15"
  });

  const getStatusBadge = (status: VehicleData['status']) => {
    const baseClass = "px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case 'In Transit':
        return <span className={`${baseClass} bg-blue-100 text-blue-800`}>{t('inTransit')}</span>;
      case 'Delivered':
        return <span className={`${baseClass} bg-green-100 text-green-800`}>{t('delivered')}</span>;
      case 'Pending':
        return <span className={`${baseClass} bg-yellow-100 text-yellow-800`}>{t('pending')}</span>;
      case 'Damaged':
        return <span className={`${baseClass} bg-red-100 text-red-800`}>{t('damaged')}</span>;
      default:
        return <span className={`${baseClass} bg-gray-100 text-gray-800`}>{t('unknown')}</span>;
    }
  };

  const formatVehicleValue = (value: string) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(Number(value));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-center relative">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 text-center">
            {t('viewVehicleDetails')}
          </h1>
        </div>

        {/* Vehicle Details Card */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {/* Details Grid */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Shipment ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('shipmentId')}
                </label>
                <div className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50">
                  <span className="text-gray-900">{vehicleData.shipmentId}</span>
                </div>
              </div>

              {/* VIN Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('vinNumber')}
                </label>
                <div className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 font-mono">
                  <span className="text-gray-900">{vehicleData.vinNumber}</span>
                </div>
              </div>

              {/* Make */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('make')}
                </label>
                <div className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50">
                  <span className="text-gray-900">{vehicleData.make}</span>
                </div>
              </div>

              {/* Model */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('model')}
                </label>
                <div className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50">
                  <span className="text-gray-900">{vehicleData.model}</span>
                </div>
              </div>

              {/* Model Year */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('modelYear')}
                </label>
                <div className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50">
                  <span className="text-gray-900">{vehicleData.modelYear}</span>
                </div>
              </div>

              {/* Color */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('color')}
                </label>
                <div className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50">
                  <span className="text-gray-900">{vehicleData.color || t('notSpecified')}</span>
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('status')}
                </label>
                <div className="w-full px-4 py-2.5">
                  {getStatusBadge(vehicleData.status)}
                </div>
              </div>

              {/* Added Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('addedDate')}
                </label>
                <div className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50">
                  <span className="text-gray-900">{vehicleData.addedDate}</span>
                </div>
              </div>

              {/* Vehicle Value */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('vehicleValue')}
                </label>
                <div className="relative w-full md:w-1/2">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    {t('aed')}
                  </div>
                  <div className="w-full pl-12 pr-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50">
                    <span className="text-gray-900 font-medium">
                      {formatVehicleValue(vehicleData.vehicleValue)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}