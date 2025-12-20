import { useState } from "react";
import { useParams} from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { ClockIcon } from '@heroicons/react/24/outline';

interface PortFormData {
  // Basic Port Information
  portId: string;
  portName: string;
  portCode: string;
  emirate: string;
  activeStatus: "Active" | "Inactive";
  
  // Container Return Rules
  standardFreeDays: number;
  maximumReturnDays: number;
  demurragePerDay: number;
  returnDeadlineMethod: "ETA Based" | "Release Date Based" | "Custom";
  gracePeriod: number;
  
  // Toll & Movement Rules
  tollApplicable: boolean;
  dayTollAmount: number;
  nightTollAmount: number;
  nightHoursStart: string;
  nightHoursEnd: string;
  tollRequiredForEmptyReturn: boolean;
  emptyReturnTollAmount: number;
  tollApplied: "Car Carriers Only" | "Heavy Trucks Only" | "Both";
  tollPaymentMethod: "Prepaid" | "Postpaid" | "Vendor Pays";
  mandatoryTollReceipt: boolean;
  returnRouteRestrictions: string[];
  automaticTollPenalty: boolean;
  penaltyAmount: number;
  
  // Movement Restrictions
  nightOnlyMovement: boolean;
  allowedMovementStart: string;
  allowedMovementEnd: string;
  weekendRestrictions: string[];
  publicHolidayLock: boolean;
  portEntryFee: number;
  
  // Operational Cutoff Rules
  cutoffDosubmission: string;
  cutoffContainerPickup: string;
  cutoffEmptyReturn: string;
  uploadDoMandatory: boolean;
  
  // Notification Setup
  reminderBeforeReturn: string;
  demurrageAlertThreshold: number;
  tollRequiredNotification: boolean;
  nightMovementWarning: boolean;
  cutoffTimeWarning: boolean;
}

const returnRoutes = ["Sheikh Zayed Road", "E311", "E611", "Internal Roads"];
const weekendDays = ["Saturday", "Sunday", "Friday", "Monday", "Tuesday", "Wednesday", "Thursday"];

