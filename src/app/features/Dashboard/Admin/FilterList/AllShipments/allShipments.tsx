"use client";

import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Package,
  AlertTriangle,
  Clock,
  CreditCard,
  FileDown,
  RotateCcw,
  X,
  Download,
  MoreVertical,
  Truck,
  MapPin,
  Calendar,
  DollarSign,
  Eye,
  ChevronRight,
} from "lucide-react";
import { Button } from "../../../../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../../components/ui/card";

const COLORS = {
  text: "#434343",
  bgLight: "#ecf3ff",
  primary: "#104e90",
  secondary: "#519fcc",
};

const filterTitles: Record<
  string,
  { title: string; color: string; icon: any }
> = {
  activeShipments: {
    title: "Active Shipments",
    color: COLORS.primary,
    icon: Package,
  },
  nearDemurrage: {
    title: "Near Demurrage",
    color: "#f59e0b",
    icon: AlertTriangle,
  },
  inDemurrage: {
    title: "In Demurrage",
    color: "#ef4444",
    icon: Clock,
  },
  pendingClearance: {
    title: "Pending Clearance",
    color: "#8b5cf6",
    icon: FileDown,
  },
  pendingPayments: {
    title: "Pending Payments",
    color: "#10b981",
    icon: CreditCard,
  },
  overdueEmptyReturns: {
    title: "Overdue Returns",
    color: "#7c3aed",
    icon: RotateCcw,
  },
};

type ShipmentStatus =
  | "in_transit"
  | "payment_pending"
  | "warning"
  | "delayed"
  | "customs_hold"
  | "overdue";
type Priority = "critical" | "urgent" | "high" | "medium" | "low";
type ShipmentType = keyof typeof filterTitles;

interface Shipment {
  id: number;
  type: ShipmentType;
  shipmentId: string;
  name: string;
  route: string;
  status: ShipmentStatus;
  progress: number;
  eta: string;
  value: string;
  priority: Priority;
  amountDue?: string;
  demurrageDays?: number;
  charges?: string;
  overdueDays?: number;
}

const statusConfig: Record<
  ShipmentStatus,
  { label: string; color: string; bg: string }
> = {
  in_transit: { label: "In Transit", color: COLORS.secondary, bg: "#dbeafe" },
  payment_pending: { label: "Payment Due", color: "#f59e0b", bg: "#fef3c7" },
  warning: { label: "Near Demurrage", color: "#f59e0b", bg: "#fef3c7" },
  delayed: { label: "In Demurrage", color: "#ef4444", bg: "#fee2e2" },
  customs_hold: { label: "Customs Hold", color: "#8b5cf6", bg: "#ede9fe" },
  overdue: { label: "Overdue", color: "#7c3aed", bg: "#ede9fe" },
};

const allShipments: Shipment[] = [
  {
    id: 1,
    type: "activeShipments",
    shipmentId: "SH-2024-001",
    name: "Medical Equipment",
    route: "Karachi → Dubai",
    status: "in_transit",
    progress: 65,
    eta: "Mar 15",
    value: "$45,800",
    priority: "high",
  },
  {
    id: 2,
    type: "pendingPayments",
    shipmentId: "SH-2024-002",
    name: "Electronics",
    route: "Shanghai → Singapore",
    status: "payment_pending",
    progress: 100,
    eta: "Mar 10",
    value: "$28,500",
    priority: "medium",
    amountDue: "$15,820",
  },
  {
    id: 3,
    type: "activeShipments",
    shipmentId: "SH-2024-003",
    name: "Textiles",
    route: "Mumbai → LA",
    status: "in_transit",
    progress: 40,
    eta: "Mar 25",
    value: "$62,300",
    priority: "medium",
  },
  {
    id: 4,
    type: "nearDemurrage",
    shipmentId: "SH-2024-004",
    name: "Auto Parts",
    route: "Istanbul → Jeddah",
    status: "warning",
    progress: 100,
    eta: "Mar 05",
    value: "$34,200",
    priority: "urgent",
    demurrageDays: 2,
  },
  {
    id: 5,
    type: "inDemurrage",
    shipmentId: "SH-2024-005",
    name: "Machinery",
    route: "Tokyo → Hamburg",
    status: "delayed",
    progress: 100,
    eta: "Feb 28",
    value: "$89,500",
    priority: "critical",
    charges: "$1,250",
  },
  {
    id: 6,
    type: "pendingClearance",
    shipmentId: "SH-2024-006",
    name: "Pharmaceuticals",
    route: "Basel → London",
    status: "customs_hold",
    progress: 85,
    eta: "Mar 08",
    value: "$125,000",
    priority: "high",
  },
  {
    id: 7,
    type: "overdueEmptyReturns",
    shipmentId: "SH-2024-007",
    name: "Container Return",
    route: "Rotterdam → Antwerp",
    status: "overdue",
    progress: 100,
    eta: "Feb 20",
    value: "-",
    priority: "medium",
    overdueDays: 8,
  },
  {
    id: 8,
    type: "pendingPayments",
    shipmentId: "SH-2024-008",
    name: "Consumer Goods",
    route: "Shenzhen → Sydney",
    status: "payment_pending",
    progress: 100,
    eta: "Mar 01",
    value: "$56,700",
    priority: "low",
    amountDue: "$28,350",
  },
];

