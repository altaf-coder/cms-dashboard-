import { BrowserRouter as Router, Routes, Route } from "react-router";
import Calendar from "./app/features/Calendar/Calendar";
import Customers from "./app/features/EntityManagement/UserManagement/CustomerManagement/CustomerManagement";
import AddCustomers from "./app/features/EntityManagement/UserManagement/CustomerManagement/AddCustomerForm/AddCustomers";
import ViewCustomers from "./app/features/EntityManagement/UserManagement/CustomerManagement/ViewCustomerForm/ViewCustomers";
import EditCustomers from "./app/features/EntityManagement/UserManagement/CustomerManagement/EditCustomerForm/EditCustomers";
import EditShipment from "./app/features/EntityManagement/ShipmentManagement/EditShipmentForm/EditShipment";
import ViewShipment from "./app/features/EntityManagement/ShipmentManagement/ViewShipmentForm/ViewShipment";
import VehicleList from "./app/features/EntityManagement/ShipmentManagement/VehicleList/VehicleList";
import ViewVehicleList from "./app/features/EntityManagement/ShipmentManagement/VehicleList/ViewVehicleForm/ViewVehicleList";
import EditVehicleList from "./app/features/EntityManagement/ShipmentManagement/VehicleList/EditVehicleForm/EditVehicleList";
import Documents from "./app/features/EntityManagement/DocumentsManagement/Documents";
import AddDocument from "./app/features/EntityManagement/DocumentsManagement/AddDocumentsForm/AddDocument";
import ViewDocument from "./app/features/EntityManagement/DocumentsManagement/ViewDocumentsForm/ViewDocument";
import Jobs from "./app/features/EntityManagement/JobsManagement/Jobs";
import AddJobs from "./app/features/EntityManagement/JobsManagement/AddJobForm/AddJobs";
import ViewJobs from "./app/features/EntityManagement/JobsManagement/ViewJobForm/ViewJobs";
import EditJobs from "./app/features/EntityManagement/JobsManagement/EditJobForm/EditJobs";
import Truck from "./app/features/EntityManagement/TruckManagement/Truck";
import AddTruck from "./app/features/EntityManagement/TruckManagement/AddTruckForm/AddTruck";
import ViewTruck from "./app/features/EntityManagement/TruckManagement/ViewTruckForm/ViewTruck";
import EditTruck from "./app/features/EntityManagement/TruckManagement/EditTruckForm/EditTruck";
import Driver from "./app/features/EntityManagement/UserManagement/DriverManagement/Driver";
import ViewDriver from "./app/features/EntityManagement/UserManagement/DriverManagement/ViewDriverForm/ViewDriver";
import EditDriver from "./app/features/EntityManagement/UserManagement/DriverManagement/EditDriverForm/EditDriver";
import Vendor from "./app/features/EntityManagement/UserManagement/VendorManagement/Vendor";
import ADDVendor from "./app/features/EntityManagement/UserManagement/VendorManagement/AddVendorForm/AddVendor";
import ViewVendor from "./app/features/EntityManagement/UserManagement/VendorManagement/ViewVendorForm/ViewVendor";
import EditVendor from "./app/features/EntityManagement/UserManagement/VendorManagement/EditVendorForm/EditVendor";
import SignIn from "./services/AuthPages/SignIn";
import SignUp from "./services/AuthPages/SignUp";
import NotFound from "./app/components/NotFound/NotFound";
import LineChart from "./app/features/Charts/line/LineChart";
import BarChart from "./app/features/Charts/bar/BarChart";
import Admin from "./app/features/EntityManagement/UserManagement/Admin/Admin";
import { ScrollToTop } from "./app/components/common/ScrollToTop";
import FormElements from "./app/components/Forms/FormElements/FormElements";
import AddAdmin from "./app/features/EntityManagement/UserManagement/Admin/AddAdminForm/AddAdmin";
import ViewAdmin from "./app/features/EntityManagement/UserManagement/Admin/ViewAdminForm/ViewAdmin";
import EditAdmin from "./app/features/EntityManagement/UserManagement/Admin/EditAdminForm/EditAdmin";
import Home from "./app/features/Home/Home";
import UserProfiles from "./app/features/UserProfiles/UserProfiles";
import Shipment from "./app/features/EntityManagement/ShipmentManagement/Shipment";
import ADDDriver from "./app/features/EntityManagement/UserManagement/DriverManagement/AddDriverForm/AddDriver";
import PortConfigurations from "./app/features/EntityManagement/PortConfigurations/PortConfigurations";
import AddPortRuleForms from "./app/features/EntityManagement/PortConfigurations/AddPortForm/AddPortRuleForms";
import ViewPortRuleForms from "./app/features/EntityManagement/PortConfigurations/ViewPortForm/ViewPortRuleForms";
import EditPortRuleForms from "./app/features/EntityManagement/PortConfigurations/EditPortForm/EditPortRuleForms";
import Alerts from "./app/components/UiElements/Alerts";
import Avatars from "./app/components/UiElements/Avatars";
import Badges from "./app/components/UiElements/Badges";
import Buttons from "./app/components/UiElements/Buttons";
import Images from "./app/components/UiElements/Images";
import Videos from "./app/components/UiElements/Videos";
import ShipmentTracking from "./app/features/ShipmentTracking/ShipmentTracking";
import RolesPermissionsPage from "./app/features/Roles/Roles&Permissions/rolesAndPermissions";

