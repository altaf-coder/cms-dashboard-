import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

export default function ViewAdmin() {
  const { t } = useTranslation();
  const generateAdminId = useCallback(() => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `AD-CMS-${randomNum}`;
  }, []);

  // Mock form data
  const [formData] = useState({
    adminId: generateAdminId(),
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '501234567',
    countryCode: '+971',
    password: '••••••••',
    confirmPassword: '••••••••',
    role: 'admin',
    emiratesId: 'john_emirates_id.pdf',
    status: true
  });

  const formatPhoneNumber = (phone: string) => {
    if (phone.length === 9) {
      return `${phone.substring(0, 3)} ${phone.substring(3, 6)} ${phone.substring(6, 9)}`;
    }
    return phone.replace(/(\d{3})(?=\d)/g, '$1 ');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-center items-center mb-4 sm:mb-6 lg:mb-8">
        <div className="text-center w-full">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{t('viewAdmin')}</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">{t('thisFormIsViewOnly')}</p>
        </div>
      </div>

      {/* Form Container */}
      <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-lg sm:rounded-xl shadow-sm pointer-events-none">
        
        {/* Admin ID and Status - Side by side on larger screens, stacked on mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 lg:mb-8">
          {/* Admin ID */}
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">{t('adminId')}</label>
            <div className="border border-gray-300 rounded-lg px-3 py-2.5 sm:px-4 sm:py-3 bg-gray-100/50">
              <span className="text-gray-700 font-medium text-sm sm:text-base">{formData.adminId}</span>
            </div>
          </div>

          {/* Status */}
          <div className="w-full flex items-center justify-between lg:justify-start lg:space-x-4">
            <span className="text-sm font-medium text-gray-700">{t('status')}</span>
            <div
              className={`relative w-11 h-6 sm:w-12 sm:h-7 rounded-full ${formData.status ? 'bg-blue-600' : 'bg-gray-300'}`}
            >
              <div
                className={`absolute top-[2px] left-[2px] w-5 h-5 sm:w-6 sm:h-6 bg-white rounded-full transition-all ${formData.status ? 'translate-x-full border-white' : ''
                  } border border-gray-300`}
              ></div>
            </div>
          </div>
        </div>

        {/* Main Form Grid - Responsive columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          
          {/* Personal Information Section */}
          <div className="space-y-4 sm:space-y-6">
            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">{t('firstName')}</label>
              <div className="border border-gray-300 rounded-lg px-3 py-2.5 sm:px-4 sm:py-3 bg-gray-100/50">
                <span className="text-gray-700 text-sm sm:text-base">{formData.firstName}</span>
              </div>
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">{t('lastName')}</label>
              <div className="border border-gray-300 rounded-lg px-3 py-2.5 sm:px-4 sm:py-3 bg-gray-100/50">
                <span className="text-gray-700 text-sm sm:text-base">{formData.lastName}</span>
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">{t('email')}</label>
              <div className="border border-gray-300 rounded-lg px-3 py-2.5 sm:px-4 sm:py-3 bg-gray-100/50">
                <span className="text-gray-700 text-sm sm:text-base break-all">{formData.email}</span>
              </div>
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">{t('role')}</label>
              <div className="border border-gray-300 rounded-lg px-3 py-2.5 sm:px-4 sm:py-3 bg-gray-100/50 relative">
                <span className="text-gray-700 text-sm sm:text-base">{formData.role}</span>
                <svg 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Contact & Security Section */}
          <div className="space-y-4 sm:space-y-6">
            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">{t('phone')}</label>
              <div className="flex flex-row gap-2">
                {/* Country Code */}
                <div className="w-1/3 sm:w-1/4 border border-gray-300 rounded-lg px-3 py-2.5 sm:px-4 sm:py-3 bg-gray-100/50 relative min-w-[80px]">
                  <span className="text-gray-700 text-sm sm:text-base block truncate">{formData.countryCode}</span>
                  <svg 
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="2" 
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
                
                {/* Phone Number */}
                <div className="flex-1 border border-gray-300 rounded-lg px-3 py-2.5 sm:px-4 sm:py-3 bg-gray-100/50 flex items-center justify-between">
                  <span className="text-gray-700 text-sm sm:text-base truncate">
                    {formatPhoneNumber(formData.phone)}
                  </span>
                  <svg className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">{t('password')}</label>
              <div className="border border-gray-300 rounded-lg px-3 py-2.5 sm:px-4 sm:py-3 bg-gray-100/50 flex items-center justify-between">
                <span className="text-gray-700 text-sm sm:text-base">{formData.password}</span>
                <svg className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">{t('confirmPassword')}</label>
              <div className="border border-gray-300 rounded-lg px-3 py-2.5 sm:px-4 sm:py-3 bg-gray-100/50 flex items-center justify-between">
                <span className="text-gray-700 text-sm sm:text-base">{formData.confirmPassword}</span>
                <svg className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
            </div>

            {/* Emirates ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">{t('emiratesId')}</label>
              <div className="border border-gray-300 rounded-lg px-3 py-2.5 sm:px-4 sm:py-3 bg-gray-100/50">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="text-gray-700 text-sm sm:text-base truncate">{formData.emiratesId}</span>
                  </div>
                  <button className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer text-left sm:text-right w-full sm:w-auto">
                    {t('download')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