export default function Shipments() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const filterKey = searchParams.get("filter") as ShipmentType | null;

  const filteredShipments = filterKey
    ? allShipments.filter((s) => s.type === filterKey)
    : allShipments;

  const filterInfo = filterKey ? filterTitles[filterKey] : null;

  const clearFilter = () => {
    navigate("/shipments");
  };

  const getPriorityColor = (priority: Priority) => {
    const colors: Record<Priority, string> = {
      critical: "text-red-600",
      urgent: "text-orange-600",
      high: "text-amber-600",
      medium: "text-blue-600",
      low: "text-gray-600",
    };
    return colors[priority];
  };

  const getStatusConfig = (status: ShipmentStatus) => {
    return statusConfig[status] || statusConfig.in_transit;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                <span
                  className="hover:text-[#104e90] cursor-pointer transition-colors"
                  onClick={() => navigate("/")}
                >
                  Dashboard
                </span>
                <ChevronRight className="w-4 h-4" />
                <span className="text-[#434343] font-medium">Shipments</span>
                {filterInfo && (
                  <>
                    <ChevronRight className="w-4 h-4" />
                    <span
                      className="font-medium"
                      style={{ color: filterInfo.color }}
                    >
                      {filterInfo.title}
                    </span>
                  </>
                )}
              </div>

              <div className="flex items-center gap-3">
                <h1
                  className="text-2xl font-bold"
                  style={{ color: COLORS.text }}
                >
                  {filterInfo ? filterInfo.title : "All Shipments"}
                </h1>
                <span
                  className="px-3 py-1 text-sm font-medium rounded-full"
                  style={{
                    backgroundColor: `${COLORS.primary}15`,
                    color: COLORS.primary,
                  }}
                >
                  {filteredShipments.length} shipments
                </span>
              </div>

              <p className="text-gray-500 mt-1 text-sm">
                {filterInfo
                  ? `Viewing ${filteredShipments.length} shipments`
                  : "All shipments in one place"}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {filterKey && (
                <Button
                  variant="outline"
                  onClick={clearFilter}
                  className="border-gray-200 hover:bg-gray-50 text-sm h-9"
                >
                  <X className="w-4 h-4 mr-1" />
                  Clear
                </Button>
              )}
              <Button
                className="text-sm h-9"
                style={{
                  background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`,
                }}
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        {!filterKey && (
          <div className="mb-8">
            <h2
              className="text-lg font-semibold mb-4"
              style={{ color: COLORS.text }}
            >
              Quick Stats
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(filterTitles).map(([key, info]) => {
                const count = allShipments.filter((s) => s.type === key).length;
                const Icon = info.icon;
                return (
                  <div
                    key={key}
                    className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => navigate(`/shipments?filter=${key}`)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">{info.title}</p>
                        <p className="text-2xl font-bold mt-1">{count}</p>
                      </div>
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${info.color}15` }}
                      >
                        <Icon
                          className="w-5 h-5"
                          style={{ color: info.color }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2
              className="text-lg font-semibold"
              style={{ color: COLORS.text }}
            >
              Shipment List
            </h2>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                On Track
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                Warning
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                Critical
              </span>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredShipments.length > 0 ? (
              filteredShipments.map((shipment, index) => {
                const statusInfo = getStatusConfig(shipment.status);

                return (
                  <motion.div
                    key={shipment.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="h-full"
                  >
                    <Card className="border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200 h-full flex flex-col">
                      <CardHeader className="pb-3 flex-shrink-0">
                        {" "}
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <span
                                className="px-2 py-1 rounded text-xs font-medium flex-shrink-0"
                                style={{
                                  backgroundColor: statusInfo.bg,
                                  color: statusInfo.color,
                                }}
                              >
                                {statusInfo.label}
                              </span>
                              <span
                                className={`text-xs font-medium ${getPriorityColor(
                                  shipment.priority
                                )} flex-shrink-0`}
                              >
                                {shipment.priority}
                              </span>
                            </div>
                            <CardTitle
                              className="text-base font-bold truncate"
                              style={{ color: COLORS.text }}
                            >
                              {shipment.name}
                            </CardTitle>
                            <p className="text-sm text-gray-500 truncate mt-1">
                              {shipment.shipmentId}
                            </p>
                          </div>
                          <button className="p-1 hover:bg-gray-100 rounded flex-shrink-0">
                            <MoreVertical className="w-5 h-5 text-gray-400" />
                          </button>
                        </div>
                      </CardHeader>

                      <CardContent className="flex-1 flex flex-col">
                        <div className="mb-4 flex-shrink-0">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <MapPin
                                className="w-4 h-4 flex-shrink-0"
                                style={{ color: COLORS.primary }}
                              />
                              <span
                                className="text-sm font-medium"
                                style={{ color: COLORS.text }}
                              >
                                Route
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-gray-500 flex-shrink-0">
                              <Calendar className="w-3 h-3" />
                              <span>ETA: {shipment.eta}</span>
                            </div>
                          </div>
                          <p className="text-sm font-medium mb-2 truncate">
                            {shipment.route}
                          </p>
                          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${shipment.progress}%`,
                                background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.secondary})`,
                              }}
                            />
                          </div>
                          <div className="text-xs text-gray-500 text-right mt-1">
                            {shipment.progress}% complete
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-4 flex-shrink-0">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1">
                              <DollarSign className="w-3 h-3 text-gray-400 flex-shrink-0" />
                              <span className="text-xs text-gray-500">
                                Value
                              </span>
                            </div>
                            <p
                              className="text-sm font-bold truncate"
                              style={{ color: COLORS.text }}
                            >
                              {shipment.value}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-1">
                              <Truck className="w-3 h-3 text-gray-400 flex-shrink-0" />
                              <span className="text-xs text-gray-500">
                                Status
                              </span>
                            </div>
                            <p
                              className="text-sm font-medium truncate"
                              style={{ color: statusInfo.color }}
                            >
                              {shipment.progress < 100
                                ? "In Transit"
                                : "Arrived"}
                            </p>
                          </div>
                        </div>

                        <div
                          className={`mb-3 ${
                            (shipment.type === "pendingPayments" &&
                              shipment.amountDue) ||
                            shipment.type === "nearDemurrage" ||
                            shipment.type === "inDemurrage"
                              ? "min-h-[56px]"
                              : "min-h-0"
                          }`}
                        >
                          {shipment.type === "pendingPayments" &&
                            shipment.amountDue && (
                              <div
                                className="p-2 rounded text-sm w-full"
                                style={{
                                  backgroundColor: "#fef3c7",
                                  color: "#92400e",
                                }}
                              >
                                <div className="flex items-center justify-between w-full">
                                  <span className="font-medium truncate">
                                    Due: {shipment.amountDue}
                                  </span>
                                  <Button
                                    size="sm"
                                    className="h-6 text-xs px-2 flex-shrink-0"
                                  >
                                    Pay
                                  </Button>
                                </div>
                              </div>
                            )}

                          {(shipment.type === "nearDemurrage" ||
                            shipment.type === "inDemurrage") && (
                            <div
                              className="p-2 rounded text-sm w-full"
                              style={{
                                backgroundColor:
                                  shipment.type === "inDemurrage"
                                    ? "#fee2e2"
                                    : "#fef3c7",
                                color:
                                  shipment.type === "inDemurrage"
                                    ? "#991b1b"
                                    : "#92400e",
                              }}
                            >
                              <div className="flex items-center justify-between w-full">
                                <span className="font-medium truncate">
                                  {shipment.type === "inDemurrage"
                                    ? `Charges: ${shipment.charges}`
                                    : `${shipment.demurrageDays} days left`}
                                </span>
                                <Button
                                  size="sm"
                                  className="h-6 text-xs px-2 flex-shrink-0"
                                  style={{
                                    backgroundColor:
                                      shipment.type === "inDemurrage"
                                        ? "#ef4444"
                                        : "#f59e0b",
                                    color: "white",
                                  }}
                                >
                                  Action
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="mt-auto pt-3 border-t border-gray-100 flex-shrink-0">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full border-gray-200 hover:bg-gray-50 text-sm"
                            style={{ color: COLORS.primary }}
                          >
                            <Eye className="w-4 h-4 mr-2 flex-shrink-0" />
                            View Details
                            <ChevronRight className="w-4 h-4 ml-auto flex-shrink-0" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })
            ) : (
              <div className="col-span-full">
                <div className="bg-white rounded-xl p-8 text-center border border-dashed border-gray-300">
                  <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    No shipments found
                  </h3>
                  <p className="text-gray-500 mb-4">
                    {filterKey && filterTitles[filterKey]
                      ? `No shipments match "${filterTitles[filterKey].title}"`
                      : "No shipments available"}
                  </p>
                  {filterKey && (
                    <Button
                      onClick={clearFilter}
                      className="text-sm"
                      style={{
                        background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`,
                      }}
                    >
                      View All Shipments
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>{" "}
        </div>

        {/* Pagination */}
        {filteredShipments.length > 0 && (
          <div className="flex md:flex-row flex-col items-center md:justify-between py-4 border-t border-gray-200 gap-4 md:gap-0">
            <div className="text-sm text-gray-500">
              Showing {Math.min(filteredShipments.length, 8)} of{" "}
              {filteredShipments.length} shipments
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="border-gray-200">
                Previous
              </Button>
              <Button
                size="sm"
                className="px-3"
                style={{
                  backgroundColor: COLORS.primary,
                  color: "white",
                }}
              >
                1
              </Button>
              <Button variant="outline" size="sm" className="border-gray-200">
                2
              </Button>
              <Button variant="outline" size="sm" className="border-gray-200">
                3
              </Button>
              <Button variant="outline" size="sm" className="border-gray-200">
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
