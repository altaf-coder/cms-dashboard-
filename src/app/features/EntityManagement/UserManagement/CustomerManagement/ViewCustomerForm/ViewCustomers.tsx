import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface CustomerData {
  customerId: string;
  status: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  countryCode: string;
  password: string;
  confirmPassword: string;
  emiratesId: string;
  passport: string;
  companyName: string;
  tradeLicenseNumber: string;
  tradeLicenseExpiry: string;
  tradeLicenseCopy: string;
  vatRegistered: string;
  trnNumber: string;
  officeAddress: string;
  paymentTerms: string;
  creditLimit: string;
  outstandingBalance: string;
  vatCertificate: string;
}

export default function ViewCustomers() {
  const { t } = useTranslation();
  const [formData] = useState<CustomerData>({
    customerId: 'C-Ag-1234',
    status: 'Active',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '501234567',
    countryCode: '+971',
    password: '********',
    confirmPassword: '********',
    emiratesId: 'emirates-id.pdf',
    passport: 'passport.pdf',
    companyName: 'ABC Trading',
    tradeLicenseNumber: 'TL-987654',
    tradeLicenseExpiry: '2026-01-01',
    tradeLicenseCopy: 'trade-license.pdf',
    vatRegistered: 'Yes',
    trnNumber: 'TRN123456',
    officeAddress: '123 Business Street, Dubai',
    paymentTerms: 'Credit',
    creditLimit: '100000',
    outstandingBalance: '50000',
    vatCertificate: 'vat-certificate.pdf'
  });

  const formatPhoneNumber = (phone: string) => {
    if (phone.length === 9) {
      return `${phone.substring(0, 3)} ${phone.substring(3, 6)} ${phone.substring(6, 9)}`;
    }
    return phone.replace(/(\d{3})(?=\d)/g, '$1 ');
  };

  const renderFileField = (label: string, fileName: string) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="border border-gray-300 rounded-lg px-3 py-2 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-gray-700">{fileName}</span>
          </div>
          <button className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer">
            {t('download')}
          </button>
        </div>
      </div>
    </div>
  );

  const renderDateField = (label: string, value: string) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 relative">
        <span className="text-gray-700">{value}</span>
        <svg 
          className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
    </div>
  );

  const renderDropdownField = (label: string, value: string) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 relative">
        <span className="text-gray-700">{value}</span>
        <svg 
          className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" 
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
  );

  const renderStatusField = (label: string, value: string) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 relative">
        <div className="flex items-center justify-between">
          <span className={`font-medium ${
            value === 'Active' ? 'text-gray-600' : 
            value === 'Inactive' ? 'text-red-600' : 
            value === 'Pending' ? 'text-yellow-600' : 
            'text-gray-600'
          }`}>
            {value}
          </span>
          <svg 
            className="w-5 h-5 text-gray-400" 
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
  );

  const renderRadioField = (label: string, value: string) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="flex items-center space-x-6">
        {/* Yes Radio Button */}
        <div className="flex items-center">
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
            value === 'Yes' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
          }`}>
            {value === 'Yes' && (
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
            )}
          </div>
          <span className={`ml-2 ${value === 'Yes' ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
            {t('yes')}
          </span>
        </div>
        
        {/* No Radio Button */}
        <div className="flex items-center">
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
            value === 'No' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
          }`}>
            {value === 'No' && (
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
            )}
          </div>
          <span className={`ml-2 ${value === 'No' ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
            {t('no')}
          </span>
        </div>
      </div>
    </div>
  );

  const renderInputField = (label: string, value: string, type: string = 'text') => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="border border-gray-300 rounded-lg px-3 py-2 bg-gray-50">
        {type === 'password' ? (
          <div className="flex items-center justify-between">
            <span className="text-gray-700">••••••••</span>
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
        ) : (
          <span className="text-gray-700">{value}</span>
        )}
      </div>
    </div>
  );

  // Render Phone Field - Read only view version
  const renderPhoneField = () => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {t('phone')}
      </label>
      <div className="flex gap-2">
        {/* Country Code - Read only view */}
        <div className="w-1/3 border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 relative">
          <span className="text-gray-700">{formData.countryCode}</span>
          <svg 
            className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" 
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
        
        {/* Phone Number - Read only view */}
        <div className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 flex items-center justify-between">
          <span className="text-gray-700">{formatPhoneNumber(formData.phone)}</span>
          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        </div>
      </div>
      
      {/* Phone Info - Read only view */}
      <div className="flex justify-between mt-2">
       
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-white p-6 border-b">
          <h1 className="text-2xl font-bold text-center text-gray-800">{t('viewCustomer')}</h1>
          <p className="text-center text-gray-600 mt-2">{t('customerInformationAndSpecifications')}</p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Customer ID & Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('customerId')}
              </label>
              <div className="border border-gray-300 rounded-lg px-3 py-2 bg-gray-50">
                <span className="text-gray-700 font-medium">{formData.customerId}</span>
              </div>
            </div>

            {renderStatusField(t('status'), formData.status)}

            {/* Authorized Person */}
            <div className="md:col-span-2">
              <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">{t('authorizedPersonSection')}</h2>
            </div>

            {renderInputField(t('firstName'), formData.firstName)}
            {renderInputField(t('lastName'), formData.lastName)}
            {renderInputField(t('email'), formData.email)}
            
            {/* Phone Field - Read only view */}
            {renderPhoneField()}
            
            {renderInputField(t('password'), formData.password, 'password')}
            {renderInputField(t('confirmPassword'), formData.confirmPassword, 'password')}

            {/* Emirates ID & Passport */}
            {renderFileField(t('emiratesId'), formData.emiratesId)}
            {renderFileField(t('passport'), formData.passport)}

            {/* Company Details */}
            <div className="md:col-span-2">
              <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">{t('companyInformationSection')}</h2>
            </div>

            {renderInputField(t('companyName'), formData.companyName)}
            {renderInputField(t('tradeLicenseNumber'), formData.tradeLicenseNumber)}
            {renderDateField(t('tradeLicenseExpiry'), formData.tradeLicenseExpiry)}
            {renderFileField(t('tradeLicenseCopy'), formData.tradeLicenseCopy)}
            
            {/* VAT Registered - Radio buttons without input container */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('vatRegistered')}?
              </label>
              {renderRadioField('', formData.vatRegistered)}
            </div>
            
            {renderInputField(t('trnNumber'), formData.trnNumber)}

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('officeAddress')}
              </label>
              <div className="border border-gray-300 rounded-lg px-3 py-3 bg-gray-50">
                <span className="text-gray-700">{formData.officeAddress}</span>
              </div>
            </div>

            {/* Financial Info */}
            <div className="md:col-span-2">
              <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">{t('financialInfo')}</h2>
            </div>

            {renderDropdownField(t('paymentTerms'), formData.paymentTerms)}
            {renderInputField(t('creditLimit'), `AED ${formData.creditLimit}`)}
            {renderInputField(t('outstandingBalance'), `AED ${formData.outstandingBalance}`)}
            {renderFileField(t('vatCertificate'), formData.vatCertificate)}
          </div>
        </div>
      </div>
    </div>
  );
}
