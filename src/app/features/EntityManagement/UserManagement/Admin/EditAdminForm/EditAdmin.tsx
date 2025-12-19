import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';

// Validation functions
const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const validatePhoneWithCode = (phone: string, countryCode: string) => {
  const fullPhone = countryCode + phone;
  const cleanedPhone = fullPhone.replace(/\s+/g, '');
  
  const phoneValidations: Record<string, RegExp> = {
    '+971': /^\+971[0-9]{9}$/, // UAE: 9 digits
    '+966': /^\+966[0-9]{9}$/, // KSA: 9 digits
    '+974': /^\+974[0-9]{8}$/, // Qatar: 8 digits
    '+965': /^\+965[0-9]{8}$/, // Kuwait: 8 digits
    '+973': /^\+973[0-9]{8}$/, // Bahrain: 8 digits
    '+968': /^\+968[0-9]{8}$/, // Oman: 8 digits
    '+91': /^\+91[0-9]{10}$/,  // India: 10 digits
    '+92': /^\+92[0-9]{10}$/,  // Pakistan: 10 digits
    '+1': /^\+1[0-9]{10}$/,    // USA/Canada: 10 digits
    '+44': /^\+44[0-9]{10}$/,  // UK: 10 digits
  };

  return phoneValidations[countryCode]?.test(cleanedPhone) || 
         /^\+[1-9][0-9]{0,3}[0-9]{4,14}$/.test(cleanedPhone); // Fallback
};

const validateName = (name: string) => /^[A-Za-z]{3,}$/.test(name);

const validatePassword = (password: string) => {
  const hasMinLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return {
    isValid: hasMinLength && hasUpperCase && hasNumber && hasSpecialChar,
    errors: {
      minLength: hasMinLength ? '' : 'At least 8 characters',
      upperCase: hasUpperCase ? '' : 'At least 1 uppercase letter',
      number: hasNumber ? '' : 'At least 1 number',
      specialChar: hasSpecialChar ? '' : 'At least 1 special character'
    }
  };
};

// Helper functions for phone input
const getPhonePlaceholder = (countryCode: string) => {
  const formats: Record<string, string> = {
    '+971': '5XX XXX XXX',
    '+966': '5X XXX XXXX',
    '+974': 'XXX XXXX',
    '+965': 'XXXX XXXX',
    '+973': 'XXXX XXXX',
    '+968': 'XXXX XXXX',
    '+91': 'XXXXX XXXXX',
    '+92': 'XXX XXXXXXX',
    '+1': 'XXX XXX XXXX',
    '+44': 'XXXX XXXXXX',
  };
  return formats[countryCode] || 'Enter phone number';
};

const getPhoneFormatHint = (countryCode: string) => {
  const hints: Record<string, string> = {
    '+971': '9 digits required for UAE numbers (excluding +971)',
    '+966': '9 digits required for KSA numbers (excluding +966)',
    '+974': '8 digits required for Qatar numbers (excluding +974)',
    '+965': '8 digits required for Kuwait numbers (excluding +965)',
    '+973': '8 digits required for Bahrain numbers (excluding +973)',
    '+968': '8 digits required for Oman numbers (excluding +968)',
    '+91': '10 digits required for India numbers (excluding +91)',
    '+92': '10 digits required for Pakistan numbers (excluding +92)',
    '+1': '10 digits required for USA/Canada numbers (excluding +1)',
    '+44': '10 digits required for UK numbers (excluding +44)',
  };
  return hints[countryCode] || 'Enter valid phone number for selected country';
};

