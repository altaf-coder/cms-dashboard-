import { useState, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';

const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validateName = (name: string) => /^[A-Za-z\s]{3,}$/.test(name);
const validatePassword = (password: string) =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);

export default function ADDDriver() {
  const { t } = useTranslation();
  const generateDriverId = useCallback(() => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `D-Naj-${randomNum}`;
  }, []);

  const [formData, setFormData] = useState({
    driverId: generateDriverId(),
    status: 'Pending Approval',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    countryCode: '+971', // Added country code
    password: '',
    confirmPassword: '',
    emiratesId: null as File | null,
    emiratesIdExpiry: '',
    visa: null as File | null,
    visaExpiry: '',
    passport: null as File | null,
    tradeLicenseNumber: '',
    drivingLicenseNumber: '',
    drivingLicenseExpiry: '',
    drivingLicenseCopy: null as File | null,
    assignedTruck: '',
    assignedVendor: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');
  const [fileNames, setFileNames] = useState({
    emiratesId: '',
    visa: '',
    passport: '',
    drivingLicenseCopy: ''
  });
  const [showAllErrors, setShowAllErrors] = useState(false);

  const emiratesIdRef = useRef<HTMLInputElement | null>(null);
  const visaRef = useRef<HTMLInputElement | null>(null);
  const passportRef = useRef<HTMLInputElement | null>(null);
  const drivingLicenseCopyRef = useRef<HTMLInputElement | null>(null);

  // Country codes array
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

  const getFullPhoneNumber = () => `${formData.countryCode} ${formData.phone}`;

  const handleCalendarClick = (fieldName: string) => {
    const dateInput = document.getElementById(fieldName) as HTMLInputElement;
    if (dateInput) dateInput.showPicker();
  };

  // Calculate minimum date (2 months from today)
  const getMinDate = () => {
    const today = new Date();
    const minDate = new Date(today);
    minDate.setMonth(today.getMonth() + 2);
    return minDate.toISOString().split('T')[0];
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
      case 'emiratesIdExpiry':
        if (!value) return t('emiratesIdExpiryRequired');
        if (new Date(value) <= new Date()) return t('emiratesIdMustNotBeExpired');
        if (new Date(value) <= new Date(new Date().setMonth(new Date().getMonth() + 2)))
          return t('emiratesIdMustBeValidFor2Months');
        return '';
      case 'visaExpiry':
        if (!value) return t('visaExpiryRequired');
        if (new Date(value) <= new Date()) return t('visaMustNotBeExpired');
        if (new Date(value) <= new Date(new Date().setMonth(new Date().getMonth() + 2)))
          return t('visaMustBeValidFor2Months');
        return '';
      case 'drivingLicenseExpiry':
        if (!value) return t('drivingLicenseExpiryRequired');
        if (new Date(value) <= new Date()) return t('licenseMustNotBeExpired');
        if (new Date(value) <= new Date(new Date().setMonth(new Date().getMonth() + 2)))
          return t('licenseMustBeValidFor2Months');
        return '';
      case 'emiratesId':
      case 'visa':
      case 'drivingLicenseCopy':
      case 'status':
      case 'tradeLicenseNumber':
      case 'drivingLicenseNumber':
      case 'assignedTruck':
      case 'assignedVendor':
        return value ? '' : t('thisFieldIsRequired');
      default:
        return '';
    }
  };

  const handleFileChange = (name: string, file: File | null) => {
    setFormData(prev => ({ ...prev, [name]: file }));
    setFileNames(prev => ({ ...prev, [name]: file ? file.name : '' }));
    if (showAllErrors) {
      setErrors(prev => ({ ...prev, [name]: file ? '' : t('thisFieldIsRequired') }));
    }
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
      if (showAllErrors) {
        const errorMsg = validateField(name, value);
        setErrors(prev => ({ ...prev, [name]: errorMsg }));
      }
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setFormData(prev => ({ ...prev, phone: value }));
    if (showAllErrors) {
      setErrors(prev => ({ ...prev, phone: validateField('phone', value) }));
    }
  };

  // --- Form Submit ---
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, (formData as any)[key]);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    setShowAllErrors(true);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setSuccessMessage(t('driverAddedSuccessfully') + ' ' + t('status') + ': ' + t('pendingApproval'));
    setTimeout(() => setSuccessMessage(''), 3000);
    setFormData({
      driverId: generateDriverId(),
      status: 'Pending Approval',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      countryCode: '+971',
      password: '',
      confirmPassword: '',
      emiratesId: null,
      emiratesIdExpiry: '',
      visa: null,
      visaExpiry: '',
      passport: null,
      tradeLicenseNumber: '',
      drivingLicenseNumber: '',
      drivingLicenseExpiry: '',
      drivingLicenseCopy: null,
      assignedTruck: '',
      assignedVendor: ''
    });
    setFileNames({
      emiratesId: '',
      visa: '',
      passport: '',
      drivingLicenseCopy: ''
    });
    setShowAllErrors(false);
  };

  const handleCustomFileClick = (ref: React.RefObject<HTMLInputElement | null>) => {
    ref.current?.click();
  };

  return (
    <div className="min-h-screen p-6">
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

      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">{t('addDriver')}</h1>
        <p className="text-center text-gray-500 mb-6">
          {t('pleaseFillFormToAddDriver')}
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">{t('driverId')}</label>
              <input
                type="text"
                name="driverId"
                value={formData.driverId}
                readOnly
                className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100"
              />
            </div>

            <div>
              <label className="text-sm font-medium">
                {t('status')} <span className="text-red-500">*</span>
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={`w-full border rounded-lg px-3 py-2 ${showAllErrors && errors.status ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="Pending Approval">{t('pendingApproval')}</option>
                <option value="active">{t('active')}</option>
                <option value="suspended">{t('suspended')}</option>
                <option value="inactive">{t('inactive')}</option>
              </select>
              {showAllErrors && errors.status && <p className="text-red-500 text-xs mt-1">{errors.status}</p>}
              <p className="text-xs text-gray-500 mt-1">
                {t('default')}: {t('pendingApproval')}. {t('adminWillApproveAfterVerification')}
              </p>
            </div>

            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">{t('personalInfo')}</h3>
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
                className={`w-full border rounded-lg px-3 py-2 ${showAllErrors && errors.firstName ? 'border-red-500' : 'border-gray-300'
                  }`}
              />
              {showAllErrors && errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
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
                className={`w-full border rounded-lg px-3 py-2 ${showAllErrors && errors.lastName ? 'border-red-500' : 'border-gray-300'
                  }`}
              />
              {showAllErrors && errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
            </div>

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
                className={`w-full border rounded-lg px-3 py-2 ${showAllErrors && errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
              />
              {showAllErrors && errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Phone with Country Code Dropdown */}
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
                  placeholder={formData.countryCode === '+971' ? '5XX XXX XXXX' : t('enterPhoneNumber')}
                  className={`w-2/3 border border-l-0 rounded-r-lg px-3 py-2 ${showAllErrors && errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-500">{t('full')}: {getFullPhoneNumber()}</span>
                {showAllErrors && errors.phone ? (
                  <span className="text-red-500 text-xs">{errors.phone}</span>
                ) : formData.countryCode === '+971' && (
                  <span className="text-xs text-gray-500">9 {t('digitsRequired')}</span>
                )}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">{t('password')} <span className="text-red-500">*</span></label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder={t('enterYourPassword')}
                className={`w-full border rounded-lg px-3 py-2 ${showAllErrors && errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
              />
              {showAllErrors && errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
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
                className={`w-full border rounded-lg px-3 py-2 ${showAllErrors && errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                  }`}
              />
              {showAllErrors && errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
            </div>

            <div>
              <label className="text-sm font-medium">{t('uploadEmiratesId')} <span className="text-red-500">*</span></label>
              <div
                className={`flex items-center justify-between border rounded-lg px-3 py-2 cursor-pointer ${showAllErrors && errors.emiratesId ? 'border-red-500' : 'border-gray-300'
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
              {showAllErrors && errors.emiratesId && <p className="text-red-500 text-xs mt-1">{errors.emiratesId}</p>}
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
                  id="emiratesIdExpiry"
                  name="emiratesIdExpiry"
                  value={formData.emiratesIdExpiry}
                  onChange={handleChange}
                  min={getMinDate()}
                  className={`w-full border rounded-lg px-3 py-2 pl-10 pr-3 cursor-pointer ${showAllErrors && errors.emiratesIdExpiry ? 'border-red-500' : 'border-gray-300'}`}
                />
                <div
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                  onClick={() => handleCalendarClick('emiratesIdExpiry')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              {showAllErrors && errors.emiratesIdExpiry && <p className="text-red-500 text-xs mt-1">{errors.emiratesIdExpiry}</p>}
            </div>

            <div>
              <label className="text-sm font-medium">{t('uploadVisa')} <span className="text-red-500">*</span></label>
              <div
                className={`flex items-center justify-between border rounded-lg px-3 py-2 cursor-pointer ${showAllErrors && errors.visa ? 'border-red-500' : 'border-gray-300'
                  }`}
                onClick={() => handleCustomFileClick(visaRef)}
              >
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                  <span className="text-gray-500">
                    {fileNames.visa ? fileNames.visa : t('uploadVisa')}
                  </span>
                </div>
                <span className="text-blue-600 text-sm">{t('browse')}</span>
              </div>
              <input
                type="file"
                name="visa"
                ref={visaRef}
                onChange={handleChange}
                className="hidden"
              />
              {showAllErrors && errors.visa && <p className="text-red-500 text-xs mt-1">{errors.visa}</p>}
              <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-500">
                  {fileNames.visa ? t('fileSelected') : t('noFileChosen')}
                </span>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">{t('visaExpiry')} <span className="text-red-500">*</span></label>
              <div className="relative">
                <input
                  type="date"
                  id="visaExpiry"
                  name="visaExpiry"
                  value={formData.visaExpiry}
                  onChange={handleChange}
                  min={getMinDate()}
                  className={`w-full border rounded-lg px-3 py-2 pl-10 pr-3 cursor-pointer ${showAllErrors && errors.visaExpiry ? 'border-red-500' : 'border-gray-300'}`}
                />
                <div
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                  onClick={() => handleCalendarClick('visaExpiry')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              {showAllErrors && errors.visaExpiry && <p className="text-red-500 text-xs mt-1">{errors.visaExpiry}</p>}
            </div>

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

            <div>
              <label className="text-sm font-medium">{t('tradeLicenseNumber')} <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="tradeLicenseNumber"
                value={formData.tradeLicenseNumber}
                onChange={handleChange}
                placeholder={t('enterTradeLicenseNumber')}
                className={`w-full border rounded-lg px-3 py-2 ${showAllErrors && errors.tradeLicenseNumber ? 'border-red-500' : 'border-gray-300'}`}
              />
              {showAllErrors && errors.tradeLicenseNumber && <p className="text-red-500 text-xs mt-1">{errors.tradeLicenseNumber}</p>}
            </div>

            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">{t('licenseInfo')}</h3>
            </div>

            <div>
              <label className="text-sm font-medium">{t('drivingLicenseNumber')} <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="drivingLicenseNumber"
                value={formData.drivingLicenseNumber}
                onChange={handleChange}
                placeholder={t('enterDrivingLicenseNumber')}
                className={`w-full border rounded-lg px-3 py-2 ${showAllErrors && errors.drivingLicenseNumber ? 'border-red-500' : 'border-gray-300'}`}
              />
              {showAllErrors && errors.drivingLicenseNumber && <p className="text-red-500 text-xs mt-1">{errors.drivingLicenseNumber}</p>}
            </div>

            <div>
              <label className="text-sm font-medium">{t('drivingLicenseExpiry')} <span className="text-red-500">*</span></label>
              <div className="relative">
                <input
                  type="date"
                  id="drivingLicenseExpiry"
                  name="drivingLicenseExpiry"
                  value={formData.drivingLicenseExpiry}
                  onChange={handleChange}
                  min={getMinDate()}
                  className={`w-full border rounded-lg px-3 py-2 pl-10 pr-3 cursor-pointer ${showAllErrors && errors.drivingLicenseExpiry ? 'border-red-500' : 'border-gray-300'}`}
                />
                <div
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                  onClick={() => handleCalendarClick('drivingLicenseExpiry')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              {showAllErrors && errors.drivingLicenseExpiry && <p className="text-red-500 text-xs mt-1">{errors.drivingLicenseExpiry}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-medium">{t('uploadDrivingLicenseCopy')} <span className="text-red-500">*</span></label>
              <div
                className={`flex items-center justify-between border rounded-lg px-3 py-2 cursor-pointer ${showAllErrors && errors.drivingLicenseCopy ? 'border-red-500' : 'border-gray-300'
                  }`}
                onClick={() => handleCustomFileClick(drivingLicenseCopyRef)}
              >
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                  <span className="text-gray-500">
                    {fileNames.drivingLicenseCopy ? fileNames.drivingLicenseCopy : t('uploadDrivingLicenseCopy')}
                  </span>
                </div>
                <span className="text-blue-600 text-sm">{t('browse')}</span>
              </div>
              <input
                type="file"
                name="drivingLicenseCopy"
                ref={drivingLicenseCopyRef}
                onChange={handleChange}
                className="hidden"
              />
              {showAllErrors && errors.drivingLicenseCopy && <p className="text-red-500 text-xs mt-1">{errors.drivingLicenseCopy}</p>}
              <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-500">
                  {fileNames.drivingLicenseCopy ? t('fileSelected') : t('noFileChosen')}
                </span>
              </div>
            </div>

            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">{t('operationalDetails')}</h3>
            </div>

            <div>
              <label className="text-sm font-medium">{t('assignedTruck')} <span className="text-red-500">*</span></label>
              <select
                name="assignedTruck"
                value={formData.assignedTruck}
                onChange={handleChange}
                className={`w-full border rounded-lg px-3 py-2 ${showAllErrors && errors.assignedTruck ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">{t('selectAssignedTruck')}</option>
                <option value="truck-001">Truck 001</option>
                <option value="truck-002">Truck 002</option>
                <option value="truck-003">Truck 003</option>
              </select>
              {showAllErrors && errors.assignedTruck && <p className="text-red-500 text-xs mt-1">{errors.assignedTruck}</p>}
            </div>

            <div>
              <label className="text-sm font-medium">{t('assignedVendor')} <span className="text-red-500">*</span></label>
              <select
                name="assignedVendor"
                value={formData.assignedVendor}
                onChange={handleChange}
                className={`w-full border rounded-lg px-3 py-2 ${showAllErrors && errors.assignedVendor ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">{t('selectVendor')}</option>
                <option value="vendor-001">Vendor 001</option>
                <option value="vendor-002">Vendor 002</option>
                <option value="vendor-003">Vendor 003</option>
              </select>
              {showAllErrors && errors.assignedVendor && <p className="text-red-500 text-xs mt-1">{errors.assignedVendor}</p>}
            </div>

          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              {t('addDriver')}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}



















