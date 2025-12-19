"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Save, X, Shield, ChevronRight } from "lucide-react";
import { ROLES, PERMISSIONS_MATRIX } from "./constants";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";

import { Button } from "../../../components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from "../../../components/ui/accordion";

import { Switch } from "../../../components/ui/switch";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";

type Role = (typeof ROLES)[number];

interface PermissionModule {
  id: string;
  name: string;
  icon?: React.ReactNode;
  permissions: Record<Role, string>;
}

export default function RolesPermissionsPage() {
  const [modules, setModules] = useState<PermissionModule[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const [roleName, setRoleName] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    const initialModules: PermissionModule[] = PERMISSIONS_MATRIX.map((row) => {
      const perms: Record<Role, string> = {} as Record<Role, string>;
      ROLES.forEach((role) => {
        const permissionRow = row as any;
        perms[role] = permissionRow[role] || "none";
      });

      return {
        id: row.module,
        name: row.module,
        icon: row.icon || null,
        permissions: perms,
      };
    });

    setModules(initialModules);
  }, []);

  const handlePermissionChange = (
    moduleId: string,
    role: Role,
    enabled: boolean
  ) => {
    setModules((prev) =>
      prev.map((m) =>
        m.id === moduleId
          ? {
              ...m,
              permissions: {
                ...m.permissions,
                [role]: enabled
                  ? (
                      PERMISSIONS_MATRIX.find((x) => x.module === m.id) as any
                    )?.[role] || "none"
                  : "none",
              },
            }
          : m
      )
    );
  };

  const handleModuleSelectAll = (moduleId: string, checked: boolean) => {
    setModules((prev) =>
      prev.map((m) => {
        if (m.id !== moduleId) return m;

        const updatedPerms: Record<Role, string> = {} as Record<Role, string>;

        ROLES.forEach((role) => {
          updatedPerms[role] = checked
            ? (PERMISSIONS_MATRIX.find((x) => x.module === moduleId) as any)?.[
                role
              ] || "none"
            : "none";
        });

        return { ...m, permissions: updatedPerms };
      })
    );
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);

    setModules((prev) =>
      prev.map((module) => {
        const updatedPerms: Record<Role, string> = {} as Record<Role, string>;

        ROLES.forEach((role) => {
          updatedPerms[role] = checked
            ? (PERMISSIONS_MATRIX.find((x) => x.module === module.id) as any)?.[
                role
              ] || "none"
            : "none";
        });

        return { ...module, permissions: updatedPerms };
      })
    );
  };

  const isModuleFullySelected = (module: PermissionModule) =>
    ROLES.every((r) => module.permissions[r] !== "none");

  const isModulePartiallySelected = (module: PermissionModule) =>
    ROLES.some((r) => module.permissions[r] !== "none") &&
    !isModuleFullySelected(module);

  const getSelectedCount = (module: PermissionModule) =>
    ROLES.filter((r) => module.permissions[r] !== "none").length;

  const handleSave = () => {
    setShowSaveDialog(true);
  };

  const handleConfirmSave = () => {
    setShowSaveDialog(false);
    setIsSaved(true);

    console.log("Saved Permissions", modules);
    console.log("Role Name:", roleName);
    console.log("Description:", description);
    console.log("Is Active:", isActive);

    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleCancel = () => {
    setRoleName("");
    setDescription("");
    setIsActive(true);
    setSelectAll(false);

    const initialModules: PermissionModule[] = PERMISSIONS_MATRIX.map((row) => {
      const perms: Record<Role, string> = {} as Record<Role, string>;
      ROLES.forEach((role) => {
        const permissionRow = row as any;
        perms[role] = permissionRow[role] || "none";
      });

      return {
        id: row.module,
        name: row.module,
        icon: row.icon || null,
        permissions: perms,
      };
    });

    setModules(initialModules);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <motion.div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center gap-2 text-sm text-gray-600">
          <span className="hover:text-blue-600 cursor-pointer transition-colors">
            CMS
          </span>
          <ChevronRight className="h-4 w-4 text-gray-400" />
          <span className="hover:text-blue-600 cursor-pointer transition-colors">
            Roles
          </span>
          <ChevronRight className="h-4 w-4 text-gray-400" />
          <span className="text-blue-600 font-medium">Assign Permissions</span>
        </div>

        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 shadow-sm">
            <Shield className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Assign Permissions
            </h1>
            <p className="text-gray-600">Modify role permissions for the CMS</p>
          </div>
        </div>

        <Card className="mb-6 border border-gray-200 bg-white shadow-sm hover:shadow transition-shadow duration-200">
          <CardHeader className="border-b border-gray-100 px-6">
            <CardTitle className="text-lg font-semibold text-gray-900">
              Role Information
            </CardTitle>
          </CardHeader>

          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            <div className="space-y-2">
              <Label className="text-gray-700 font-medium">Role Name *</Label>
              <Input
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                placeholder="Enter role name"
                className="border-gray-300 focus:border-white focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200"
              />
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gradient-to-r from-gray-50 to-white">
              <div>
                <Label className="text-gray-700 font-medium">Status</Label>
                <p className="text-sm text-gray-600">
                  {isActive ? "Role is active" : "Role is inactive"}
                </p>
              </div>
              <Switch
                checked={isActive}
                onCheckedChange={setIsActive}
                className="data-[state=checked]:bg-blue-600"
              />
            </div>

            <div className="md:col-span-2">
              <Label className="text-gray-700 mb-2 font-medium">
                Description
              </Label>
              <Textarea
                rows={3}
                value={description}
                placeholder="Enter description..."
                onChange={(e) => setDescription(e.target.value)}
                className="border-gray-300 focus:border-white focus:ring-1 focus:ring-blue-200 focus:outline-none transition-all duration-200"
              />
            </div>
          </CardContent>
        </Card>

        {/* Permissions */}
        <Card className="mb-6 border border-gray-200 bg-white shadow-sm hover:shadow transition-shadow duration-200">
          <CardHeader className="border-b border-gray-100 px-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle className="text-lg font-semibold text-gray-900">
                Assign Permissions
              </CardTitle>

              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-700 font-medium">
                  Select All Permissions
                </span>
                <Switch
                  checked={selectAll}
                  onCheckedChange={handleSelectAll}
                  className="data-[state=checked]:bg-blue-600"
                />
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <Accordion
              type="multiple"
              defaultValue={modules.map((m) => m.id)}
              className="space-y-3 p-6"
            >
              {modules.map((module) => (
                <AccordionItem
                  key={module.id}
                  value={module.id}
                  className={`border rounded-lg transition-all duration-300 overflow-hidden
                ${
                  isModuleFullySelected(module)
                    ? "border-blue-200 bg-gradient-to-r from-blue-50 to-blue-25"
                    : isModulePartiallySelected(module)
                    ? "border-blue-100 bg-gradient-to-r from-blue-25 to-blue-10"
                    : "border-gray-200 bg-gradient-to-r from-gray-50 to-white"
                } hover:border-blue-300 hover:shadow-sm`}
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-6 py-4">
                    <div className="flex items-center gap-4 flex-1">
                      <div
                        className={`h-12 w-12 rounded-xl flex items-center justify-center transition-all duration-300
                      ${
                        isModuleFullySelected(module)
                          ? "bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700 shadow-sm"
                          : isModulePartiallySelected(module)
                          ? "bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600"
                          : "bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600"
                      }`}
                      >
                        {module.icon}
                      </div>

                      <div className="text-left flex-1">
                        <h3 className="font-semibold text-gray-900">
                          {module.name}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {getSelectedCount(module)} of {ROLES.length}{" "}
                          permissions selected
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mt-4 sm:mt-0">
                      <div
                        className="flex items-center gap-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span className="text-sm text-gray-600">
                          Select All
                        </span>
                        <Switch
                          checked={isModuleFullySelected(module)}
                          onCheckedChange={(checked) =>
                            handleModuleSelectAll(module.id, checked)
                          }
                          className="data-[state=checked]:bg-blue-600"
                        />
                      </div>

                      <div className="h-10 w-10 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
                        <ChevronRight className="h-5 w-5 text-gray-500 transition-transform duration-200 group-data-[state=open]/accordion:rotate-90" />
                      </div>
                    </div>
                  </div>

                  <AccordionContent
                    forceMount
                    className="px-6 pb-6 pt-0 data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp overflow-hidden"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {ROLES.map((role) => (
                        <div
                          key={role}
                          onClick={() =>
                            handlePermissionChange(
                              module.id,
                              role,
                              module.permissions[role] === "none"
                            )
                          }
                          className={`flex justify-between items-center p-3.5 border rounded-lg cursor-pointer transition-all duration-200
                        ${
                          module.permissions[role] !== "none"
                            ? "border-blue-300 bg-gradient-to-r from-blue-50 to-blue-25 shadow-sm"
                            : "border-gray-200 bg-white hover:border-blue-200 hover:bg-blue-50/30"
                        }`}
                        >
                          <span className="text-sm font-medium text-gray-900">
                            {role.replace(/([A-Z])/g, " $1").trim()}
                          </span>

                          <Switch
                            checked={module.permissions[role] !== "none"}
                            onCheckedChange={(checked) =>
                              handlePermissionChange(module.id, role, checked)
                            }
                            className="data-[state=checked]:bg-blue-600"
                          />
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900 hover:border-gray-400 px-6 py-2.5 transition-all duration-200"
          >
            <X className="mr-2 h-4 w-4" /> Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 px-6 py-2.5 shadow-sm hover:shadow transition-all duration-200"
          >
            <Save className="mr-2 h-4 w-4" /> Save Role
          </Button>
        </div>

        {/* Save Confirmation Dialog */}
        <AnimatePresence>
          {showSaveDialog && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl border border-gray-200"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center shadow-sm">
                    <Save className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Save Role Permissions
                  </h3>
                </div>

                <p className="text-gray-600 mb-6">
                  Are you sure you want to save this role with the configured
                  permissions?
                </p>

                <div className="bg-gradient-to-r from-gray-50 to-white rounded-lg p-4 mb-6 border border-gray-200">
                  <p className="text-sm font-medium text-gray-900 mb-2">
                    Summary:
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Role:</span>{" "}
                    {roleName || "Unnamed Role"}
                  </p>
                  <p className="text-sm text-gray-700 mt-1">
                    <span className="font-medium">Status:</span>
                    <span
                      className={`ml-1 ${
                        isActive ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {isActive ? "Active" : "Inactive"}
                    </span>
                  </p>
                  <p className="text-sm text-gray-700 mt-1">
                    <span className="font-medium">Permissions:</span>{" "}
                    {modules.reduce((acc, m) => acc + getSelectedCount(m), 0)}{" "}
                    selected
                  </p>
                </div>

                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowSaveDialog(false)}
                    className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 px-5"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleConfirmSave}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 px-5"
                  >
                    Save Role
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toast */}
        <AnimatePresence>
          {isSaved && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.9 }}
              className="fixed bottom-6 right-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 z-50"
            >
              <Check className="h-5 w-5" />
              <span className="font-medium">
                Permissions Saved Successfully!
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
