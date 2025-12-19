import { useState, useCallback, useRef } from 'react';

const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validateName = (name: string) => /^[A-Za-z\s]{3,}$/.test(name);
const validatePassword = (password: string) =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);

export default function AddCustomer() {
  const generateCustomerId = useCallback(() => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `C-Ag-${randomNum}`;
  }, []);

  const [formData, setFormData] = useState({
    customerId: generateCustomerId(),
    status: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    countryCode: '+971',
    password: '',
    confirmPassword: '',
    emiratesId: null as File | null,
    passport: null as File | null,
    companyName: '',
    tradeLicenseNumber: '',
    tradeLicenseExpiry: '',
    tradeLicenseCopy: null as File | null,
    vatRegistered: 'No', // Default value
    trnNumber: '',
    officeAddress: '',
    paymentTerms: '',
    creditLimit: '',
    outstandingBalance: '50000',
    vatCertificate: null as File | null
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');
  const [fileNames, setFileNames] = useState({
    emiratesId: '',
    passport: '',
    tradeLicenseCopy: '',
    vatCertificate: ''
  });
  const [showAllErrors, setShowAllErrors] = useState(false);

  const emiratesIdRef = useRef<HTMLInputElement>(null);
  const passportRef = useRef<HTMLInputElement>(null);
  const tradeLicenseCopyRef = useRef<HTMLInputElement>(null);
  const vatCertificateRef = useRef<HTMLInputElement>(null);

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
        if (!value.trim()) return 'This field is required';
        if (!validateName(value)) return 'Only alphabets allowed (min 3 chars)';
        return '';
      case 'email':
        if (!value) return 'Email is required';
        if (!validateEmail(value)) return 'Invalid email address';
        return '';
      case 'phone':
        if (!value) return 'Mobile number is required';
        if (!/^\d+$/.test(value)) return 'Only numbers are allowed';
        if (formData.countryCode === '+971' && value.length !== 9)
          return 'UAE mobile number must be 9 digits';
        return '';
      case 'password':
        if (!value) return 'Password is required';
        if (!validatePassword(value))
          return 'Password must be at least 8 characters, include 1 uppercase, 1 number, and 1 symbol';
        return '';
      case 'confirmPassword':
        if (!value) return 'Confirm your password';
        if (value !== formData.password) return 'Passwords do not match';
        return '';
      case 'tradeLicenseExpiry':
        if (!value) return 'Trade license expiry date is required';
        if (new Date(value) <= new Date()) return 'Trade license must not be expired';
        return '';
      case 'trnNumber':
        if (formData.vatRegistered === 'Yes' && !value) return 'TRN number is required when VAT registered';
        return '';
      case 'creditLimit':
        if (formData.paymentTerms === 'Credit' && !value) return 'Credit limit is required for credit payment terms';
        return '';
      case 'vatRegistered':
        if (!value) return 'This field is required';
        return '';
      case 'emiratesId':
      case 'tradeLicenseCopy':
      case 'status':
      case 'companyName':
      case 'tradeLicenseNumber':
      case 'officeAddress':
      case 'paymentTerms':
        return value ? '' : 'This field is required';
      default:
        return '';
    }
  };

  const handleFileChange = (name: string, file: File | null) => {
    setFormData(prev => ({ ...prev, [name]: file }));
    setFileNames(prev => ({ ...prev, [name]: file ? file.name : '' }));
    if (showAllErrors) {
      setErrors(prev => ({ ...prev, [name]: file ? '' : 'This field is required' }));
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

  // Handle radio button change specifically
  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (showAllErrors) {
      const errorMsg = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: errorMsg }));
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
    setSuccessMessage('Customer added successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
    setFormData({
      customerId: generateCustomerId(),
      status: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      countryCode: '+971',
      password: '',
      confirmPassword: '',
      emiratesId: null,
      passport: null,
      companyName: '',
      tradeLicenseNumber: '',
      tradeLicenseExpiry: '',
      tradeLicenseCopy: null,
      vatRegistered: 'No',
      trnNumber: '',
      officeAddress: '',
      paymentTerms: '',
      creditLimit: '',
      outstandingBalance: '50000',
      vatCertificate: null
    });
    setFileNames({
      emiratesId: '',
      passport: '',
      tradeLicenseCopy: '',
      vatCertificate: ''
    });
    setShowAllErrors(false);
  };

  const handleCustomFileClick = (ref: React.RefObject<HTMLInputElement | null>): void => {
    ref.current?.click();
  };

  return (
    <div className="min-h-screen p-6">
      {/* Success Popup */}
      {successMessage && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
          <div className="bg-white p-6 rounded-xl shadow-lg z-10 text-center max-w-sm mx-auto">
            <h2 className="text-green-600 text-xl font-semibold mb-2">Success!</h2>
            <p className="text-gray-700 mb-4">{successMessage}</p>
            <button
              onClick={() => setSuccessMessage('')}
              className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* Main Form Content */}
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">ADD CUSTOMER</h1>
        <p className="text-center text-gray-500 mb-6">
          Please Fill In The Form Below to Add Customer
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Customer ID */}
            <div>
              <label className="text-sm font-medium">Customer ID</label>
              <input
                type="text"
                name="customerId"
                value={formData.customerId}
                readOnly
                className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100"
              />
            </div>

            {/* Status */}
            <div>
              <label className="text-sm font-medium">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={`w-full border rounded-lg px-3 py-2 ${showAllErrors && errors.status ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">Select Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>
              {showAllErrors && errors.status && <p className="text-red-500 text-xs mt-1">{errors.status}</p>}
            </div>

            {/* Authorized Person Section */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">Authorized Person</h3>
            </div>

            <div>
              <label className="text-sm font-medium">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Enter Your First Name"
                className={`w-full border rounded-lg px-3 py-2 ${showAllErrors && errors.firstName ? 'border-red-500' : 'border-gray-300'
                  }`}
              />
              {showAllErrors && errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
            </div>

            <div>
              <label className="text-sm font-medium">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Enter Your Last Name"
                className={`w-full border rounded-lg px-3 py-2 ${showAllErrors && errors.lastName ? 'border-red-500' : 'border-gray-300'
                  }`}
              />
              {showAllErrors && errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-medium">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter Your Email"
                className={`w-full border rounded-lg px-3 py-2 ${showAllErrors && errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
              />
              {showAllErrors && errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div className="mb-4">
              <label className="text-sm font-medium mb-1 block">
                Phone <span className="text-red-500">*</span>
              </label>

              <div className="flex gap-2">
                <select
                  name="countryCode"
                  value={formData.countryCode}
                  onChange={handleChange}
                  className="w-1/3 border border-gray-300 rounded-lg px-2 py-2 bg-gray-50"
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
                  placeholder={formData.countryCode === '+971' ? '999 999 9999' : 'Enter Phone Number'}
                  className={`w-full border rounded-lg px-3 py-2 ${showAllErrors && errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                />
              </div>

              <div className="flex justify-between mt-2"> {/* Increased from mt-1 to mt-2 */}
                <span className="text-xs text-gray-500">Full: {getFullPhoneNumber()}</span>

                {showAllErrors && errors.phone ? (
                  <span className="text-red-500 text-xs">{errors.phone}</span>
                ) : formData.countryCode === '+971' && (
                  <span className="text-xs text-gray-500">9 digits required</span>
                )}
              </div>
            </div>


            {/* Password & Confirm Password */}
            <div>
              <label className="text-sm font-medium">Password <span className="text-red-500">*</span></label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter Your Password"
                className={`w-full border rounded-lg px-3 py-2 ${showAllErrors && errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
              />
              {showAllErrors && errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className="text-sm font-medium">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-Enter Your Password"
                className={`w-full border rounded-lg px-3 py-2 ${showAllErrors && errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                  }`}
              />
              {showAllErrors && errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
            </div>

            {/* Emirates ID & Passport */}
            <div>
              <label className="text-sm font-medium">Upload Emirates ID <span className="text-red-500">*</span></label>
              <div
                className={`flex items-center justify-between border rounded-lg px-3 py-2 cursor-pointer ${showAllErrors && errors.emiratesId ? 'border-red-500' : 'border-gray-300'}`}
                onClick={() => {
                  if (emiratesIdRef.current) {
                    emiratesIdRef.current.click();
                  }
                }}>
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                  <span className="text-gray-500">
                    {fileNames.emiratesId ? fileNames.emiratesId : 'Upload Emirates ID'}
                  </span>
                </div>
                <span className="text-blue-600 text-sm">Browse</span>
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
                  {fileNames.emiratesId ? 'File selected' : 'No file chosen'}
                </span>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Upload Passport</label>
              <div
                className="flex items-center justify-between border border-gray-300 rounded-lg px-3 py-2 cursor-pointer"
                onClick={() => {
                  if (passportRef.current) {
                    passportRef.current.click();
                  }
                }}>
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                  <span className="text-gray-500">
                    {fileNames.passport ? fileNames.passport : 'Upload Passport'}
                  </span>
                </div>
                <span className="text-gray-600 text-sm">Browse</span>
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
                  {fileNames.passport ? 'File selected' : 'No file chosen'}
                </span>
                <span className="text-xs text-gray-500">Optional (For Expats)</span>
              </div>
            </div>

            {/* Company Details Section */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">Company Details</h3>
            </div>

            <div>
              <label className="text-sm font-medium">Company Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Enter Company Name"
                className={`w-full border rounded-lg px-3 py-2 ${showAllErrors && errors.companyName ? 'border-red-500' : 'border-gray-300'}`}
              />
              {showAllErrors && errors.companyName && <p className="text-red-500 text-xs mt-1">{errors.companyName}</p>}
            </div>

            <div>
              <label className="text-sm font-medium">Trade License Number <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="tradeLicenseNumber"
                value={formData.tradeLicenseNumber}
                onChange={handleChange}
                placeholder="Enter Trade License Number"
                className={`w-full border rounded-lg px-3 py-2 ${showAllErrors && errors.tradeLicenseNumber ? 'border-red-500' : 'border-gray-300'}`}
              />
              {showAllErrors && errors.tradeLicenseNumber && <p className="text-red-500 text-xs mt-1">{errors.tradeLicenseNumber}</p>}
            </div>

            <div>
              <label className="text-sm font-medium">Expiry Date (Trade License) <span className="text-red-500">*</span></label>
              <div className="relative">
                <input
                  type="date"
                  id="tradeLicenseExpiry"
                  name="tradeLicenseExpiry"
                  value={formData.tradeLicenseExpiry}
                  onChange={handleChange}
                  min={getMinDate()}
                  className={`w-full border rounded-lg px-3 py-2 pl-10 pr-3 cursor-pointer ${showAllErrors && errors.tradeLicenseExpiry ? 'border-red-500' : 'border-gray-300'}`}
                />
                <div
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                  onClick={() => handleCalendarClick('tradeLicenseExpiry')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              {showAllErrors && errors.tradeLicenseExpiry && <p className="text-red-500 text-xs mt-1">{errors.tradeLicenseExpiry}</p>}
            </div>

            <div>
              <label className="text-sm font-medium">Upload License Copy <span className="text-red-500">*</span></label>
              <div
                className="flex items-center justify-between border rounded-lg px-3 py-2 cursor-pointer"
                onClick={() => handleCustomFileClick(tradeLicenseCopyRef)}
              >
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                  <span className="text-gray-500">
                    {fileNames.tradeLicenseCopy ? fileNames.tradeLicenseCopy : 'Upload License Copy'}
                  </span>
                </div>
                <span className="text-blue-600 text-sm">Browse</span>
              </div>
              <input
                type="file"
                name="tradeLicenseCopy"
                ref={tradeLicenseCopyRef}
                onChange={handleChange}
                className="hidden"
              />
              {showAllErrors && errors.tradeLicenseCopy && <p className="text-red-500 text-xs mt-1">{errors.tradeLicenseCopy}</p>}
              <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-500">
                  {fileNames.tradeLicenseCopy ? 'File selected' : 'No file chosen'}
                </span>
              </div>
            </div>

            {/* VAT Registration - Radio Buttons */}
            <div>
              <label className="text-sm font-medium">
                VAT Registered? <span className="text-red-500">*</span>
              </label>
              <div className={`flex space-x-4 mt-2 ${showAllErrors && errors.vatRegistered ? 'border border-red-500 rounded-lg p-2' : ''}`}>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="vatRegistered"
                    value="Yes"
                    checked={formData.vatRegistered === 'Yes'}
                    onChange={handleRadioChange}
                    className="h-4 w-4 accent-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Yes</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="vatRegistered"
                    value="No"
                    checked={formData.vatRegistered === 'No'}
                    onChange={handleRadioChange}
                    className="h-4 w-4 accent-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">No</span>
                </label>
              </div>
              {showAllErrors && errors.vatRegistered && (
                <p className="text-red-500 text-xs mt-1">{errors.vatRegistered}</p>
              )}
            </div>


            <div>
              <label className="text-sm font-medium">TRN Number <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="trnNumber"
                value={formData.trnNumber}
                onChange={handleChange}
                placeholder="Enter TRN Number"
                disabled={formData.vatRegistered !== 'Yes'}
                className={`w-full border rounded-lg px-3 py-2 ${showAllErrors && errors.trnNumber ? 'border-red-500' : 'border-gray-300'
                  } ${formData.vatRegistered !== 'Yes' ? 'bg-gray-100' : ''}`}
              />
              {showAllErrors && errors.trnNumber && <p className="text-red-500 text-xs mt-1">{errors.trnNumber}</p>}
            </div>

            {/* Office Address */}
            <div className="md:col-span-2">
              <label className="text-sm font-medium">Office Address <span className="text-red-500">*</span></label>
              <textarea
                name="officeAddress"
                value={formData.officeAddress}
                onChange={handleChange}
                placeholder="Enter Address"
                rows={3}
                className={`w-full border rounded-lg px-3 py-2 ${showAllErrors && errors.officeAddress ? 'border-red-500' : 'border-gray-300'}`}
              />
              {showAllErrors && errors.officeAddress && <p className="text-red-500 text-xs mt-1">{errors.officeAddress}</p>}
              <p className="text-xs text-gray-500 mt-1">Min: 5 Max 3000 characters</p>
            </div>

            {/* Financial Info Section */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">Financial Info</h3>
            </div>

            <div>
              <label className="text-sm font-medium">Payment Terms <span className="text-red-500">*</span></label>
              <select
                name="paymentTerms"
                value={formData.paymentTerms}
                onChange={handleChange}
                className={`w-full border rounded-lg px-3 py-2 ${showAllErrors && errors.paymentTerms ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">Select Payment Terms</option>
                <option value="Prepaid">Prepaid</option>
                <option value="Credit">Credit</option>
                <option value="Postpaid">Postpaid</option>
              </select>
              {showAllErrors && errors.paymentTerms && <p className="text-red-500 text-xs mt-1">{errors.paymentTerms}</p>}
            </div>

            <div>
              <label className="text-sm font-medium">Credit Limit <span className="text-red-500">*</span></label>
              <input
                type="number"
                name="creditLimit"
                value={formData.creditLimit}
                onChange={handleChange}
                placeholder="Enter Credit Limit"
                disabled={formData.paymentTerms !== 'Credit'}
                className={`w-full border rounded-lg px-3 py-2 ${showAllErrors && errors.creditLimit ? 'border-red-500' : 'border-gray-300'
                  } ${formData.paymentTerms !== 'Credit' ? 'bg-gray-100' : ''}`}
              />
              {showAllErrors && errors.creditLimit && <p className="text-red-500 text-xs mt-1">{errors.creditLimit}</p>}
            </div>

            <div>
              <label className="text-sm font-medium">Outstanding Balance</label>
              <div className="flex items-center">
                <span className="bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg px-3 py-2">AED</span>
                <input
                  type="text"
                  name="outstandingBalance"
                  value={formData.outstandingBalance}
                  readOnly
                  className="w-full border border-l-0 rounded-r-lg px-3 py-2 bg-gray-100"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">AED 50,000 (Auto-calculated)</p>
            </div>

            <div>
              <label className="text-sm font-medium">VAT Certificate</label>
              <div
                className="flex items-center justify-between border border-gray-300 rounded-lg px-3 py-2 cursor-pointer"
                onClick={() => handleCustomFileClick(vatCertificateRef)}
              >
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                  <span className="text-gray-500">
                    {fileNames.vatCertificate ? fileNames.vatCertificate : 'Upload VAT Certificate Copy'}
                  </span>
                </div>
                <span className="text-gray-600 text-sm">Browse</span>
              </div>
              <input
                type="file"
                name="vatCertificate"
                ref={vatCertificateRef}
                onChange={handleChange}
                className="hidden"
              />
              <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-500">
                  {fileNames.vatCertificate ? 'File selected' : 'No file chosen'}
                </span>
                <span className="text-xs text-gray-500">Optional</span>
              </div>
            </div>

          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Add Customer
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}