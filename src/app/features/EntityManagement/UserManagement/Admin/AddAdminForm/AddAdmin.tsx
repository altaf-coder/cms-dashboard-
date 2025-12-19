import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';

// Validation functions
const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePhone = (phone: string, countryCode: string) => {
  const cleanPhone = phone.replace(/\s+/g, '');
  switch (countryCode) {
    case '+971': // UAE
      return /^\+971[0-9]{9}$/.test(cleanPhone);
    case '+966': // KSA
      return /^\+966[0-9]{9}$/.test(cleanPhone);
    case '+974': // Qatar
      return /^\+974[0-9]{8}$/.test(cleanPhone);
    case '+965': // Kuwait
      return /^\+965[0-9]{8}$/.test(cleanPhone);
    case '+973': // Bahrain
      return /^\+973[0-9]{8}$/.test(cleanPhone);
    case '+968': // Oman
      return /^\+968[0-9]{8}$/.test(cleanPhone);
    case '+91': // India
      return /^\+91[0-9]{10}$/.test(cleanPhone);
    case '+92': // Pakistan
      return /^\+92[0-9]{10}$/.test(cleanPhone);
    case '+1': // USA/Canada
      return /^\+1[0-9]{10}$/.test(cleanPhone);
    case '+44': // UK
      return /^\+44[0-9]{10}$/.test(cleanPhone);
    default:
      return cleanPhone.length >= 10;
  }
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

export default function AddAdmin() {
  const generateAdminId = useCallback(() => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `AD-CMS-${randomNum}`;
  }, []);

  const [formData, setFormData] = useState({
    adminId: generateAdminId(),
    firstName: '',
    lastName: '',
    email: '',
    phoneCountryCode: '+971',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    role: '',
    emiratesId: null as File | null,
    status: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [successMessage, setSuccessMessage] = useState('');
  const [showAllErrors, setShowAllErrors] = useState(false);

  const getFullPhoneNumber = () => {
    return formData.phoneCountryCode + ' ' + formData.phoneNumber;
  };

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
          if (!value) {
            newErrors[name] = 'First name is required';
          } else if (!validateName(value)) {
            newErrors[name] = 'Only alphabets, min 3 characters';
          } else {
            delete newErrors[name];
          }
          break;

        case 'lastName':
          if (!value) {
            newErrors[name] = 'Last name is required';
          } else if (!validateName(value)) {
            newErrors[name] = 'Only alphabets, min 3 characters';
          } else {
            delete newErrors[name];
          }
          break;

        case 'email':
          if (!value) {
            newErrors[name] = 'Email is required';
          } else if (!validateEmail(value)) {
            newErrors[name] = 'Invalid email format';
          } else {
            delete newErrors[name];
          }
          break;

        case 'phoneNumber':
          const fullPhone = getFullPhoneNumber();
          if (!value) {
            newErrors[name] = 'Phone number is required';
          } else if (!validatePhone(fullPhone, formData.phoneCountryCode)) {
            newErrors[name] = `Please enter a valid ${countryCodes.find(c => c.code === formData.phoneCountryCode)?.country} phone number`;
          } else {
            delete newErrors[name];
          }
          break;

        case 'password':
          if (!value) {
            newErrors[name] = 'Password is required';
          } else if (!validatePassword(value).isValid) {
            newErrors[name] = 'Password must be at least 8 characters, include 1 uppercase, 1 number, and 1 symbol';
          } else {
            delete newErrors[name];
          }

          if (formData.confirmPassword && formData.confirmPassword !== value) {
            newErrors.confirmPassword = 'Passwords do not match';
          } else if (formData.confirmPassword) {
            delete newErrors.confirmPassword;
          }
          break;

        case 'confirmPassword':
          if (!value) {
            newErrors[name] = 'Confirm password is required';
          } else if (value !== formData.password) {
            newErrors[name] = 'Passwords do not match';
          } else {
            delete newErrors[name];
          }
          break;

        case 'role':
          if (!value) {
            newErrors[name] = 'Role is required';
          } else {
            delete newErrors[name];
          }
          break;

        case 'emiratesId':
          if (!value) {
            newErrors[name] = 'Emirates ID is required';
          } else {
            delete newErrors[name];
          }
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
    } else if (name === 'phoneCountryCode') {
      setFormData(prev => ({ ...prev, phoneCountryCode: value }));
      if (touched.phoneNumber || showAllErrors) validateField('phoneNumber', formData.phoneNumber);
    } else if (name === 'phoneNumber') {
      let cleanValue = value.replace(/[^0-9]/g, '');
     
      const maxLengths: { [key: string]: number } = {
        '+971': 9, '+966': 9, '+974': 8, '+965': 8, '+973': 8,
        '+968': 8, '+91': 10, '+92': 10, '+1': 10, '+44': 10,
      };
     
      const maxLength = maxLengths[formData.phoneCountryCode] || 15;
      cleanValue = cleanValue.substring(0, maxLength);
      setFormData(prev => ({ ...prev, phoneNumber: cleanValue }));
      if (touched.phoneNumber || showAllErrors) validateField('phoneNumber', cleanValue);
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
      if (touched[name] || showAllErrors) validateField(name as keyof typeof formData, value);
    }
  };

  const validateAllFields = () => {
    const fieldsToValidate = ['firstName', 'lastName', 'email', 'phoneNumber', 'password', 'confirmPassword', 'role', 'emiratesId'] as const;
   
    fieldsToValidate.forEach(field => {
      validateField(field, formData[field]);
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
   
    // Set showAllErrors to true to display all validation errors
    setShowAllErrors(true);
   
    // Mark all fields as touched
    const fields = ['firstName', 'lastName', 'email', 'phoneNumber', 'password', 'confirmPassword', 'role', 'emiratesId'];
    const newTouched: Record<string, boolean> = {};
    fields.forEach(f => newTouched[f] = true);
    setTouched(newTouched);

    // Validate all fields
    validateAllFields();

    const allFilled = fields.every(f => {
      const value = formData[f as keyof typeof formData];
      return value !== '' && value !== null && value !== undefined;
    });
    const noErrors = Object.keys(errors).length === 0;

    if (allFilled && noErrors) {
      setSuccessMessage('Admin added successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      // Reset form after successful submission
      setFormData({
        adminId: generateAdminId(),
        firstName: '',
        lastName: '',
        email: '',
        phoneCountryCode: '+971',
        phoneNumber: '',
        password: '',
        confirmPassword: '',
        role: '',
        emiratesId: null,
        status: true
      });
      setTouched({});
      setShowAllErrors(false);
    }
  };

  // Check if we should show error for a field
  const shouldShowError = (fieldName: string) => {
    return (touched[fieldName] || showAllErrors) && errors[fieldName];
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {successMessage && !showAllErrors && (
        <div className="mb-4 p-3 text-green-700 bg-green-100 border border-green-300 rounded-lg text-center font-medium">
          {successMessage}
        </div>
      )}

      <div className="flex justify-center items-center mb-6">
        <div className="text-center w-full">
          <h1 className="text-2xl font-bold text-gray-900">ADD ADMINS</h1>
          <p className="text-gray-600 mt-2">Please Fill in The Form Below to Add Admin</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm">
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
              focus:ring-blue-500 focus:border-blue-500 ${shouldShowError('firstName') ? 'border-red-500' : 'border-gray-300'}`}
            />
            {shouldShowError('firstName') && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
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
              focus:ring-blue-500 focus:border-blue-500 ${shouldShowError('lastName') ? 'border-red-500' : 'border-gray-300'}`}
            />
            {shouldShowError('lastName') && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
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
              focus:ring-blue-500 focus:border-blue-500 ${shouldShowError('email') ? 'border-red-500' : 'border-gray-300'}`}
            />
            {shouldShowError('email') && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* Phone */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <select
                name="phoneCountryCode"
                value={formData.phoneCountryCode}
                onChange={handleChange}
                className="w-32 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {countryCodes.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.flag} {country.code}
                  </option>
                ))}
              </select>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder={`Enter phone number`}
                className={`flex-1 border rounded-lg px-3 py-2 focus:ring-2
                focus:ring-blue-500 focus:border-blue-500 ${shouldShowError('phoneNumber') ? 'border-red-500' : 'border-gray-300'}`}
              />
            </div>
            {shouldShowError('phoneNumber') && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
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
              focus:ring-blue-500 focus:border-blue-500 ${shouldShowError('password') ? 'border-red-500' : 'border-gray-300'}`}
            />
            {shouldShowError('password') && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
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
              focus:ring-blue-500 focus:border-blue-500 ${shouldShowError('confirmPassword') ? 'border-red-500' : 'border-gray-300'}`}
            />
            {shouldShowError('confirmPassword') && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
          </div>

          {/* Emirates ID */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Emirates ID <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center">
              <label className={`flex items-center px-4 py-2 bg-white text-gray-700 border rounded-lg cursor-pointer hover:bg-gray-50 ${shouldShowError('emiratesId') ? 'border-red-500' : 'border-gray-300'}`}>
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
            {shouldShowError('emiratesId') && <p className="text-red-500 text-sm mt-1">{errors.emiratesId}</p>}
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
              focus:ring-blue-500 focus:border-blue-500 ${shouldShowError('role') ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="super-admin">Clearance Agent</option>
              <option value="manager">Transport Coordinator</option>
              <option value="support">Finance</option>
            </select>
            {shouldShowError('role') && <p className="text-red-500 text-sm mt-1">{errors.role}</p>}
          </div>

        </div>

        {/* Manage Accessibility */}
        <div className="mb-6">
          <Link to="#" className="text-blue-600 hover:underline flex items-center">
            <span>Manage Accessibility for this User</span>
            <svg xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </Link>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            className="text-white font-medium py-2 px-6 rounded-lg bg-blue-600 hover:bg-blue-700"
          >
            Add Admin
          </button>
        </div>
      </form>

      {/* Success Popup */}
      {successMessage && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-white/30 backdrop-blur-sm"></div>
          <div className="bg-white p-6 rounded-lg shadow-lg z-10 text-center max-w-sm mx-auto">
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

    </div>
  );
}