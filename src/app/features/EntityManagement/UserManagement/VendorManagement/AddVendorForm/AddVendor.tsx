import { useState, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';

const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validateName = (name: string) => /^[A-Za-z\s]{3,}$/.test(name);
const validateIBAN = (iban: string) => /^AE[0-9]{2}[A-Z0-9]{4,}$/i.test(iban.replace(/\s/g, ''));
// Strong password validation: at least 8 chars, 1 uppercase, 1 number, 1 symbol
const validatePassword = (password: string) => 
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);

export default function AddVendor() {
  const { t } = useTranslation();
  const generateVendorId = useCallback(() => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `V-NaJ-${randomNum}`;
  }, []);

  const [formData, setFormData] = useState({
    vendorId: generateVendorId(),
    status: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    countryCode: '+971',
    password: '',
    confirmPassword: '',
    emiratesId: null as File | null,
    emiratesIdExpiryDate: '',
    passport: null as File | null,
    companyName: '',
    vatNumber: '',
    tradeLicenseNumber: '',
    officeAddress: '',
    accountName: '',
    bankName: '',
    iban: '',
    linkedDriver: '',
    insurancePolicyNumber: '',
    insuranceExpiryDate: '',
    insuranceCopy: null as File | null,
    paymentTerms: '',
    financialLimit: '20000'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');
  const [fileNames, setFileNames] = useState({
    emiratesId: '',
    passport: '',
    insuranceCopy: ''
  });

  const emiratesIdRef = useRef<HTMLInputElement>(null);
  const passportRef = useRef<HTMLInputElement>(null);
  const insuranceCopyRef = useRef<HTMLInputElement>(null);

  const countryCodes = [
    { code: '+971', country: 'UAE', flag: '🇦🇪' },
    { code: '+966', country: 'KSA', flag: '🇸🇦' },
    { code: '+974', country: 'Qatar', flag: '🇶🇦' },
    { code: '+965', country: 'Kuwait', flag: '🇰🇼' },
    { code: '+973', country: 'Bahrain', flag: '🇧🇭' },
    { code: '+968', country: 'Oman', flag: '🇴🇲' },
    { code: '+91', country: 'India', flag: '🇮🇳' },
    { code: '+92', country: 'Pakistan', flag: '🇵🇰' },
    { code: '+1', country: 'USA', flag: '🇺🇸' },
    { code: '+44', country: 'UK', flag: '🇬🇧' },
  ];


  const handleCalendarClick = (fieldName: string) => {
    const dateInput = document.getElementById(fieldName) as HTMLInputElement;
    if (dateInput) dateInput.showPicker();
  };

  // --- Field-level Validation ---
  const validateField = (name: string, value: any) => {
    switch (name) {
      case 'firstName':
      case 'lastName':
        if (!value.trim()) return t('thisFieldIsRequired');
        if (!validateName(value)) return t('onlyAlphabetsAllowed');
        return '';
      case 'email':
        if (!value) return t('emailIsRequired');
        if (!validateEmail(value)) return t('invalidEmailAddress');
        return '';
      case 'phone':
        if (!value) return t('mobileNumberIsRequired');
        // Only allow numbers
        if (!/^\d+$/.test(value)) return t('onlyNumbersAreAllowed');
        if (formData.countryCode === '+971' && value.length !== 9)
          return t('uaeMobileNumberMustBe9Digits');
        return '';
      case 'password':
        if (!value) return t('passwordIsRequired');
        if (!validatePassword(value)) 
          return t('passwordMustBeAtLeast8Chars');
        return '';
      case 'confirmPassword':
        if (!value) return t('confirmYourPassword');
        if (value !== formData.password) return t('passwordsDoNotMatch');
        return '';
      case 'iban':
        if (!value.trim()) return t('iban') + ' ' + t('thisFieldIsRequired').toLowerCase();
        if (!validateIBAN(value)) return t('iban') + ' ' + t('mustStartWithAE');
        return '';
      case 'emiratesIdExpiryDate':
        if (!value) return 'Emirates ID expiry date is required';
        if (new Date(value) <= new Date()) return 'Emirates ID must not be expired';
        return '';
      case 'insuranceExpiryDate':
        if (!value) return t('insuranceExpiryDateRequired');
        if (new Date(value) <= new Date()) return 'Insurance must not be expired';
        return '';
      case 'emiratesId':
      case 'insuranceCopy':
      case 'status':
      case 'companyName':
      case 'tradeLicenseNumber':
      case 'vatNumber':
      case 'officeAddress':
      case 'accountName':
      case 'bankName':
      case 'linkedDriver':
      case 'insurancePolicyNumber':
      case 'paymentTerms':
      case 'financialLimit':
        return value ? '' : t('thisFieldIsRequired');
      default:
        return '';
    }
  };

  const handleFileChange = (name: string, file: File | null) => {
    setFormData(prev => ({ ...prev, [name]: file }));
    setFileNames(prev => ({ ...prev, [name]: file ? file.name : '' }));
      setErrors(prev => ({ ...prev, [name]: file ? '' : t('thisFieldIsRequired') }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;

    if (type === 'file') {
      const file = (e.target as HTMLInputElement).files?.[0] || null;
      handleFileChange(name, file);
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
      const errorMsg = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: errorMsg }));
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setFormData(prev => ({ ...prev, phone: value }));
    setErrors(prev => ({ ...prev, phone: validateField('phone', value) }));
  };

  // Custom file input handlers
  const handleCustomFileClick = (ref: React.RefObject<HTMLInputElement | null>) => {
    ref.current?.click();
  };

  // --- Form Submit ---
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, (formData as any)[key]);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setSuccessMessage(t('vendorAddedSuccessfully'));
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  return (
    <div className="min-h-scree p-6">
      {/* Success Popup */}
      {successMessage && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
          <div className="bg-white p-6 rounded-xl shadow-lg z-10 text-center max-w-sm mx-auto">
            <h2 className="text-green-600 text-xl font-semibold mb-2">{t('success')}</h2>
            <p className="text-gray-700 mb-4">{successMessage}</p>
            <button
              onClick={() => setSuccessMessage('')}
              className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              {t('ok')}
            </button>
          </div>
        </div>
      )}

      {/* Main Form Content */}
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">{t('addVendors')}</h1>
        <p className="text-center text-gray-500 mb-6">
          {t('pleaseFillFormToAddVendor')}
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Vendor ID */}
            <div>
              <label className="text-sm font-medium">{t('vendorId')}</label>
              <input
                type="text"
                name="vendorId"
                value={formData.vendorId}
                readOnly
                className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100"
              />
            </div>

            {/* Status */}
            <div>
              <label className="text-sm font-medium">
                {t('status')} <span className="text-red-500">*</span>
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={`w-full border rounded-lg px-3 py-2 ${errors.status ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">{t('selectStatus')}</option>
                <option value="active">{t('active')}</option>
                <option value="inactive">{t('inactive')}</option>
              </select>
              {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status}</p>}
            </div>

            {/* Authorized Person */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">{t('authorizedPersonSection')}</h3>
            </div>

            <div>
              <label className="text-sm font-medium">
                {t('firstName')} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder={t('enterYourFirstName')}
                className={`w-full border rounded-lg px-3 py-2 ${
                  errors.firstName ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
            </div>

            <div>
              <label className="text-sm font-medium">
                {t('lastName')} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder={t('enterYourLastName')}
                className={`w-full border rounded-lg px-3 py-2 ${
                  errors.lastName ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-medium">
                {t('email')} <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={t('enterYourEmail')}
                className={`w-full border rounded-lg px-3 py-2 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="text-sm font-medium">
                {t('phone')} <span className="text-red-500">*</span>
              </label>
              <div className="flex">
                <select
                  name="countryCode"
                  value={formData.countryCode}
                  onChange={handleChange}
                  className="w-1/3 border border-gray-300 rounded-l-lg px-2 py-2 bg-gray-50"
                >
                  {countryCodes.map(country => (
                    <option key={country.code} value={country.code}>
                      {country.flag} {country.code}
                    </option>
                  ))}
                </select>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  placeholder={formData.countryCode === '+971' ? '5XX XXX XXXX' : 'Enter Phone Number'}
                  className={`w-2/3 border border-l-0 rounded-r-lg px-3 py-2 ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
              <div className="flex justify-between mt-1">
                {/* <span className="text-xs text-gray-500">Full: {getFullPhoneNumber()}</span> */}
                {errors.phone ? (
                  <span className="text-red-500 text-xs">{errors.phone}</span>
                ) : formData.countryCode === '+971' && (
                  <span className="text-xs text-gray-500">9 digits required</span>
                )}
              </div>
            </div>

            {/* Password & Confirm Password */}
            <div>
              <label className="text-sm font-medium">{t('password')} <span className="text-red-500">*</span></label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder={t('enterYourPassword')}
                className={`w-full border rounded-lg px-3 py-2 ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              {/* <p className="text-xs text-gray-500 mt-1">
                Must be at least 8 characters, include 1 uppercase, 1 number, and 1 symbol
              </p> */}
            </div>

            <div>
              <label className="text-sm font-medium">
                {t('confirmPassword')} <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder={t('reEnterYourPassword')}
                className={`w-full border rounded-lg px-3 py-2 ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
            </div>

            {/* Emirates ID Fields */}
            <div>
              <label className="text-sm font-medium">{t('uploadEmiratesId')} <span className="text-red-500">*</span></label>
              <div 
                className={`flex items-center justify-between border rounded-lg px-3 py-2 cursor-pointer ${
                  errors.emiratesId ? 'border-red-500' : 'border-gray-300'
                }`}
                onClick={() => handleCustomFileClick(emiratesIdRef)}
              >
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                  <span className="text-gray-500">
                    {fileNames.emiratesId ? fileNames.emiratesId : t('uploadEmiratesId')}
                  </span>
                </div>
                <span className="text-blue-600 text-sm">{t('browse')}</span>
              </div>
              <input
                type="file"
                name="emiratesId"
                ref={emiratesIdRef}
                onChange={handleChange}
                className="hidden"
              />
              {errors.emiratesId && <p className="text-red-500 text-xs mt-1">{errors.emiratesId}</p>}
              <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-500">
                  {fileNames.emiratesId ? t('fileSelected') : t('noFileChosen')}
                </span>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">{t('emiratesIdExpiryDate')} <span className="text-red-500">*</span></label>
              <div className="relative">
                <input
                  type="date"
                  id="emiratesIdExpiryDate"
                  name="emiratesIdExpiryDate"
                  value={formData.emiratesIdExpiryDate}
                  onChange={handleChange}
                  className={`w-full border rounded-lg px-3 py-2 pl-10 pr-3 cursor-pointer ${errors.emiratesIdExpiryDate ? 'border-red-500' : 'border-gray-300'}`}
                />
                <div 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                  onClick={() => handleCalendarClick('emiratesIdExpiryDate')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              {errors.emiratesIdExpiryDate && <p className="text-red-500 text-xs mt-1">{errors.emiratesIdExpiryDate}</p>}
            </div>

            {/* Passport Field */}
            <div>
              <label className="text-sm font-medium">{t('uploadPassport')}</label>
              <div 
                className="flex items-center justify-between border border-gray-300 rounded-lg px-3 py-2 cursor-pointer"
                onClick={() => handleCustomFileClick(passportRef)}
              >
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                  <span className="text-gray-500">
                    {fileNames.passport ? fileNames.passport : t('uploadPassport')}
                  </span>
                </div>
                <span className="text-gray-600 text-sm">{t('browse')}</span>
              </div>
              <input
                type="file"
                name="passport"
                ref={passportRef}
                onChange={handleChange}
                className="hidden"
              />
              <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-500">
                  {fileNames.passport ? t('fileSelected') : t('noFileChosen')}
                </span>
                <span className="text-xs text-gray-500">{t('optionalForExpats')}</span>
              </div>
            </div>

            {/* Company Info Section */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">{t('companyInformationSection')}</h3>
            </div>

            <div>
              <label className="text-sm font-medium">{t('companyName')} <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder={t('enterCompanyName')}
                className={`w-full border rounded-lg px-3 py-2 ${errors.companyName ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.companyName && <p className="text-red-500 text-xs mt-1">{errors.companyName}</p>}
            </div>

            <div>
              <label className="text-sm font-medium">{t('tradeLicenseNumber')} <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="tradeLicenseNumber"
                value={formData.tradeLicenseNumber}
                onChange={handleChange}
                placeholder={t('enterTradeLicenseNumber')}
                className={`w-full border rounded-lg px-3 py-2 ${errors.tradeLicenseNumber ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.tradeLicenseNumber && <p className="text-red-500 text-xs mt-1">{errors.tradeLicenseNumber}</p>}
            </div>

            <div>
              <label className="text-sm font-medium">{t('vatNumber')} <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="vatNumber"
                value={formData.vatNumber}
                onChange={handleChange}
                placeholder={t('enterVatNumber')}
                className={`w-full border rounded-lg px-3 py-2 ${errors.vatNumber ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.vatNumber && <p className="text-red-500 text-xs mt-1">{errors.vatNumber}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-medium">{t('officeAddress')} <span className="text-red-500">*</span></label>
              <textarea
                name="officeAddress"
                value={formData.officeAddress}
                onChange={handleChange}
                placeholder={t('enterAddress')}
                rows={3}
                className={`w-full border rounded-lg px-3 py-2 ${errors.officeAddress ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.officeAddress && <p className="text-red-500 text-xs mt-1">{errors.officeAddress}</p>}
              {/* <p className="text-xs text-gray-500 mt-1">Min: 5 Max 3000 characters</p> */}
            </div>

            {/* Bank Details Section */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">{t('bankDetails')}</h3>
            </div>

            <div>
              <label className="text-sm font-medium">{t('accountName')} <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="accountName"
                value={formData.accountName}
                onChange={handleChange}
                placeholder={t('enterAccountName')}
                className={`w-full border rounded-lg px-3 py-2 ${errors.accountName ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.accountName && <p className="text-red-500 text-xs mt-1">{errors.accountName}</p>}
            </div>

            <div>
              <label className="text-sm font-medium">{t('bankName')} <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="bankName"
                value={formData.bankName}
                onChange={handleChange}
                placeholder={t('enterBankName')}
                className={`w-full border rounded-lg px-3 py-2 ${errors.bankName ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.bankName && <p className="text-red-500 text-xs mt-1">{errors.bankName}</p>}
            </div>

            <div>
              <label className="text-sm font-medium">{t('iban')} <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="iban"
                value={formData.iban}
                onChange={handleChange}
                placeholder={t('enterIban')}
                className={`w-full border rounded-lg px-3 py-2 ${errors.iban ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.iban && <p className="text-red-500 text-xs mt-1">{errors.iban}</p>}
              <p className="text-xs text-gray-500 mt-1">{t('mustStartWithAE')} ({t('uaeFormat')})</p>
            </div>

            {/* Operational Info Section */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">{t('operationalInfo')}</h3>
            </div>

            <div>
              <label className="text-sm font-medium">{t('linkedDriver')} <span className="text-red-500">*</span></label>
              <select
                name="linkedDriver"
                value={formData.linkedDriver}
                onChange={handleChange}
                className={`w-full border rounded-lg px-3 py-2 ${errors.linkedDriver ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">{t('selectLinkedDriver')}</option>
                <option value="driver1">Driver 1</option>
                <option value="driver2">Driver 2</option>
                <option value="driver3">Driver 3</option>
              </select>
              {errors.linkedDriver && <p className="text-red-500 text-xs mt-1">{errors.linkedDriver}</p>}
            </div>

            <div>
              <label className="text-sm font-medium">{t('insuranceExpiryDate')} <span className="text-red-500">*</span></label>
              <div className="relative">
                <input
                  type="date"
                  id="insuranceExpiryDate"
                  name="insuranceExpiryDate"
                  value={formData.insuranceExpiryDate}
                  onChange={handleChange}
                  className={`w-full border rounded-lg px-3 py-2 pl-10 pr-3 cursor-pointer ${errors.insuranceExpiryDate ? 'border-red-500' : 'border-gray-300'}`}
                />
                <div 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                  onClick={() => handleCalendarClick('insuranceExpiryDate')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              {errors.insuranceExpiryDate && <p className="text-red-500 text-xs mt-1">{errors.insuranceExpiryDate}</p>}
            </div>

            {/* Insurance Policy Section */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">{t('insurancePolicy')}</h3>
            </div>

            <div>
              <label className="text-sm font-medium">{t('insurancePolicyNumber')} <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="insurancePolicyNumber"
                value={formData.insurancePolicyNumber}
                onChange={handleChange}
                placeholder={t('enterInsurancePolicyNumber')}
                className={`w-full border rounded-lg px-3 py-2 ${errors.insurancePolicyNumber ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.insurancePolicyNumber && <p className="text-red-500 text-xs mt-1">{errors.insurancePolicyNumber}</p>}
            </div>

            <div>
              <label className="text-sm font-medium">{t('uploadInsuranceCopy')} <span className="text-red-500">*</span></label>
              <div 
                className={`flex items-center justify-between border rounded-lg px-3 py-2 cursor-pointer ${
                  errors.insuranceCopy ? 'border-red-500' : 'border-gray-300'
                }`}
                onClick={() => handleCustomFileClick(insuranceCopyRef)}
              >
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                  <span className="text-gray-500">
                    {fileNames.insuranceCopy ? fileNames.insuranceCopy : t('uploadInsuranceCopy')}
                  </span>
                </div>
                <span className="text-blue-600 text-sm">{t('browse')}</span>
              </div>
              <input
                type="file"
                name="insuranceCopy"
                ref={insuranceCopyRef}
                onChange={handleChange}
                className="hidden"
              />
              {errors.insuranceCopy && <p className="text-red-500 text-xs mt-1">{errors.insuranceCopy}</p>}
              <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-500">
                  {fileNames.insuranceCopy ? t('fileSelected') : t('noFileChosen')}
                </span>
              </div>
            </div>

            {/* Financial Info Section */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">{t('financialInfo')}</h3>
            </div>

            <div>
              <label className="text-sm font-medium">{t('paymentTerms')} <span className="text-red-500">*</span></label>
              <select
                name="paymentTerms"
                value={formData.paymentTerms}
                onChange={handleChange}
                className={`w-full border rounded-lg px-3 py-2 ${errors.paymentTerms ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">{t('selectPaymentTerms')}</option>
                <option value="net15">{t('net15')}</option>
                <option value="net30">{t('net30')}</option>
                <option value="net45">{t('net45')}</option>
                <option value="net60">{t('net60')}</option>
              </select>
              {errors.paymentTerms && <p className="text-red-500 text-xs mt-1">{errors.paymentTerms}</p>}
            </div>

            <div>
              <label className="text-sm font-medium">{t('payables')} <span className="text-red-500">*</span></label>
              <div className="flex items-center">
                <span className="bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg px-3 py-2">AED</span>
                <input
                  type="number"
                  name="financialLimit"
                  value={formData.financialLimit}
                  onChange={handleChange}
                  className={`w-full border rounded-r-lg px-3 py-2 ${errors.financialLimit ? 'border-red-500' : 'border-gray-300'}`}
                />
              </div>
              {errors.financialLimit && <p className="text-red-500 text-xs mt-1">{errors.financialLimit}</p>}
            </div>

          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              {t('addVendor')}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

