import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Validation functions
const validateBOLNo = (bolNo: string) => /^[A-Za-z0-9]{5,20}$/.test(bolNo);
const validateContainerNo = (containerNo: string) =>
  /^[A-Z]{4}\d{7}$/.test(containerNo.replace(/\s/g, ''));
const validateFileSize = (file: File | null, maxSizeMB: number) =>
  !file || file.size <= maxSizeMB * 1024 * 1024;

// Helper to generate shipment ID
const generateShipmentId = () => {
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `SH-${randomNum}`;
};

// Helper to generate T-CMS Container No
const generateTCMSContainerNo = (containerNo: string) => {
  if (!containerNo) return '';
  const now = new Date();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const year = now.getFullYear();
  return `T-CMS-${containerNo}-${month}-${year}`;
};

// Initial container object
const initialContainer = {
  containerNo: '',
  tCMSContainerNo: '',
  containerSize: '',
  containerWeight: '',
  sealNumber: '',
  containerType: '',
  shipper: '',
  consignee: ''
};

// Initial shipper object
const initialShipper = {
  name: '',
  address: '',
  telephone: '',
  email: '',
  fmcNumber: '',
  notes: ''
};

// Initial consignee object
const initialConsignee = {
  name: '',
  address: '',
  telephone: '',
  email: '',
  notes: ''
};

type Container = typeof initialContainer;
type Shipper = typeof initialShipper;
type Consignee = typeof initialConsignee;

