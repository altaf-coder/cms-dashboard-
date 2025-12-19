import { useState, useRef } from 'react';

export default function ViewDriver() {
  const [formData] = useState({
    driverId: "D-Naj-4567",
    status: 'Active',
    firstName: 'John',
    lastName: 'Doe',
    email: 'driver@gmail.com',
    phone: '22334456',
    countryCode: '+971',
    password: '********',
    confirmPassword: '********',
    emiratesId: null as File | null,
    emiratesIdExpiry: '2025-12-31',
    visa: null as File | null,
    visaExpiry: '2025-11-30',
    passport: null as File | null,
    tradeLicenseNumber: 'COMM12345678',
    drivingLicenseNumber: 'UAE123456789',
    drivingLicenseExpiry: '2026-03-15',
    assignedTruck: 'truck-001',
    assignedVendor: 'vendor-002'
  });

  const [fileNames] = useState({
    emiratesId: 'emirates_id_john_doe.pdf',
    visa: 'visa_john_doe.pdf',
    passport: 'passport_john_doe.pdf',
    drivingLicenseCopy: 'driving_license_john_doe.pdf'
  });

  // Helper function to get current date in YYYY-MM-DD format
  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const emiratesIdRef = useRef<HTMLInputElement>(null);
  const visaRef = useRef<HTMLInputElement>(null);
  const passportRef = useRef<HTMLInputElement>(null);
  const drivingLicenseCopyRef = useRef<HTMLInputElement>(null);

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

  const handleCustomFileClick = (inputRef: React.RefObject<HTMLInputElement | null>): void => {
    inputRef.current?.click();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // View mode - no submission
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">VIEW DRIVER</h1>
        <p className="text-center text-gray-500 mb-6">
          Driver Information & Details
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Driver ID</label>
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
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                disabled
                className="w-full border rounded-lg px-3 py-2 bg-gray-100"
              >
                <option value="Pending Approval">Pending Approval</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="inactive">Inactive</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Driver current status
              </p>
            </div>

            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">Personal Info</h3>
            </div>

            <div>
              <label className="text-sm font-medium">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                readOnly
                placeholder="Enter Your First Name"
                className="w-full border rounded-lg px-3 py-2 bg-gray-100"
              />
            </div>

            <div>
              <label className="text-sm font-medium">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                readOnly
                placeholder="Enter Your Last Name"
                className="w-full border rounded-lg px-3 py-2 bg-gray-100"
              />
            </div>

            <div>
              <label className="text-sm font-medium">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                readOnly
                placeholder="Enter Your Email"
                className="w-full border rounded-lg px-3 py-2 bg-gray-100"
              />
            </div>

            <div>
              <label className="text-sm font-medium">
                Phone
              </label>
              <div className="flex">
                <select
                  name="countryCode"
                  value={formData.countryCode}
                  disabled
                  className="w-1/3 border border-gray-300 rounded-l-lg px-2 py-2 bg-gray-100"
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
                  readOnly
                  placeholder={formData.countryCode === '+971' ? '5XX XXX XXXX' : 'Enter Phone Number'}
                  className="w-2/3 border border-l-0 rounded-r-lg px-3 py-2 bg-gray-100"
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-500">Full: {formData.countryCode} {formData.phone}</span>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                readOnly
                placeholder="Enter Your Password"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100"
              />
            </div>

            <div>
              <label className="text-sm font-medium">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                readOnly
                placeholder="Re-Enter Your Password"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Upload Emirates ID</label>
              <div 
                className="flex items-center justify-between border border-gray-300 rounded-lg px-3 py-2 bg-gray-100"
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
                <span className="text-blue-600 text-sm">View</span>
              </div>
              <input
                type="file"
                name="emiratesId"
                ref={emiratesIdRef}
                className="hidden"
                disabled
              />
              <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-500">
                  {fileNames.emiratesId ? 'File available' : 'No file available'}
                </span>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Emirates ID Expiry Date</label>
              <div className="relative">
                <input
                  type="date"
                  id="emiratesIdExpiry"
                  name="emiratesIdExpiry"
                  value={formData.emiratesIdExpiry}
                  readOnly
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 pl-10 pr-3 bg-gray-100"
                />
                <div 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Upload Visa</label>
              <div 
                className="flex items-center justify-between border border-gray-300 rounded-lg px-3 py-2 bg-gray-100"
                onClick={() => handleCustomFileClick(visaRef)}
              >
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                  <span className="text-gray-500">
                    {fileNames.visa ? fileNames.visa : 'Upload Visa'}
                  </span>
                </div>
                <span className="text-blue-600 text-sm">View</span>
              </div>
              <input
                type="file"
                name="visa"
                ref={visaRef}
                className="hidden"
                disabled
              />
              <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-500">
                  {fileNames.visa ? 'File available' : 'No file available'}
                </span>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Visa Expiry Date</label>
              <div className="relative">
                <input
                  type="date"
                  id="visaExpiry"
                  name="visaExpiry"
                  value={formData.visaExpiry}
                  readOnly
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 pl-10 pr-3 bg-gray-100"
                />
                <div 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Upload Passport</label>
              <div 
                className="flex items-center justify-between border border-gray-300 rounded-lg px-3 py-2 bg-gray-100"
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
                <span className="text-gray-600 text-sm">View</span>
              </div>
              <input
                type="file"
                name="passport"
                ref={passportRef}
                className="hidden"
                disabled
              />
              <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-500">
                  {fileNames.passport ? 'File available' : 'No file available'}
                </span>
                <span className="text-xs text-gray-500">Optional (For Expats)</span>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Trade License Number</label>
              <input
                type="text"
                name="tradeLicenseNumber"
                value={formData.tradeLicenseNumber}
                readOnly
                placeholder="Enter Trade License Number"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100"
              />
            </div>

            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">License Info</h3>
            </div>

            <div>
              <label className="text-sm font-medium">Driving License Number</label>
              <input
                type="text"
                name="drivingLicenseNumber"
                value={formData.drivingLicenseNumber}
                readOnly
                placeholder="Enter License Number"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Driving License Expiry Date</label>
              <div className="relative">
                <input
                  type="date"
                  id="drivingLicenseExpiry"
                  name="drivingLicenseExpiry"
                  value={formData.drivingLicenseExpiry}
                  readOnly
                  min={getCurrentDate()}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 pl-10 pr-3 bg-gray-100"
                />
                <div 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-medium">Upload License Copy</label>
              <div 
                className="flex items-center justify-between border border-gray-300 rounded-lg px-3 py-2 bg-gray-100"
                onClick={() => handleCustomFileClick(drivingLicenseCopyRef)}
              >
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                  <span className="text-gray-500">
                    {fileNames.drivingLicenseCopy ? fileNames.drivingLicenseCopy : 'Upload License Copy'}
                  </span>
                </div>
                <span className="text-blue-600 text-sm">View</span>
              </div>
              <input
                type="file"
                name="drivingLicenseCopy"
                ref={drivingLicenseCopyRef}
                className="hidden"
                disabled
              />
              <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-500">
                  {fileNames.drivingLicenseCopy ? 'File available' : 'No file available'}
                </span>
              </div>
            </div>

            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">Operational Info</h3>
            </div>

            <div>
              <label className="text-sm font-medium">Assigned Truck</label>
              <select
                name="assignedTruck"
                value={formData.assignedTruck}
                disabled
                className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100"
              >
                <option value="">Select Assigned Truck</option>
                <option value="truck-001">Truck 001</option>
                <option value="truck-002">Truck 002</option>
                <option value="truck-003">Truck 003</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Assigned Vendor</label>
              <select
                name="assignedVendor"
                value={formData.assignedVendor}
                disabled
                className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100"
              >
                <option value="">Select Vendor</option>
                <option value="vendor-001">Vendor 001</option>
                <option value="vendor-002">Vendor 002</option>
                <option value="vendor-003">Vendor 003</option>
              </select>
            </div>

          </div>

        </form>
      </div>
    </div>
  );
}