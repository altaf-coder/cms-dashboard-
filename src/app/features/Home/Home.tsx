import {
  AlertTriangle,
  Clock,
  CreditCard,
  FileDown,
  Package,
  RotateCcw,
} from "lucide-react";
import PageMeta from "../Dashboard/PageMeta";
import EcommerceMetrics from "../Dashboard/EcommerceMetrics";
import MonthlySalesChart from "../Dashboard/MonthlySalesChart";
import MonthlyTarget from "../Dashboard/MonthlyTarget";
import StatisticsChart from "../Dashboard/StatisticsChart";
import DemographicCard from "../Dashboard/DemographicCard";
import DashboardHeader from "../Dashboard/Admin/Header/header";
import RevenueCostChart from "../Dashboard/Admin/RevenueCostChart/revenueCostChart";
import DashboardMainStats from "../Dashboard/Admin/Widgets/widgets";

const stats = [
  {
    title: "Total Active Shipments",
    value: "128",
    icon: Package,
    note: "↑ 12% from last month",
    trend: "up",
    color: "bg-blue-500",
    filterKey: "activeShipments",
  },
  {
    title: "Near Demurrage (3 days)",
    value: "7",
    icon: AlertTriangle,
    note: "↓ 2 from last week",
    trend: "down",
    color: "bg-amber-500",
    filterKey: "nearDemurrage",
  },
  {
    title: "In Demurrage",
    value: "3",
    icon: Clock,
    note: "Extra charges running",
    trend: "neutral",
    color: "bg-red-500",
    filterKey: "inDemurrage",
  },
  {
    title: "Pending Clearance",
    value: "12",
    icon: FileDown,
    note: "Inspection / Docs",
    trend: "neutral",
    color: "bg-purple-500",
    filterKey: "pendingClearance",
  },
  {
    title: "Pending Payments",
    value: "$15,820",
    icon: CreditCard,
    note: "↑ 8% from last month",
    trend: "up",
    color: "bg-green-500",
    filterKey: "pendingPayments",
  },
  {
    title: "Overdue Empty Returns",
    value: "4",
    icon: RotateCcw,
    note: "↓ 1 from last week",
    trend: "down",
    color: "bg-indigo-500",
    filterKey: "overdueEmptyReturns",
  },
];

export default function Home() {
  return (
    <>
      <PageMeta
        title="T CMS"
        description="Transportation & container management system"
      />

      <div className="space-y-8 py-6">
        <DashboardHeader />
        <DashboardMainStats stats={stats} />
        <RevenueCostChart />
      </div>

      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-7">
          <EcommerceMetrics />

          <MonthlySalesChart />
        </div>

        <div className="col-span-12 xl:col-span-5">
          <MonthlyTarget />
        </div>

        <div className="col-span-12">
          <StatisticsChart />
        </div>

        <div className="col-span-12 xl:col-span-5">
          <DemographicCard />
        </div>
      </div>
    </>
  );
}
