"use client";

import {
  DollarSign,
  ArrowUp,
  ArrowDown,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function RevenueCostChart() {
  const revenueData = [
    { month: "Jan", revenue: 4200, cost: 2400 },
    { month: "Feb", revenue: 3800, cost: 1398 },
    { month: "Mar", revenue: 5200, cost: 9800 },
    { month: "Apr", revenue: 5780, cost: 3908 },
    { month: "May", revenue: 4890, cost: 4800 },
    { month: "Jun", revenue: 6390, cost: 3800 },
    { month: "Jul", revenue: 7490, cost: 4300 },
    { month: "Aug", revenue: 8200, cost: 5200 },
    { month: "Sep", revenue: 7800, cost: 4900 },
    { month: "Oct", revenue: 9100, cost: 6100 },
    { month: "Nov", revenue: 9500, cost: 6500 },
    { month: "Dec", revenue: 11200, cost: 7200 },
  ];
  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Revenue vs Cost Analytics
          </CardTitle>
          <div className="flex gap-2">
            <button className="px-3 py-1 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100">
              Monthly
            </button>
            <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
              Quarterly
            </button>
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Track revenue and operational costs over time
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={revenueData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#104e90" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#104e90" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#666" fontSize={12} />
              <YAxis
                stroke="#666"
                fontSize={12}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip
                formatter={(value) => [`$${value}`, ""]}
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb",
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#104e90"
                strokeWidth={2}
                fill="url(#colorRevenue)"
                name="Revenue"
              />
              <Area
                type="monotone"
                dataKey="cost"
                stroke="#EF4444"
                strokeWidth={2}
                fill="url(#colorCost)"
                name="Operating Cost"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-blue-50 p-4 rounded-xl">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Revenue</span>
              <DollarSign className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-2">$89,420</p>
            <div className="flex items-center gap-1 mt-1">
              <ArrowUp className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-500">+15.2%</span>
            </div>
          </div>
          <div className="bg-red-50 p-4 rounded-xl">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Cost</span>
              <AlertTriangle className="w-4 h-4 text-red-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-2">$45,890</p>
            <div className="flex items-center gap-1 mt-1">
              <ArrowDown className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-500">-3.8%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
