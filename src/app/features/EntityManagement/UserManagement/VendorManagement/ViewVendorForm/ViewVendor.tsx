import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function ViewVendor() {
  const { t } = useTranslation();
  const [formData] = useState({
    vendorId: 'V-NaJ-1234',
    status: 'Active',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '501234567',
    countryCode: '+971',
    password: '********',
    confirmPassword: '********',
    emiratesId: 'emirates-id.pdf',
    emiratesIdExpiryDate: '2026-01-01',
    passport: 'passport.pdf',
    companyName: 'ABC Trading',
    vatNumber: 'VAT123456',
    tradeLicenseNumber: 'TL987654',
    officeAddress: '123 Business Street, Dubai',
    accountName: 'John Doe',
    bankName: 'Emirates NBD',
    iban: 'AE123456789012345678901',
    linkedDriver: 'Driver 1',
    insurancePolicyNumber: 'INS-987654',
    insuranceExpiryDate: '2026-01-01',
    insuranceCopy: 'insurance.pdf',
    paymentTerms: 'Net 30',
    financialLimit: '20000',
  });

  const getFullPhoneNumber = () => `${formData.countryCode} ${formData.phone}`;

  const renderFileField = (label: string, fileName?: string) => (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <div className="flex items-center justify-between border border-gray-300 rounded-lg px-3 py-2 bg-gray-100">
        <span className="text-gray-700">{fileName || t('noFileUploaded')}</span>
        <span className="text-xs text-gray-500">{t('file')}</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">{t('viewVendor')}</h1>
        <p className="text-center text-gray-500 mb-6">{t('allVendorDetailsShownBelow')}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Vendor ID & Status */}
          <div>
            <label className="text-sm font-medium">{t('vendorId')}</label>
            <input
              type="text"
              value={formData.vendorId}
              readOnly
              className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100"
            />
          </div>

          <div>
            <label className="text-sm font-medium">{t('status')}</label>
            <input
              type="text"
              value={formData.status}
              readOnly
              className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100"
            />
          </div>

          {/* Authorized Person */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">{t('authorizedPersonSection')}</h3>
          </div>

          <div>
            <label className="text-sm font-medium">{t('firstName')}</label>
            <input
              type="text"
              value={formData.firstName}
              readOnly
              className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100"
            />
          </div>

          <div>
            <label className="text-sm font-medium">{t('lastName')}</label>
            <input
              type="text"
              value={formData.lastName}
              readOnly
              className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100"
            />
          </div>

          <div>
            <label className="text-sm font-medium">{t('email')}</label>
            <input
              type="text"
              value={formData.email}
              readOnly
              className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100"
            />
          </div>

          <div>
            <label className="text-sm font-medium">{t('phone')}</label>
            <input
              type="text"
              value={getFullPhoneNumber()}
              readOnly
              className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100"
            />
          </div>

          <div>
            <label className="text-sm font-medium">{t('password')}</label>
            <input
              type="password"
              value={formData.password}
              readOnly
              className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100"
            />
          </div>

          <div>
            <label className="text-sm font-medium">{t('confirmPassword')}</label>
            <input
              type="password"
              value={formData.confirmPassword}
              readOnly
              className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100"
            />
          </div>

          {/* Emirates ID & Passport */}
          {renderFileField(t('emiratesId'), formData.emiratesId)}
          <div>
            <label className="text-sm font-medium">{t('emiratesIdExpiryDate')}</label>
            <input
              type="date"
              value={formData.emiratesIdExpiryDate}
              readOnly
              className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100"
            />
          </div>
          {renderFileField(t('passport'), formData.passport)}
          
          {/* Company Details */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">Company Details</h3>
          </div>

          <div>
            <label className="text-sm font-medium">{t('companyName')}</label>
            <input
              type="text"
              value={formData.companyName}
              readOnly
              className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100"
            />
          </div>

          <div>
            <label className="text-sm font-medium">{t('tradeLicenseNumber')}</label>
            <input
              type="text"
              value={formData.tradeLicenseNumber}
              readOnly
              className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100"
            />
          </div>

          <div>
            <label className="text-sm font-medium">{t('vatNumber')}</label>
            <input
              type="text"
              value={formData.vatNumber}
              readOnly
              className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-medium">{t('officeAddress')}</label>
            <textarea
              value={formData.officeAddress}
              readOnly
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100"
            />
          </div>

          {/* Bank Details */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">{t('bankDetails')}</h3>
          </div>

          <div>
            <label className="text-sm font-medium">{t('accountName')}</label>
            <input
              type="text"
              value={formData.accountName}
              readOnly
              className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100"
            />
          </div>

          <div>
            <label className="text-sm font-medium">{t('bankName')}</label>
            <input
              type="text"
              value={formData.bankName}
              readOnly
              className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100"
            />
          </div>

          <div>
            <label className="text-sm font-medium">{t('iban')}</label>
            <input
              type="text"
              value={formData.iban}
              readOnly
              className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100"
            />
          </div>

          {/* Operational Info */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">{t('operationalInfo')}</h3>
          </div>

          <div>
            <label className="text-sm font-medium">{t('linkedDriver')}</label>
            <input
              type="text"
              value={formData.linkedDriver}
              readOnly
              className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100"
            />
          </div>

          <div>
            <label className="text-sm font-medium">{t('insurancePolicyNumber')}</label>
            <input
              type="text"
              value={formData.insurancePolicyNumber}
              readOnly
              className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100"
            />
          </div>

          <div>
            {renderFileField(t('insuranceCopy'), formData.insuranceCopy)}
          </div>

          <div>
            <label className="text-sm font-medium">{t('insuranceExpiryDate')}</label>
            <input
              type="date"
              value={formData.insuranceExpiryDate}
              readOnly
              className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100"
            />
          </div>

          {/* Financial Info */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">{t('financialInfo')}</h3>
          </div>

          <div>
            <label className="text-sm font-medium">{t('paymentTerms')}</label>
            <input
              type="text"
              value={formData.paymentTerms}
              readOnly
              className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100"
            />
          </div>

          <div>
            <label className="text-sm font-medium">{t('financialLimit')}</label>
            <div className="flex">
              <span className="bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg px-3 py-2">AED</span>
              <input
                type="text"
                value={formData.financialLimit}
                readOnly
                className="w-full border rounded-r-lg px-3 py-2 bg-gray-100"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
