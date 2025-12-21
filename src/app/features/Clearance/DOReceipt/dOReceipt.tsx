"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Upload, X, FileText, AlertCircle } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function DOReceiptPage() {
  const [doNumber, setDoNumber] = useState<string>("");
  const [doFees, setDoFees] = useState<string>("");
  const [issueDate, setIssueDate] = useState<Date | null>(null);
  const [expiryDate, setExpiryDate] = useState<Date | null>(null);
  const [doFile, setDoFile] = useState<File | null>(null);
  const [showToast, setShowToast] = useState<boolean>(false);
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log({ doNumber, doFees, issueDate, expiryDate, doFile });
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 4000);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setDoFile(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setDoFile(null);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-2">
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed right-4 top-4 z-50 w-80"
          >
            <div className="rounded-lg bg-[#0c3469] p-4 shadow-xl border border-[#104e90]">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-semibold text-white">
                    DO Receipt Saved
                  </p>
                  <p className="text-xs text-blue-100 mt-0.5">
                    Status: DO Received
                  </p>
                </div>
                <button
                  type="button"
                  className="ml-4 flex-shrink-0 text-blue-200 hover:text-white focus:outline-none"
                  onClick={() => setShowToast(false)}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-semibold text-[#434343]">
          Receive Delivery Order
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          When port issues DO. Fill in the details below.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="rounded-xl border border-[#ecf3ff] bg-white p-6 shadow-sm"
      >
        <form onSubmit={handleSubmit} className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#434343]">
              DO Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={doNumber}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setDoNumber(e.target.value)
              }
              placeholder="Enter DO number"
              className="w-full h-11 rounded-lg border border-[#519fcc] bg-white px-4 py-2.5 text-[#434343] placeholder-gray-400 focus:border-[#104e90] focus:outline-none focus:ring-2 focus:ring-[#ecf3ff] transition-all duration-200"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[#434343]">
              DO Fees (if applicable)
            </label>
            <input
              type="number"
              value={doFees}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setDoFees(e.target.value)
              }
              placeholder="Amount"
              className="w-full h-11 rounded-lg border border-[#519fcc] bg-white px-4 py-2.5 text-[#434343] placeholder-gray-400 focus:border-[#104e90] focus:outline-none focus:ring-2 focus:ring-[#ecf3ff] transition-all duration-200"
            />
            <p className="text-xs text-gray-500">
              Leave empty if no fees applicable
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[#434343]">
              DO Issue Date <span className="text-red-500">*</span>
            </label>
            <div className="[&_.react-datepicker-wrapper]:w-full">
              <DatePicker
                selected={issueDate}
                onChange={(date: Date | null) => setIssueDate(date)}
                placeholderText="Select issue date"
                dateFormat="yyyy-MM-dd"
                className="w-full h-11 rounded-lg border border-[#519fcc] bg-white px-4 py-2.5 text-[#434343] placeholder-gray-400 focus:border-[#104e90] focus:outline-none focus:ring-2 focus:ring-[#ecf3ff] transition-all duration-200"
                required
                wrapperClassName="w-full"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[#434343]">
              DO Expiry Date <span className="text-red-500">*</span>
            </label>
            <div className="[&_.react-datepicker-wrapper]:w-full">
              <DatePicker
                selected={expiryDate}
                onChange={(date: Date | null) => setExpiryDate(date)}
                placeholderText="Select expiry date"
                dateFormat="yyyy-MM-dd"
                className="w-full h-11 rounded-lg border border-[#519fcc] bg-white px-4 py-2.5 text-[#434343] placeholder-gray-400 focus:border-[#104e90] focus:outline-none focus:ring-2 focus:ring-[#ecf3ff] transition-all duration-200"
                required
                wrapperClassName="w-full"
              />
            </div>
            <div className="flex items-start gap-2 mt-2 p-2 bg-[#fef2f2] rounded-lg border border-[#fed7d7]">
              <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red-700">
                <span className="font-semibold">VERY IMPORTANT:</span> Expired
                DO causes clearance delay. Please ensure expiry date is correct.
              </p>
            </div>
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-[#434343]">
              DO Document <span className="text-red-500">*</span>
            </label>

            <div className="relative">
              {doFile ? (
                <div className="flex items-center justify-between h-11 rounded-lg border border-[#519fcc] bg-white px-4">
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-[#0c3469]" />
                    <span className="text-sm text-[#434343] truncate">
                      {doFile.name}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={removeFile}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer w-full block">
                  <div className="flex items-center h-11 rounded-lg border border-[#519fcc] bg-white px-4 hover:bg-[#ecf3ff] transition-colors w-full">
                    <Upload className="h-4 w-4 text-[#0c3469] mr-3" />
                    <span className="text-sm text-gray-500">
                      Upload DO document (PDF)
                    </span>
                  </div>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                    required
                  />
                </label>
              )}
            </div>
            <p className="text-xs text-gray-500">
              Upload official DO document issued by port
            </p>
          </div>

          <div className="md:col-span-2">
            <div className="rounded-lg bg-[#ecf3ff] border border-[#519fcc] p-5">
              <h3 className="text-sm font-semibold text-[#0c3469] mb-3 flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                System Actions After Submission
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <div className="rounded-full bg-white p-1 mt-0.5">
                    <div className="h-2 w-2 rounded-full bg-[#0c3469]"></div>
                  </div>
                  <p className="text-sm text-[#434343]">
                    <span className="font-medium">Update Status:</span>{" "}
                    Container status will be updated to "DO Received"
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="rounded-full bg-white p-1 mt-0.5">
                    <div className="h-2 w-2 rounded-full bg-[#0c3469]"></div>
                  </div>
                  <p className="text-sm text-[#434343]">
                    <span className="font-medium">Alert Notification:</span>{" "}
                    System sends alert to Transport Coordinator (if assigned for
                    container)
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="rounded-full bg-white p-1 mt-0.5">
                    <div className="h-2 w-2 rounded-full bg-[#0c3469]"></div>
                  </div>
                  <p className="text-sm text-[#434343]">
                    <span className="font-medium">Next Step Enabled:</span>{" "}
                    Customs Declaration becomes available
                  </p>
                </div>
              </div>
            </div>
          </div>

          <motion.div
            className="md:col-span-2 flex justify-end pt-4"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <button
              type="submit"
              className="rounded-lg bg-[#0c3469] px-8 py-2.5 text-white font-medium hover:bg-[#104e90] focus:outline-none focus:ring-2 focus:ring-[#ecf3ff] focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow h-11"
            >
              Save DO Receipt
            </button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
}
