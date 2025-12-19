"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, Pencil, Trash2, Users } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Button } from "../../../components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { Badge } from "../../../components/ui/badge";
import { Input } from "../../../components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Label } from "../../../components/ui/label";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

type UserStatus = "Active" | "Inactive";
type UserRole = "Admin" | "Manager" | "Staff";
type UserBranch = "Lahore" | "Karachi" | "Islamabad";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  branch: UserBranch;
  status: UserStatus;
}

const initialUsers: User[] = [
  {
    id: "1",
    name: "Ahmed Khan",
    email: "ahmed.khan@company.com",
    phone: "+923001234567",
    role: "Admin",
    branch: "Lahore",
    status: "Active",
  },
  {
    id: "2",
    name: "Fatima Ali",
    email: "fatima.ali@company.com",
    phone: "+923001234568",
    role: "Manager",
    branch: "Karachi",
    status: "Active",
  },
  {
    id: "3",
    name: "Hassan Raza",
    email: "hassan.raza@company.com",
    phone: "+923001234569",
    role: "Staff",
    branch: "Islamabad",
    status: "Active",
  },
  {
    id: "4",
    name: "Ayesha Malik",
    email: "ayesha.malik@company.com",
    phone: "+923001234570",
    role: "Manager",
    branch: "Lahore",
    status: "Inactive",
  },
  {
    id: "5",
    name: "Usman Sheikh",
    email: "usman.sheikh@company.com",
    phone: "+923001234571",
    role: "Staff",
    branch: "Karachi",
    status: "Active",
  },
  {
    id: "6",
    name: "Zainab Hussain",
    email: "zainab.hussain@company.com",
    phone: "+923001234572",
    role: "Admin",
    branch: "Islamabad",
    status: "Active",
  },
];

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [branchFilter, setBranchFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [formData, setFormData] = useState<Omit<User, "id">>({
    name: "",
    email: "",
    phone: "",
    role: "Staff",
    branch: "Lahore",
    status: "Active",
  });

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesBranch =
      branchFilter === "all" || user.branch === branchFilter;
    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesBranch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAddUser = () => {
    const newUser: User = {
      id: Date.now().toString(),
      ...formData,
    };
    setUsers([...users, newUser]);
    setIsAddModalOpen(false);
    resetForm();
  };

  const handleEditUser = () => {
    if (selectedUser) {
      setUsers(
        users.map((user) =>
          user.id === selectedUser.id ? { ...selectedUser, ...formData } : user
        )
      );
      setIsEditModalOpen(false);
      resetForm();
      setSelectedUser(null);
    }
  };

  const handleDeleteUser = () => {
    if (selectedUser) {
      setUsers(users.filter((user) => user.id !== selectedUser.id));
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
    }
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      branch: user.branch,
      status: user.status,
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (user: User) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      role: "Staff",
      branch: "Lahore",
      status: "Active",
    });
  };

  const getStatusBadgeColor = (status: UserStatus) => {
    return status === "Active"
      ? "bg-green-100 text-green-800 border-green-200"
      : "bg-red-100 text-red-800 border-red-200";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-7xl"
      >
        <motion.div
          className="mb-4 sm:mb-6 lg:mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h1 className="text-3xl font-bold text-[#434343] mb-2">
            User Management
          </h1>
          <p className="text-gray-600">
            Manage your team members and their permissions
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6 shadow-sm hover:shadow-md transition-shadow duration-300"
        >
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
            <div className="flex-1 relative w-full lg:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#104e90] focus:border-[#104e90] transition-all duration-300"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full sm:w-[140px] bg-white border border-gray-300 rounded-lg hover:border-[#104e90] transition-colors duration-300">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent className="bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Manager">Manager</SelectItem>
                  <SelectItem value="Staff">Staff</SelectItem>
                </SelectContent>
              </Select>

              <Select value={branchFilter} onValueChange={setBranchFilter}>
                <SelectTrigger className="w-full sm:w-[140px] bg-white border border-gray-300 rounded-lg hover:border-[#104e90] transition-colors duration-300">
                  <SelectValue placeholder="Branch" />
                </SelectTrigger>
                <SelectContent className="bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <SelectItem value="all">All Branches</SelectItem>
                  <SelectItem value="Lahore">Lahore</SelectItem>
                  <SelectItem value="Karachi">Karachi</SelectItem>
                  <SelectItem value="Islamabad">Islamabad</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[140px] bg-white border border-gray-300 rounded-lg hover:border-[#104e90] transition-colors duration-300">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={() => setIsAddModalOpen(true)}
                  className="flex w-full items-center justify-center bg-[#104e90] hover:bg-[#0c3469] text-white rounded-lg shadow-md px-4 py-2 transition-all duration-300"
                >
                  <Plus className="h-4 w-4 mr-2" /> Add User
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
        >
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#ecf3ff] hover:bg-[#ecf3ff]">
                  <TableHead className="text-[#434343] font-semibold">
                    Name
                  </TableHead>
                  <TableHead className="text-[#434343] font-semibold">
                    Email
                  </TableHead>
                  <TableHead className="text-[#434343] font-semibold">
                    Role
                  </TableHead>
                  <TableHead className="text-[#434343] font-semibold">
                    Branch
                  </TableHead>
                  <TableHead className="text-[#434343] font-semibold">
                    Status
                  </TableHead>
                  <TableHead className="text-right text-[#434343] font-semibold">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence mode="wait">
                  {paginatedUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="p-0">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6 }}
                          className="flex flex-col items-center justify-center py-16 px-4 relative overflow-hidden min-h-[400px]"
                        >
                          <motion.div
                            initial={{ scale: 0.5 }}
                            animate={{ scale: 1 }}
                            transition={{
                              type: "spring",
                              stiffness: 200,
                              damping: 15,
                              delay: 0.1,
                            }}
                            className="relative mb-6"
                          >
                            <motion.div
                              animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.5, 0, 0.5],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                repeatType: "loop",
                              }}
                              className="absolute inset-0 rounded-full bg-gradient-to-r from-[#519fcc]/30 to-[#104e90]/30 blur-lg"
                            />

                            <motion.div
                              animate={{
                                rotate: 360,
                              }}
                              transition={{
                                duration: 20,
                                repeat: Infinity,
                                repeatType: "loop",
                                ease: "linear",
                              }}
                              className="absolute -inset-2 rounded-full border-2 border-dashed border-[#519fcc]/20"
                            />

                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              className="relative flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-[#ecf3ff] to-white shadow-lg border border-gray-200"
                            >
                              <div className="relative">
                                <Search className="h-12 w-12 text-[#104e90]" />

                                <motion.div
                                  animate={{
                                    rotate: [0, -10, 10, 0],
                                  }}
                                  transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    repeatType: "loop",
                                  }}
                                  className="absolute -right-1 -top-1"
                                >
                                  <Users className="h-5 w-5 text-[#519fcc]" />
                                </motion.div>
                              </div>

                              {[1, 2, 3].map((i) => (
                                <motion.div
                                  key={i}
                                  initial={{ opacity: 0, y: 0 }}
                                  animate={{
                                    opacity: [0, 1, 0],
                                    y: [-3, 3],
                                    x: Math.random() * 6 - 3,
                                  }}
                                  transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    repeatType: "loop",
                                    delay: i * 0.5,
                                  }}
                                  className={`absolute h-1 w-1 rounded-full ${
                                    i === 1
                                      ? "bg-[#104e90]"
                                      : i === 2
                                      ? "bg-[#519fcc]"
                                      : "bg-[#0c3469]"
                                  }`}
                                  style={{
                                    left: `${Math.random() * 60 + 20}%`,
                                    top: `${Math.random() * 60 + 20}%`,
                                  }}
                                />
                              ))}
                            </motion.div>
                          </motion.div>

                          <motion.h3
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-xl font-semibold text-[#434343] mb-2 text-center"
                          >
                            No Users Found
                          </motion.h3>

                          <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="text-sm text-gray-600 text-center max-w-md mb-6"
                          >
                            No users match your current search criteria. Try
                            adjusting your search terms or filters to see
                            results.
                          </motion.p>

                          <div className="absolute -z-10 w-32 h-32 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-5">
                            <Users className="h-full w-full text-[#519fcc]" />
                          </div>
                        </motion.div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedUsers.map((user, index) => (
                      <motion.tr
                        key={user.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="hover:bg-[#ecf3ff]/50 transition-colors duration-200 border-b border-gray-100"
                      >
                        <TableCell className="text-[#434343] font-medium">
                          {user.name}
                        </TableCell>
                        <TableCell className="text-[#434343]">
                          {user.email}
                        </TableCell>
                        <TableCell className="text-[#434343]">
                          {user.role}
                        </TableCell>
                        <TableCell className="text-[#434343]">
                          {user.branch}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`${getStatusBadgeColor(
                              user.status
                            )} border font-medium`}
                          >
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => openEditModal(user)}
                                className="h-8 w-8 text-[#519fcc] hover:text-[#0c3469] hover:bg-[#ecf3ff] rounded-lg"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </motion.div>
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => openDeleteModal(user)}
                                className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </motion.div>
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))
                  )}
                </AnimatePresence>
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-4 border-t border-gray-200">
              <p className="text-gray-600 text-sm">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of{" "}
                {filteredUsers.length} results
              </p>
              <div className="flex gap-2">
                <Button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                  variant="outline"
                  className="border-gray-300 text-[#434343] hover:border-[#104e90] hover:text-[#104e90]"
                >
                  Previous
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      onClick={() => setCurrentPage(page)}
                      className={`${
                        currentPage === page
                          ? "bg-[#104e90] hover:bg-[#0c3469] text-white"
                          : "border-gray-300 text-[#434343] hover:border-[#104e90] hover:text-[#104e90]"
                      }`}
                    >
                      {page}
                    </Button>
                  )
                )}
                <Button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}
                  variant="outline"
                  className="border-gray-300 text-[#434343] hover:border-[#104e90] hover:text-[#104e90]"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>

      {/* Edit User Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="w-[95vw] max-w-[500px] bg-white border border-gray-200 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#434343]">
              Edit User
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Update the information for {selectedUser?.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name" className="text-[#434343]">
                Full Name
              </Label>
              <Input
                id="edit-name"
                placeholder="Enter full name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="bg-white border-gray-300 focus:border-[#104e90] focus:ring-[#104e90]/20 text-[#434343]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email" className="text-[#434343]">
                Email
              </Label>
              <Input
                id="edit-email"
                type="email"
                placeholder="Enter email address"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="bg-white border-gray-300 focus:border-[#104e90] focus:ring-[#104e90]/20 text-[#434343]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-phone" className="text-[#434343]">
                Phone Number
              </Label>
              <div className="phone-input-wrapper">
                <PhoneInput
                  international
                  defaultCountry="PK"
                  value={formData.phone}
                  onChange={(value) =>
                    setFormData({ ...formData, phone: value || "" })
                  }
                  className="border-gray-300 rounded-lg focus:border-[#104e90] focus:ring-[#104e90]"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-role" className="text-[#434343]">
                Role
              </Label>
              <Select
                value={formData.role}
                onValueChange={(value: UserRole) =>
                  setFormData({ ...formData, role: value })
                }
              >
                <SelectTrigger
                  id="edit-role"
                  className="bg-white border-gray-300 text-[#434343]"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200">
                  <SelectItem
                    value="Admin"
                    className="text-[#434343] hover:bg-[#ecf3ff]"
                  >
                    Admin
                  </SelectItem>
                  <SelectItem
                    value="Manager"
                    className="text-[#434343] hover:bg-[#ecf3ff]"
                  >
                    Manager
                  </SelectItem>
                  <SelectItem
                    value="Staff"
                    className="text-[#434343] hover:bg-[#ecf3ff]"
                  >
                    Staff
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-branch" className="text-[#434343]">
                Branch
              </Label>
              <Select
                value={formData.branch}
                onValueChange={(value: UserBranch) =>
                  setFormData({ ...formData, branch: value })
                }
              >
                <SelectTrigger
                  id="edit-branch"
                  className="bg-white border-gray-300 text-[#434343]"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200">
                  <SelectItem
                    value="Lahore"
                    className="text-[#434343] hover:bg-[#ecf3ff]"
                  >
                    Lahore
                  </SelectItem>
                  <SelectItem
                    value="Karachi"
                    className="text-[#434343] hover:bg-[#ecf3ff]"
                  >
                    Karachi
                  </SelectItem>
                  <SelectItem
                    value="Islamabad"
                    className="text-[#434343] hover:bg-[#ecf3ff]"
                  >
                    Islamabad
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-status" className="text-[#434343]">
                Status
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value: UserStatus) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger
                  id="edit-status"
                  className="bg-white border-gray-300 text-[#434343]"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200">
                  <SelectItem
                    value="Active"
                    className="text-[#434343] hover:bg-[#ecf3ff]"
                  >
                    Active
                  </SelectItem>
                  <SelectItem
                    value="Inactive"
                    className="text-[#434343] hover:bg-[#ecf3ff]"
                  >
                    Inactive
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditModalOpen(false);
                resetForm();
                setSelectedUser(null);
              }}
              className="border-gray-300 text-[#434343] hover:border-[#104e90] hover:text-[#104e90]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleEditUser}
              className="flex items-center justify-center bg-[#104e90] hover:bg-[#0c3469] text-white rounded-lg shadow-md px-4 py-2 transition-all duration-300"
              disabled={!formData.name || !formData.email}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add User Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="w-[95vw] max-w-[500px] bg-white border border-gray-200 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#434343]">
              Add New User
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Fill in the information below to add a new user to the system.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="add-name" className="text-[#434343]">
                Full Name
              </Label>
              <Input
                id="add-name"
                placeholder="Enter full name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="bg-white border-gray-300 focus:border-[#104e90] focus:ring-[#104e90]/20 text-[#434343]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-email" className="text-[#434343]">
                Email
              </Label>
              <Input
                id="add-email"
                type="email"
                placeholder="Enter email address"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="bg-white border-gray-300 focus:border-[#104e90] focus:ring-[#104e90]/20 text-[#434343]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-phone" className="text-[#434343]">
                Phone Number
              </Label>
              <div className="phone-input-wrapper">
                <PhoneInput
                  international
                  defaultCountry="PK"
                  value={formData.phone}
                  onChange={(value) =>
                    setFormData({ ...formData, phone: value || "" })
                  }
                  className="border-gray-300 rounded-lg focus:border-[#104e90] focus:ring-[#104e90]"
                  id="add-phone"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-role" className="text-[#434343]">
                Role
              </Label>
              <Select
                value={formData.role}
                onValueChange={(value: UserRole) =>
                  setFormData({ ...formData, role: value })
                }
              >
                <SelectTrigger
                  id="add-role"
                  className="bg-white border-gray-300 text-[#434343]"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200">
                  <SelectItem
                    value="Admin"
                    className="text-[#434343] hover:bg-[#ecf3ff]"
                  >
                    Admin
                  </SelectItem>
                  <SelectItem
                    value="Manager"
                    className="text-[#434343] hover:bg-[#ecf3ff]"
                  >
                    Manager
                  </SelectItem>
                  <SelectItem
                    value="Staff"
                    className="text-[#434343] hover:bg-[#ecf3ff]"
                  >
                    Staff
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-branch" className="text-[#434343]">
                Branch
              </Label>
              <Select
                value={formData.branch}
                onValueChange={(value: UserBranch) =>
                  setFormData({ ...formData, branch: value })
                }
              >
                <SelectTrigger
                  id="add-branch"
                  className="bg-white border-gray-300 text-[#434343]"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200">
                  <SelectItem
                    value="Lahore"
                    className="text-[#434343] hover:bg-[#ecf3ff]"
                  >
                    Lahore
                  </SelectItem>
                  <SelectItem
                    value="Karachi"
                    className="text-[#434343] hover:bg-[#ecf3ff]"
                  >
                    Karachi
                  </SelectItem>
                  <SelectItem
                    value="Islamabad"
                    className="text-[#434343] hover:bg-[#ecf3ff]"
                  >
                    Islamabad
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-status" className="text-[#434343]">
                Status
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value: UserStatus) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger
                  id="add-status"
                  className="bg-white border-gray-300 text-[#434343]"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200">
                  <SelectItem
                    value="Active"
                    className="text-[#434343] hover:bg-[#ecf3ff]"
                  >
                    Active
                  </SelectItem>
                  <SelectItem
                    value="Inactive"
                    className="text-[#434343] hover:bg-[#ecf3ff]"
                  >
                    Inactive
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddModalOpen(false);
                resetForm();
              }}
              className="border-gray-300 text-[#434343] hover:border-[#104e90] hover:text-[#104e90]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddUser}
              className="flex items-center justify-center bg-[#104e90] hover:bg-[#0c3469] text-white rounded-lg shadow-md px-4 py-2 transition-all duration-300"
              disabled={!formData.name || !formData.email}
            >
              Add User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="w-[95vw] max-w-[425px] bg-white border border-gray-200 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#434343]">
              Delete User
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-[#434343]">
                {selectedUser?.name}
              </span>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteModalOpen(false);
                setSelectedUser(null);
              }}
              className="border-gray-300 text-[#434343] hover:border-[#104e90] hover:text-[#104e90]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteUser}
              className="flex items-center justify-center bg-[#104e90] hover:bg-[#0c3469] text-white rounded-lg shadow-md px-4 py-2 transition-all duration-300"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
