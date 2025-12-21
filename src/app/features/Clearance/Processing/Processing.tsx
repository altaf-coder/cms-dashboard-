"use client";

import { useState, ChangeEvent } from "react";
import { motion } from "framer-motion";
import {
  UploadCloud,
  CheckCircle,
  AlertTriangle,
  X,
  FileText,
  Package,
  Search,
} from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router";

export default function ClearanceProcessingPage() {
  const [doApplied, setDoApplied] = useState(false);
  const navigate = useNavigate();
  const [inspectionRequired, setInspectionRequired] = useState(false);
  const [vehicleCount, setVehicleCount] = useState<number | "">("");
  const [vinList, setVinList] = useState("");
  const [declarationStatus, setDeclarationStatus] = useState("Pending");
  const [clearanceDate, setClearanceDate] = useState<Date | null>(null);

  const [doFile, setDoFile] = useState<File | null>(null);
  const [declarationFile, setDeclarationFile] = useState<File | null>(null);
  const [invoiceFile, setInvoiceFile] = useState<File | null>(null);
  const [inspectionFile, setInspectionFile] = useState<File | null>(null);

  const [doDate, setDoDate] = useState<Date | null>(null);
  const [declarationDate, setDeclarationDate] = useState<Date | null>(null);
  const [inspectionDate, setInspectionDate] = useState<Date | null>(null);

  const vinCount = vinList.split("\n").filter((v) => v.trim() !== "").length;

  const vinMismatch = vehicleCount !== "" && vinCount !== Number(vehicleCount);

  const mandatoryDocsMissing =
    !doFile ||
    !declarationFile ||
    !invoiceFile ||
    (inspectionRequired && !inspectionFile);

  const handleFileChange = (
    setter: React.Dispatch<React.SetStateAction<File | null>>,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      setter(e.target.files[0]);
    }
  };

  const removeFile = (
    setter: React.Dispatch<React.SetStateAction<File | null>>
  ) => {
    setter(null);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="rounded-xl border border-[#ecf3ff] bg-white p-4 shadow-sm"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[#0c3469] flex items-center gap-3">
              <Package className="h-7 w-7" />
              Clearance Processing
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Complete clearance workflow for container. Fill all mandatory
              documents for successful clearance.
            </p>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-[#434343]">Status</p>
              <p className="text-sm text-gray-500">Pending Clearance</p>
            </div>
            <div className="h-8 w-px bg-gray-300"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div
            className={`p-4 rounded-lg border ${
              doApplied
                ? "border-green-200 bg-green-50"
                : "border-gray-200 bg-gray-50"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center ${
                  doApplied
                    ? "bg-green-100 text-green-600"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {doApplied ? <CheckCircle className="h-5 w-5" /> : "1"}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">DO Applied</p>
                <p className="text-xs text-gray-500">
                  {doApplied ? "Completed" : "Pending"}
                </p>
              </div>
            </div>
          </div>

          <div
            className={`p-4 rounded-lg border ${
              declarationStatus !== "Pending"
                ? "border-blue-200 bg-blue-50"
                : "border-gray-200 bg-gray-50"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center ${
                  declarationStatus !== "Pending"
                    ? "bg-blue-100 text-blue-600"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {declarationStatus !== "Pending" ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  "2"
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Customs</p>
                <p className="text-xs text-gray-500">{declarationStatus}</p>
              </div>
            </div>
          </div>

          <div
            className={`p-4 rounded-lg border ${
              !inspectionRequired
                ? "border-green-200 bg-green-50"
                : "border-gray-200 bg-gray-50"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center ${
                  !inspectionRequired
                    ? "bg-green-100 text-green-600"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {!inspectionRequired ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  "3"
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Inspection</p>
                <p className="text-xs text-gray-500">
                  {inspectionRequired ? "Required" : "Not Required"}
                </p>
              </div>
            </div>
          </div>

          <div
            className={`p-4 rounded-lg border ${
              !mandatoryDocsMissing
                ? "border-green-200 bg-green-50"
                : "border-gray-200 bg-gray-50"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center ${
                  !mandatoryDocsMissing
                    ? "bg-green-100 text-green-600"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {!mandatoryDocsMissing ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  "4"
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Clearance</p>
                <p className="text-xs text-gray-500">
                  {!mandatoryDocsMissing ? "Ready" : "Documents Pending"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="rounded-xl border border-[#ecf3ff] bg-white p-4 shadow-sm space-y-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <FileText className="h-5 w-5 text-[#0c3469]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[#434343]">
                Delivery Order
              </h2>
              <p className="text-sm text-gray-500">
                Apply and upload DO documents
              </p>
            </div>
          </div>
          {doApplied && (
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm">
              <CheckCircle className="h-4 w-4" />
              Applied
            </span>
          )}
        </div>

        <div className="flex items-center justify-between mb-4">
          <label className="flex items-center gap-3 text-sm font-medium text-[#434343]">
            <input
              type="checkbox"
              checked={doApplied}
              onChange={() => setDoApplied(!doApplied)}
              className="h-4 w-4 rounded border-[#519fcc] text-[#0c3469] focus:ring-[#ecf3ff]"
            />
            DO Applied
          </label>
        </div>

        {!doApplied ? (
          <div className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#434343]">
                  DO Amount
                </label>
                <input
                  className="w-full h-11 rounded-lg border border-[#519fcc] bg-white px-4 py-2.5 text-[#434343] placeholder-gray-400 focus:border-[#104e90] focus:outline-none focus:ring-2 focus:ring-[#ecf3ff] transition-all duration-200"
                  placeholder="Enter amount"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[#434343]">
                  DO Date
                </label>
                <div className="[&_.react-datepicker-wrapper]:w-full">
                  <DatePicker
                    selected={doDate}
                    onChange={setDoDate}
                    placeholderText="Select DO date"
                    dateFormat="yyyy-MM-dd"
                    className="w-full h-11 rounded-lg border border-[#519fcc] bg-white px-4 py-2.5 text-[#434343] placeholder-gray-400 focus:border-[#104e90] focus:outline-none focus:ring-2 focus:ring-[#ecf3ff] transition-all duration-200"
                    wrapperClassName="w-full"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[#434343]">
                  DO Letter Upload
                </label>
                <div className="relative">
                  {doFile ? (
                    <div className="flex items-center justify-between h-11 rounded-lg border border-[#519fcc] bg-white px-4">
                      <div className="flex items-center gap-3">
                        <UploadCloud className="h-4 w-4 text-[#0c3469]" />
                        <span className="text-sm text-[#434343] truncate">
                          {doFile.name}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(setDoFile)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer">
                      <div className="flex items-center h-11 rounded-lg border border-[#519fcc] bg-white px-4 hover:bg-[#ecf3ff] transition-colors">
                        <UploadCloud className="h-4 w-4 text-[#0c3469] mr-3" />
                        <span className="text-sm text-gray-500">
                          Upload PDF document
                        </span>
                      </div>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.png"
                        onChange={(e) => handleFileChange(setDoFile, e)}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>

            <motion.button
              onClick={() => navigate("/clearance/do-application")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full md:w-[32.3%] rounded-lg border border-[#519fcc] bg-white px-6 py-2.5 text-[#0c3469] font-medium hover:bg-[#ecf3ff] focus:outline-none focus:ring-2 focus:ring-[#ecf3ff] transition-all duration-200 shadow-sm"
            >
              Open DO Application Form
            </motion.button>
          </div>
        ) : (
          <div className="rounded-lg bg-green-50 border border-green-200 p-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-green-900">
                  DO already applied
                </p>
                <p className="text-sm text-green-700 mt-1">
                  Details have been fetched automatically. You can proceed with
                  customs declaration.
                </p>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="rounded-xl border border-[#ecf3ff] bg-white p-4 shadow-sm space-y-6"
      >
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center">
            <Search className="h-5 w-5 text-[#0c3469]" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-[#434343]">
              Customs Declaration
            </h2>
            <p className="text-sm text-gray-500">
              Submit customs declaration details
            </p>
          </div>
        </div>

        {!doApplied ? (
          <div className="rounded-lg bg-gray-50 border border-gray-200 p-4">
            <p className="text-sm text-gray-500 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Please apply DO first to enable customs declaration
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#434343]">
                  Declaration Reference No
                </label>
                <input
                  className="w-full h-11 rounded-lg border border-[#519fcc] bg-white px-4 py-2.5 text-[#434343] placeholder-gray-400 focus:border-[#104e90] focus:outline-none focus:ring-2 focus:ring-[#ecf3ff] transition-all duration-200"
                  placeholder="Enter reference number"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[#434343]">
                  Declaration Type
                </label>
                <input
                  className="w-full h-11 rounded-lg border border-[#519fcc] bg-white px-4 py-2.5 text-[#434343] bg-gray-50 cursor-not-allowed"
                  value="Import"
                  disabled
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[#434343]">
                  Declaration Date
                </label>
                <div className="[&_.react-datepicker-wrapper]:w-full">
                  <DatePicker
                    selected={declarationDate}
                    onChange={setDeclarationDate}
                    placeholderText="Select declaration date"
                    dateFormat="yyyy-MM-dd"
                    className="w-full h-11 rounded-lg border border-[#519fcc] bg-white px-4 py-2.5 text-[#434343] placeholder-gray-400 focus:border-[#104e90] focus:outline-none focus:ring-2 focus:ring-[#ecf3ff] transition-all duration-200"
                    wrapperClassName="w-full"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[#434343]">
                  Bill of Entry No (BF)
                </label>
                <input
                  className="w-full h-11 rounded-lg border border-[#519fcc] bg-white px-4 py-2.5 text-[#434343] placeholder-gray-400 focus:border-[#104e90] focus:outline-none focus:ring-2 focus:ring-[#ecf3ff] transition-all duration-200"
                  placeholder="Enter BE number"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[#434343]">
                  Port of Origin
                </label>
                <input
                  className="w-full h-11 rounded-lg border border-[#519fcc] bg-white px-4 py-2.5 text-[#434343] placeholder-gray-400 focus:border-[#104e90] focus:outline-none focus:ring-2 focus:ring-[#ecf3ff] transition-all duration-200"
                  placeholder="Enter port name"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[#434343]">
                  Vehicle Count
                </label>
                <input
                  type="number"
                  className="w-full h-11 rounded-lg border border-[#519fcc] bg-white px-4 py-2.5 text-[#434343] placeholder-gray-400 focus:border-[#104e90] focus:outline-none focus:ring-2 focus:ring-[#ecf3ff] transition-all duration-200"
                  placeholder="Number of vehicles"
                  value={vehicleCount}
                  onChange={(e) => setVehicleCount(Number(e.target.value))}
                />
              </div>

              <div className="md:col-span-3 space-y-2">
                <label className="text-sm font-medium text-[#434343]">
                  VIN Numbers (one per line)
                </label>
                <textarea
                  className="w-full rounded-lg border border-[#519fcc] bg-white px-4 py-3 text-[#434343] placeholder-gray-400 focus:border-[#104e90] focus:outline-none focus:ring-2 focus:ring-[#ecf3ff] transition-all duration-200 min-h-[120px]"
                  placeholder="Enter each VIN on a new line"
                  value={vinList}
                  onChange={(e) => setVinList(e.target.value)}
                />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    {vinCount} VIN(s) entered
                  </span>
                  {vinMismatch && (
                    <span className="text-red-500 flex items-center gap-1">
                      <AlertTriangle className="h-4 w-4" />
                      VIN count must match vehicle count
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[#434343]">
                  Declared Value
                </label>
                <input
                  className="w-full h-11 rounded-lg border border-[#519fcc] bg-white px-4 py-2.5 text-[#434343] placeholder-gray-400 focus:border-[#104e90] focus:outline-none focus:ring-2 focus:ring-[#ecf3ff] transition-all duration-200"
                  placeholder="Enter value"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[#434343]">
                  Declaration Status
                </label>
                <div className="relative">
                  <select
                    className="w-full h-11 rounded-lg border border-[#519fcc] bg-white px-4 py-2.5 text-[#434343] focus:border-[#104e90] focus:outline-none focus:ring-2 focus:ring-[#ecf3ff] transition-all duration-200 appearance-none"
                    value={declarationStatus}
                    onChange={(e) => setDeclarationStatus(e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Submitted">Submitted</option>
                    <option value="Passed">Passed</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
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
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#434343]">
                  Upload Invoices <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  {invoiceFile ? (
                    <div className="flex items-center justify-between h-11 rounded-lg border border-[#519fcc] bg-white px-4">
                      <div className="flex items-center gap-3">
                        <UploadCloud className="h-4 w-4 text-[#0c3469]" />
                        <span className="text-sm text-[#434343] truncate">
                          {invoiceFile.name}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(setInvoiceFile)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer">
                      <div className="flex items-center h-11 rounded-lg border border-[#519fcc] bg-white px-4 hover:bg-[#ecf3ff] transition-colors">
                        <UploadCloud className="h-4 w-4 text-[#0c3469] mr-3" />
                        <span className="text-sm text-gray-500">
                          Upload invoices (PDF/JPG/PNG)
                        </span>
                      </div>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.png"
                        onChange={(e) => handleFileChange(setInvoiceFile, e)}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[#434343]">
                  Declaration Documents <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  {declarationFile ? (
                    <div className="flex items-center justify-between h-11 rounded-lg border border-[#519fcc] bg-white px-4">
                      <div className="flex items-center gap-3">
                        <UploadCloud className="h-4 w-4 text-[#0c3469]" />
                        <span className="text-sm text-[#434343] truncate">
                          {declarationFile.name}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(setDeclarationFile)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer">
                      <div className="flex items-center h-11 rounded-lg border border-[#519fcc] bg-white px-4 hover:bg-[#ecf3ff] transition-colors">
                        <UploadCloud className="h-4 w-4 text-[#0c3469] mr-3" />
                        <span className="text-sm text-gray-500">
                          Upload documents (PDF/JPG/PNG)
                        </span>
                      </div>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.png"
                        onChange={(e) =>
                          handleFileChange(setDeclarationFile, e)
                        }
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="rounded-xl border border-[#ecf3ff] bg-white p-4 shadow-sm space-y-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <Search className="h-5 w-5 text-[#0c3469]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[#434343]">
                Inspection
              </h2>
              <p className="text-sm text-gray-500">
                Inspection requirements and results
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <label className="flex items-center gap-3 text-sm font-medium text-[#434343]">
            <input
              type="checkbox"
              checked={inspectionRequired}
              onChange={() => setInspectionRequired(!inspectionRequired)}
              className="h-4 w-4 rounded border-[#519fcc] text-[#0c3469] focus:ring-[#ecf3ff]"
            />
            Inspection Required
          </label>
        </div>

        {inspectionRequired ? (
          <div className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#434343]">
                  Inspection Type
                </label>
                <div className="relative">
                  <select className="w-full h-11 rounded-lg border border-[#519fcc] bg-white px-4 py-2.5 text-[#434343] focus:border-[#104e90] focus:outline-none focus:ring-2 focus:ring-[#ecf3ff] transition-all duration-200 appearance-none">
                    <option>X-Ray</option>
                    <option>Physical</option>
                    <option>Both</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
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

              <div className="space-y-2">
                <label className="text-sm font-medium text-[#434343]">
                  Inspection Date
                </label>
                <div className="[&_.react-datepicker-wrapper]:w-full">
                  <DatePicker
                    selected={inspectionDate}
                    onChange={setInspectionDate}
                    placeholderText="Select inspection date"
                    dateFormat="yyyy-MM-dd"
                    className="w-full h-11 rounded-lg border border-[#519fcc] bg-white px-4 py-2.5 text-[#434343] placeholder-gray-400 focus:border-[#104e90] focus:outline-none focus:ring-2 focus:ring-[#ecf3ff] transition-all duration-200"
                    wrapperClassName="w-full"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[#434343]">
                  Inspection Agent
                </label>
                <input
                  className="w-full h-11 rounded-lg border border-[#519fcc] bg-white px-4 py-2.5 text-[#434343] placeholder-gray-400 focus:border-[#104e90] focus:outline-none focus:ring-2 focus:ring-[#ecf3ff] transition-all duration-200"
                  placeholder="Enter agent name"
                />
              </div>

              <div className="md:col-span-3 space-y-2">
                <label className="text-sm font-medium text-[#434343]">
                  Inspector Notes
                </label>
                <textarea
                  className="w-full rounded-lg border border-[#519fcc] bg-white px-4 py-3 text-[#434343] placeholder-gray-400 focus:border-[#104e90] focus:outline-none focus:ring-2 focus:ring-[#ecf3ff] transition-all duration-200 min-h-[100px]"
                  placeholder="Enter inspection notes..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[#434343]">
                  Inspection Result
                </label>
                <div className="relative">
                  <select className="w-full h-11 rounded-lg border border-[#519fcc] bg-white px-4 py-2.5 text-[#434343] focus:border-[#104e90] focus:outline-none focus:ring-2 focus:ring-[#ecf3ff] transition-all duration-200 appearance-none">
                    <option>Pass</option>
                    <option>Hold</option>
                    <option>Pending</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
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
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[#434343]">
                Upload Inspection Documents
              </label>
              <div className="relative">
                {inspectionFile ? (
                  <div className="flex items-center justify-between h-11 rounded-lg border border-[#519fcc] bg-white px-4">
                    <div className="flex items-center gap-3">
                      <UploadCloud className="h-4 w-4 text-[#0c3469]" />
                      <span className="text-sm text-[#434343] truncate">
                        {inspectionFile.name}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(setInspectionFile)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer">
                    <div className="flex items-center h-11 rounded-lg border border-[#519fcc] bg-white px-4 hover:bg-[#ecf3ff] transition-colors">
                      <UploadCloud className="h-4 w-4 text-[#0c3469] mr-3" />
                      <span className="text-sm text-gray-500">
                        Upload inspection documents (PDF/JPG/PNG)
                      </span>
                    </div>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.png"
                      onChange={(e) => handleFileChange(setInspectionFile, e)}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-lg bg-green-50 border border-green-200 p-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-green-900">
                  Inspection Not Required
                </p>
                <p className="text-sm text-green-700 mt-1">
                  Container is ready for pickup. No inspection needed.
                </p>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="rounded-xl border border-[#ecf3ff] bg-white p-4 shadow-sm"
      >
        <div className="flex md:flex-row md:gap-0 gap-3 flex-col items-center md:justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-[#434343]">
              Final Clearance Actions
            </h2>
            <p className="text-sm text-gray-500">
              Complete the clearance process
            </p>
          </div>
          {mandatoryDocsMissing && (
            <div className="w-full md:w-[28%] flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 border border-red-200">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <span className="text-sm font-medium text-red-900">
                Mandatory documents pending
              </span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex items-end">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full h-11 rounded-lg border border-[#519fcc] bg-white px-4 py-2.5 text-[#0c3469] font-medium hover:bg-[#ecf3ff] focus:outline-none focus:ring-2 focus:ring-[#ecf3ff] transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={mandatoryDocsMissing}
            >
              Submit Declaration
            </motion.button>
          </div>

          <div className="space-y-2">
            <div className="[&_.react-datepicker-wrapper]:w-full">
              <DatePicker
                selected={clearanceDate}
                onChange={setClearanceDate}
                placeholderText="Select Clearance Date"
                dateFormat="yyyy-MM-dd"
                className="w-full h-11 rounded-lg border border-[#519fcc] bg-white px-4 py-2.5 text-[#434343] placeholder-gray-400 focus:border-[#104e90] focus:outline-none focus:ring-2 focus:ring-[#ecf3ff] transition-all duration-200"
                wrapperClassName="w-full"
              />
            </div>
          </div>

          <div className="flex items-end">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full h-11 rounded-lg bg-[#0c3469] px-4 py-2.5 text-white font-medium hover:bg-[#104e90] focus:outline-none focus:ring-2 focus:ring-[#ecf3ff] focus:ring-offset-2 transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={mandatoryDocsMissing}
            >
              Mark Cleared
            </motion.button>
          </div>

          <div className="flex items-end">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full h-11 rounded-lg bg-green-600 px-4 py-2.5 text-white font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-100 focus:ring-offset-2 transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={mandatoryDocsMissing}
            >
              Ready for Pickup
            </motion.button>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-red-500"></div>
              Mandatory document missing
            </span>
            <span className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              Completed step
            </span>
            <span className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-blue-500"></div>
              In progress
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
