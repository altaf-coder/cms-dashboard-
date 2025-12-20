import { useState } from 'react';
import { useTranslation } from 'react-i18next';

// Types matching the form
type Vehicle = {
  chassisNumber: string;
  make: string;
  model: string;
  modelYear: string;
  color: string;
  value: string;
};

type Container = {
  containerNo: string;
  containerSize: string;
  sealNumber: string;
  lastFreeDate: string;
  returnDeadline: string;
  manifestCopy: File | null;
};

type ShipmentData = {
  shipmentId: string;
  customer: string;
  billOfLadingNo: string;
  billOfLadingDoc: File | null;
  portOfArrival: string;
  etaDate: string;
  etaTime: string;
  numberOfVehicles: string;
  shipmentType: string;
  status: string;
  doIssued: boolean;
  doNumber: string;
  doIssueDate: string;
  doExpiryDate: string;
  doCopy: File | null;
  doIssuedBy: string;
  containerShipment: boolean;
  importCustomsNo: string;
  customsDeclaration: File | null;
  feeReceipt: File | null;
  inspectionRequired: string;
  inspectionDate: string;
  inspectionPassed: string;
  remarks: string;
  customsDeposit: string;
  portCharges: string;
  shippingLineCharges: string;
  demurrageApplicable: string;
  demurrageDays: string;
  demurrageAmount: string;
  cargoDescription: string;
};

// Mock data - replace with your actual data
const mockShipmentData: ShipmentData = {
  shipmentId: 'SH-123456',
  customer: 'cust1',
  billOfLadingNo: 'BL12345',
  billOfLadingDoc: null,
  portOfArrival: 'Jebel Ali',
  etaDate: '2024-12-15',
  etaTime: '14:30',
  numberOfVehicles: '2',
  shipmentType: 'RORO',
  status: 'pending',
  doIssued: true,
  doNumber: 'DO-789012',
  doIssueDate: '2024-12-01',
  doExpiryDate: '2024-12-31',
  doCopy: null,
  doIssuedBy: 'Maersk Line',
  containerShipment: true,
  importCustomsNo: 'CUST456789',
  customsDeclaration: null,
  feeReceipt: null,
  inspectionRequired: 'yes',
  inspectionDate: '2024-12-16',
  inspectionPassed: 'yes',
  remarks: 'Handle with care. High-value shipment.',
  customsDeposit: '5000',
  portCharges: '2500',
  shippingLineCharges: '3000',
  demurrageApplicable: 'no',
  demurrageDays: '',
  demurrageAmount: '',
  cargoDescription: '2 Toyota SUVs, Model Year 2023'
};

const mockVehicles: Vehicle[] = [
  {
    chassisNumber: 'JTEBU5JR9J5123456',
    make: 'Toyota',
    model: 'Land Cruiser',
    modelYear: '2023',
    color: 'White',
    value: '250000'
  },
  {
    chassisNumber: 'JTEBU5JR9J5789012',
    make: 'Toyota',
    model: 'Prado',
    modelYear: '2023',
    color: 'Black',
    value: '180000'
  }
];

const mockContainers: Container[] = [
  {
    containerNo: 'MSKU1234567',
    containerSize: '40',
    sealNumber: 'SEAL12345',
    lastFreeDate: '2024-12-20',
    returnDeadline: '2024-12-25',
    manifestCopy: null
  }
];

// Helper function to get customer name by ID
const getCustomerName = (id: string) => {
  const customers = [
    { id: 'cust1', name: 'ABC Trading LLC' },
    { id: 'cust2', name: 'XYZ Motors FZE' },
    { id: 'cust3', name: 'Global Auto Importers' },
    { id: 'cust4', name: 'Middle East Car Distributors' }
  ];
  return customers.find(c => c.id === id)?.name || id;
};

// Helper function to get status display text
const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    'pending': 'Pending',
    'in-transit': 'In-Transit',
    'arrived': 'Arrived',
    'docs-pending': 'Docs Pending',
    'under-clearance': 'Under Clearance',
    'released': 'Released',
    'delivered': 'Delivered',
    'closed': 'Closed'
  };
  return statusMap[status] || status;
};

