import { 
  FileText, 
  Package, 
  ClipboardList, 
  BadgeCheck, 
  Search, 
  Briefcase, 
  FileSpreadsheet, 
  Folder 
} from "lucide-react";

export interface PermissionRow {
  module: string;
  icon: React.ReactNode;
  Admin: string;
  ClearanceAgent: string;
  Vendor: string;
  Driver: string;
  Customer: string;
  Finance: string;
}

export const PERMISSIONS_MATRIX: PermissionRow[] = [
  {
    module: "Entities",
    icon: <FileText className="h-5 w-5" />,
    Admin: "CRUD",
    ClearanceAgent: "read",
    Vendor: "read own",
    Driver: "read own",
    Customer: "read own",
    Finance: "read",
  },
  {
    module: "Shipments",
    icon: <Package className="h-5 w-5" />,
    Admin: "CRUD",
    ClearanceAgent: "CRUD",
    Vendor: "read assigned",
    Driver: "read assigned",
    Customer: "read own",
    Finance: "read",
  },
  {
    module: "DO",
    icon: <ClipboardList className="h-5 w-5" />,
    Admin: "CRUD",
    ClearanceAgent: "CRUD",
    Vendor: "none",
    Driver: "none",
    Customer: "none",
    Finance: "read",
  },
  {
    module: "Declaration",
    icon: <BadgeCheck className="h-5 w-5" />,
    Admin: "CRUD",
    ClearanceAgent: "CRUD",
    Vendor: "none",
    Driver: "none",
    Customer: "none",
    Finance: "read",
  },
  {
    module: "Inspection",
    icon: <Search className="h-5 w-5" />,
    Admin: "CRUD",
    ClearanceAgent: "CRUD",
    Vendor: "none",
    Driver: "update status",
    Customer: "none",
    Finance: "read",
  },
  {
    module: "Jobs",
    icon: <Briefcase className="h-5 w-5" />,
    Admin: "CRUD",
    ClearanceAgent: "CRUD",
    Vendor: "CRUD",
    Driver: "update status",
    Customer: "none",
    Finance: "read",
  },
  {
    module: "Financials",
    icon: <FileSpreadsheet className="h-5 w-5" />,
    Admin: "CRUD + override",
    ClearanceAgent: "update",
    Vendor: "read own",
    Driver: "none",
    Customer: "read own",
    Finance: "CRUD",
  },
  {
    module: "Documents",
    icon: <Folder className="h-5 w-5" />,
    Admin: "approve",
    ClearanceAgent: "approve",
    Vendor: "upload vendor docs",
    Driver: "upload POD",
    Customer: "upload customer docs",
    Finance: "view",
  },
];

export const ROLES = [
  "Admin",
  "ClearanceAgent",
  "Vendor",
  "Driver",
  "Customer",
  "Finance",
] as const;