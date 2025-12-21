import { useState } from "react";
import { useParams} from "react-router-dom";
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

// Helper function to format time display
function formatTimeDisplay(time: string) {
  if (!time) return "Not set";
  return time;
}

// Helper function to format boolean as Yes/No
function formatBoolean(value: boolean) {
  return value ? "Yes" : "No";
}

// Helper function to format currency
function formatCurrency(amount: number) {
  if (amount === 0 || amount === undefined) return "0 AED";
  return `${amount} AED`;
}

// Helper function to format days
function formatDays(value: number) {
  return `${value} day${value !== 1 ? 's' : ''}`;
}

export default function PortViewForm() {
  const { id } = useParams();
 

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
              View Port Rule
            </h1>
          </div>
        </div>

        {/* Basic Port Information */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">
            Basic Port Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Port ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Port ID
              </label>
              <div className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                {formData.portId}
              </div>
            </div>

            {/* Port Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Port Name
              </label>
              <div className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                {formData.portName}
              </div>
            </div>

            {/* Port Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Port Code
              </label>
              <div className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                {formData.portCode || "Not set"}
              </div>
            </div>

            {/* Emirate */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Emirate
              </label>
              <div className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                {formData.emirate}
              </div>
            </div>

            {/* Active Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Active Status
              </label>
              <div className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  formData.activeStatus === "Active" 
                    ? "bg-green-100 text-green-800" 
                    : "bg-red-100 text-red-800"
                }`}>
                  {formData.activeStatus}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Container Return Rules */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">
            Container Return Rules
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Standard Free Days */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Standard Free Days
              </label>
              <div className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                {formatDays(formData.standardFreeDays)}
              </div>
            </div>

            {/* Maximum Allowed Return Days */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Allowed Return Days
              </label>
              <div className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                {formatDays(formData.maximumReturnDays)}
              </div>
            </div>

            {/* Demurrage per Day */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Demurrage per Day
              </label>
              <div className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                {formatCurrency(formData.demurragePerDay)}
              </div>
            </div>

            {/* Return Deadline Calculation Method */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Return Deadline Calculation Method
              </label>
              <div className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                {formData.returnDeadlineMethod}
              </div>
            </div>

            {/* Grace Period */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Grace Period
              </label>
              <div className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                {formData.gracePeriod > 0 ? `${formData.gracePeriod} hours` : "No grace period"}
              </div>
            </div>
          </div>
        </div>

        {/* Toll & Movement Rules */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">
            Toll & Movement Rules
          </h3>
          
          {/* Toll Applicable */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Toll Applicable?
                </label>
                <p className="text-sm text-gray-500">Enable toll charges for this port</p>
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
                      Day Toll Amount
                    </label>
                    <div className="w-full px-4 py-2.5 bg-blue-50 border border-blue-200 rounded-lg text-gray-900">
                      {formatCurrency(formData.dayTollAmount)}
                    </div>
                  </div>

                  {/* Night Toll Amount */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Night Toll Amount
                    </label>
                    <div className="w-full px-4 py-2.5 bg-blue-50 border border-blue-200 rounded-lg text-gray-900">
                      {formatCurrency(formData.nightTollAmount)}
                    </div>
                  </div>

                  {/* Night Hours Start */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Night Hours Start
                    </label>
                    <div className="w-full px-4 py-2.5 bg-blue-50 border border-blue-200 rounded-lg text-gray-900 flex items-center gap-2">
                      <ClockIcon className="w-4 h-4 text-gray-500" />
                      {formatTimeDisplay(formData.nightHoursStart)}
                    </div>
                  </div>

                  {/* Night Hours End */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Night Hours End
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
                        Toll Required For Empty Return?
                      </label>
                      <p className="text-sm text-gray-500">Enable toll for empty container returns</p>
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
                        Toll Amount
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
                    Toll Applied
                  </label>
                  <div className="w-full px-4 py-2.5 bg-blue-50 border border-blue-200 rounded-lg text-gray-900">
                    {formData.tollApplied}
                  </div>
                </div>

                {/* Toll Payment Method */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Toll Payment Method
                  </label>
                  <div className="w-full px-4 py-2.5 bg-blue-50 border border-blue-200 rounded-lg text-gray-900">
                    {formData.tollPaymentMethod}
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    {formData.tollPaymentMethod === "Prepaid" && "Company pays upfront"}
                    {formData.tollPaymentMethod === "Postpaid" && "Customer pays later"}
                    {formData.tollPaymentMethod === "Vendor Pays" && "Vendor pays the toll"}
                  </p>
                </div>

                {/* Mandatory Toll Receipt Upload */}
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Mandatory Toll Receipt Upload?
                    </label>
                    <p className="text-sm text-gray-500">Driver will have to upload receipt before marking job as Complete</p>
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
                    Return Route Restrictions
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
                      ? `Selected: ${formData.returnRouteRestrictions.join(", ")}`
                      : "No restrictions selected"}
                  </p>
                </div>

                {/* Automatic Toll Penalty If No Receipt */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Automatic Toll Penalty If No Receipt?
                      </label>
                      <p className="text-sm text-gray-500">Apply penalty automatically if receipt not uploaded</p>
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
                        Penalty Amount
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
            Movement Restrictions
          </h3>
          
          <div className="space-y-6">
            {/* Night-Only Movement Allowed */}
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Night-Only Movement Allowed?
                </label>
                <p className="text-sm text-gray-500">Restrict movement to night hours only</p>
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
                      Allowed Movement Start Time
                    </label>
                    <div className="w-full px-4 py-2.5 bg-blue-50 border border-blue-200 rounded-lg text-gray-900 flex items-center gap-2">
                      <ClockIcon className="w-4 h-4 text-gray-500" />
                      {formatTimeDisplay(formData.allowedMovementStart)}
                    </div>
                  </div>

                  {/* Allowed Movement End Time */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Allowed Movement End Time
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
                Weekend Restrictions
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
                  ? `Restricted days: ${formData.weekendRestrictions.join(", ")}`
                  : "No weekend restrictions"}
              </p>
            </div>

            {/* Public Holiday Lock */}
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Public Holiday Lock?
                </label>
                <p className="text-sm text-gray-500">Admin can manually block port on given dates</p>
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
                Port Entry Fee
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
            Operational Cutoff Rules
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cutoff Time for DO Submission */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cutoff Time for DO Submission
              </label>
              <div className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 flex items-center gap-2">
                <ClockIcon className="w-4 h-4 text-gray-500" />
                {formatTimeDisplay(formData.cutoffDosubmission)}
              </div>
            </div>

            {/* Cutoff Time for Container Pickup */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cutoff Time for Container Pickup
              </label>
              <div className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 flex items-center gap-2">
                <ClockIcon className="w-4 h-4 text-gray-500" />
                {formatTimeDisplay(formData.cutoffContainerPickup)}
              </div>
            </div>

            {/* Cutoff Time for Empty Return */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cutoff Time for Empty Return
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
                Upload DO Mandatory?
              </label>
              <p className="text-sm text-gray-500">Require Delivery Order upload for operations</p>
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
            Notification Setup
          </h3>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Reminder Before Return Deadline */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reminder Before Return Deadline
                </label>
                <div className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                  {formData.reminderBeforeReturn}
                </div>
              </div>

              {/* Demurrage Alert Threshold */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Demurrage Alert Threshold
                </label>
                <div className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                  {formatDays(formData.demurrageAlertThreshold)} before free days end
                </div>
              </div>
            </div>

            {/* Notification Toggles */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Toll Required Notification
                  </label>
                  <p className="text-sm text-gray-500">Notify drivers about toll requirements</p>
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
                    Night Movement Warning
                  </label>
                  <p className="text-sm text-gray-500">Alert about night movement restrictions</p>
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
                    Cutoff Time Warning
                  </label>
                  <p className="text-sm text-gray-500">Alert about approaching cutoff times</p>
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