import "./i18n";
import AppLayout from "./layout/AppLayout";
import Shipments from "./app/features/Dashboard/Admin/FilterList/AllShipments/allShipments";
import UserManagementPage from "./app/features/User & Branch Management/UsersPage/UsersPage";
import { AuditLogs } from "./app/features/User & Branch Management/AuditLogsPage/AuditLogsPage";
import ClearanceDashboard from "./app/features/Clearance/Dashboard/dashboard";
import DOApplicationPage from "./app/features/Clearance/DoApplication/doApplication";
import DOReceiptPage from "./app/features/Clearance/DOReceipt/dOReceipt";
import ClearanceProcessingPage from "./app/features/Clearance/Processing/Processing";
import ClearanceWorkQueuePage from "./app/features/Clearance/WorkQueue/WorkQueue";

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout */}
          <Route element={<AppLayout />}>
            <Route index path="/" element={<Home />} />
            <Route path="/shipments" element={<Shipments />} />
            <Route path="/customers" element={<Customers />} />
            <Route
              path="/clearance/dashboard"
              element={<ClearanceDashboard />}
            />
            <Route
              path="/clearance/do-application"
              element={<DOApplicationPage />}
            />
            <Route
              path="/clearance/processing"
              element={<ClearanceProcessingPage />}
            />

            <Route
              path="/clearance/work-queue"
              element={<ClearanceWorkQueuePage />}
            />
            <Route path="/clearance/do-receipt" element={<DOReceiptPage />} />
            <Route path="/shipment-tracking" element={<ShipmentTracking />} />
            <Route
              path="/roles-and-permissions"
              element={<RolesPermissionsPage />}
            />
            <Route
              path="/user-management/users"
              element={<UserManagementPage />}
            />

            <Route path="/user-management/auditlogs" element={<AuditLogs />} />
            <Route path="/Add-customers" element={<AddCustomers />} />
            <Route path="/View-customers/:id" element={<ViewCustomers />} />
            <Route path="/edit-customers/:id" element={<EditCustomers />} />
            <Route path="/truck" element={<Truck />} />
            <Route path="/add-truck" element={<AddTruck />} />
            <Route path="/view-truck/:id" element={<ViewTruck />} />
            <Route path="/edit-truck/:id" element={<EditTruck />} />
            <Route path="/vendors" element={<Vendor />} />
            <Route path="/add-vendor" element={<ADDVendor />} />
            <Route path="/view-vendor/:id" element={<ViewVendor />} />
            <Route path="/edit-vendor/:id" element={<EditVendor />} />
            <Route path="Container/shipment" element={<Shipment />} />
            <Route path="/edit-shipment/:id" element={<EditShipment />} />
            <Route path="/view-shipment/:id" element={<ViewShipment />} />
            <Route path="/vehicle-list/:id" element={<VehicleList />} />
            <Route
              path="/view-vehicle-list/:id"
              element={<ViewVehicleList />}
            />
            <Route
              path="/edit-vehicle-list/:id"
              element={<EditVehicleList />}
            />
            <Route path="/documents" element={<Documents />} />
            <Route path="/add-document" element={<AddDocument />} />
            <Route path="/view-document" element={<ViewDocument />} />

            <Route path="/jobs" element={<Jobs />} />
            <Route path="/add-jobs" element={<AddJobs />} />
            <Route path="/view-jobs/:id" element={<ViewJobs />} />
            <Route path="/edit-jobs/:id" element={<EditJobs />} />
            <Route
              path="/port-configurations"
              element={<PortConfigurations />}
            />
            <Route path="/add-port-rule-forms" element={<AddPortRuleForms />} />
            <Route
              path="/view-port-rule-forms/:id"
              element={<ViewPortRuleForms />}
            />
            <Route
              path="/edit-port-rule-forms/:id"
              element={<EditPortRuleForms />}
            />
            <Route path="/drivers" element={<Driver />} />
            <Route path="/add-driver" element={<ADDDriver />} />
            <Route path="/view-driver/:id" element={<ViewDriver />} />
            <Route path="/edit-driver/:id" element={<EditDriver />} />

            {/* Others Page */}
            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/calendar" element={<Calendar />} />
            {/* Forms */}
            <Route path="/form-elements" element={<FormElements />} />

            {/* Tables */}
            <Route path="/admin" element={<Admin />} />
            <Route path="/add-admin" element={<AddAdmin />} />
            <Route path="/view-admin/:id" element={<ViewAdmin />} />
            <Route path="/edit-admin/:id" element={<EditAdmin />} />

            {/* Ui Elements */}
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/avatars" element={<Avatars />} />
            <Route path="/badge" element={<Badges />} />
            <Route path="/buttons" element={<Buttons />} />
            <Route path="/images" element={<Images />} />
            <Route path="/videos" element={<Videos />} />

            {/* Charts */}
            <Route path="/line-chart" element={<LineChart />} />
            <Route path="/bar-chart" element={<BarChart />} />
          </Route>

          {/* Auth Layout */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
