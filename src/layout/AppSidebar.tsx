"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSidebar } from "../app/context/SidebarContext";
import {
  BoltIcon,
  BoxCubeIcon,
  CalenderIcon,
  ChevronDownIcon,
  GridIcon,
  HorizontaLDots,
  PieChartIcon,
  UserCircleIcon,
} from "../pages/icons";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string }[];
};

const adminNavItems: NavItem[] = [
  { icon: <GridIcon />, name: "Dashboard", path: "/" },
  { icon: <GridIcon />, name: "Shipment Tracking", path: "/shipments" },
  {
    icon: <BoltIcon />,
    name: "Roles & Permissions",
    path: "/roles-and-permissions",
  },
  {
    icon: <BoxCubeIcon />,
    name: "User & Branch Mngt",
    subItems: [
      { name: "User List", path: "/user-management/users" },
      { name: "Audit Logs", path: "/user-management/auditlogs" },
    ],
  },
  {
    icon: <BoxCubeIcon />,
    name: "User Management",
    subItems: [
      { name: "Admin", path: "/admin" },
      { name: "Customer MNGT", path: "/customers" },
      { name: "Vendor MNGT", path: "/vendors" },
      { name: "Driver MNGT", path: "/drivers" },
    ],
  },
  { icon: <BoltIcon />, name: "Truck MNGT", path: "/truck" },
  { icon: <BoxCubeIcon />, name: "Shipment MNGT", path: "/container/shipment" },
  { icon: <GridIcon />, name: "Documents MNGT", path: "/documents" },
  { icon: <GridIcon />, name: "Jobs MNGT", path: "/jobs" },
  {
    icon: <GridIcon />,
    name: "Port Configurations",
    path: "/port-configurations",
  },
  { icon: <CalenderIcon />, name: "Calendar", path: "/calendar" },
  { icon: <UserCircleIcon />, name: "User Profile", path: "/profile" },
];

const clearanceAgentNavItems: NavItem[] = [
  { icon: <GridIcon />, name: "Dashboard", path: "/clearance/dashboard" },
  {
    icon: <BoxCubeIcon />,
    name: "DO Application",
    path: "/clearance/do-application",
  },
  { icon: <BoxCubeIcon />, name: "DO Receipt", path: "/clearance/do-receipt" },
  { icon: <BoxCubeIcon />, name: "Processing", path: "/clearance/processing" },
  { icon: <BoxCubeIcon />, name: "Work Queue", path: "/clearance/work-queue" },
];

const othersItems: NavItem[] = [
  {
    icon: <PieChartIcon />,
    name: "Charts",
    subItems: [
      { name: "Line Chart", path: "/line-chart" },
      { name: "Bar Chart", path: "/bar-chart" },
    ],
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();

  const isClearanceRoute = location.pathname.startsWith("/clearance");
  const mainMenuItems = isClearanceRoute
    ? clearanceAgentNavItems
    : adminNavItems;

  const [openSubmenu, setOpenSubmenu] = useState<number | null>(null);
  const subMenuRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  useEffect(() => {
    let matched = false;
    mainMenuItems.forEach((item, idx) => {
      if (item.subItems) {
        item.subItems.forEach((sub) => {
          if (isActive(sub.path!)) {
            setOpenSubmenu(idx);
            matched = true;
          }
        });
      }
    });
    if (!matched) setOpenSubmenu(null);
  }, [location.pathname, mainMenuItems, isActive]);

  const handleSubmenuRef = useCallback((index: number) => {
    return (el: HTMLDivElement | null) => {
      subMenuRefs.current[index] = el;
    };
  }, []);

  const renderMenuItems = (items: NavItem[]) => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <>
              <button
                onClick={() =>
                  setOpenSubmenu(openSubmenu === index ? null : index)
                }
                className={`menu-item group ${
                  openSubmenu === index
                    ? "menu-item-active"
                    : "menu-item-inactive"
                } cursor-pointer ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "lg:justify-start"
                }`}
              >
                <span
                  className={`menu-item-icon-size ${
                    openSubmenu === index
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
                {(isExpanded || isHovered || isMobileOpen) && (
                  <ChevronDownIcon
                    className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                      openSubmenu === index ? "rotate-180 text-brand-500" : ""
                    }`}
                  />
                )}
              </button>
              <div
                ref={handleSubmenuRef(index)}
                className="overflow-hidden transition-all duration-300"
                style={{
                  height:
                    openSubmenu === index
                      ? subMenuRefs.current[index]?.scrollHeight || 0
                      : 0,
                }}
              >
                <ul className="ml-9 mt-2 space-y-1">
                  {nav.subItems.map((sub) => (
                    <li key={sub.name}>
                      <Link
                        to={sub.path!}
                        className={`menu-dropdown-item ${
                          isActive(sub.path!)
                            ? "menu-dropdown-item-active"
                            : "menu-dropdown-item-inactive"
                        }`}
                      >
                        {sub.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <Link
              to={nav.path!}
              className={`menu-item group ${
                isActive(nav.path!) ? "menu-item-active" : "menu-item-inactive"
              }`}
            >
              <span
                className={`menu-item-icon-size ${
                  isActive(nav.path!)
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text">{nav.name}</span>
              )}
            </Link>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`flex ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link to="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <img
                className="dark:hidden pt-2"
                src="/logo (2).svg"
                alt="Logo"
                width={160}
                height={80}
              />
              <img
                className="hidden dark:block"
                src="/logo (2).svg"
                alt="Logo"
                width={150}
                height={40}
              />
            </>
          ) : (
            <img src="/logo (2).svg" alt="Logo" width={80} height={80} />
          )}
        </Link>
      </div>

      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  ""
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(mainMenuItems)}
            </div>

            {!isClearanceRoute && (
              <div>
                <h2
                  className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                    !isExpanded && !isHovered
                      ? "lg:justify-center"
                      : "justify-start"
                  }`}
                >
                  {isExpanded || isHovered || isMobileOpen ? (
                    "Others"
                  ) : (
                    <HorizontaLDots />
                  )}
                </h2>
                {renderMenuItems(othersItems)}
              </div>
            )}
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;