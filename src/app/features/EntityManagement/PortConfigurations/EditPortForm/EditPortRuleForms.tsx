import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { CheckIcon, ClockIcon, ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

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

const emirates = ["Dubai", "Sharjah", "Ajman", "Abu Dhabi", "Fujairah", "Ras Al Khaimah"];
const returnDeadlineMethods = ["ETA Based", "Release Date Based", "Custom"];
const tollAppliedOptions = ["Car Carriers Only", "Heavy Trucks Only", "Both"];
const tollPaymentMethods = ["Prepaid", "Postpaid", "Vendor Pays"];
const returnRoutes = ["Sheikh Zayed Road", "E311", "E611", "Internal Roads"];
const weekendDays = ["Saturday", "Sunday", "Friday", "Monday", "Tuesday", "Wednesday", "Thursday"];
const reminderOptions = ["1 hr", "6 hrs", "12 hrs", "24 hrs", "48 hrs", "Custom"];

// Custom Time Picker Component
interface TimePickerProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  touched?: boolean;
  label: string;
  required?: boolean;
}

function TimePicker({ value, onChange, error, touched, label, required }: TimePickerProps) {
  const [showPicker, setShowPicker] = useState(false);
  const [hours, setHours] = useState("00");
  const [minutes, setMinutes] = useState("00");
  const [seconds, setSeconds] = useState("00");
  const timePickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value) {
      const [h, m, s] = value.split(":");
      setHours(h || "00");
      setMinutes(m || "00");
      setSeconds(s || "00");
    } else {
      setHours("00");
      setMinutes("00");
      setSeconds("00");
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (timePickerRef.current && !timePickerRef.current.contains(event.target as Node)) {
        setShowPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleTimeChange = (type: 'hours' | 'minutes' | 'seconds', increment: boolean) => {
    if (type === 'hours') {
      let newHours = parseInt(hours) + (increment ? 1 : -1);
      if (newHours < 0) newHours = 23;
      if (newHours > 23) newHours = 0;
      setHours(newHours.toString().padStart(2, '0'));
    } else if (type === 'minutes') {
      let newMinutes = parseInt(minutes) + (increment ? 1 : -1);
      if (newMinutes < 0) newMinutes = 59;
      if (newMinutes > 59) newMinutes = 0;
      setMinutes(newMinutes.toString().padStart(2, '0'));
    } else {
      let newSeconds = parseInt(seconds) + (increment ? 1 : -1);
      if (newSeconds < 0) newSeconds = 59;
      if (newSeconds > 59) newSeconds = 0;
      setSeconds(newSeconds.toString().padStart(2, '0'));
    }
  };

  const handleApply = () => {
    const newTime = `${hours}:${minutes}:${seconds}`;
    onChange(newTime);
    setShowPicker(false);
  };

  const handleCancel = () => {
    if (value) {
      const [h, m, s] = value.split(":");
      setHours(h || "00");
      setMinutes(m || "00");
      setSeconds(s || "00");
    } else {
      setHours("00");
      setMinutes("00");
      setSeconds("00");
    }
    setShowPicker(false);
  };

  return (
    <div className="relative" ref={timePickerRef}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <input
          type="text"
          value={value || "HH:MM:SS"}
          readOnly
          onClick={() => setShowPicker(!showPicker)}
          className={`w-full px-4 py-2.5 border rounded-lg bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            error && touched ? 'border-red-500' : 'border-gray-300'
          } ${!value ? 'text-gray-400' : 'text-gray-900'}`}
          placeholder="HH:MM:SS"
        />
        <div
          className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 cursor-pointer"
          onClick={() => setShowPicker(!showPicker)}
        >
          <ClockIcon className="w-5 h-5" />
        </div>
      </div>
     
      {showPicker && (
        <div className="absolute z-50 mt-1 bg-white border border-gray-300 rounded-lg shadow-xl w-80">
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <div className="text-sm font-medium text-gray-700">Select Time</div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleApply}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Apply
                </button>
              </div>
            </div>
           
            <div className="flex justify-center items-center space-x-6 mb-4">
              {/* Hours */}
              <div className="text-center">
                <div className="flex flex-col items-center">
                  <button
                    type="button"
                    onClick={() => handleTimeChange('hours', true)}
                    className="p-3 hover:bg-gray-100 rounded-full mb-2 transition-colors"
                  >
                    <ChevronUpIcon className="w-6 h-6 text-gray-700" />
                  </button>
                  <div className="w-16 h-16 bg-gray-50 border border-gray-300 rounded-lg flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-900">{hours}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">Hours</div>
                  <button
                    type="button"
                    onClick={() => handleTimeChange('hours', false)}
                    className="p-3 hover:bg-gray-100 rounded-full mt-2 transition-colors"
                  >
                    <ChevronDownIcon className="w-6 h-6 text-gray-700" />
                  </button>
                </div>
              </div>
             
              <div className="text-2xl font-bold text-gray-400 mb-6">:</div>
             
              {/* Minutes */}
              <div className="text-center">
                <div className="flex flex-col items-center">
                  <button
                    type="button"
                    onClick={() => handleTimeChange('minutes', true)}
                    className="p-3 hover:bg-gray-100 rounded-full mb-2 transition-colors"
                  >
                    <ChevronUpIcon className="w-6 h-6 text-gray-700" />
                  </button>
                  <div className="w-16 h-16 bg-gray-50 border border-gray-300 rounded-lg flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-900">{minutes}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">Minutes</div>
                  <button
                    type="button"
                    onClick={() => handleTimeChange('minutes', false)}
                    className="p-3 hover:bg-gray-100 rounded-full mt-2 transition-colors"
                  >
                    <ChevronDownIcon className="w-6 h-6 text-gray-700" />
                  </button>
                </div>
              </div>
             
              <div className="text-2xl font-bold text-gray-400 mb-6">:</div>
             
              {/* Seconds */}
              <div className="text-center">
                <div className="flex flex-col items-center">
                  <button
                    type="button"
                    onClick={() => handleTimeChange('seconds', true)}
                    className="p-3 hover:bg-gray-100 rounded-full mb-2 transition-colors"
                  >
                    <ChevronUpIcon className="w-6 h-6 text-gray-700" />
                  </button>
                  <div className="w-16 h-16 bg-gray-50 border border-gray-300 rounded-lg flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-900">{seconds}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">Seconds</div>
                  <button
                    type="button"
                    onClick={() => handleTimeChange('seconds', false)}
                    className="p-3 hover:bg-gray-100 rounded-full mt-2 transition-colors"
                  >
                    <ChevronDownIcon className="w-6 h-6 text-gray-700" />
                  </button>
                </div>
              </div>
            </div>
           
            <div className="pt-3 border-t border-gray-200">
              <div className="text-sm text-gray-600 mb-1">Selected Time:</div>
              <div className="text-lg font-bold text-blue-600 bg-blue-50 py-2 px-3 rounded">{hours}:{minutes}:{seconds}</div>
            </div>
          </div>
        </div>
      )}
     
      {error && touched && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}

export default function PortForm() {
  const { id } = useParams();
  const isEditMode = Boolean(id);

  // State for popups
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Generate a random port ID for new ports
  const generatePortId = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    let id = 'PORT-';
   
    for (let i = 0; i < 3; i++) {
      id += letters.charAt(Math.floor(Math.random() * letters.length));
    }
   
    for (let i = 0; i < 3; i++) {
      id += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }
   
    return id;
  };

  // Initial form data for resetting
  const initialFormData: PortFormData = {
    // Basic Port Information
    portId: generatePortId(),
    portName: "",
    portCode: "",
    emirate: "",
    activeStatus: "Active",
   
    // Container Return Rules
    standardFreeDays: 5,
    maximumReturnDays: 10,
    demurragePerDay: 150,
    returnDeadlineMethod: "ETA Based",
    gracePeriod: 0,
   
    // Toll & Movement Rules
    tollApplicable: false,
    dayTollAmount: 0,
    nightTollAmount: 0,
    nightHoursStart: "",
    nightHoursEnd: "",
    tollRequiredForEmptyReturn: false,
    emptyReturnTollAmount: 0,
    tollApplied: "Both",
    tollPaymentMethod: "Postpaid",
    mandatoryTollReceipt: true,
    returnRouteRestrictions: [],
    automaticTollPenalty: false,
    penaltyAmount: 0,
   
    // Movement Restrictions
    nightOnlyMovement: false,
    allowedMovementStart: "",
    allowedMovementEnd: "",
    weekendRestrictions: [],
    publicHolidayLock: false,
    portEntryFee: 0,
   
    // Operational Cutoff Rules
    cutoffDosubmission: "",
    cutoffContainerPickup: "",
    cutoffEmptyReturn: "",
    uploadDoMandatory: true,
   
    // Notification Setup
    reminderBeforeReturn: "24 hrs",
    demurrageAlertThreshold: 1,
    tollRequiredNotification: true,
    nightMovementWarning: true,
    cutoffTimeWarning: true,
  };

  // Edit mode initial data
  const editModeInitialData: PortFormData = {
    // Basic Port Information
    portId: id || generatePortId(),
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

  const [formData, setFormData] = useState<PortFormData>(isEditMode ? editModeInitialData : initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // In edit mode, fetch the port data
  useEffect(() => {
    if (isEditMode) {
      // TODO: Fetch port data from API
      // For now, use mock data
      setFormData(editModeInitialData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isEditMode]); // editModeInitialData is stable mock data

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
   
    if (type === "checkbox") {
      const target = e.target as HTMLInputElement;
      setFormData(prev => ({
        ...prev,
        [name]: target.checked
      }));
    } else if (type === "number") {
      const numValue = value === "" ? "" : Number(value);
      setFormData(prev => ({
        ...prev,
        [name]: numValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Mark field as touched
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleToggle = (field: keyof PortFormData) => {
    setFormData(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleMultiSelect = (field: keyof PortFormData, value: string) => {
    setFormData(prev => {
      const currentArray = Array.isArray(prev[field]) ? [...(prev[field] as string[])] : [];
      const newArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value];
     
      return {
        ...prev,
        [field]: newArray
      };
    });
  };

  const handleTimeChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Basic Port Information
    if (!formData.portName.trim()) newErrors.portName = "Port name is required";
    if (!formData.emirate) newErrors.emirate = "Emirate is required";
    if (formData.portCode && (formData.portCode.length < 3 || formData.portCode.length > 5)) {
      newErrors.portCode = "Port code must be 3-5 letters";
    }

    // Container Return Rules
    if (!formData.standardFreeDays || formData.standardFreeDays <= 0) {
      newErrors.standardFreeDays = "Standard free days must be greater than 0";
    }
    if (!formData.maximumReturnDays || formData.maximumReturnDays < formData.standardFreeDays) {
      newErrors.maximumReturnDays = "Maximum return days must be greater than or equal to free days";
    }
    if (!formData.demurragePerDay || formData.demurragePerDay <= 0) {
      newErrors.demurragePerDay = "Demurrage per day must be greater than 0";
    }
    if (!formData.returnDeadlineMethod) {
      newErrors.returnDeadlineMethod = "Return deadline method is required";
    }

    // Toll & Movement Rules (conditional validation)
    if (formData.tollApplicable) {
      if (!formData.dayTollAmount || formData.dayTollAmount <= 0) {
        newErrors.dayTollAmount = "Day toll amount must be greater than 0";
      }
      if (!formData.nightTollAmount || formData.nightTollAmount <= 0) {
        newErrors.nightTollAmount = "Night toll amount must be greater than 0";
      }
      if (!formData.nightHoursStart) newErrors.nightHoursStart = "Night hours start is required";
      if (!formData.nightHoursEnd) newErrors.nightHoursEnd = "Night hours end is required";
      if (formData.tollRequiredForEmptyReturn && (!formData.emptyReturnTollAmount || formData.emptyReturnTollAmount <= 0)) {
        newErrors.emptyReturnTollAmount = "Empty return toll amount must be greater than 0";
      }
      if (!formData.tollPaymentMethod) newErrors.tollPaymentMethod = "Toll payment method is required";
      if (formData.automaticTollPenalty && (!formData.penaltyAmount || formData.penaltyAmount <= 0)) {
        newErrors.penaltyAmount = "Penalty amount must be greater than 0";
      }
    }

    // Movement Restrictions
    if (formData.nightOnlyMovement) {
      if (!formData.allowedMovementStart) newErrors.allowedMovementStart = "Allowed movement start time is required";
      if (!formData.allowedMovementEnd) newErrors.allowedMovementEnd = "Allowed movement end time is required";
    }

    // Operational Cutoff Rules
    if (!formData.cutoffDosubmission) newErrors.cutoffDosubmission = "Cutoff time for DO submission is required";
    if (!formData.cutoffContainerPickup) newErrors.cutoffContainerPickup = "Cutoff time for container pickup is required";
    if (!formData.cutoffEmptyReturn) newErrors.cutoffEmptyReturn = "Cutoff time for empty return is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
   
    // Mark all required fields as touched for validation
    const requiredFields = [
      "portName", "emirate", "standardFreeDays", "maximumReturnDays",
      "demurragePerDay", "returnDeadlineMethod", "cutoffDosubmission",
      "cutoffContainerPickup", "cutoffEmptyReturn"
    ];
   
    if (formData.tollApplicable) {
      requiredFields.push("dayTollAmount", "nightTollAmount", "nightHoursStart", "nightHoursEnd", "tollPaymentMethod");
    }
   
    if (formData.nightOnlyMovement) {
      requiredFields.push("allowedMovementStart", "allowedMovementEnd");
    }
   
    const touchedFields: Record<string, boolean> = {};
    requiredFields.forEach(field => {
      touchedFields[field] = true;
    });
    setTouched(prev => ({ ...prev, ...touchedFields }));
   
    if (!validateForm()) {
      // Scroll to first error
      const firstError = Object.keys(errors)[0];
      if (firstError) {
        const element = document.getElementsByName(firstError)[0];
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.focus();
        }
      }
      return;
    }

    setIsSubmitting(true);
   
    try {
      // TODO: Submit form data to API
      // TODO: Replace with actual API call
     
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
     
      // Show success popup
      setShowSuccessPopup(true);
    } catch (error) {
      // Error handling - in production, use proper error logging service
      setErrors(prev => ({
        ...prev,
        submit: "Failed to submit form. Please try again."
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    // Reset form to initial state based on mode
    if (isEditMode) {
      setFormData(editModeInitialData);
    } else {
      setFormData({
        ...initialFormData,
        portId: generatePortId() // Generate new ID for new form
      });
    }
   
    // Clear errors and touched fields
    setErrors({});
    setTouched({});
   
    // Scroll to top of form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSuccessPopupClose = () => {
    // Just close the popup, stay on the same page
    setShowSuccessPopup(false);
   
    // If in add mode, reset the form for new entry
    if (!isEditMode) {
      setFormData({
        ...initialFormData,
        portId: generatePortId() // Generate new ID for new form
      });
      setErrors({});
      setTouched({});
     
      // Scroll to top of form
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={handleCancel}
              className="hover:bg-gray-200 rounded-lg transition-colors"
              type="button"
            >
              {/* <ArrowLeftIcon className="w-5 h-5" /> */}
            </button>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditMode ? "Edit Port Rule" : "Add Port Rule"}
            </h1>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
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
                <input
                  type="text"
                  value={formData.portId}
                  readOnly
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-600 cursor-not-allowed"
                />
                <p className="mt-1 text-sm text-gray-500">Auto-generated port identifier</p>
              </div>

              {/* Port Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Port Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="portName"
                  value={formData.portName}
                  onChange={handleInputChange}
                  onBlur={() => setTouched(prev => ({ ...prev, portName: true }))}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.portName && touched.portName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter port name"
                />
                {errors.portName && touched.portName && (
                  <p className="mt-1 text-sm text-red-600">{errors.portName}</p>
                )}
              </div>

              {/* Port Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Port Code (Optional)
                </label>
                <input
                  type="text"
                  name="portCode"
                  value={formData.portCode}
                  onChange={handleInputChange}
                  onBlur={() => setTouched(prev => ({ ...prev, portCode: true }))}
                  maxLength={5}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.portCode && touched.portCode ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., JAL"
                />
                {errors.portCode && touched.portCode && (
                  <p className="mt-1 text-sm text-red-600">{errors.portCode}</p>
                )}
                <p className="mt-1 text-sm text-gray-500">3-5 letter code</p>
              </div>

              {/* Emirate */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Emirate <span className="text-red-500">*</span>
                </label>
                <select
                  name="emirate"
                  value={formData.emirate}
                  onChange={handleInputChange}
                  onBlur={() => setTouched(prev => ({ ...prev, emirate: true }))}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.emirate && touched.emirate ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Emirate</option>
                  {emirates.map(emirate => (
                    <option key={emirate} value={emirate}>{emirate}</option>
                  ))}
                </select>
                {errors.emirate && touched.emirate && (
                  <p className="mt-1 text-sm text-red-600">{errors.emirate}</p>
                )}
              </div>

              {/* Active Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Active Status
                </label>
                <select
                  name="activeStatus"
                  value={formData.activeStatus}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
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
                  Standard Free Days <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="standardFreeDays"
                  value={formData.standardFreeDays}
                  onChange={handleInputChange}
                  onBlur={() => setTouched(prev => ({ ...prev, standardFreeDays: true }))}
                  min="1"
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.standardFreeDays && touched.standardFreeDays ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.standardFreeDays && touched.standardFreeDays && (
                  <p className="mt-1 text-sm text-red-600">{errors.standardFreeDays}</p>
                )}
                <p className="mt-1 text-sm text-gray-500">Number of free days before demurrage applies</p>
              </div>

              {/* Maximum Allowed Return Days */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Allowed Return Days <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="maximumReturnDays"
                  value={formData.maximumReturnDays}
                  onChange={handleInputChange}
                  onBlur={() => setTouched(prev => ({ ...prev, maximumReturnDays: true }))}
                  min={formData.standardFreeDays}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.maximumReturnDays && touched.maximumReturnDays ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.maximumReturnDays && touched.maximumReturnDays && (
                  <p className="mt-1 text-sm text-red-600">{errors.maximumReturnDays}</p>
                )}
                <p className="mt-1 text-sm text-gray-500">Must be ≥ Free Days</p>
              </div>

              {/* Demurrage per Day */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Demurrage per Day (AED) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="demurragePerDay"
                  value={formData.demurragePerDay}
                  onChange={handleInputChange}
                  onBlur={() => setTouched(prev => ({ ...prev, demurragePerDay: true }))}
                  min="1"
                  step="0.01"
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.demurragePerDay && touched.demurragePerDay ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.demurragePerDay && touched.demurragePerDay && (
                  <p className="mt-1 text-sm text-red-600">{errors.demurragePerDay}</p>
                )}
              </div>

              {/* Return Deadline Calculation Method */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Return Deadline Calculation Method <span className="text-red-500">*</span>
                </label>
                <select
                  name="returnDeadlineMethod"
                  value={formData.returnDeadlineMethod}
                  onChange={handleInputChange}
                  onBlur={() => setTouched(prev => ({ ...prev, returnDeadlineMethod: true }))}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.returnDeadlineMethod && touched.returnDeadlineMethod ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Method</option>
                  {returnDeadlineMethods.map(method => (
                    <option key={method} value={method}>{method}</option>
                  ))}
                </select>
                {errors.returnDeadlineMethod && touched.returnDeadlineMethod && (
                  <p className="mt-1 text-sm text-red-600">{errors.returnDeadlineMethod}</p>
                )}
              </div>

              {/* Grace Period */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Grace Period (hours) - Optional
                </label>
                <input
                  type="number"
                  name="gracePeriod"
                  value={formData.gracePeriod}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="mt-1 text-sm text-gray-500">Additional hours after deadline</p>
              </div>
            </div>
          </div>

          {/* Toll & Movement Rules */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">
              Toll & Movement Rules
            </h3>
           
            {/* Toll Applicable Toggle */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Toll Applicable?
                  </label>
                  <p className="text-sm text-gray-500">Enable toll charges for this port</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggle("tollApplicable")}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                    formData.tollApplicable ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    formData.tollApplicable ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              {formData.tollApplicable && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 space-y-6">
                  {/* Day Toll Amount */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Day Toll Amount (AED) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="dayTollAmount"
                        value={formData.dayTollAmount}
                        onChange={handleInputChange}
                        onBlur={() => setTouched(prev => ({ ...prev, dayTollAmount: true }))}
                        min="0.01"
                        step="0.01"
                        className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.dayTollAmount && touched.dayTollAmount ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.dayTollAmount && touched.dayTollAmount && (
                        <p className="mt-1 text-sm text-red-600">{errors.dayTollAmount}</p>
                      )}
                    </div>

                    {/* Night Toll Amount */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Night Toll Amount (AED) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="nightTollAmount"
                        value={formData.nightTollAmount}
                        onChange={handleInputChange}
                        onBlur={() => setTouched(prev => ({ ...prev, nightTollAmount: true }))}
                        min="0.01"
                        step="0.01"
                        className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.nightTollAmount && touched.nightTollAmount ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.nightTollAmount && touched.nightTollAmount && (
                        <p className="mt-1 text-sm text-red-600">{errors.nightTollAmount}</p>
                      )}
                    </div>

                    {/* Night Hours Start with Custom Time Picker */}
                    <TimePicker
                      value={formData.nightHoursStart}
                      onChange={(value) => handleTimeChange("nightHoursStart", value)}
                      error={errors.nightHoursStart}
                      touched={touched.nightHoursStart}
                      label="Night Hours Start"
                      required={true}
                    />

                    {/* Night Hours End with Custom Time Picker */}
                    <TimePicker
                      value={formData.nightHoursEnd}
                      onChange={(value) => handleTimeChange("nightHoursEnd", value)}
                      error={errors.nightHoursEnd}
                      touched={touched.nightHoursEnd}
                      label="Night Hours End"
                      required={true}
                    />
                  </div>

                  {/* Toll Required For Empty Return Toggle */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Toll Required For Empty Return? (Optional)
                        </label>
                        <p className="text-sm text-gray-500">Enable toll for empty container returns</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleToggle("tollRequiredForEmptyReturn")}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                          formData.tollRequiredForEmptyReturn ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                          formData.tollRequiredForEmptyReturn ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>

                    {formData.tollRequiredForEmptyReturn && (
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Toll Amount (AED) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          name="emptyReturnTollAmount"
                          value={formData.emptyReturnTollAmount}
                          onChange={handleInputChange}
                          onBlur={() => setTouched(prev => ({ ...prev, emptyReturnTollAmount: true }))}
                          min="0.01"
                          step="0.01"
                          className={`w-full md:w-1/2 px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors.emptyReturnTollAmount && touched.emptyReturnTollAmount ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Enter toll amount"
                        />
                        {errors.emptyReturnTollAmount && touched.emptyReturnTollAmount && (
                          <p className="mt-1 text-sm text-red-600">{errors.emptyReturnTollAmount}</p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Toll Applied Dropdown */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Toll Applied
                    </label>
                    <select
                      name="tollApplied"
                      value={formData.tollApplied}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {tollAppliedOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>

                  {/* Toll Payment Method Dropdown */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Toll Payment Method <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="tollPaymentMethod"
                      value={formData.tollPaymentMethod}
                      onChange={handleInputChange}
                      onBlur={() => setTouched(prev => ({ ...prev, tollPaymentMethod: true }))}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.tollPaymentMethod && touched.tollPaymentMethod ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select Payment Method</option>
                      {tollPaymentMethods.map(method => (
                        <option key={method} value={method}>{method}</option>
                      ))}
                    </select>
                    {errors.tollPaymentMethod && touched.tollPaymentMethod && (
                      <p className="mt-1 text-sm text-red-600">{errors.tollPaymentMethod}</p>
                    )}
                    <p className="mt-1 text-sm text-gray-500">
                      Prepaid (company pays upfront), Postpaid (customer pays later), Vendor Pays
                    </p>
                  </div>

                  {/* Mandatory Toll Receipt Upload Toggle */}
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Mandatory Toll Receipt Upload?
                      </label>
                      <p className="text-sm text-gray-500">Driver will have to upload receipt before marking job as Complete</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggle("mandatoryTollReceipt")}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                        formData.mandatoryTollReceipt ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        formData.mandatoryTollReceipt ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>

                  {/* Return Route Restrictions */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Return Route Restrictions
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {returnRoutes.map(route => (
                        <button
                          key={route}
                          type="button"
                          onClick={() => handleMultiSelect("returnRouteRestrictions", route)}
                          className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${
                            formData.returnRouteRestrictions.includes(route)
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {route}
                        </button>
                      ))}
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      {formData.returnRouteRestrictions.length > 0
                        ? `Selected: ${formData.returnRouteRestrictions.join(", ")}`
                        : "No restrictions selected"}
                    </p>
                  </div>

                  {/* Automatic Toll Penalty If No Receipt Toggle */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Automatic Toll Penalty If No Receipt? (Optional)
                        </label>
                        <p className="text-sm text-gray-500">Apply penalty automatically if receipt not uploaded</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleToggle("automaticTollPenalty")}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                          formData.automaticTollPenalty ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                          formData.automaticTollPenalty ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>

                    {formData.automaticTollPenalty && (
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Penalty Amount (AED) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          name="penaltyAmount"
                          value={formData.penaltyAmount}
                          onChange={handleInputChange}
                          onBlur={() => setTouched(prev => ({ ...prev, penaltyAmount: true }))}
                          min="0.01"
                          step="0.01"
                          className={`w-full md:w-1/2 px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors.penaltyAmount && touched.penaltyAmount ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Enter penalty amount"
                        />
                        {errors.penaltyAmount && touched.penaltyAmount && (
                          <p className="mt-1 text-sm text-red-600">{errors.penaltyAmount}</p>
                        )}
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
              {/* Night-Only Movement Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Night-Only Movement Allowed?
                  </label>
                  <p className="text-sm text-gray-500">Restrict movement to night hours only</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggle("nightOnlyMovement")}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                    formData.nightOnlyMovement ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    formData.nightOnlyMovement ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              {formData.nightOnlyMovement && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Allowed Movement Start Time with Custom Time Picker */}
                    <TimePicker
                      value={formData.allowedMovementStart}
                      onChange={(value) => handleTimeChange("allowedMovementStart", value)}
                      error={errors.allowedMovementStart}
                      touched={touched.allowedMovementStart}
                      label="Allowed Movement Start Time"
                      required={true}
                    />

                    {/* Allowed Movement End Time with Custom Time Picker */}
                    <TimePicker
                      value={formData.allowedMovementEnd}
                      onChange={(value) => handleTimeChange("allowedMovementEnd", value)}
                      error={errors.allowedMovementEnd}
                      touched={touched.allowedMovementEnd}
                      label="Allowed Movement End Time"
                      required={true}
                    />
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
                    <button
                      key={day}
                      type="button"
                      onClick={() => handleMultiSelect("weekendRestrictions", day)}
                      className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${
                        formData.weekendRestrictions.includes(day)
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  {formData.weekendRestrictions.length > 0
                    ? `Restricted days: ${formData.weekendRestrictions.join(", ")}`
                    : "No weekend restrictions"}
                </p>
              </div>

              {/* Public Holiday Lock Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Public Holiday Lock?
                  </label>
                  <p className="text-sm text-gray-500">Admin can manually block port on given dates</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggle("publicHolidayLock")}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                    formData.publicHolidayLock ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    formData.publicHolidayLock ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              {/* Port Entry Fee */}
              <div className="w-full md:w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Port Entry Fee (AED) - Optional
                </label>
                <input
                  type="number"
                  name="portEntryFee"
                  value={formData.portEntryFee}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Operational Cutoff Rules */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">
              Operational Cutoff Rules
            </h3>
           
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Cutoff Time for DO Submission with Custom Time Picker */}
              <TimePicker
                value={formData.cutoffDosubmission}
                onChange={(value) => handleTimeChange("cutoffDosubmission", value)}
                error={errors.cutoffDosubmission}
                touched={touched.cutoffDosubmission}
                label="Cutoff Time for DO Submission"
                required={true}
              />

              {/* Cutoff Time for Container Pickup with Custom Time Picker */}
              <TimePicker
                value={formData.cutoffContainerPickup}
                onChange={(value) => handleTimeChange("cutoffContainerPickup", value)}
                error={errors.cutoffContainerPickup}
                touched={touched.cutoffContainerPickup}
                label="Cutoff Time for Container Pickup"
                required={true}
              />

              {/* Cutoff Time for Empty Return with Custom Time Picker */}
              <TimePicker
                value={formData.cutoffEmptyReturn}
                onChange={(value) => handleTimeChange("cutoffEmptyReturn", value)}
                error={errors.cutoffEmptyReturn}
                touched={touched.cutoffEmptyReturn}
                label="Cutoff Time for Empty Return"
                required={true}
              />
            </div>

            {/* Upload DO Mandatory Toggle */}
            <div className="mt-6 flex items-center justify-between">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Upload DO Mandatory?
                </label>
                <p className="text-sm text-gray-500">Require Delivery Order upload for operations</p>
              </div>
              <button
                type="button"
                onClick={() => handleToggle("uploadDoMandatory")}
                className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                  formData.uploadDoMandatory ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  formData.uploadDoMandatory ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
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
                  <select
                    name="reminderBeforeReturn"
                    value={formData.reminderBeforeReturn}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {reminderOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                {/* Demurrage Alert Threshold */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Demurrage Alert Threshold (days)
                  </label>
                  <input
                    type="number"
                    name="demurrageAlertThreshold"
                    value={formData.demurrageAlertThreshold}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="mt-1 text-sm text-gray-500">Days before free days end</p>
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
                  <button
                    type="button"
                    onClick={() => handleToggle("tollRequiredNotification")}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                      formData.tollRequiredNotification ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      formData.tollRequiredNotification ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Night Movement Warning
                    </label>
                    <p className="text-sm text-gray-500">Alert about night movement restrictions</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggle("nightMovementWarning")}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                      formData.nightMovementWarning ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      formData.nightMovementWarning ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Cutoff Time Warning
                    </label>
                    <p className="text-sm text-gray-500">Alert about approaching cutoff times</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggle("cutoffTimeWarning")}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                      formData.cutoffTimeWarning ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      formData.cutoffTimeWarning ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-200">
            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2 transition-colors"
                disabled={isSubmitting}
              >
                {/* <XMarkIcon className="w-5 h-5" /> */}
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {isEditMode ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>
                    {/* <CheckIcon className="w-5 h-5" /> */}
                    {isEditMode ? "Update Port Rule" : "Create Port Rule"}
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-96 text-center animate-fadeIn">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckIcon className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {isEditMode ? "Port Updated Successfully!" : "Port Created Successfully!"}
            </h2>
            <p className="text-gray-600 mb-6">
              {isEditMode
                ? "Port configuration has been updated successfully."
                : "New port has been created successfully and added to the system."
              }
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={handleSuccessPopupClose}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 transition-colors"
              >
                {/* <CheckIcon className="w-5 h-5" /> */}
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
