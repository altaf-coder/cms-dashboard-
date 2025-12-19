export interface AuditLog {
    id: string
    timestamp: string
    user: {
      name: string
      email: string
      avatar?: string
    }
    module: string
    action: string
    description: string
    ipAddress: string
    status: "success" | "warning" | "error"
  }
  
  export const mockAuditLogs: AuditLog[] = [
    {
      id: "1",
      timestamp: "2024-01-15T10:30:00Z",
      user: { name: "John Doe", email: "john@example.com" },
      module: "Users",
      action: "Create",
      description: "Created new user account for sarah@example.com",
      ipAddress: "192.168.1.100",
      status: "success",
    },
    {
      id: "2",
      timestamp: "2024-01-15T09:45:00Z",
      user: { name: "Jane Smith", email: "jane@example.com" },
      module: "Settings",
      action: "Update",
      description: "Updated system configuration for authentication",
      ipAddress: "192.168.1.101",
      status: "success",
    },
    {
      id: "3",
      timestamp: "2024-01-15T09:15:00Z",
      user: { name: "Mike Johnson", email: "mike@example.com" },
      module: "Products",
      action: "Delete",
      description: "Deleted product SKU-12345 from inventory",
      ipAddress: "192.168.1.102",
      status: "warning",
    },
    {
      id: "4",
      timestamp: "2024-01-15T08:30:00Z",
      user: { name: "Sarah Wilson", email: "sarah@example.com" },
      module: "Orders",
      action: "Update",
      description: "Modified order #ORD-2024-001 status to shipped",
      ipAddress: "192.168.1.103",
      status: "success",
    },
    {
      id: "5",
      timestamp: "2024-01-14T16:20:00Z",
      user: { name: "Admin User", email: "admin@example.com" },
      module: "Security",
      action: "Login",
      description: "Failed login attempt detected from unknown device",
      ipAddress: "203.45.67.89",
      status: "error",
    },
    {
      id: "6",
      timestamp: "2024-01-14T15:45:00Z",
      user: { name: "Emily Brown", email: "emily@example.com" },
      module: "Reports",
      action: "Export",
      description: "Exported monthly sales report for December 2023",
      ipAddress: "192.168.1.104",
      status: "success",
    },
    {
      id: "7",
      timestamp: "2024-01-14T14:30:00Z",
      user: { name: "David Lee", email: "david@example.com" },
      module: "Users",
      action: "Update",
      description: "Changed role permissions for marketing team",
      ipAddress: "192.168.1.105",
      status: "success",
    },
    {
      id: "8",
      timestamp: "2024-01-14T13:15:00Z",
      user: { name: "Lisa Chen", email: "lisa@example.com" },
      module: "Billing",
      action: "Create",
      description: "Generated invoice #INV-2024-0156 for client",
      ipAddress: "192.168.1.106",
      status: "success",
    },
    {
      id: "9",
      timestamp: "2024-01-14T11:00:00Z",
      user: { name: "Tom Anderson", email: "tom@example.com" },
      module: "API",
      action: "Access",
      description: "Rate limit exceeded for endpoint /api/v1/data",
      ipAddress: "192.168.1.107",
      status: "warning",
    },
    {
      id: "10",
      timestamp: "2024-01-14T10:30:00Z",
      user: { name: "Anna Martinez", email: "anna@example.com" },
      module: "Database",
      action: "Backup",
      description: "Completed automated database backup successfully",
      ipAddress: "192.168.1.108",
      status: "success",
    },
  ]
  
  export const modules = ["Users", "Settings", "Products", "Orders", "Security", "Reports", "Billing", "API", "Database"]
  export const actions = ["Create", "Update", "Delete", "Login", "Export", "Access", "Backup"]
  export const users = [
    "John Doe",
    "Jane Smith",
    "Mike Johnson",
    "Sarah Wilson",
    "Admin User",
    "Emily Brown",
    "David Lee",
    "Lisa Chen",
    "Tom Anderson",
    "Anna Martinez",
  ]
  