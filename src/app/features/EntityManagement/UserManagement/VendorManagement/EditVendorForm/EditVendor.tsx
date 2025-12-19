import { useState, useCallback, useRef } from 'react';

const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validateName = (name: string) => /^[A-Za-z\s]{3,}$/.test(name);
const validateIBAN = (iban: string) => /^AE[0-9]{2}[A-Z0-9]{4,}$/i.test(iban.replace(/\s/g, ''));
// Strong password validation: at least 8 chars, 1 uppercase, 1 number, 1 symbol
const validatePassword = (password: string) => 
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);

export default function EditVendor() {
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
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  // Update ref types to be non-nullable
  const emiratesIdRef = useRef<HTMLInputElement>(null!);
  const passportRef = useRef<HTMLInputElement>(null!);
  const insuranceCopyRef = useRef<HTMLInputElement>(null!);

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
        if (!value.trim()) return 'This field is required';
        if (!validateName(value)) return 'Only alphabets allowed (min 3 chars)';
        return '';
      case 'email':
        if (!value) return 'Email is required';
        if (!validateEmail(value)) return 'Invalid email address';
        return '';
      case 'phone':
        if (!value) return 'Mobile number is required';
        // Only allow numbers
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
      case 'iban':
        if (!value.trim()) return 'IBAN is required';
        if (!validateIBAN(value)) return 'IBAN must start with AE';
        return '';
      case 'emiratesIdExpiryDate':
        if (!value) return 'Emirates ID expiry date is required';
        if (new Date(value) <= new Date()) return 'Emirates ID must not be expired';
        return '';
      case 'insuranceExpiryDate':
        if (!value) return 'Insurance expiry date is required';
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
        return value ? '' : 'This field is required';
      default:
        return '';
    }
  };

  const handleFileChange = (name: string, file: File | null) => {
    setFormData(prev => ({ ...prev, [name]: file }));
    setFileNames(prev => ({ ...prev, [name]: file ? file.name : '' }));
    setErrors(prev => ({ ...prev, [name]: file ? '' : 'This field is required' }));
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
  const handleCustomFileClick = (inputRef: React.RefObject<HTMLInputElement>) => {
    inputRef.current?.click();
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
    setSuccessMessage('Vendor updated successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  // --- Delete Vendor Function ---
  const handleDeleteVendor = () => {
    // In a real application, you would send a delete request to your backend here
    setSuccessMessage('Vendor deleted successfully!');
    setShowDeletePopup(false);
    
    // Reset form after deletion
    setFormData({
      vendorId: generateVendorId(),
      status: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      countryCode: '+971',
      password: '',
      confirmPassword: '',
      emiratesId: null,
      emiratesIdExpiryDate: '',
      passport: null,
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
      insuranceCopy: null,
      paymentTerms: '',
      financialLimit: '20000'
    });
    setFileNames({
      emiratesId: '',
      passport: '',
      insuranceCopy: ''
    });
    
    setTimeout(() => setSuccessMessage(''), 3000);
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

      {/* Delete Confirmation Popup */}
      {showDeletePopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
          <div className="bg-white p-6 rounded-xl shadow-lg z-10 text-center max-w-sm mx-auto">
            <div className="w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Delete Vendor</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this vendor? This action cannot be undone.
            </p>
            <div className="flex space-x-3 justify-center">
              <button
                onClick={() => setShowDeletePopup(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteVendor}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Form Content */}
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">EDIT VENDOR</h1>
        <p className="text-center text-gray-500 mb-6">
          Please Fill In The Form Below to Edit Vendor
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Vendor ID */}
            <div>
              <label className="text-sm font-medium">Vendor ID</label>
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
                Status <span className="text-red-500">*</span>
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={`w-full border rounded-lg px-3 py-2 ${errors.status ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">Select Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status}</p>}
            </div>

            {/* Authorized Person */}
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
                placeholder="Enter First Name"
                className={`w-full border rounded-lg px-3 py-2 ${
                  errors.firstName ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
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
                placeholder="Enter Last Name"
                className={`w-full border rounded-lg px-3 py-2 ${
                  errors.lastName ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
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
                placeholder="Enter Email"
                className={`w-full border rounded-lg px-3 py-2 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="text-sm font-medium">
                Phone <span className="text-red-500">*</span>
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
                {errors.phone ? (
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
                className={`w-full border rounded-lg px-3 py-2 ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
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
                className={`w-full border rounded-lg px-3 py-2 ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
            </div>

            {/* Emirates ID Fields */}
            <div>
              <label className="text-sm font-medium">Upload Emirates ID <span className="text-red-500">*</span></label>
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
              {errors.emiratesId && <p className="text-red-500 text-xs mt-1">{errors.emiratesId}</p>}
              <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-500">
                  {fileNames.emiratesId ? 'File selected' : 'No file chosen'}
                </span>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Emirates ID Expiry Date <span className="text-red-500">*</span></label>
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
              <label className="text-sm font-medium">Upload Passport</label>
              <div 
                className="flex items-center justify-between border border-gray-300 rounded-lg px-3 py-2 cursor-pointer"
                onClick={() => handleCustomFileClick(passportRef)}
              >
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

            {/* Company Info Section */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">Company Info</h3>
            </div>

            <div>
              <label className="text-sm font-medium">Vendor Company Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Enter Company Name"
                className={`w-full border rounded-lg px-3 py-2 ${errors.companyName ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.companyName && <p className="text-red-500 text-xs mt-1">{errors.companyName}</p>}
            </div>

            <div>
              <label className="text-sm font-medium">Trade License Number <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="tradeLicenseNumber"
                value={formData.tradeLicenseNumber}
                onChange={handleChange}
                placeholder="Enter Trade License Number"
                className={`w-full border rounded-lg px-3 py-2 ${errors.tradeLicenseNumber ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.tradeLicenseNumber && <p className="text-red-500 text-xs mt-1">{errors.tradeLicenseNumber}</p>}
            </div>

            <div>
              <label className="text-sm font-medium">VAT / TRN Number <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="vatNumber"
                value={formData.vatNumber}
                onChange={handleChange}
                placeholder="Enter VAT / TRN Number"
                className={`w-full border rounded-lg px-3 py-2 ${errors.vatNumber ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.vatNumber && <p className="text-red-500 text-xs mt-1">{errors.vatNumber}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-medium">Office Address <span className="text-red-500">*</span></label>
              <textarea
                name="officeAddress"
                value={formData.officeAddress}
                onChange={handleChange}
                placeholder="Enter Address"
                rows={3}
                className={`w-full border rounded-lg px-3 py-2 ${errors.officeAddress ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.officeAddress && <p className="text-red-500 text-xs mt-1">{errors.officeAddress}</p>}
            </div>

            {/* Bank Details Section */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">Bank Details</h3>
            </div>

            <div>
              <label className="text-sm font-medium">Account Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="accountName"
                value={formData.accountName}
                onChange={handleChange}
                placeholder="Enter Account Name"
                className={`w-full border rounded-lg px-3 py-2 ${errors.accountName ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.accountName && <p className="text-red-500 text-xs mt-1">{errors.accountName}</p>}
            </div>

            <div>
              <label className="text-sm font-medium">Bank Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="bankName"
                value={formData.bankName}
                onChange={handleChange}
                placeholder="Enter Bank Name"
                className={`w-full border rounded-lg px-3 py-2 ${errors.bankName ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.bankName && <p className="text-red-500 text-xs mt-1">{errors.bankName}</p>}
            </div>

            <div>
              <label className="text-sm font-medium">IBAN <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="iban"
                value={formData.iban}
                onChange={handleChange}
                placeholder="Enter IBAN (AE...)"
                className={`w-full border rounded-lg px-3 py-2 ${errors.iban ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.iban && <p className="text-red-500 text-xs mt-1">{errors.iban}</p>}
              <p className="text-xs text-gray-500 mt-1">Must start with AE (UAE format)</p>
            </div>

            {/* Operational Info Section */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">Operational Info</h3>
            </div>

            <div>
              <label className="text-sm font-medium">Linked Drivers <span className="text-red-500">*</span></label>
              <select
                name="linkedDriver"
                value={formData.linkedDriver}
                onChange={handleChange}
                className={`w-full border rounded-lg px-3 py-2 ${errors.linkedDriver ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">Select Driver</option>
                <option value="driver1">Driver 1</option>
                <option value="driver2">Driver 2</option>
                <option value="driver3">Driver 3</option>
              </select>
              {errors.linkedDriver && <p className="text-red-500 text-xs mt-1">{errors.linkedDriver}</p>}
            </div>

            <div>
              <label className="text-sm font-medium">Insurance Expiry Date <span className="text-red-500">*</span></label>
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
              <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">Insurance Policy</h3>
            </div>

            <div>
              <label className="text-sm font-medium">Insurance Policy Number <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="insurancePolicyNumber"
                value={formData.insurancePolicyNumber}
                onChange={handleChange}
                placeholder="Enter Insurance Policy Number"
                className={`w-full border rounded-lg px-3 py-2 ${errors.insurancePolicyNumber ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.insurancePolicyNumber && <p className="text-red-500 text-xs mt-1">{errors.insurancePolicyNumber}</p>}
            </div>

            <div>
              <label className="text-sm font-medium">Insurance Policy Copy <span className="text-red-500">*</span></label>
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
                    {fileNames.insuranceCopy ? fileNames.insuranceCopy : 'Upload Insurance Copy'}
                  </span>
                </div>
                <span className="text-blue-600 text-sm">Browse</span>
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
                  {fileNames.insuranceCopy ? 'File selected' : 'No file chosen'}
                </span>
              </div>
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
                className={`w-full border rounded-lg px-3 py-2 ${errors.paymentTerms ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">Select Payment Terms</option>
                <option value="net15">Net 15</option>
                <option value="net30">Net 30</option>
                <option value="net45">Net 45</option>
                <option value="net60">Net 60</option>
              </select>
              {errors.paymentTerms && <p className="text-red-500 text-xs mt-1">{errors.paymentTerms}</p>}
            </div>

            <div>
              <label className="text-sm font-medium">Payables <span className="text-red-500">*</span></label>
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

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4 pt-4">
            <button
              type="button"
              onClick={() => setShowDeletePopup(true)}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete Vendor
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Update Vendor
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}