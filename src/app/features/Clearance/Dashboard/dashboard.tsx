"use client";

import { motion } from "framer-motion";
import {
  Package,
  FileText,
  ClipboardList,
  Search,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

const stats = [
  {
    title: "Assigned Containers",
    value: 24,
    icon: Package,
    color: "text-[#104e90]",
    bg: "bg-[#ecf3ff]",
    border: "border-[#519fcc]",
    description: "Containers assigned for clearance",
  },
  {
    title: "Pending DO Applications",
    value: 7,
    icon: FileText,
    color: "text-[#0c3469]",
    bg: "bg-[#ecf3ff]",
    border: "border-[#519fcc]",
    description: "Awaiting delivery order application",
  },
  {
    title: "Pending Declaration",
    value: 5,
    icon: ClipboardList,
    color: "text-[#104e90]",
    bg: "bg-[#ecf3ff]",
    border: "border-[#519fcc]",
    description: "Customs declaration pending",
  },
  {
    title: "Inspection Required",
    value: 3,
    icon: Search,
    color: "text-[#0c3469]",
    bg: "bg-[#ecf3ff]",
    border: "border-[#519fcc]",
    description: "Requires physical inspection",
  },
  {
    title: "Ready for Pickup (Released)",
    value: 9,
    icon: CheckCircle,
    color: "text-[#104e90]",
    bg: "bg-[#ecf3ff]",
    border: "border-[#519fcc]",
    description: "Available for customer pickup",
  },
  {
    title: "Clearance Delayed (Alert)",
    value: 2,
    icon: AlertTriangle,
    color: "text-[#dc2626]",
    bg: "bg-[#fef2f2]",
    border: "border-[#fed7d7]",
    description: "Delayed containers",
    alert: true,
  },
];

export default function ClearanceDashboard() {
  return (
    <div className="space-y-8 p-2">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-[#434343]">
              Clearance Dashboard
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Overview of clearance activities & container status
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className={`rounded-xl border ${item.border} ${item.bg} p-5 shadow-sm hover:shadow-lg transition-all duration-300`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-lg ${item.bg} border ${item.border}`}
                  >
                    <Icon className={`h-6 w-6 ${item.color}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#434343]">
                      {item.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-end justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-[#434343]">
                    {item.value}
                  </h2>
                  {item.alert ? (
                    <div className="flex items-center gap-1.5 mt-2">
                      <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></div>
                      <span className="text-xs font-semibold text-red-600">
                        Requires attention
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 mt-2">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      <span className="text-xs font-medium text-gray-600">
                        Active
                      </span>
                    </div>
                  )}
                </div>

                <button className="text-xs font-medium text-[#0c3469] hover:text-[#104e90] px-3 py-1.5 rounded-lg bg-white border border-[#519fcc] hover:bg-[#ecf3ff] transition-colors">
                  View Details
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
