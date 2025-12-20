import { useState } from "react";
import { EyeIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';

interface Vehicle {
  id: string;
  shipmentId: string;
  vin: string;
  make: string;
  model: string;
  modelYear: number;
  color: string;
  vehicleValue: string;
}

const vehiclesData: Vehicle[] = [
  {
    id: "VEH-001",
    shipmentId: "SHP-00125",
    vin: "12345678912345678",
    make: "Honda",
    model: "Civic",
    modelYear: 2024,
    color: "",
    vehicleValue: "AED 200,000"
  },
  {
    id: "VEH-002",
    shipmentId: "SHP-00125",
    vin: "98765432198765432",
    make: "Toyota",
    model: "Camry",
    modelYear: 2023,
    color: "Silver",
    vehicleValue: "AED 185,000"
  },
  {
    id: "VEH-003",
    shipmentId: "SHP-00125",
    vin: "54321678901234567",
    make: "Ford",
    model: "Explorer",
    modelYear: 2024,
    color: "Black",
    vehicleValue: "AED 320,000"
  }
];

export default function VehicleList() {
  const { t } = useTranslation();
  const [vehicles, setVehicles] = useState<Vehicle[]>(vehiclesData);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<Vehicle | null>(null);

  // Delete vehicle function
  const handleDelete = () => {
    if (vehicleToDelete) {
      setVehicles(prev => prev.filter(vehicle => vehicle.id !== vehicleToDelete.id));
      setShowDeletePopup(false);
      setVehicleToDelete(null);
    }
  };

  return (
    <div className="overflow-hidden mt-8 w-full rounded-xl border border-gray-200 bg-white shadow-sm">
      
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-800">{t('vehicleList')}</h2>
            <p className="text-sm text-gray-600 mt-1">
              {t('shipmentId')}: <span className="font-semibold text-blue-600">SHP-00125</span>
            </p>
          </div>
          <Link to="/add-vehicle">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
              <span className="text-xl">+</span> {t('addVehicle')}
            </button>
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                {t('shipmentId')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                {t('vinNumber')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                {t('make')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                {t('model')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                {t('modelYear')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                {t('color')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                {t('vehicleValue')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                {t('action')}
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {vehicles.map((vehicle) => (
              <tr key={vehicle.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="font-medium text-gray-900">{vehicle.shipmentId}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                    {vehicle.vin}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="font-medium">{vehicle.make}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {vehicle.model}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-sm">
                    {vehicle.modelYear}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {vehicle.color || (
                    <span className="text-gray-400 italic">-</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="font-bold text-green-600">{vehicle.vehicleValue}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-">
                    
                    {/* View Button */}
                    <div className="relative group">
                      <Link 
                        to={`/view-vehicle-list/${vehicle.id}`}
                        className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors block"
                      >
                        <EyeIcon className="w-5 h-5" />
                      </Link>
                      {/* Tooltip below icon on hover */}
                      <div className="absolute left-1/2 transform -translate-x-1/2 top-full mt-1 px-2 py-1  text-black text-xs  opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                        {t('view')}
                        <div className="absolute left-1/2 transform -translate-x-1/2 -top-1 w-0 h-0  "></div>
                      </div>
                    </div>

                    {/* Edit Button */}
                    <div className="relative group">
                      <Link 
                        to={`/edit-vehicle-list/${vehicle.id}`}
                        className="p-1.5 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors block"
                      >
                        <PencilIcon className="w-5 h-5" />
                      </Link>
                      {/* Tooltip below icon on hover */}
                      <div className="absolute left-1/2 transform -translate-x-1/2 top-full mt-1 px-2 py-1 text-black text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                        {t('editVehicle')}
                        <div className="absolute left-1/2 transform -translate-x-1/2 -top-1 w-0 h-0 border-l-2 border-r-2 border-b-2 border-l-transparent border-r-transparent border-b-gray-900"></div>
                      </div>
                    </div>

                    {/* Delete Button */}
                    <div className="relative group">
                      <button
                        onClick={() => {
                          setVehicleToDelete(vehicle);
                          setShowDeletePopup(true);
                        }}
                        className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                      {/* Tooltip below icon on hover */}
                      <div className="absolute left-1/2 transform -translate-x-1/2 top-full mt-1 px-2 py-1 text-black text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                        {t('deleteVehicle')}
                        <div className="absolute left-1/2 transform -translate-x-1/2 -top-1 w-0 h-0 border-l-2 border-r-2 border-b-2 border-l-transparent border-r-transparent border-b-gray-900"></div>
                      </div>
                    </div>

                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {vehicles.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">{t('noVehiclesFoundInShipment')}</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div className="text-sm text-gray-600">
          {t('showingVehiclesInShipment', { count: vehicles.length, shipmentId: 'SHP-00125' })}
        </div>
      </div>

      {/* Delete Confirmation Popup */}
      {showDeletePopup && vehicleToDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 p-6">
            <div className="text-center">
              {/* Warning Icon */}
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <TrashIcon className="h-6 w-6 text-red-600" />
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t('deleteVehicle')}
              </h3>
              
              <p className="text-gray-600 mb-6">
                {t('deleteVehicleConfirm')}{" "}
                <span className="font-semibold text-gray-900">
                  {vehicleToDelete.make} {vehicleToDelete.model}
                </span>
                ?
              </p>

              <div className="flex justify-center gap-4">
                <button
                  onClick={() => {
                    setShowDeletePopup(false);
                    setVehicleToDelete(null);
                  }}
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {t('cancel')}
                </button>
                <button
                  onClick={handleDelete}
                  className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  {t('yesDelete')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}