export default function ViewShipment() {
  const { t } = useTranslation();
  const [shipmentData] = useState<ShipmentData>(mockShipmentData);
  const [vehicles] = useState<Vehicle[]>(mockVehicles);
  const [containers] = useState<Container[]>(mockContainers);

 

  const formatDateTime = (date: string, time: string) => {
    if (!date) return 'N/A';
    const dateObj = new Date(date);
    const formattedDate = dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    return time ? `${formattedDate} at ${time}` : formattedDate;
  };

  const formatCurrency = (amount: string) => {
    if (!amount) return 'N/A';
    return `AED ${parseInt(amount).toLocaleString()}`;
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-md p-6">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">{t('shipmentDetails')}</h1>
            <p className="text-gray-600 mt-2">{t('shipmentInformationAndSpecifications')}</p>
          </div>
          

          <div className="space-y-8">
            {/* Shipment Information Section */}
            <div className="border-b pb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('shipmentInformation')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">{t('shipmentId')}</label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-800 font-medium">{shipmentData.shipmentId}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">{t('customer')}</label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-800 font-medium">{getCustomerName(shipmentData.customer)}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">{t('billOfLadingNo')}</label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-800 font-medium">{shipmentData.billOfLadingNo}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">{t('portOfArrival')}</label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-800 font-medium">{shipmentData.portOfArrival}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">{t('eta')}</label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-800 font-medium">{formatDateTime(shipmentData.etaDate, shipmentData.etaTime)}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">{t('numberOfVehicles')}</label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-800 font-medium">{shipmentData.numberOfVehicles}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">{t('shipmentType')}</label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-800 font-medium">{shipmentData.shipmentType}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">{t('status')}</label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-800 font-medium">{getStatusText(shipmentData.status)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Vehicle Details Section */}
            {(shipmentData.shipmentType === 'RORO' || shipmentData.shipmentType === 'Containerized Cars') && vehicles.length > 0 && (
              <div className="border-b pb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('vehicleDetails')}</h3>
                <div className="space-y-4">
                  {vehicles.map((vehicle, index) => (
                    <div key={index} className="p-4 border rounded-lg bg-gray-50">
                      <h4 className="font-medium text-gray-700 mb-3">{t('vehicle')} {index + 1}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500">{t('chassisNumber')} (VIN)</label>
                          <div className="mt-1 p-2 bg-white rounded border border-gray-200">
                            <p className="text-gray-800 font-mono">{vehicle.chassisNumber}</p>
                          </div>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-gray-500">{t('make')}</label>
                          <div className="mt-1 p-2 bg-white rounded border border-gray-200">
                            <p className="text-gray-800">{vehicle.make}</p>
                          </div>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-gray-500">{t('model')}</label>
                          <div className="mt-1 p-2 bg-white rounded border border-gray-200">
                            <p className="text-gray-800">{vehicle.model}</p>
                          </div>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-gray-500">{t('modelYear')}</label>
                          <div className="mt-1 p-2 bg-white rounded border border-gray-200">
                            <p className="text-gray-800">{vehicle.modelYear}</p>
                          </div>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-gray-500">{t('color')}</label>
                          <div className="mt-1 p-2 bg-white rounded border border-gray-200">
                            <p className="text-gray-800">{vehicle.color || 'N/A'}</p>
                          </div>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-gray-500">{t('vehicleValue')}</label>
                          <div className="mt-1 p-2 bg-white rounded border border-gray-200">
                            <p className="text-gray-800">{vehicle.value ? formatCurrency(vehicle.value) : 'N/A'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Delivery Order Section */}
            {shipmentData.doIssued && (
              <div className="border-b pb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('deliveryOrder')} (DO)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">{t('doNumber')}</label>
                    <div className="mt-1 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-gray-800 font-medium">{shipmentData.doNumber}</p>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">{t('doIssueDate')}</label>
                    <div className="mt-1 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-gray-800 font-medium">{formatDateTime(shipmentData.doIssueDate, '')}</p>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">{t('doExpiryDate')}</label>
                    <div className="mt-1 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-gray-800 font-medium">{formatDateTime(shipmentData.doExpiryDate, '')}</p>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">{t('doIssuedBy')}</label>
                    <div className="mt-1 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-gray-800 font-medium">{shipmentData.doIssuedBy}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Container Information Section */}
            {shipmentData.containerShipment && containers.length > 0 && (
              <div className="border-b pb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('containerInformation')}</h3>
                <div className="space-y-4">
                  {containers.map((container, index) => (
                    <div key={index} className="p-4 border rounded-lg bg-gray-50">
                      <h4 className="font-medium text-gray-700 mb-3">{t('container')} {index + 1}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500">{t('containerNo')}</label>
                          <div className="mt-1 p-2 bg-white rounded border border-gray-200">
                            <p className="text-gray-800 font-mono">{container.containerNo}</p>
                          </div>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-gray-500">{t('containerSize')}</label>
                          <div className="mt-1 p-2 bg-white rounded border border-gray-200">
                            <p className="text-gray-800">{container.containerSize} {t('ft')}</p>
                          </div>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-gray-500">{t('sealNumber')}</label>
                          <div className="mt-1 p-2 bg-white rounded border border-gray-200">
                            <p className="text-gray-800">{container.sealNumber || 'N/A'}</p>
                          </div>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-gray-500">{t('lastFreeDate')} (LFD)</label>
                          <div className="mt-1 p-2 bg-white rounded border border-gray-200">
                            <p className="text-gray-800">{formatDateTime(container.lastFreeDate, '')}</p>
                          </div>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-gray-500">{t('returnDeadline')}</label>
                          <div className="mt-1 p-2 bg-white rounded border border-gray-200">
                            <p className="text-gray-800">{formatDateTime(container.returnDeadline, '')}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Customs Documents Section */}
            <div className="border-b pb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('customsDocuments')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">{t('importCustomsNo')}</label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-800 font-medium">{shipmentData.importCustomsNo}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">{t('inspectionRequired')}</label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-800 font-medium">{shipmentData.inspectionRequired === 'yes' ? t('yes') : t('no')}</p>
                  </div>
                </div>

                {shipmentData.inspectionRequired === 'yes' && (
                  <>
                    <div>
                      <label className="text-sm font-medium text-gray-500">{t('inspectionDate')}</label>
                      <div className="mt-1 p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-gray-800 font-medium">{formatDateTime(shipmentData.inspectionDate, '')}</p>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-500">{t('inspectionPassed')}</label>
                      <div className="mt-1 p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-gray-800 font-medium">{shipmentData.inspectionPassed === 'yes' ? t('yes') : t('no')}</p>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="mt-4">
                <label className="text-sm font-medium text-gray-500">{t('remarks')}</label>
                <div className="mt-1 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-gray-800 whitespace-pre-line">{shipmentData.remarks || t('noRemarks')}</p>
                </div>
              </div>
            </div>

            {/* Financial Section */}
            <div className="pb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('financialInformation')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">{t('customsDeposit')}</label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-800 font-medium">{formatCurrency(shipmentData.customsDeposit)}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">{t('portCharges')}</label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-800 font-medium">{formatCurrency(shipmentData.portCharges)}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">{t('shippingLineCharges')}</label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-800 font-medium">{formatCurrency(shipmentData.shippingLineCharges)}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">{t('demurrageApplicable')}</label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-800 font-medium">{shipmentData.demurrageApplicable === 'yes' ? t('yes') : t('no')}</p>
                  </div>
                </div>

                {shipmentData.demurrageApplicable === 'yes' && (
                  <>
                    <div>
                      <label className="text-sm font-medium text-gray-500">{t('demurrageDays')}</label>
                      <div className="mt-1 p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-gray-800 font-medium">{shipmentData.demurrageDays} {t('days')}</p>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-500">{t('demurrageAmount')}</label>
                      <div className="mt-1 p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-gray-800 font-medium">{formatCurrency(shipmentData.demurrageAmount)}</p>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="mt-4">
                <label className="text-sm font-medium text-gray-500">{t('cargoDescription')}</label>
                <div className="mt-1 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-gray-800 whitespace-pre-line">{shipmentData.cargoDescription || t('noDescription')}</p>
                </div>
              </div>
            </div>

          
          </div>
        </div>
      </div>
    </div>
  );
}