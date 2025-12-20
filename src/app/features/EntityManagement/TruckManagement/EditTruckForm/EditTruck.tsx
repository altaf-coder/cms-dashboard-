import { useState, useRef, ChangeEvent, FormEvent } from 'react';
import { useTranslation } from 'react-i18next';

interface ReportFormData {
  truckId: string;
  truckNo: string;
  vendorId: string;
  registrationExpiry: string;
  insuranceExpiry: string;
  capacity: string;
  vehicleType: string;
  status: string;
  documents: File | null;
  approvalStatus: string;
  notes: string;
  assignedTruck: string;
  assignedVendor: string;
  addedBy: string;
}

interface ReportFormErrors {
  truckNo?: string;
  vendorId?: string;
  registrationExpiry?: string;
  insuranceExpiry?: string;
  capacity?: string;
  vehicleType?: string;
  status?: string;
  documents?: string;
  assignedTruck?: string;
  assignedVendor?: string;
  [key: string]: string | undefined; // For dynamic access
}

interface ReportFormTouched {
  [key: string]: boolean;
}

export default function EditTruck() {
    const { t } = useTranslation();
    const [formData, setFormData] = useState<ReportFormData>({
        truckId: 'T-CMS-0001',
        truckNo: '',
        vendorId: '',
        registrationExpiry: '',
        insuranceExpiry: '',
        capacity: '',
        vehicleType: '',
        status: '',
        documents: null,
        approvalStatus: 'pending',
        notes: '',
        assignedTruck: '',
        assignedVendor: '',
        addedBy: 'Current User'
    });

    const [errors, setErrors] = useState<ReportFormErrors>({});
    const [touched, setTouched] = useState<ReportFormTouched>({});
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const registrationExpiryRef = useRef<HTMLInputElement | null>(null);
    const insuranceExpiryRef = useRef<HTMLInputElement | null>(null);

    // UAE vehicle number format — e.g., SHJ 12345
    const plateRegex = /^[A-Za-z]{2,4}\s?\d{3,5}$/;

    const validateField = (name: keyof ReportFormData, value: any): string => {
        const today = new Date().toISOString().split("T")[0];

        switch (name) {
            case 'truckNo':
                if (!value) return t('truckNumberRequired');
                if (!plateRegex.test(value)) return t('validUaePlateNoRequired');
                return '';

            case 'vendorId':
                if (!value) return t('vendorIdRequired');
                return '';

            case 'registrationExpiry':
                if (!value) return t('registrationExpiryRequired');
                if (value < today) return t('expiryMustBeTodayOrFuture');
                return '';

            case 'insuranceExpiry':
                if (!value) return t('insuranceExpiryRequired');
                if (value < today) return t('expiryMustBeTodayOrFuture');
                return '';

            case 'capacity':
                if (value && isNaN(Number(value))) return t('capacityMustBeNumeric');
                return '';

            case 'vehicleType':
                if (!value) return t('vehicleTypeRequired');
                return '';

            case 'status':
                if (!value) return t('statusIsRequired');
                return '';

            case 'documents':
                if (!value) return t('documentUploadRequired');
                return '';

            case 'assignedTruck':
                if (!value) return t('assignedTruckRequired');
                return '';

            case 'assignedVendor':
                if (!value) return t('vendorSelectionRequired');
                return '';

            default:
                return '';
        }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const fieldName = name as keyof ReportFormData;
        
        setTouched(prev => ({
            ...prev,
            [fieldName]: true
        }));

        const error = validateField(fieldName, value);
        setErrors(prev => ({
            ...prev,
            [fieldName]: error
        }));
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const fieldName = name as keyof ReportFormData;
        
        setFormData(prev => ({
            ...prev,
            [fieldName]: value
        }));

        if (errors[fieldName]) {
            const error = validateField(fieldName, value);
            setErrors(prev => ({
                ...prev,
                [fieldName]: error
            }));
        }
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                documents: file
            }));

            let error = '';
            if (!["application/pdf", "image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
                error = t('onlyPdfJpgPngAllowed');
            } else if (file.size > 10 * 1024 * 1024) {
                error = t('maxFileSize10MbAllowed');
            }

            setErrors(prev => ({
                ...prev,
                documents: error
            }));

            setTouched(prev => ({
                ...prev,
                documents: true
            }));
        }
    };

    // Function to open date picker when calendar icon is clicked
    const openDatePicker = (ref: React.RefObject<HTMLInputElement | null>): void => {
        ref.current?.showPicker();
    };

    const validateForm = (): boolean => {
        const newErrors: ReportFormErrors = {};

        (Object.keys(formData) as Array<keyof ReportFormData>).forEach(key => {
            if (key !== 'truckId' && key !== 'approvalStatus' && key !== 'notes' && key !== 'addedBy') {
                const error = validateField(key, formData[key]);
                if (error) {
                    newErrors[key] = error;
                }
            }
        });

        if (!formData.documents) {
            newErrors.documents = t('documentUploadRequired');
        }

        setErrors(newErrors);

        const allTouched: ReportFormTouched = {};
        (Object.keys(formData) as Array<keyof ReportFormData>).forEach(key => {
            allTouched[key] = true;
        });
        setTouched(allTouched);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("Form submission started...");

        if (!validateForm()) {
            console.log("Form validation failed");
            return;
        }

        console.log("Form Submitted Successfully!", formData);
        setShowSuccessPopup(true);
        console.log("Success popup should show now");
    };

    const handleSuccessPopupClose = () => {
        setShowSuccessPopup(false);
        setFormData({
            truckId: `T-CMS-${Math.floor(Math.random() * 1000).toString().padStart(4, '0')}`,
            truckNo: '',
            vendorId: '',
            registrationExpiry: '',
            insuranceExpiry: '',
            capacity: '',
            vehicleType: '',
            status: '',
            documents: null,
            approvalStatus: 'pending',
            notes: '',
            assignedTruck: '',
            assignedVendor: '',
            addedBy: 'Current User'
        });
        setErrors({});
        setTouched({});

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Delete function
    const handleDelete = () => {
        setShowDeletePopup(true);
    };

    const confirmDelete = () => {
        setShowDeletePopup(false);
        // Reset form after delete
        setFormData({
            truckId: `T-CMS-${Math.floor(Math.random() * 1000).toString().padStart(4, '0')}`,
            truckNo: '',
            vendorId: '',
            registrationExpiry: '',
            insuranceExpiry: '',
            capacity: '',
            vehicleType: '',
            status: '',
            documents: null,
            approvalStatus: 'pending',
            notes: '',
            assignedTruck: '',
            assignedVendor: '',
            addedBy: 'Current User'
        });
        setErrors({});
        setTouched({});

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const shouldShowError = (fieldName: keyof ReportFormData): boolean => {
        return !!touched[fieldName] && !!errors[fieldName];
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            {/* Success Popup - Same design as Edit Driver */}
            {showSuccessPopup && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
                    <div className="bg-white p-6 rounded-xl shadow-lg z-10 text-center max-w-sm mx-auto">
                        <h2 className="text-green-600 text-xl font-semibold mb-2">{t('success')}</h2>
                        <p className="text-gray-700 mb-4">
                            {t('truck')} <span className="font-semibold text-blue-600">{formData.truckNo}</span> {t('truckHasBeenUpdatedSuccessfully')}
                        </p>
                        <button
                            onClick={handleSuccessPopupClose}
                            className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                            {t('ok')}
                        </button>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Popup - Same design as Edit Driver */}
            {showDeletePopup && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
                    <div className="bg-white p-6 rounded-xl shadow-lg z-10 text-center max-w-sm mx-auto">
                        <div className="w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">{t('deleteTruck')}</h2>
                        <p className="text-gray-600 mb-6">
                            {t('deleteTruckConfirmAction')}
                        </p>
                        <div className="flex space-x-3 justify-center">
                            <button
                                onClick={() => setShowDeletePopup(false)}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                {t('cancel')}
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                                {t('delete')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-white p-6 border-b">
                    <h1 className="text-2xl font-bold text-center text-gray-800">{t('editTruck')}</h1>
                    <p className="text-center text-gray-600 mt-2">{t('pleaseFillFormToEditTruck')}</p>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    {/* Truck ID + Truck No */}
                    <div className="mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('truckId')}
                                </label>
                                <div className="border border-gray-300 rounded px-3 py-2 bg-gray-50">
                                    <span className="text-gray-700">{formData.truckId}</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('truckNoPlateNo')} <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="truckNo"
                                    value={formData.truckNo}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="SHJ 12345"
                                    className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${shouldShowError('truckNo') ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                />
                                {shouldShowError('truckNo') && (
                                    <p className="text-red-500 text-sm mt-1">{errors.truckNo}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* PERSONAL INFO */}
                    <div className="mb-6">
                        <h2 className="text-lg font-bold text-gray-800 mb-4">{t('personalInfo')}</h2>

                        {/* Vendor + Reg */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('vendorId')} <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="vendorId"
                                    value={formData.vendorId}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${shouldShowError('vendorId') ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                />
                                {shouldShowError('vendorId') && (
                                    <p className="text-red-500 text-sm mt-1">{errors.vendorId}</p>
                                )}
                            </div>

                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('registrationExpiry')} <span className="text-red-500">*</span>
                                </label>
                                <input
                                    ref={registrationExpiryRef}
                                    type="date"
                                    name="registrationExpiry"
                                    value={formData.registrationExpiry}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    min={new Date().toISOString().split('T')[0]}
                                    className={`w-full border rounded px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 ${shouldShowError('registrationExpiry') ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => openDatePicker(registrationExpiryRef)}
                                    className="absolute right-3 top-8 transform -translate-y-0 text-gray-400 hover:text-gray-600 cursor-pointer"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </button>
                                {shouldShowError('registrationExpiry') && (
                                    <p className="text-red-500 text-sm mt-1">{errors.registrationExpiry}</p>
                                )}
                            </div>
                        </div>

                        {/* Insurance + Capacity */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('insuranceExpiry')} <span className="text-red-500">*</span>
                                </label>
                                <input
                                    ref={insuranceExpiryRef}
                                    type="date"
                                    name="insuranceExpiry"
                                    value={formData.insuranceExpiry}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    min={new Date().toISOString().split('T')[0]}
                                    className={`w-full border rounded px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 ${shouldShowError('insuranceExpiry') ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => openDatePicker(insuranceExpiryRef)}
                                    className="absolute right-3 top-8 transform -translate-y-0 text-gray-400 hover:text-gray-600 cursor-pointer"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </button>
                                {shouldShowError('insuranceExpiry') && (
                                    <p className="text-red-500 text-sm mt-1">{errors.insuranceExpiry}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('capacityTons')}
                                </label>
                                <input
                                    type="text"
                                    name="capacity"
                                    value={formData.capacity}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${shouldShowError('capacity') ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                />
                                {shouldShowError('capacity') && (
                                    <p className="text-red-500 text-sm mt-1">{errors.capacity}</p>
                                )}
                            </div>
                        </div>

                        {/* Vehicle Type + Status */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('vehicleType')} <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="vehicleType"
                                    value={formData.vehicleType}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${shouldShowError('vehicleType') ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                >
                                    <option value="">{t('selectType')}</option>
                                    <option value="Trailer">Trailer</option>
                                    <option value="Flatbed">Flatbed</option>
                                    <option value="Reefer">Reefer</option>
                                    <option value="Box">Box Truck</option>
                                    <option value="Other">{t('other')}</option>
                                </select>
                                {shouldShowError('vehicleType') && (
                                    <p className="text-red-500 text-sm mt-1">{errors.vehicleType}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('status')} <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${shouldShowError('status') ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                >
                                    <option value="">{t('selectStatus')}</option>
                                    <option value="Available">{t('available')}</option>
                                    <option value="On Trip">{t('onTrip')}</option>
                                    <option value="Maintenance">{t('maintenance')}</option>
                                    <option value="Suspended">{t('suspended')}</option>
                                </select>
                                {shouldShowError('status') && (
                                    <p className="text-red-500 text-sm mt-1">{errors.status}</p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Documents with Upload Icon */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('documents')} <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="file"
                                        onChange={handleFileChange}
                                        ref={fileInputRef}
                                        className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 opacity-0 absolute z-10 ${shouldShowError('documents') ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    />
                                    <div className={`border rounded px-3 py-2 flex items-center ${shouldShowError('documents') ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'}`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                        </svg>
                                        <span className="text-gray-700">
                                            {formData.documents ? formData.documents.name : t('chooseFile')}
                                        </span>
                                    </div>
                                </div>
                                {shouldShowError('documents') && (
                                    <p className="text-red-500 text-sm mt-1">{errors.documents}</p>
                                )}
                            </div>

                            {/* Added by Field - Auto populated */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('addedBy')}
                                </label>
                                <div className="border border-gray-300 rounded px-3 py-2 bg-gray-50">
                                    <span className="text-gray-700">{formData.addedBy}</span>
                                </div>
                                <p className="text-gray-500 text-xs mt-1">{t('autoFilledFromCurrentUser')}</p>
                            </div>
                        </div>

                        {/* Approval Status */}
                        <div className="grid grid-cols-1 gap-4 mb-4 mt-4">
                            <div className="w-full md:w-1/2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('approvalStatus')}
                                </label>
                                <select
                                    name="approvalStatus"
                                    value={formData.approvalStatus}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="pending">{t('pending')}</option>
                                    <option value="approved">{t('approved')}</option>
                                    <option value="rejected">{t('rejected')}</option>
                                </select>
                                <p className="text-gray-500 text-xs mt-1">{t('autoManaged')}</p>
                            </div>
                        </div>

                        {/* Notes */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t('notes')} <span className="text-gray-500 font-normal">({t('optional')})</span>
                            </label>
                            <textarea
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                rows={3}
                                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder={t('addAnyAdditionalNotesHere')}
                            />
                        </div>
                    </div>

                    {/* Assigned Truck & Vendor */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t('assignedTruck')} <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="assignedTruck"
                                value={formData.assignedTruck}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${shouldShowError('assignedTruck') ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            >
                                <option value="">{t('selectTruck')}</option>
                                <option value="truck-001">Truck-001</option>
                                <option value="truck-002">Truck-002</option>
                                <option value="truck-003">Truck-003</option>
                            </select>
                            {shouldShowError('assignedTruck') && (
                                <p className="text-red-500 text-sm mt-1">{errors.assignedTruck}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t('assignedVendor')} <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="assignedVendor"
                                value={formData.assignedVendor}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${shouldShowError('assignedVendor') ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            >
                                <option value="">{t('selectVendor')}</option>
                                <option value="vendor-001">Vendor-001</option>
                                <option value="vendor-002">Vendor-002</option>
                                <option value="vendor-003">Vendor-003</option>
                            </select>
                            {shouldShowError('assignedVendor') && (
                                <p className="text-red-500 text-sm mt-1">{errors.assignedVendor}</p>
                            )}
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-center space-x-4">
                        <button
                            type="button"
                            onClick={handleDelete}
                            className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition-colors flex items-center"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            {t('deleteTruck')}
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
                        >
                            {t('updateTruck')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}