export default function EditAdmin() {
  const generateAdminId = useCallback(() => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `AD-CMS-${randomNum}`;
  }, []);

  const [formData, setFormData] = useState({
    adminId: generateAdminId(),
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    countryCode: '+971',
    password: '',
    confirmPassword: '',
    role: '',
    emiratesId: null as File | null,
    status: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [popupMessage, setPopupMessage] = useState('');
  const [showAllErrors, setShowAllErrors] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);

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

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name as keyof typeof formData, formData[name as keyof typeof formData]);
  };

  const validateField = (name: keyof typeof formData, value: any) => {
    setErrors(prev => {
      const newErrors = { ...prev };

      switch (name) {
        case 'firstName':
        case 'lastName':
          if (!value) newErrors[name] = 'This field is required';
          else if (!validateName(value)) newErrors[name] = 'Only alphabets, min 3 characters';
          else delete newErrors[name];
          break;

        case 'email':
          if (!value) newErrors[name] = 'Email is required';
          else if (!validateEmail(value)) newErrors[name] = 'Invalid email';
          else delete newErrors[name];
          break;

        case 'phone':
          if (!value) {
            newErrors[name] = 'Phone number is required';
          } else if (!/^\d+$/.test(value)) {
            newErrors[name] = 'Only numbers are allowed';
          } else if (formData.countryCode === '+971' && value.length !== 9) {
            newErrors[name] = 'UAE mobile number must be 9 digits';
          } else if (formData.countryCode === '+966' && value.length !== 9) {
            newErrors[name] = 'KSA mobile number must be 9 digits';
          } else if ((formData.countryCode === '+974' || formData.countryCode === '+965' || formData.countryCode === '+973' || formData.countryCode === '+968') && value.length !== 8) {
            newErrors[name] = `${formData.countryCode} mobile number must be 8 digits`;
          } else if ((formData.countryCode === '+91' || formData.countryCode === '+92') && value.length !== 10) {
            newErrors[name] = `${formData.countryCode} mobile number must be 10 digits`;
          } else if ((formData.countryCode === '+1' || formData.countryCode === '+44') && value.length !== 10) {
            newErrors[name] = `${formData.countryCode} mobile number must be 10 digits`;
          } else if (!validatePhoneWithCode(value, formData.countryCode)) {
            newErrors[name] = 'Invalid phone number format for selected country';
          } else {
            delete newErrors[name];
          }
          break;

        case 'password':
          if (!value) newErrors[name] = 'Password is required';
          else if (!validatePassword(value).isValid)
            newErrors[name] = 'Password must be at least 8 characters, include 1 uppercase, 1 number, and 1 symbol';
          else delete newErrors[name];

          if (formData.confirmPassword && formData.confirmPassword !== value)
            newErrors.confirmPassword = 'Passwords do not match';
          else delete newErrors.confirmPassword;
          break;

        case 'confirmPassword':
          if (!value) newErrors[name] = 'Confirm password is required';
          else if (value !== formData.password) newErrors[name] = 'Passwords do not match';
          else delete newErrors[name];
          break;

        case 'role':
          if (!value) newErrors[name] = 'Please select a role';
          else delete newErrors[name];
          break;

        case 'emiratesId':
          if (!value) newErrors[name] = 'Emirates ID is required';
          else delete newErrors[name];
          break;

        default:
          break;
      }

      return newErrors;
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;

    if (type === 'file') {
      const file = (e.target as HTMLInputElement).files?.[0] || null;
      setFormData(prev => ({ ...prev, [name]: file }));
      if (touched[name] || showAllErrors) validateField(name as keyof typeof formData, file);
    } else if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
      if (touched[name] || showAllErrors) validateField(name as keyof typeof formData, value);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setFormData(prev => ({ ...prev, phone: value }));
    if (touched.phone || showAllErrors) validateField('phone', value);
  };

  const validateAllFields = () => {
    const newErrors: Record<string, string> = {};
    
    // Validate each required field
    if (!formData.firstName) newErrors.firstName = 'This field is required';
    else if (!validateName(formData.firstName)) newErrors.firstName = 'Only alphabets, min 3 characters';

    if (!formData.lastName) newErrors.lastName = 'This field is required';
    else if (!validateName(formData.lastName)) newErrors.lastName = 'Only alphabets, min 3 characters';

    if (!formData.email) newErrors.email = 'Email is required';
    else if (!validateEmail(formData.email)) newErrors.email = 'Invalid email';

    // Phone validation
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d+$/.test(formData.phone)) {
      newErrors.phone = 'Only numbers are allowed';
    } else if (formData.countryCode === '+971' && formData.phone.length !== 9) {
      newErrors.phone = 'UAE mobile number must be 9 digits';
    } else if (formData.countryCode === '+966' && formData.phone.length !== 9) {
      newErrors.phone = 'KSA mobile number must be 9 digits';
    } else if ((formData.countryCode === '+974' || formData.countryCode === '+965' || formData.countryCode === '+973' || formData.countryCode === '+968') && formData.phone.length !== 8) {
      newErrors.phone = `${formData.countryCode} mobile number must be 8 digits`;
    } else if ((formData.countryCode === '+91' || formData.countryCode === '+92') && formData.phone.length !== 10) {
      newErrors.phone = `${formData.countryCode} mobile number must be 10 digits`;
    } else if ((formData.countryCode === '+1' || formData.countryCode === '+44') && formData.phone.length !== 10) {
      newErrors.phone = `${formData.countryCode} mobile number must be 10 digits`;
    } else if (!validatePhoneWithCode(formData.phone, formData.countryCode)) {
      newErrors.phone = 'Invalid phone number format for selected country';
    }

    if (!formData.password) newErrors.password = 'Password is required';
    else if (!validatePassword(formData.password).isValid) 
      newErrors.password = 'Password must be at least 8 characters, include 1 uppercase, 1 number, and 1 symbol';

    if (!formData.confirmPassword) newErrors.confirmPassword = 'Confirm password is required';
    else if (formData.confirmPassword !== formData.password) newErrors.confirmPassword = 'Passwords do not match';

    if (!formData.role) newErrors.role = 'Please select a role';

    if (!formData.emiratesId) newErrors.emiratesId = 'Emirates ID is required';

    return newErrors;
  };

  const handleUpdate = () => {
    const newErrors = validateAllFields();
    setErrors(newErrors);
    setShowAllErrors(true);
    
    if (Object.keys(newErrors).length === 0) {
      setPopupMessage('Admin updated successfully!');
      // Here you would typically send the data to your backend
    }
  };

  const handleDelete = () => {
    setShowDeletePopup(true);
  };

  const confirmDelete = () => {
    setPopupMessage('Admin deleted successfully!');
    setShowDeletePopup(false);
    // Here you would typically send delete request to your backend
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* Success/Error Popup */}
      {popupMessage && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
          <div className="bg-white p-6 rounded-xl shadow-lg z-10 text-center max-w-sm mx-auto">
            <h2 className={`text-xl font-semibold mb-2 ${
              popupMessage.includes('successfully') ? 'text-green-600' : 'text-red-600'
            }`}>
              {popupMessage.includes('successfully') ? 'Success!' : 'Error!'}
            </h2>
            <p className="text-gray-700 mb-4">{popupMessage}</p>
            <button
              onClick={() => setPopupMessage('')}
              className={`mt-2 px-4 py-2 ${
                popupMessage.includes('successfully') ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
              } text-white rounded`}
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
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Delete Admin</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this admin? This action cannot be undone.
            </p>
            <div className="flex space-x-3 justify-center">
              <button
                onClick={() => setShowDeletePopup(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-center items-center mb-6">
        <div className="text-center w-full">
          <h1 className="text-2xl font-bold text-gray-900">EDIT ADMIN</h1>
          <p className="text-gray-600 mt-2">Edit Admin Details Below</p>
        </div>
      </div>

      <form className="bg-white p-6 rounded-lg shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

          {/* Admin ID */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Admin ID <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="adminId"
              value={formData.adminId}
              readOnly
              className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 text-gray-500"
            />
          </div>

          {/* Status */}
          <div className="mb-4 flex items-center">
            <span className="text-sm font-medium text-gray-700 mr-3">Status</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="status"
                checked={formData.status}
                onChange={handleChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white 
              after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 
              after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* First Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter Your First Name"
              className={`w-full border rounded-lg px-3 py-2 focus:ring-2 
              focus:ring-blue-500 focus:border-blue-500 ${
                (showAllErrors && errors.firstName) ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {(showAllErrors || touched.firstName) && errors.firstName && (
              <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
            )}
          </div>

          {/* Last Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter Your Last Name"
              className={`w-full border rounded-lg px-3 py-2 focus:ring-2 
              focus:ring-blue-500 focus:border-blue-500 ${
                (showAllErrors && errors.lastName) ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {(showAllErrors || touched.lastName) && errors.lastName && (
              <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
            )}
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter Your Email"
              className={`w-full border rounded-lg px-3 py-2 focus:ring-2 
              focus:ring-blue-500 focus:border-blue-500 ${
                (showAllErrors && errors.email) ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {(showAllErrors || touched.email) && errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Phone with separate Country Code and Phone Number inputs */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone <span className="text-red-500">*</span>
            </label>
            
            <div className="flex gap-2">
              {/* Country Code Dropdown - Left side */}
              <div className="w-1/3">
                <select
                  name="countryCode"
                  value={formData.countryCode}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-2 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                >
                  {countryCodes.map(country => (
                    <option key={country.code} value={country.code}>
                      {country.flag} {country.code}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Phone Number Input - Right side */}
              <div className="w-2/3">
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  onBlur={handleBlur}
                  placeholder={getPhonePlaceholder(formData.countryCode)}
                  className={`w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 
                  focus:ring-blue-500 focus:border-blue-500 ${
                    (showAllErrors && errors.phone) ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
            </div>
            
            {(showAllErrors || touched.phone) && errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              {getPhoneFormatHint(formData.countryCode)}
            </p>
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter Your Password"
              className={`w-full border rounded-lg px-3 py-2 focus:ring-2 
              focus:ring-blue-500 focus:border-blue-500 ${
                (showAllErrors && errors.password) ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {(showAllErrors || touched.password) && errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Re-Enter Your Password"
              className={`w-full border rounded-lg px-3 py-2 focus:ring-2 
              focus:ring-blue-500 focus:border-blue-500 ${
                (showAllErrors && errors.confirmPassword) ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {(showAllErrors || touched.confirmPassword) && errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Emirates ID */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Emirates ID <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center">
              <label className={`flex items-center px-4 py-2 bg-white text-gray-700 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                (showAllErrors && errors.emiratesId) ? 'border-red-500' : 'border-gray-300'
              }`}>
                {formData.emiratesId && <span className="text-green-600 mr-2">✓</span>}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
                <span>{formData.emiratesId ? formData.emiratesId.name : 'Upload Emirates ID'}</span>
                <input
                  type="file"
                  name="emiratesId"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="hidden"
                  accept="image/*,.pdf"
                />
              </label>
            </div>
            {(showAllErrors || touched.emiratesId) && errors.emiratesId && (
              <p className="text-red-500 text-sm mt-1">{errors.emiratesId}</p>
            )}
          </div>

          {/* Role */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role <span className="text-red-500">*</span>
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full border rounded-lg px-3 py-2 focus:ring-2 
              focus:ring-blue-500 focus:border-blue-500 ${
                (showAllErrors && errors.role) ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="super-admin">Clearance Agent</option>
              <option value="manager">Transport Coordinator</option>
              <option value="support">Finance</option>
            </select>
            {(showAllErrors || touched.role) && errors.role && (
              <p className="text-red-500 text-sm mt-1">{errors.role}</p>
            )}
          </div>

        </div>

        {/* Manage Accessibility */}
        <div className="mb-6">
          <Link to="#" className="text-blue-600 hover:underline flex items-center">
            <span>Manage Accessibility for this User</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </Link>
        </div>

        {/* Update and Delete buttons */}
        <div className="flex justify-center gap-4">
          <button
            type="button"
            onClick={handleDelete}
            className="text-white font-medium py-2 px-6 rounded-lg bg-red-600 hover:bg-red-700 transition-colors flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>
          <button
            type="button"
            onClick={handleUpdate}
            className="text-white font-medium py-2 px-8 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            Update Admin
          </button>
        </div>
      </form>
    </div>
  );
}