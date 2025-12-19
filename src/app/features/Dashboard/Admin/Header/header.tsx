"use client";

import { Button } from "../../../../components/ui/button";
import { Download } from "lucide-react";

export default function DashboardHeader() {
  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Admin Dashboard
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Operational & financial overview
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search shipments, containers..."
              className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
            />
            <svg
              className="absolute left-3 top-3 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="border-gray-300 hover:bg-gray-50"
            >
              <Download className="w-4 h-4 mr-2" /> PDF
            </Button>
            <Button className="bg-gradient-to-r from-[#104e90] to-[#519fcc] hover:from-[#0c3469] hover:to-[#104e90]">
              <Download className="w-4 h-4 mr-2" /> Export Excel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
