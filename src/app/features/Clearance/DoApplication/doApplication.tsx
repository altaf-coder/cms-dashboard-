"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Upload, X } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function DOApplicationPage() {
  const [paidBy, setPaidBy] = useState<string>("Company");
  const [container, setContainer] = useState<string>("");
  const [paymentAmount, setPaymentAmount] = useState<string>("");
  const [paymentDate, setPaymentDate] = useState<Date | null>(null);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [doFile, setDOFile] = useState<File | null>(null);
  const [showToast, setShowToast] = useState<boolean>(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log({
      container,
      doFile,
      paymentAmount,
      paymentDate,
      receiptFile,
      paidBy,
    });

    setShowToast(true);

    setTimeout(() => {
      setShowToast(false);
    }, 4000);
  };

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
                    Application Submitted
                  </p>
                  <p className="text-xs text-blue-100 mt-0.5">
                    Status: DO Applied
                  </p>
                </div>
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
          Delivery Order Application
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Apply delivery order after documents are received
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
              Container #
            </label>
            <div className="relative">
              <select
                value={container}
                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                  setContainer(e.target.value)
                }
                className="w-full h-11 rounded-lg border border-[#519fcc] bg-white px-4 py-2.5 text-[#434343] focus:border-[#104e90] focus:outline-none focus:ring-2 focus:ring-[#ecf3ff] transition-all duration-200 appearance-none"
                required
              >
                <option value="">Select arrived container</option>
                <option value="C001">C001</option>
                <option value="C002">C002</option>
                <option value="C003">C003</option>
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
            <p className="text-xs text-gray-500">
              Only containers with status "arrived" are shown
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[#434343]">
              DO Document (optional)
            </label>
            <div className="relative">
              {doFile ? (
                <div className="flex items-center justify-between h-11 rounded-lg border border-[#519fcc] bg-white px-4">
                  <div className="flex items-center gap-3">
                    <Upload className="h-4 w-4 text-[#0c3469]" />
                    <span className="text-sm text-[#434343] truncate">
                      {doFile.name}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(setDOFile)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer">
                  <div className="flex items-center h-11 rounded-lg border border-[#519fcc] bg-white px-4 hover:bg-[#ecf3ff] transition-colors">
                    <Upload className="h-4 w-4 text-[#0c3469] mr-3" />
                    <span className="text-sm text-gray-500">
                      Upload PDF document
                    </span>
                  </div>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => handleFileChange(setDOFile, e)}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            <p className="text-xs text-gray-500">Optional PDF document</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[#434343]">
              DO Application Payment Amount
            </label>
            <input
              type="number"
              value={paymentAmount}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setPaymentAmount(e.target.value)
              }
              placeholder="Amount"
              className="w-full h-11 rounded-lg border border-[#519fcc] bg-white px-4 py-2.5 text-[#434343] placeholder-gray-400 focus:border-[#104e90] focus:outline-none focus:ring-2 focus:ring-[#ecf3ff] transition-all duration-200"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[#434343]">
              DO Payment Date
            </label>
            <div className="[&_.react-datepicker-wrapper]:w-full">
              <DatePicker
                selected={paymentDate}
                onChange={(date: Date | null) => setPaymentDate(date)}
                placeholderText="Select payment date"
                dateFormat="yyyy-MM-dd"
                className="w-full h-11 rounded-lg border border-[#519fcc] bg-white px-4 py-2.5 text-[#434343] placeholder-gray-400 focus:border-[#104e90] focus:outline-none focus:ring-2 focus:ring-[#ecf3ff] transition-all duration-200"
                required
                wrapperClassName="w-full"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[#434343]">
              Paid By
            </label>
            <div className="relative">
              <select
                value={paidBy}
                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                  setPaidBy(e.target.value)
                }
                className="w-full h-11 rounded-lg border border-[#519fcc] bg-white px-4 py-2.5 text-[#434343] focus:border-[#104e90] focus:outline-none focus:ring-2 focus:ring-[#ecf3ff] transition-all duration-200 appearance-none"
                required
              >
                <option value="Company">Company</option>
                <option value="Customer">Customer</option>
                <option value="Vendor">Vendor</option>
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

          <div className="md:col-span-2">
            <div className="rounded-lg bg-[#ecf3ff] border border-[#519fcc] p-4">
              <h3 className="text-sm font-semibold text-[#0c3469] mb-2">
                System Auto:
              </h3>
              <div className="space-y-1">
                <p className="text-sm text-[#434343]">• Marks "DO Applied"</p>
                <p className="text-sm text-[#434343]">• Stores payment data</p>
                <p className="text-sm text-[#434343]">
                  • Adds record to Financial Module Payables
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-[#434343]">
              Payment Receipt <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              {receiptFile ? (
                <div className="flex items-center justify-between h-11 rounded-lg border border-[#519fcc] bg-white px-4">
                  <div className="flex items-center gap-3">
                    <Upload className="h-4 w-4 text-[#0c3469]" />
                    <span className="text-sm text-[#434343] truncate">
                      {receiptFile.name}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(setReceiptFile)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer">
                  <div className="flex items-center h-11 rounded-lg border border-[#519fcc] bg-white px-4 hover:bg-[#ecf3ff] transition-colors">
                    <Upload className="h-4 w-4 text-[#0c3469] mr-3" />
                    <span className="text-sm text-gray-500">
                      Upload payment receipt (PDF/JPG/PNG)
                    </span>
                  </div>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.png"
                    onChange={(e) => handleFileChange(setReceiptFile, e)}
                    className="hidden"
                    required
                  />
                </label>
              )}
            </div>
            <p className="text-xs text-gray-500">
              Required for payment verification
            </p>
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
              Submit Application
            </button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
}
