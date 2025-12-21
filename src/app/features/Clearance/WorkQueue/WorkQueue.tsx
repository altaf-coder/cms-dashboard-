"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MoreVertical } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";

type ClearanceStatus =
  | "Declaration Pending"
  | "In Progress"
  | "Cleared"
  | "Ready for Pickup";

type Priority = "High" | "Medium" | "Low";

interface ClearanceRow {
  shipmentId: string;
  containerNo: string;
  arrivalDate: string;
  docsReceivedDate: string;
  inspectionRequired: "Yes" | "No";
  status: ClearanceStatus;
  priority: Priority;
}

const INITIAL_ROWS: ClearanceRow[] = [
  {
    shipmentId: "SHP-001",
    containerNo: "CONT-7781",
    arrivalDate: "2024-09-12",
    docsReceivedDate: "2024-09-14",
    inspectionRequired: "No",
    status: "Declaration Pending",
    priority: "High",
  },
  {
    shipmentId: "SHP-002",
    containerNo: "CONT-8823",
    arrivalDate: "2024-09-15",
    docsReceivedDate: "2024-09-16",
    inspectionRequired: "Yes",
    status: "In Progress",
    priority: "Medium",
  },
  {
    shipmentId: "SHP-003",
    containerNo: "CONT-9904",
    arrivalDate: "2024-09-10",
    docsReceivedDate: "2024-09-11",
    inspectionRequired: "No",
    status: "Cleared",
    priority: "Low",
  },
  {
    shipmentId: "SHP-004",
    containerNo: "CONT-1145",
    arrivalDate: "2024-09-18",
    docsReceivedDate: "2024-09-19",
    inspectionRequired: "Yes",
    status: "Declaration Pending",
    priority: "High",
  },
  {
    shipmentId: "SHP-005",
    containerNo: "CONT-3367",
    arrivalDate: "2024-09-20",
    docsReceivedDate: "2024-09-21",
    inspectionRequired: "No",
    status: "In Progress",
    priority: "Medium",
  },
  {
    shipmentId: "SHP-006",
    containerNo: "CONT-5589",
    arrivalDate: "2024-09-08",
    docsReceivedDate: "2024-09-09",
    inspectionRequired: "No",
    status: "Ready for Pickup",
    priority: "Low",
  },
  {
    shipmentId: "SHP-007",
    containerNo: "CONT-7712",
    arrivalDate: "2024-09-22",
    docsReceivedDate: "2024-09-23",
    inspectionRequired: "Yes",
    status: "In Progress",
    priority: "High",
  },
  {
    shipmentId: "SHP-008",
    containerNo: "CONT-6644",
    arrivalDate: "2024-09-05",
    docsReceivedDate: "2024-09-06",
    inspectionRequired: "No",
    status: "Cleared",
    priority: "Medium",
  },
  {
    shipmentId: "SHP-009",
    containerNo: "CONT-2298",
    arrivalDate: "2024-09-25",
    docsReceivedDate: "2024-09-26",
    inspectionRequired: "Yes",
    status: "Declaration Pending",
    priority: "High",
  },
  {
    shipmentId: "SHP-010",
    containerNo: "CONT-8831",
    arrivalDate: "2024-09-03",
    docsReceivedDate: "2024-09-04",
    inspectionRequired: "No",
    status: "Ready for Pickup",
    priority: "Low",
  },
];

const getPriorityBadge = (priority: Priority) => {
  if (priority === "High") return "bg-red-100 text-red-700 border-red-200";
  if (priority === "Medium")
    return "bg-yellow-100 text-yellow-700 border-yellow-200";
  return "bg-green-100 text-green-700 border-green-200";
};

const getStatusBadge = (status: ClearanceStatus) => {
  switch (status) {
    case "Cleared":
      return "bg-green-100 text-green-700 border-green-200";
    case "Ready for Pickup":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "In Progress":
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

export default function ClearanceWorkQueuePage() {
  const [rows, setRows] = useState<ClearanceRow[]>(INITIAL_ROWS);

  const handleAction = (
    shipmentId: string,
    action: "submit" | "cleared" | "ready"
  ) => {
    setRows((prev) =>
      prev.map((row) => {
        if (row.shipmentId !== shipmentId) return row;

        if (action === "submit") return { ...row, status: "In Progress" };

        if (action === "cleared") return { ...row, status: "Cleared" };

        if (action === "ready") return { ...row, status: "Ready for Pickup" };

        return row;
      })
    );
  };

  return (
    <div className="mx-auto max-w-7xl">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-3xl font-bold text-[#434343]">
          Clearance Work Queue
        </h1>
        <p className="text-gray-600">Priority based clearance listing</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
      >
        <Table>
          <TableHeader>
            <TableRow className="bg-[#ecf3ff] hover:bg-[#ecf3ff]">
              <TableHead>Shipment ID</TableHead>
              <TableHead>Container No</TableHead>
              <TableHead>Arrival Date</TableHead>
              <TableHead>Docs Received</TableHead>
              <TableHead>Inspection</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            <AnimatePresence>
              {rows.map((row, index) => (
                <motion.tr
                  key={row.shipmentId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b hover:bg-[#ecf3ff]/50"
                >
                  <TableCell className="font-medium">
                    {row.shipmentId}
                  </TableCell>
                  <TableCell>{row.containerNo}</TableCell>
                  <TableCell>{row.arrivalDate}</TableCell>
                  <TableCell>{row.docsReceivedDate}</TableCell>
                  <TableCell>{row.inspectionRequired}</TableCell>

                  <TableCell>
                    <Badge className={`${getStatusBadge(row.status)} border`}>
                      {row.status}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <Badge
                      className={`${getPriorityBadge(row.priority)} border`}
                    >
                      {row.priority}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-lg hover:bg-[#ecf3ff]"
                        >
                          <MoreVertical className="h-4 w-4 text-[#434343]" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent
                        align="end"
                        className="w-56 bg-white border border-gray-200 shadow-lg rounded-xl"
                      >
                        <DropdownMenuItem
                          onClick={() => handleAction(row.shipmentId, "submit")}
                          className="cursor-pointer hover:bg-[#ecf3ff]"
                        >
                          Submit Declaration
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() =>
                            handleAction(row.shipmentId, "cleared")
                          }
                          className="cursor-pointer text-green-700 hover:bg-green-50"
                        >
                          Mark Cleared
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => handleAction(row.shipmentId, "ready")}
                          className="cursor-pointer text-blue-700 hover:bg-blue-50"
                        >
                          Mark Ready for Pickup
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </motion.tr>
              ))}
            </AnimatePresence>
          </TableBody>
        </Table>
      </motion.div>
    </div>
  );
}
