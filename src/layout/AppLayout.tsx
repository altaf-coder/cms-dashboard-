// import { Outlet } from "react-router";
// import { SidebarProvider, useSidebar } from "../app/context/SidebarContext";
// import AppSidebar from "./AppSidebar";
// import AppHeader from "./AppHeader";
// import Backdrop from "./Backdrop";

// const LayoutContent: React.FC = () => {
//   const { isExpanded, isHovered, isMobileOpen } = useSidebar();

//   return (
//     <div className="min-h-screen xl:flex">
//       <div>
//         <AppSidebar />
//         <Backdrop />
//       </div>
//       <div
//         className={`flex-1 transition-all duration-300 ease-in-out overflow-x-hidden ${
//           isExpanded || isHovered ? "lg:ml-[290px]" : "lg:ml-[90px]"
//         } ${isMobileOpen ? "ml-0" : ""}`}
//       >
//         <AppHeader />
//         <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
//           <Outlet />
//         </div>
//       </div>
//     </div>
//   );
// };

// const AppLayout: React.FC = () => {
//   return (
//     <SidebarProvider>
//       <LayoutContent />
//     </SidebarProvider>
//   );
// };

// export default AppLayout;






import { Outlet } from "react-router";
import { SidebarProvider, useSidebar } from "../app/context/SidebarContext";
import AppSidebar from "./AppSidebar";
import AppHeader from "./AppHeader";
import Backdrop from "./Backdrop";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
 
const LayoutContent: React.FC = () => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
 
  return (
    <div className="min-h-screen xl:flex">
      <div>
        <AppSidebar />
        <Backdrop />
      </div>
 
      {/*  MAIN CONTENT */}
      <div
        className={`flex-1 transition-all duration-300 ease-in-out overflow-x-hidden ${
          isRTL
            ? isExpanded || isHovered 
              ? "lg:mr-[290px]" 
              : "lg:mr-[90px]"
            : isExpanded || isHovered 
              ? "lg:ml-[290px]" 
              : "lg:ml-[90px]"
        } ${isMobileOpen ? "" : ""}`}
      >
        <AppHeader />
 
        {/*  CONTENT WRAPPER */}
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
 
const AppLayout: React.FC = () => {
  const { i18n } = useTranslation();
 
  useEffect(() => {
    if (i18n.language === "ar") {
      document.body.classList.add("lang-ar");
    } else {
      document.body.classList.remove("lang-ar");
    }
  }, [i18n.language]);
 
  return (
    <SidebarProvider>
      <LayoutContent />
    </SidebarProvider>
  );
};
 
export default AppLayout;
 