export default function PortViewForm() {
  const { t } = useTranslation();
  const { id } = useParams();

  // Helper function to format time display
  const formatTimeDisplay = (time: string) => {
    if (!time) return t('notSet');
    return time;
  };

  // Helper function to format boolean as Yes/No
  const formatBoolean = (value: boolean) => {
    return value ? t('yes') : t('no');
  };

  // Helper function to format currency
  const formatCurrency = (amount: number) => {
    if (amount === 0 || amount === undefined) return "0 AED";
    return `${amount} AED`;
  };

  // Helper function to format days
  const formatDays = (value: number) => {
    return value === 1 ? `${value} ${t('day')}` : `${value} ${t('days')}`;
  };
 

  // View data
  const viewData: PortFormData = {
    // Basic Port Information
    portId: id || "PORT-ABC123",
    portName: "Jabel Ali",
    portCode: "JAL",
    emirate: "Dubai",
    activeStatus: "Active",
    
    // Container Return Rules
    standardFreeDays: 5,
    maximumReturnDays: 10,
    demurragePerDay: 150,
    returnDeadlineMethod: "ETA Based",
    gracePeriod: 2,
    
    // Toll & Movement Rules
    tollApplicable: true,
    dayTollAmount: 5,
    nightTollAmount: 8,
    nightHoursStart: "20:00:00",
    nightHoursEnd: "06:00:00",
    tollRequiredForEmptyReturn: true,
    emptyReturnTollAmount: 3,
    tollApplied: "Both",
    tollPaymentMethod: "Postpaid",
    mandatoryTollReceipt: true,
    returnRouteRestrictions: ["Sheikh Zayed Road", "E311"],
    automaticTollPenalty: true,
    penaltyAmount: 50,
    
    // Movement Restrictions
    nightOnlyMovement: false,
    allowedMovementStart: "08:00:00",
    allowedMovementEnd: "20:00:00",
    weekendRestrictions: ["Friday", "Saturday"],
    publicHolidayLock: true,
    portEntryFee: 25,
    
    // Operational Cutoff Rules
    cutoffDosubmission: "17:00:00",
    cutoffContainerPickup: "18:00:00",
    cutoffEmptyReturn: "19:00:00",
    uploadDoMandatory: true,
    
    // Notification Setup
    reminderBeforeReturn: "24 hrs",
    demurrageAlertThreshold: 1,
    tollRequiredNotification: true,
    nightMovementWarning: true,
    cutoffTimeWarning: true,
  };

  const [formData] = useState<PortFormData>(viewData);


  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-2xl font-bold text-gray-900">
              {t('viewPortRule')}
            </h1>
          </div>
        </div>

        {/* Basic Port Information */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">
            {t('basicPortInformation')}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Port ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('portId')}
              </label>
              <div className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                {formData.portId}
              </div>
            </div>

            {/* Port Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('portName')}
              </label>
              <div className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                {formData.portName}
              </div>
            </div>

            {/* Port Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('portCode')}
              </label>
              <div className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                {formData.portCode || t('notSet')}
              </div>
            </div>

            {/* Emirate */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('emirate')}
              </label>
              <div className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                {formData.emirate}
              </div>
            </div>

            {/* Active Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('activeStatus')}
              </label>
              <div className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  formData.activeStatus === "Active" 
                    ? "bg-green-100 text-green-800" 
                    : "bg-red-100 text-red-800"
                }`}>
                  {formData.activeStatus === "Active" ? t('active') : t('inactive')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Container Return Rules */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">
            {t('containerReturnRules')}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Standard Free Days */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('standardFreeDays')}
              </label>
              <div className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                {formatDays(formData.standardFreeDays)}
              </div>
            </div>

            {/* Maximum Allowed Return Days */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('maximumReturnDays')}
              </label>
              <div className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                {formatDays(formData.maximumReturnDays)}
              </div>
            </div>

            {/* Demurrage per Day */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('demurragePerDayAED')}
              </label>
              <div className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                {formatCurrency(formData.demurragePerDay)}
              </div>
            </div>

            {/* Return Deadline Calculation Method */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('returnDeadlineCalculationMethod')}
              </label>
              <div className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                {formData.returnDeadlineMethod === 'ETA Based' ? t('etaBased') : 
                 formData.returnDeadlineMethod === 'Release Date Based' ? t('releaseDateBased') : 
                 formData.returnDeadlineMethod === 'Custom' ? t('custom') : formData.returnDeadlineMethod}
              </div>
            </div>

            {/* Grace Period */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('gracePeriodHoursOptional').replace(' - Optional', '')}
              </label>
              <div className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                {formData.gracePeriod > 0 ? `${formData.gracePeriod} ${t('hours')}` : t('noGracePeriod')}
              </div>
            </div>
          </div>
        </div>

        {/* Toll & Movement Rules */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">
            {t('tollMovementRules')}
          </h3>
          
          {/* Toll Applicable */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t('tollApplicable')}
                </label>
                <p className="text-sm text-gray-500">{t('enableTollChargesForThisPort')}</p>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                formData.tollApplicable 
                  ? "bg-green-100 text-green-800" 
                  : "bg-gray-100 text-gray-800"
              }`}>
                {formatBoolean(formData.tollApplicable)}
              </div>
            </div>

            {formData.tollApplicable && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 space-y-6">
                {/* Day Toll Amount */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('dayTollAmountAED')}
                    </label>
                    <div className="w-full px-4 py-2.5 bg-blue-50 border border-blue-200 rounded-lg text-gray-900">
                      {formatCurrency(formData.dayTollAmount)}
                    </div>
                  </div>

                  {/* Night Toll Amount */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('nightTollAmountAED')}
                    </label>
                    <div className="w-full px-4 py-2.5 bg-blue-50 border border-blue-200 rounded-lg text-gray-900">
                      {formatCurrency(formData.nightTollAmount)}
                    </div>
                  </div>

                  {/* Night Hours Start */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('nightHoursStart')}
                    </label>
                    <div className="w-full px-4 py-2.5 bg-blue-50 border border-blue-200 rounded-lg text-gray-900 flex items-center gap-2">
                      <ClockIcon className="w-4 h-4 text-gray-500" />
                      {formatTimeDisplay(formData.nightHoursStart)}
                    </div>
                  </div>

                  {/* Night Hours End */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('nightHoursEnd')}
                    </label>
                    <div className="w-full px-4 py-2.5 bg-blue-50 border border-blue-200 rounded-lg text-gray-900 flex items-center gap-2">
                      <ClockIcon className="w-4 h-4 text-gray-500" />
                      {formatTimeDisplay(formData.nightHoursEnd)}
                    </div>
                  </div>
                </div>

                {/* Toll Required For Empty Return */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        {t('tollRequiredForEmptyReturn')}
                      </label>
                      <p className="text-sm text-gray-500">{t('enableTollForEmptyContainerReturns')}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      formData.tollRequiredForEmptyReturn 
                        ? "bg-green-100 text-green-800" 
                        : "bg-gray-100 text-gray-800"
                    }`}>
                      {formatBoolean(formData.tollRequiredForEmptyReturn)}
                    </div>
                  </div>

                  {formData.tollRequiredForEmptyReturn && (
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('emptyReturnTollAmountAED')}
                      </label>
                      <div className="w-full md:w-1/2 px-4 py-2.5 bg-blue-50 border border-blue-200 rounded-lg text-gray-900">
                        {formatCurrency(formData.emptyReturnTollAmount)}
                      </div>
                    </div>
                  )}
                </div>

                {/* Toll Applied */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('tollAppliedTo')}
                  </label>
                  <div className="w-full px-4 py-2.5 bg-blue-50 border border-blue-200 rounded-lg text-gray-900">
                    {formData.tollApplied === 'Car Carriers Only' ? t('carCarriersOnly') :
                     formData.tollApplied === 'Heavy Trucks Only' ? t('heavyTrucksOnly') :
                     formData.tollApplied === 'Both' ? t('both') : formData.tollApplied}
                  </div>
                </div>

                {/* Toll Payment Method */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('tollPaymentMethod')}
                  </label>
                  <div className="w-full px-4 py-2.5 bg-blue-50 border border-blue-200 rounded-lg text-gray-900">
                    {formData.tollPaymentMethod === 'Prepaid' ? t('prepaid') :
                     formData.tollPaymentMethod === 'Postpaid' ? t('postpaid') :
                     formData.tollPaymentMethod === 'Vendor Pays' ? t('vendorPays') : formData.tollPaymentMethod}
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    {t('tollPaymentMethodDescription')}
                  </p>
                </div>

                {/* Mandatory Toll Receipt Upload */}
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {t('mandatoryTollReceipt')}
                    </label>
                    <p className="text-sm text-gray-500">{t('driverWillHaveToUploadReceiptBeforeMarkingJobAsComplete')}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    formData.mandatoryTollReceipt 
                      ? "bg-green-100 text-green-800" 
                      : "bg-gray-100 text-gray-800"
                  }`}>
                    {formatBoolean(formData.mandatoryTollReceipt)}
                  </div>
                </div>

                {/* Return Route Restrictions */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('returnRouteRestrictions')}
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {returnRoutes.map(route => (
                      <span
                        key={route}
                        className={`px-3 py-1.5 rounded-lg border text-sm font-medium ${
                          formData.returnRouteRestrictions.includes(route)
                            ? 'bg-blue-100 text-blue-800 border-blue-200'
                            : 'bg-gray-50 text-gray-600 border-gray-200'
                        }`}
                      >
                        {route}
                      </span>
                    ))}
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    {formData.returnRouteRestrictions.length > 0 
                      ? `${t('selected')}: ${formData.returnRouteRestrictions.join(", ")}`
                      : t('noRestrictionsSelected')}
                  </p>
                </div>

                {/* Automatic Toll Penalty If No Receipt */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        {t('automaticTollPenalty')}
                      </label>
                      <p className="text-sm text-gray-500">{t('applyPenaltyAutomaticallyIfReceiptNotUploaded')}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      formData.automaticTollPenalty 
                        ? "bg-green-100 text-green-800" 
                        : "bg-gray-100 text-gray-800"
                    }`}>
                      {formatBoolean(formData.automaticTollPenalty)}
                    </div>
                  </div>

                  {formData.automaticTollPenalty && (
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('penaltyAmountAED')}
                      </label>
                      <div className="w-full md:w-1/2 px-4 py-2.5 bg-blue-50 border border-blue-200 rounded-lg text-gray-900">
                        {formatCurrency(formData.penaltyAmount)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Movement Restrictions */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">
            {t('movementRestrictionsSection')}
          </h3>
          
          <div className="space-y-6">
            {/* Night-Only Movement Allowed */}
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t('nightOnlyMovementAllowed')}
                </label>
                <p className="text-sm text-gray-500">{t('restrictMovementToNightHoursOnly')}</p>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                formData.nightOnlyMovement 
                  ? "bg-green-100 text-green-800" 
                  : "bg-gray-100 text-gray-800"
              }`}>
                {formatBoolean(formData.nightOnlyMovement)}
              </div>
            </div>

            {formData.nightOnlyMovement && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Allowed Movement Start Time */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('allowedMovementStartTime')}
                    </label>
                    <div className="w-full px-4 py-2.5 bg-blue-50 border border-blue-200 rounded-lg text-gray-900 flex items-center gap-2">
                      <ClockIcon className="w-4 h-4 text-gray-500" />
                      {formatTimeDisplay(formData.allowedMovementStart)}
                    </div>
                  </div>

                  {/* Allowed Movement End Time */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('allowedMovementEndTime')}
                    </label>
                    <div className="w-full px-4 py-2.5 bg-blue-50 border border-blue-200 rounded-lg text-gray-900 flex items-center gap-2">
                      <ClockIcon className="w-4 h-4 text-gray-500" />
                      {formatTimeDisplay(formData.allowedMovementEnd)}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Weekend Restrictions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('weekendRestrictions')}
              </label>
              <div className="flex flex-wrap gap-2">
                {weekendDays.map(day => (
                  <span
                    key={day}
                    className={`px-3 py-1.5 rounded-lg border text-sm font-medium ${
                      formData.weekendRestrictions.includes(day)
                        ? 'bg-red-100 text-red-800 border-red-200'
                        : 'bg-gray-50 text-gray-600 border-gray-200'
                    }`}
                  >
                    {day}
                  </span>
                ))}
              </div>
              <p className="mt-1 text-sm text-gray-500">
                {formData.weekendRestrictions.length > 0 
                  ? `${t('restrictedDays')} ${formData.weekendRestrictions.join(", ")}`
                  : t('noWeekendRestrictions')}
              </p>
            </div>

            {/* Public Holiday Lock */}
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t('publicHolidayLock')}
                </label>
                <p className="text-sm text-gray-500">{t('adminCanManuallyBlockPortOnGivenDates')}</p>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                formData.publicHolidayLock 
                  ? "bg-green-100 text-green-800" 
                  : "bg-gray-100 text-gray-800"
              }`}>
                {formatBoolean(formData.publicHolidayLock)}
              </div>
            </div>

            {/* Port Entry Fee */}
            <div className="w-full md:w-1/2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('portEntryFeeAEDOptional').replace(' - Optional', '')}
              </label>
              <div className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                {formatCurrency(formData.portEntryFee)}
              </div>
            </div>
          </div>
        </div>

        {/* Operational Cutoff Rules */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">
            {t('operationalCutoffRules')}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cutoff Time for DO Submission */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('cutoffTimeForDosubmission')}
              </label>
              <div className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 flex items-center gap-2">
                <ClockIcon className="w-4 h-4 text-gray-500" />
                {formatTimeDisplay(formData.cutoffDosubmission)}
              </div>
            </div>

            {/* Cutoff Time for Container Pickup */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('cutoffTimeForContainerPickup')}
              </label>
              <div className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 flex items-center gap-2">
                <ClockIcon className="w-4 h-4 text-gray-500" />
                {formatTimeDisplay(formData.cutoffContainerPickup)}
              </div>
            </div>

            {/* Cutoff Time for Empty Return */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('cutoffTimeForEmptyReturn')}
              </label>
              <div className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 flex items-center gap-2">
                <ClockIcon className="w-4 h-4 text-gray-500" />
                {formatTimeDisplay(formData.cutoffEmptyReturn)}
              </div>
            </div>
          </div>

          {/* Upload DO Mandatory */}
          <div className="mt-6 flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('uploadDoMandatory')}
              </label>
              <p className="text-sm text-gray-500">{t('requireDeliveryOrderUploadForOperations')}</p>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              formData.uploadDoMandatory 
                ? "bg-green-100 text-green-800" 
                : "bg-gray-100 text-gray-800"
            }`}>
              {formatBoolean(formData.uploadDoMandatory)}
            </div>
          </div>
        </div>

        {/* Notification Setup */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">
            {t('notificationSetup')}
          </h3>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Reminder Before Return Deadline */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('reminderBeforeReturnDeadline')}
                </label>
                <div className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                  {formData.reminderBeforeReturn}
                </div>
              </div>

              {/* Demurrage Alert Threshold */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('demurrageAlertThresholdDays')}
                </label>
                <div className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                  {formatDays(formData.demurrageAlertThreshold)} {t('daysBeforeFreeDaysEnd')}
                </div>
              </div>
            </div>

            {/* Notification Toggles */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('tollRequiredNotification')}
                  </label>
                  <p className="text-sm text-gray-500">{t('notifyDriversAboutTollRequirements')}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  formData.tollRequiredNotification 
                    ? "bg-green-100 text-green-800" 
                    : "bg-gray-100 text-gray-800"
                }`}>
                  {formatBoolean(formData.tollRequiredNotification)}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('nightMovementWarning')}
                  </label>
                  <p className="text-sm text-gray-500">{t('alertAboutNightMovementRestrictions')}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  formData.nightMovementWarning 
                    ? "bg-green-100 text-green-800" 
                    : "bg-gray-100 text-gray-800"
                }`}>
                  {formatBoolean(formData.nightMovementWarning)}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('cutoffTimeWarning')}
                  </label>
                  <p className="text-sm text-gray-500">{t('alertAboutApproachingCutoffTimes')}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  formData.cutoffTimeWarning 
                    ? "bg-green-100 text-green-800" 
                    : "bg-gray-100 text-gray-800"
                }`}>
                  {formatBoolean(formData.cutoffTimeWarning)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}