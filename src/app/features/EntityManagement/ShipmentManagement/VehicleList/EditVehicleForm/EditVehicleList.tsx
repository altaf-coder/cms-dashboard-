import { useState } from "react";
import { useTranslation } from 'react-i18next';

const validateVIN = (vin: string) => /^[A-HJ-NPR-Z0-9]{17}$/i.test(vin);

export default function EditVehicleList() {
  const { t } = useTranslation();
  const initialFormData = {
    shipmentId: "SHP-00125",
    vinNumber: "",
    make: "",
    model: "",
    modelYear: "",
    color: "",
    vehicleValue: ""
  };
 
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validate a single field
  const validateField = (name: string, value: string): string => {
    if (!value.trim()) {
      const fieldNames: Record<string, string> = {
        vinNumber: t('vinNumber'),
        make: t('make'),
        model: t('model'),
        modelYear: t('modelYear'),
        vehicleValue: t('vehicleValue')
      };
      return t('fieldIsRequired', { field: fieldNames[name] || name });
    }

    switch (name) {
      case 'vinNumber':
        if (!validateVIN(value)) {
          return t('invalidVinFormat');
        }
        break;
       
      case 'modelYear':
        const year = parseInt(value);
        const currentYear = new Date().getFullYear();
        if (isNaN(year) || year < 1900 || year > currentYear + 1) {
          return t('modelYearMustBeBetween', { min: 1900, max: currentYear + 1 });
        }
        break;
       
      case 'vehicleValue':
        const numValue = parseFloat(value);
        if (isNaN(numValue) || numValue <= 0) {
          return t('vehicleValueMustBeGreaterThanZero');
        }
        break;
    }
   
    return "";
  };

  // Validate entire form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
   
    // Validate all required fields except color
    const fieldsToValidate = ['vinNumber', 'make', 'model', 'modelYear', 'vehicleValue'];
   
    fieldsToValidate.forEach(field => {
      const error = validateField(field, formData[field as keyof typeof formData]);
      if (error) {
        newErrors[field] = error;
      }
    });
   
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
   
    // Update form data
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
   
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
   
    if (!validateForm()) {
      return;
    }
   
    setIsSubmitting(true);
   
    // Simulate API call delay
    setTimeout(() => {
      console.log("Vehicle updated:", formData);
      setShowSuccessPopup(true);
      setIsSubmitting(false);
    }, 500);
  };

  const handleDeleteClick = () => {
    setShowDeletePopup(true);
  };

  const handleCancelDelete = () => {
    setShowDeletePopup(false);
  };

  const handleConfirmDelete = () => {
    // Clear all form data
    setFormData(initialFormData);
   
    // Clear all errors
    setErrors({});
   
    // Close the popup
    setShowDeletePopup(false);
   
    // Optional: Log deletion (in real app, you would call API here)
    console.log("Vehicle deleted and form cleared");
  };

  const handleCloseSuccessPopup = () => {
    setShowSuccessPopup(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Delete Confirmation Popup */}
      {showDeletePopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleCancelDelete}
          />
         
          <div className="relative z-10 bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4">
            <div className="flex justify-center mb-6">
              <div className="bg-red-100 rounded-full p-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
            </div>
           
            <h3 className="text-2xl font-bold text-center text-gray-800 mb-2">
              {t('deleteVehicle')}
            </h3>
           
            <p className="text-gray-600 text-center mb-8">
              {t('deleteVehicleConfirmAction')}
            </p>
           
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleCancelDelete}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                {t('delete')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleCloseSuccessPopup}
          />
         
          <div className="relative z-10 bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4">
            <div className="flex justify-center mb-6">
              <div className="bg-green-100 rounded-full p-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
           
            <h3 className="text-2xl font-bold text-center text-gray-800 mb-2">
              {t('success')}
            </h3>
           
            <p className="text-gray-600 text-center mb-8">
              {t('vehicleUpdatedSuccessfully')}
            </p>
           
            <div className="flex justify-center">
              <button
                onClick={handleCloseSuccessPopup}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                {t('ok')}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={`max-w-4xl mx-auto ${showDeletePopup || showSuccessPopup ? 'filter blur-sm' : ''}`}>
        {/* Header - Centered */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {t('editVehicleDetailsBelow')}
          </h1>
          <p className="text-gray-600">
            {t('updateVehicleDetailsForShipment')}: <span className="font-medium">SHP-00125</span>
          </p>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="space-y-6">
            {/* Shipment ID & VIN Number */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Shipment ID - Fixed Value (Not Editable) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('shipmentId')}
                </label>
                <div className="relative">
                  <div className="w-full px-4 py-2 border border-gray-300 bg-gray-100 rounded-lg text-gray-700">
                    SHP-00125
                  </div>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  {t('shipmentIdFixedCannotBeEdited')}
                </p>
              </div>

              {/* VIN Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('vinNumber')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="vinNumber"
                  value={formData.vinNumber}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.vinNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                  maxLength={17}
                  placeholder={t('enter17CharacterVin')}
                />
                {errors.vinNumber && (
                  <p className="mt-1 text-sm text-red-600">{errors.vinNumber}</p>
                )}
              </div>
            </div>

            {/* Make & Model */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Make */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('make')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="make"
                  value={formData.make}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.make ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder={t('enterMake')}
                />
                {errors.make && (
                  <p className="mt-1 text-sm text-red-600">{errors.make}</p>
                )}
              </div>

              {/* Model */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('model')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.model ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder={t('enterModel')}
                />
                {errors.model && (
                  <p className="mt-1 text-sm text-red-600">{errors.model}</p>
                )}
              </div>
            </div>

            {/* Model Year & Color */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Model Year */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('modelYear')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="modelYear"
                  value={formData.modelYear}
                  onChange={handleChange}
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.modelYear ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder={t('enterModelYear')}
                />
                {errors.modelYear && (
                  <p className="mt-1 text-sm text-red-600">{errors.modelYear}</p>
                )}
              </div>

              {/* Color */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('color')} ({t('optional')})
                </label>
                <input
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder={t('enterColor')}
                />
              </div>
            </div>

            {/* Vehicle Value */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('vehicleValue')} ({t('aed')}) <span className="text-red-500">*</span>
              </label>
              <div className="relative w-full md:w-1/2 lg:w-1/3">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  {t('aed')}
                </span>
                <input
                  type="number"
                  name="vehicleValue"
                  value={formData.vehicleValue}
                  onChange={handleChange}
                  min="1"
                  step="0.01"
                  className={`w-full pl-12 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.vehicleValue ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="0.00"
                />
              </div>
              {errors.vehicleValue && (
                <p className="mt-1 text-sm text-red-600">{errors.vehicleValue}</p>
              )}
            </div>

            {/* Form Actions */}
            <div className="flex flex-col items-center gap-4 pt-8">
              <div className="flex justify-center gap-3 w-full">
                <button
                  type="button"
                  onClick={handleDeleteClick}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  {t('deleteVehicle')}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-6 py-2 rounded-lg transition-colors font-medium flex items-center justify-center min-w-[140px] ${
                    isSubmitting
                      ? 'bg-blue-400 text-white cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-4 w-4 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {t('updating')}
                    </>
                  ) : (
                    t('updateVehicle')
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* Validation Errors Summary - Only show if there are errors */}
        {Object.keys(errors).length > 0 && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600 mt-0.5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.346 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div>
                <p className="text-sm font-medium text-red-800">
                  {t('pleaseFixFollowingErrors')}
                </p>
                <ul className="mt-1 text-sm text-red-700 list-disc list-inside space-y-1">
                  {errors.vinNumber && <li>{errors.vinNumber}</li>}
                  {errors.make && <li>{errors.make}</li>}
                  {errors.model && <li>{errors.model}</li>}
                  {errors.modelYear && <li>{errors.modelYear}</li>}
                  {errors.vehicleValue && <li>{errors.vehicleValue}</li>}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
