"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import { ArrowUp, ArrowDown, MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function DashboardMainStats({ stats }: any) {
  const navigate = useNavigate();

  const handleWidgetClick = (filterKey: string) => {
    navigate(`/shipments?filter=${filterKey}`);
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
      {stats.map((item: any, index: number) => (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ y: -5 }}
        >
          <Card
            className="group cursor-pointer border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 overflow-hidden"
            onClick={() => handleWidgetClick(item.filterKey)}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div className="flex items-center gap-3">
                <div className={`${item.color} p-2 rounded-lg`}>
                  <item.icon className="w-5 h-5 text-white" />
                </div>
                <CardTitle className="text-sm font-medium text-gray-700">
                  {item.title}
                </CardTitle>
              </div>
              <button className="p-1 hover:bg-gray-100 rounded-lg">
                <MoreVertical className="w-5 h-5 text-gray-400" />
              </button>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <div className="text-3xl font-bold text-gray-900">
                  {item.value}
                </div>
                <div className="flex items-center">
                  {item.trend === "up" && (
                    <ArrowUp className="w-4 h-4 text-green-500" />
                  )}
                  {item.trend === "down" && (
                    <ArrowDown className="w-4 h-4 text-red-500" />
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-gray-500">{item.note}</p>
                <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                  Details →
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