export default function ShipmentForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Main form state
  const [formData, setFormData] = useState({
    shipmentId: generateShipmentId(),
    billOfLadingNo: '',
    billOfLadingDoc: null as File | null,
    portOfArrival: '',
    shippingLine: '',
    etaDate: '',
    status: t('pending')
  });

  const [containers, setContainers] = useState<Container[]>([{ ...initialContainer }]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [fileNames, setFileNames] = useState({
    billOfLadingDoc: ''
  });

  // States for shipper/consignee management
  const [showAddShipper, setShowAddShipper] = useState(false);
  const [showAddConsignee, setShowAddConsignee] = useState(false);
  const [newShipper, setNewShipper] = useState<Shipper>({ ...initialShipper });
  const [newConsignee, setNewConsignee] = useState<Consignee>({ ...initialConsignee });
  const [shippers, setShippers] = useState<Shipper[]>([
    { name: t('abcTradingLLC'), address: t('dubaiAddress'), telephone: '+971501234567', email: 'john@abctrading.com', fmcNumber: 'FMC-12345', notes: t('primaryShipper') },
    { name: t('globalLogisticsInc'), address: t('abuDhabiAddress'), telephone: '+971502345678', email: 'sarah@globallogistics.com', fmcNumber: 'FMC-67890', notes: t('airFreightSpecialist') }
  ]);
  const [consignees, setConsignees] = useState<Consignee[]>([
    { name: t('xyzMotorsFZE'), address: t('sharjahAddress'), telephone: '+971503456789', email: 'ahmed@xyzmotors.com', notes: t('autoPartsDistributor') },
    { name: t('middleEastDistributors'), address: t('ajmanAddress'), telephone: '+971504567890', email: 'mohammed@medistributors.com', notes: t('generalCargoReceiver') }
  ]);

  // States for popups
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showSaveContinuePopup, setShowSaveContinuePopup] = useState(false);

  // Refs for file inputs
  const bolDocRef = useRef<HTMLInputElement | null>(null);

  // Ports options
  const ports = [t('jebelAli'), t('khalifa'), t('ajman'), t('sharjah'), t('rasAlKhaimah'), t('fujairah')];
  const shippingLines = [
    t('maerskLine'), t('msc'), t('cmaCgm'), t('cosco'),
    t('hapagLloyd'), t('one'), t('evergreen'), t('hmm')
  ];

  // Status Options
  const statusOptions = [
    t('pending'), t('inTransit'), t('arrived'), t('docsPending'),
    t('underClearance'), t('released'), t('delivered'), t('closed')
  ];

  // Field validation
  const validateField = (name: string, value: any) => {
    switch (name) {
      case 'billOfLadingNo':
        if (!value) return t('bolRequired');
        if (!validateBOLNo(value)) return t('bolInvalidFormat');
        return '';
      case 'portOfArrival':
        return value ? '' : t('portRequired');
      case 'etaDate':
        if (!value) return t('etaRequired');
        const selectedDate = new Date(value);
        selectedDate.setHours(23, 59, 59, 999);
        if (selectedDate <= new Date()) {
          return t('etaMustBeFuture');
        }
        return '';
      default:
        return '';
    }
  };

  // Container validation
  const validateContainer = (container: Container, index: number) => {
    const containerErrors: string[] = [];

    if (!container.containerNo) {
      containerErrors.push(t('containerNoRequired', { containerNo: index + 1 }));
    } else if (!validateContainerNo(container.containerNo)) {
      containerErrors.push(t('containerNoInvalid', { containerNo: index + 1 }));
    }

    if (!container.containerSize) {
      containerErrors.push(t('containerSizeRequired', { containerNo: index + 1 }));
    }

    if (container.containerWeight && parseFloat(container.containerWeight) <= 0) {
      containerErrors.push(t('containerWeightInvalid', { containerNo: index + 1 }));
    }

    if (!container.containerType) {
      containerErrors.push(t('containerTypeRequired', { containerNo: index + 1 }));
    }

    // If container type is "Clearance", validate shipper and consignee
    if (container.containerType === t('clearance')) {
      if (!container.shipper) {
        containerErrors.push(t('shipperRequired', { containerNo: index + 1 }));
      }
      if (!container.consignee) {
        containerErrors.push(t('consigneeRequired', { containerNo: index + 1 }));
      }
    }

    return containerErrors;
  };

  // File validation
  const validateFiles = () => {
    const fileErrors: Record<string, string> = {};

    if (!formData.billOfLadingDoc) {
      fileErrors.billOfLadingDoc = t('bolDocRequired');
    } else if (!validateFileSize(formData.billOfLadingDoc, 10)) {
      fileErrors.billOfLadingDoc = t('fileSizeLimit');
    }

    return fileErrors;
  };

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    const errorMsg = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: errorMsg }));
  };

  // Handle date field changes
  const handleDateChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    const errorMsg = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: errorMsg }));
  };

  // Handle file input click
  const handleCustomFileClick = (ref: React.RefObject<HTMLInputElement | null>) => {
    if (ref.current) {
      ref.current.click();
    }
  };

  // Handle file uploads
  const handleFileChange = (name: string, file: File | null) => {
    setFormData(prev => ({ ...prev, [name]: file }));
    setFileNames(prev => ({ ...prev, [name]: file ? file.name : '' }));

    if (file && !validateFileSize(file, 10)) {
      setErrors(prev => ({ ...prev, [name]: t('fileSizeLimit') }));
    } else {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle container changes
  const handleContainerChange = (index: number, field: keyof Container, value: string) => {
    const updatedContainers = [...containers];

    if (field === 'containerNo') {
      updatedContainers[index] = {
        ...updatedContainers[index],
        [field]: value,
        tCMSContainerNo: generateTCMSContainerNo(value)
      };
    } else if (field === 'containerType') {
      updatedContainers[index] = {
        ...updatedContainers[index],
        [field]: value
      };

      // If Clearance is NOT selected, clear shipper and consignee
      if (value !== t('clearance')) {
        updatedContainers[index].shipper = '';
        updatedContainers[index].consignee = '';
      }
    } else {
      updatedContainers[index] = { ...updatedContainers[index], [field]: value };
    }

    setContainers(updatedContainers);

    // Clear container error when field is updated
    if (errors[`container_${index}`]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[`container_${index}`];
        return newErrors;
      });
    }
  };

  // Add new container
  const addContainer = () => {
    if (containers.length < 20) { // Maximum 20 containers
      setContainers([...containers, { ...initialContainer }]);
    }
  };

  // Remove container
  const removeContainer = (index: number) => {
    if (containers.length > 1) {
      const updatedContainers = [...containers];
      updatedContainers.splice(index, 1);
      setContainers(updatedContainers);
    }
  };

  // Add new shipper
  const handleAddShipper = () => {
    // Basic validation
    if (!newShipper.name.trim()) {
      alert(t('enterShipperName'));
      return;
    }
    if (!newShipper.address.trim()) {
      alert(t('enterShipperAddress'));
      return;
    }
    if (!newShipper.telephone.trim()) {
      alert(t('enterShipperTelephone'));
      return;
    }

    const addedShipper = { ...newShipper };
    setShippers([...shippers, addedShipper]);
    setNewShipper({ ...initialShipper });
    setShowAddShipper(false);

    // Auto-select the newly added shipper in all containers that have Clearance type
    const updatedContainers = containers.map(container => {
      if (container.containerType === t('clearance') && !container.shipper) {
        return { ...container, shipper: addedShipper.name };
      }
      return container;
    });
    setContainers(updatedContainers);
  };

  // Add new consignee
  const handleAddConsignee = () => {
    // Basic validation
    if (!newConsignee.name.trim()) {
      alert(t('enterConsigneeName'));
      return;
    }
    if (!newConsignee.address.trim()) {
      alert(t('enterConsigneeAddress'));
      return;
    }
    if (!newConsignee.telephone.trim()) {
      alert(t('enterConsigneeTelephone'));
      return;
    }

    const addedConsignee = { ...newConsignee };
    setConsignees([...consignees, addedConsignee]);
    setNewConsignee({ ...initialConsignee });
    setShowAddConsignee(false);

    // Auto-select the newly added consignee in all containers that have Clearance type
    const updatedContainers = containers.map(container => {
      if (container.containerType === t('clearance') && !container.consignee) {
        return { ...container, consignee: addedConsignee.name };
      }
      return container;
    });
    setContainers(updatedContainers);
  };

  // Open date picker
  const openDatePicker = (inputId: string) => {
    const dateInput = document.getElementById(inputId) as HTMLInputElement;
    if (dateInput) {
      dateInput.showPicker();
    }
  };

  // Validate entire form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validate main form fields
    Object.keys(formData).forEach(key => {
      if (key !== 'billOfLadingDoc') {
        const error = validateField(key, (formData as any)[key]);
        if (error) newErrors[key] = error;
      }
    });

    // Validate containers
    containers.forEach((container, index) => {
      const containerErrors = validateContainer(container, index);
      if (containerErrors.length > 0) {
        newErrors[`container_${index}`] = containerErrors.join(', ');
      }
    });

    // Validate files
    const fileErrors = validateFiles();
    Object.assign(newErrors, fileErrors);

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Save Shipment
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setShowSuccessPopup(true);
      console.log('Form data:', { formData, containers });

      // After 2 seconds, redirect to Shipment Management page
      setTimeout(() => {
        navigate('/container/shipment');
      }, 2000);
    } else {
      console.log('Validation errors:', errors);
    }
  };

  // Handle Save & Continue
  const handleSaveAndContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setShowSaveContinuePopup(true);
      console.log('Form data saved and continue to add vehicles:', { formData, containers });
    }
  };

  // Close success popup
  const handleCloseSuccessPopup = () => {
    setShowSuccessPopup(false);
    navigate('/container/shipment');
  };

  // Close save & continue popup
  const handleCloseSaveContinuePopup = () => {
    setShowSaveContinuePopup(false);
  };

  // Set minimum date for ETA (tomorrow)
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <div className="min-h-screen p-4 md:p-6 bg-gray-50">
      {/* Success Popup - for Save Shipment */}
      {showSuccessPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={handleCloseSuccessPopup}></div>
          <div className="relative z-10 bg-white rounded-xl shadow-2xl p-6 md:p-8 max-w-md w-full mx-4">
            <div className="flex justify-center mb-6">
              <div className="bg-green-100 rounded-full p-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-center text-gray-800 mb-2">{t('success')}</h3>
            <p className="text-gray-600 text-center mb-6 md:mb-8">
              {t('shipmentSaved')} <span className="font-semibold">{formData.shipmentId}</span>!
              <br />
              <span className="text-sm text-gray-500">{t('redirecting')}</span>
            </p>
            <div className="flex justify-center">
              <button
                onClick={handleCloseSuccessPopup}
                className="px-6 md:px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                {t('goToShipmentManagement')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Save & Continue Popup */}
      {showSaveContinuePopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={handleCloseSaveContinuePopup}></div>
          <div className="relative z-10 bg-white rounded-xl shadow-2xl p-6 md:p-8 max-w-md w-full mx-4">
            <div className="flex justify-center mb-6">
              <div className="bg-green-100 rounded-full p-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-center text-gray-800 mb-2">{t('shipmentSaved')}</h3>
            <p className="text-gray-600 text-center mb-6 md:mb-8">
              {t('shipmentSavedContinue')} <span className="font-semibold">{formData.shipmentId}</span>.<br />
              {t('redirectToAddVehicles')}
            </p>
            <div className="flex justify-center">
              <button
                onClick={handleCloseSaveContinuePopup}
                className="px-6 md:px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                {t('continue')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Shipper Popup */}
      {showAddShipper && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowAddShipper(false)}></div>
          <div className="relative z-10 bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-gray-800">{t('addNewShipper')}</h3>
                <p className="text-sm text-gray-600 mt-1">{t('fillShipperDetails')}</p>
              </div>
              <button
                onClick={() => setShowAddShipper(false)}
                className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Shipper Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('shipperName')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newShipper.name}
                      onChange={(e) => setNewShipper({ ...newShipper, name: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder={t('enterShipperNamePlaceholder')}
                      required
                    />
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('address')} <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={newShipper.address}
                      onChange={(e) => setNewShipper({ ...newShipper, address: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder={t('enterCompleteAddress')}
                      rows={4}
                      required
                    />
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-800">{t('contactInformation')}</h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t('telephone')} <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          value={newShipper.telephone}
                          onChange={(e) => setNewShipper({ ...newShipper, telephone: e.target.value })}
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="+971 50 123 4567"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t('email')}
                        </label>
                        <input
                          type="email"
                          value={newShipper.email}
                          onChange={(e) => setNewShipper({ ...newShipper, email: e.target.value })}
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="shipper@example.com"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* FMC Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('fmcNumber')}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={newShipper.fmcNumber}
                        onChange={(e) => setNewShipper({ ...newShipper, fmcNumber: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="FMC-12345"
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{t('optional')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('notes')}
                    </label>
                    <textarea
                      value={newShipper.notes}
                      onChange={(e) => setNewShipper({ ...newShipper, notes: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder={t('additionalNotesShipper')}
                      rows={4}
                    />
                    <p className="text-xs text-gray-500 mt-2">{t('shipperNotesHint')}</p>
                  </div>

                  {/* Preview Card */}
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">{t('shipperPreview')}</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex">
                        <span className="text-gray-600 w-24">{t('name')}:</span>
                        <span className="text-gray-800 font-medium">{newShipper.name || t('notProvided')}</span>
                      </div>
                      <div className="flex">
                        <span className="text-gray-600 w-24">{t('contact')}:</span>
                        <span className="text-gray-800">{newShipper.telephone || t('notProvided')}</span>
                      </div>
                      <div className="flex">
                        <span className="text-gray-600 w-24">{t('email')}:</span>
                        <span className="text-gray-800">{newShipper.email || t('notProvided')}</span>
                      </div>
                      <div className="flex">
                        <span className="text-gray-600 w-24">{t('fmcNumber')}:</span>
                        <span className="text-gray-800">{newShipper.fmcNumber || t('notProvided')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowAddShipper(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  {t('cancel')}
                </button>
                <button
                  onClick={handleAddShipper}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  {t('addShipper')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Consignee Popup */}
      {showAddConsignee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowAddConsignee(false)}></div>
          <div className="relative z-10 bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-gray-800">{t('addNewConsignee')}</h3>
                <p className="text-sm text-gray-600 mt-1">{t('fillConsigneeDetails')}</p>
              </div>
              <button
                onClick={() => setShowAddConsignee(false)}
                className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Consignee Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('consigneeName')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newConsignee.name}
                      onChange={(e) => setNewConsignee({ ...newConsignee, name: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder={t('enterConsigneeNamePlaceholder')}
                      required
                    />
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('address')} <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={newConsignee.address}
                      onChange={(e) => setNewConsignee({ ...newConsignee, address: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder={t('enterCompleteAddress')}
                      rows={4}
                      required
                    />
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-800">{t('contactInformation')}</h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t('telephone')} <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          value={newConsignee.telephone}
                          onChange={(e) => setNewConsignee({ ...newConsignee, telephone: e.target.value })}
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="+971 50 123 4567"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t('email')}
                        </label>
                        <input
                          type="email"
                          value={newConsignee.email}
                          onChange={(e) => setNewConsignee({ ...newConsignee, email: e.target.value })}
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="consignee@example.com"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('notes')}
                    </label>
                    <textarea
                      value={newConsignee.notes}
                      onChange={(e) => setNewConsignee({ ...newConsignee, notes: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder={t('additionalNotesConsignee')}
                      rows={8}
                    />
                    <p className="text-xs text-gray-500 mt-2">{t('consigneeNotesHint')}</p>
                  </div>

                  {/* Preview Card */}
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">{t('consigneePreview')}</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex">
                        <span className="text-gray-600 w-24">{t('name')}:</span>
                        <span className="text-gray-800 font-medium">{newConsignee.name || t('notProvided')}</span>
                      </div>
                      <div className="flex">
                        <span className="text-gray-600 w-24">{t('address')}:</span>
                        <span className="text-gray-800 line-clamp-1">{newConsignee.address || t('notProvided')}</span>
                      </div>
                      <div className="flex">
                        <span className="text-gray-600 w-24">{t('contact')}:</span>
                        <span className="text-gray-800">{newConsignee.telephone || t('notProvided')}</span>
                      </div>
                      <div className="flex">
                        <span className="text-gray-600 w-24">{t('email')}:</span>
                        <span className="text-gray-800">{newConsignee.email || t('notProvided')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Instructions */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-blue-700 mb-2">{t('importantInformation')}</h4>
                    <ul className="text-sm text-blue-600 space-y-1 list-disc list-inside">
                      <li>{t('consigneeReceiver')}</li>
                      <li>{t('ensureAccurateAddress')}</li>
                      <li>{t('contactInfoCrucial')}</li>
                      <li>{t('notesHelpDelivery')}</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowAddConsignee(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  {t('cancel')}
                </button>
                <button
                  onClick={handleAddConsignee}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  {t('addConsignee')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Form */}
      <div className={`max-w-6xl mx-auto ${showSuccessPopup || showSaveContinuePopup || showAddShipper || showAddConsignee ? 'filter blur-sm' : ''}`}>
        <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
          <h1 className="text-xl md:text-2xl font-bold text-center text-gray-800 mb-2">
            {formData.shipmentId.startsWith('SH-') ? t('createShipment') : t('editShipment')}
          </h1>
          <p className="text-center text-gray-500 mb-4 md:mb-6">
            {t('formDescription')}
          </p>

          <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
            {/* Shipment Information Section */}
            <div className="border-b pb-4 md:pb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                {t('shipmentInformation')}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Shipment ID */}
                <div>
                  <label className="text-sm font-medium">{t('shipmentId')}</label>
                  <input
                    type="text"
                    value={formData.shipmentId}
                    readOnly
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100"
                  />
                </div>

                {/* Bill of Lading No */}
                <div>
                  <label className="text-sm font-medium">
                    {t('billOfLadingNo')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="billOfLadingNo"
                    value={formData.billOfLadingNo}
                    onChange={handleChange}
                    placeholder={t('enterBLNo')}
                    className={`w-full border rounded-lg px-3 py-2 ${errors.billOfLadingNo ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.billOfLadingNo && <p className="text-red-500 text-xs mt-1">{errors.billOfLadingNo}</p>}
                </div>

                {/* Bill of Lading Document */}
                <div className="md:col-span-2 lg:col-span-1">
                  <label className="text-sm font-medium">
                    {t('billOfLadingDoc')} <span className="text-red-500">*</span>
                  </label>
                  <div
                    className={`flex items-center justify-between border rounded-lg px-3 py-2 cursor-pointer ${errors.billOfLadingDoc ? 'border-red-500' : 'border-gray-300'
                      }`}
                    onClick={() => handleCustomFileClick(bolDocRef)}
                  >
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                      </svg>
                      <span className="text-gray-500">
                        {fileNames.billOfLadingDoc || t('uploadBLDocument')}
                      </span>
                    </div>
                    <span className="text-blue-600 text-sm">{t('browse')}</span>
                  </div>
                  <input
                    type="file"
                    ref={bolDocRef}
                    onChange={(e) => handleFileChange('billOfLadingDoc', e.target.files?.[0] || null)}
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                  />
                  {errors.billOfLadingDoc && <p className="text-red-500 text-xs mt-1">{errors.billOfLadingDoc}</p>}
                  <p className="text-xs text-gray-500 mt-1">{t('fileFormats')}</p>
                </div>

                {/* Port of Arrival */}
                <div>
                  <label className="text-sm font-medium">
                    {t('portOfArrival')} <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="portOfArrival"
                    value={formData.portOfArrival}
                    onChange={handleChange}
                    className={`w-full border rounded-lg px-3 py-2 ${errors.portOfArrival ? 'border-red-500' : 'border-gray-300'}`}
                  >
                    <option value="">{t('selectPort')}</option>
                    {ports.map(port => (
                      <option key={port} value={port}>{port}</option>
                    ))}
                  </select>
                  {errors.portOfArrival && <p className="text-red-500 text-xs mt-1">{errors.portOfArrival}</p>}
                </div>

                {/* Shipping Line / Carrier */}
                <div>
                  <label className="text-sm font-medium">{t('shippingLine')}</label>
                  <select
                    name="shippingLine"
                    value={formData.shippingLine}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="">{t('selectShippingLine')}</option>
                    {shippingLines.map(line => (
                      <option key={line} value={line}>{line}</option>
                    ))}
                  </select>
                </div>

                {/* ETA Date with Calendar Picker */}
                <div>
                  <label className="text-sm font-medium">
                    {t('etaDate')} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      id="etaDate"
                      name="etaDate"
                      value={formData.etaDate}
                      onChange={(e) => handleDateChange('etaDate', e.target.value)}
                      min={getMinDate()}
                      className={`w-full border rounded-lg px-3 py-2 pl-10 pr-3 cursor-pointer ${errors.etaDate ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    <div
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                      onClick={() => openDatePicker('etaDate')}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  {errors.etaDate && <p className="text-red-500 text-xs mt-1">{errors.etaDate}</p>}
                  <p className="text-xs text-gray-500 mt-1">{t('futureDateNote')}</p>
                </div>

                {/* Status Dropdown */}
                <div>
                  <label className="text-sm font-medium">{t('status')}</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    {statusOptions.map((status, index) => (
                      <option key={index} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">{t('currentStatus')}: {formData.status}</p>
                </div>
              </div>
            </div>

            {/* Container Information Section */}
            <div className="border-b pb-4 md:pb-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2 md:mb-0">{t('containerInformation')}</h3>
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={addContainer}
                    className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors flex items-center text-sm"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    {t('addContainer')}
                  </button>
                </div>
              </div>

              {containers.map((container, index) => (
                <div key={index} className="mb-4 md:mb-6 p-4 border rounded-lg bg-gray-50">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium text-gray-700">{t('container')} {index + 1}</h4>
                    {containers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeContainer(index)}
                        className="text-red-600 hover:text-red-800 text-sm flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        {t('remove')}
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Container No. */}
                    <div>
                      <label className="text-sm font-medium">
                        {t('containerNo')} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={container.containerNo}
                        onChange={(e) => handleContainerChange(index, 'containerNo', e.target.value)}
                        placeholder="ABCD1234567"
                        className={`w-full border rounded-lg px-3 py-2 ${errors[`container_${index}`]?.includes(t('containerNo')) ? 'border-red-500' : 'border-gray-300'
                          }`}
                      />
                      <p className="text-xs text-gray-500 mt-1">{t('containerNoFormat')}</p>
                    </div>

                    {/* T-CMS Container No. (Auto-generated) */}
                    <div>
                      <label className="text-sm font-medium">{t('tCMSContainerNo')}</label>
                      <input
                        type="text"
                        value={container.tCMSContainerNo}
                        readOnly
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100"
                        placeholder={t('autoGenerated')}
                      />
                      <p className="text-xs text-gray-500 mt-1">{t('systemGenerated')}</p>
                    </div>

                    {/* Container Size */}
                    <div>
                      <label className="text-sm font-medium">
                        {t('containerSize')} <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={container.containerSize}
                        onChange={(e) => handleContainerChange(index, 'containerSize', e.target.value)}
                        className={`w-full border rounded-lg px-3 py-2 ${errors[`container_${index}`]?.includes(t('containerSize')) ? 'border-red-500' : 'border-gray-300'
                          }`}
                      >
                        <option value="">{t('selectSize')}</option>
                        <option value="20">20 ft</option>
                        <option value="40">40 ft</option>
                        <option value="45">45 ft</option>
                      </select>
                    </div>

                    {/* Container Weight */}
                    <div>
                      <label className="text-sm font-medium">{t('containerWeight')}</label>
                      <div className="flex">
                        <input
                          type="number"
                          value={container.containerWeight}
                          onChange={(e) => handleContainerChange(index, 'containerWeight', e.target.value)}
                          placeholder={t('weightInKgs')}
                          min="0"
                          step="0.01"
                          className={`w-full border rounded-l-lg px-3 py-2 ${errors[`container_${index}`]?.includes(t('containerWeight')) ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        <span className="bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg px-3 py-2">kgs</span>
                      </div>
                    </div>

                    {/* Seal Number */}
                    <div>
                      <label className="text-sm font-medium">{t('sealNumber')}</label>
                      <input
                        type="text"
                        value={container.sealNumber}
                        onChange={(e) => handleContainerChange(index, 'sealNumber', e.target.value)}
                        placeholder={t('enterSealNumber')}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      />
                    </div>

                    {/* Container Type - Simple Select Dropdown */}
                    <div>
                      <label className="text-sm font-medium">
                        {t('containerType')} <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={container.containerType}
                        onChange={(e) => handleContainerChange(index, 'containerType', e.target.value)}
                        className={`w-full border rounded-lg px-3 py-2 ${errors[`container_${index}`]?.includes(t('containerType')) ? 'border-red-500' : 'border-gray-300'
                          }`}
                      >
                        <option value="">{t('selectContainerType')}</option>
                        <option value={t('clearance')}>{t('clearance')}</option>
                        <option value={t('transportation')}>{t('transportation')}</option>
                      </select>
                      {errors[`container_${index}`]?.includes(t('containerType')) && (
                        <p className="text-red-500 text-xs mt-1">{t('containerTypeRequired')}</p>
                      )}
                    </div>

                    {/* Shipper and Consignee (only if Clearance is selected) */}
                    {container.containerType === t('clearance') && (
                      <div className="md:col-span-2 lg:col-span-3 border-t pt-4 mt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <div className="flex justify-between items-center">
                              <label className="text-sm font-medium">
                                {t('shipper')} <span className="text-red-500">*</span>
                              </label>
                              <button
                                type="button"
                                onClick={() => setShowAddShipper(true)}
                                className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                {t('addNewShipper')}
                              </button>
                            </div>
                            <select
                              value={container.shipper}
                              onChange={(e) => handleContainerChange(index, 'shipper', e.target.value)}
                              className={`w-full border rounded-lg px-3 py-2 mt-1 ${errors[`container_${index}`]?.includes(t('shipper')) ? 'border-red-500' : 'border-gray-300'
                                }`}
                            >
                              <option value="">{t('selectShipper')}</option>
                              {shippers.map((shipper, i) => (
                                <option key={i} value={shipper.name}>
                                  {shipper.name}
                                </option>
                              ))}
                            </select>
                            <p className="text-xs text-gray-500 mt-1">
                              {container.shipper ? `${t('selected')}: ${container.shipper}` : t('selectShipperOrAdd')}
                            </p>
                          </div>

                          <div>
                            <div className="flex justify-between items-center">
                              <label className="text-sm font-medium">
                                {t('consignee')} <span className="text-red-500">*</span>
                              </label>
                              <button
                                type="button"
                                onClick={() => setShowAddConsignee(true)}
                                className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                {t('addNewConsignee')}
                              </button>
                            </div>
                            <select
                              value={container.consignee}
                              onChange={(e) => handleContainerChange(index, 'consignee', e.target.value)}
                              className={`w-full border rounded-lg px-3 py-2 mt-1 ${errors[`container_${index}`]?.includes(t('consignee')) ? 'border-red-500' : 'border-gray-300'
                                }`}
                            >
                              <option value="">{t('selectConsignee')}</option>
                              {consignees.map((consignee, i) => (
                                <option key={i} value={consignee.name}>
                                  {consignee.name}
                                </option>
                              ))}
                            </select>
                            <p className="text-xs text-gray-500 mt-1">
                              {container.consignee ? `${t('selected')}: ${container.consignee}` : t('selectConsigneeOrAdd')}
                            </p>
                          </div>
                        </div>
                        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <p className="text-xs text-blue-700">
                            <strong>{t('note')}:</strong> {t('shipperConsigneeNote')}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {errors[`container_${index}`] && (
                    <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-600 text-sm font-medium">{t('validationErrors')}:</p>
                      <ul className="text-red-500 text-xs mt-1 list-disc list-inside">
                        {errors[`container_${index}`].split(', ').map((error, i) => (
                          <li key={i}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}

              <div className="flex justify-between items-center mt-4">
                <p className="text-sm text-gray-600">
                  {t('totalContainers')}: {containers.length}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                {t('saveShipment')}
              </button>
              <button
                type="button"
                onClick={handleSaveAndContinue}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                {t('saveContinue')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}