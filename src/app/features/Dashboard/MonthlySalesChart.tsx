// import Chart from "react-apexcharts";
// import { ApexOptions } from "apexcharts";
// import { Dropdown } from "../ui/dropdown/Dropdown";
// import { DropdownItem } from "../ui/dropdown/DropdownItem";
// import { MoreDotIcon } from "../../icons";
// import { useState } from "react";

// export default function MonthlySalesChart() {
//   const options: ApexOptions = {
//     colors: ["#465fff"],
//     chart: {
//       fontFamily: "Outfit, sans-serif",
//       type: "bar",
//       height: 180,
//       toolbar: {
//         show: false,
//       },
//     },
//     plotOptions: {
//       bar: {
//         horizontal: false,
//         columnWidth: "39%",
//         borderRadius: 5,
//         borderRadiusApplication: "end",
//       },
//     },
//     dataLabels: {
//       enabled: false,
//     },
//     stroke: {
//       show: true,
//       width: 4,
//       colors: ["transparent"],
//     },
//     xaxis: {
//       categories: [
//         "Jan",
//         "Feb",
//         "Mar",
//         "Apr",
//         "May",
//         "Jun",
//         "Jul",
//         "Aug",
//         "Sep",
//         "Oct",
//         "Nov",
//         "Dec",
//       ],
//       axisBorder: {
//         show: false,
//       },
//       axisTicks: {
//         show: false,
//       },
//     },
//     legend: {
//       show: true,
//       position: "top",
//       horizontalAlign: "left",
//       fontFamily: "Outfit",
//     },
//     yaxis: {
//       title: {
//         text: undefined,
//       },
//     },
//     grid: {
//       yaxis: {
//         lines: {
//           show: true,
//         },
//       },
//     },
//     fill: {
//       opacity: 1,
//     },

//     tooltip: {
//       x: {
//         show: false,
//       },
//       y: {
//         formatter: (val: number) => `${val}`,
//       },
//     },
//   };
//   const series = [
//     {
//       name: "Sales",
//       data: [168, 385, 201, 298, 187, 195, 291, 110, 215, 390, 280, 112],
//     },
//   ];
//   const [isOpen, setIsOpen] = useState(false);

//   function toggleDropdown() {
//     setIsOpen(!isOpen);
//   }

//   function closeDropdown() {
//     setIsOpen(false);
//   }
//   return (
//     <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
//       <div className="flex items-center justify-between">
//         <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
//           Monthly Sales
//         </h3>
//         <div className="relative inline-block">
//           <button className="dropdown-toggle" onClick={toggleDropdown}>
//             <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 size-6" />
//           </button>
//           <Dropdown
//             isOpen={isOpen}
//             onClose={closeDropdown}
//             className="w-40 p-2"
//           >
//             <DropdownItem
//               onItemClick={closeDropdown}
//               className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
//             >
//               View More
//             </DropdownItem>
//             <DropdownItem
//               onItemClick={closeDropdown}
//               className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
//             >
//               Delete
//             </DropdownItem>
//           </Dropdown>
//         </div>
//       </div>

//       <div className="max-w-full overflow-x-auto custom-scrollbar">
//         <div className="-ml-5 min-w-[650px] xl:min-w-full pl-2">
//           <Chart options={options} series={series} type="bar" height={180} />
//         </div>
//       </div>
//     </div>
//   );
// }
   

// import Chart from "react-apexcharts";
// import { ApexOptions } from "apexcharts";
// import { Dropdown } from "../../pages/ui/dropdown/Dropdown";
// import { DropdownItem } from "../../pages/ui/dropdown/DropdownItem";
// import { MoreDotIcon } from "../../pages/icons";
// import { useState } from "react";

// export default function MonthlySalesChart() {
//   const options: ApexOptions = {
//     // ✅ Brand color palette: primary (Deep Navy Blue)
//     colors: ["#1E3A8A"],
//     chart: {
//       fontFamily: "Outfit, sans-serif",
//       type: "bar",
//       height: 180,
//       toolbar: {
//         show: false,
//       },
//     },
//     plotOptions: {
//       bar: {
//         horizontal: false,
//         columnWidth: "39%",
//         borderRadius: 5,
//         borderRadiusApplication: "end",
//       },
//     },
//     dataLabels: {
//       enabled: false,
//     },
//     stroke: {
//       show: true,
//       width: 4,
//       colors: ["transparent"],
//     },
//     xaxis: {
//       categories: [
//         "Jan",
//         "Feb",
//         "Mar",
//         "Apr",
//         "May",
//         "Jun",
//         "Jul",
//         "Aug",
//         "Sep",
//         "Oct",
//         "Nov",
//         "Dec",
//       ],
//       axisBorder: { show: false },
//       axisTicks: { show: false },
//     },
//     legend: {
//       show: true,
//       position: "top",
//       horizontalAlign: "left",
//       fontFamily: "Outfit",
//       labels: { colors: "#475467" }, // ✅ Neutral text color
//     },
//     yaxis: {
//       labels: {
//         style: {
//           colors: "#475467", // ✅ Neutral gray for Y-axis labels
//         },
//       },
//     },
//     grid: {
//       borderColor: "#E4E7EC", // ✅ Light gray from palette
//       yaxis: {
//         lines: { show: true },
//       },
//     },
//     fill: {
//       opacity: 1,
//       colors: ["#1E3A8A"], // ✅ Same as primary for bars
//     },
//     tooltip: {
//       theme: "light",
//       style: {
//         fontFamily: "Outfit",
//       },
//       y: {
//         formatter: (val: number) => `${val}`,
//       },
//       fillSeriesColor: false,
//     },
//   };

//   const series = [
//     {
//       name: "Sales",
//       data: [168, 385, 201, 298, 187, 195, 291, 110, 215, 390, 280, 112],
//     },
//   ];

//   const [isOpen, setIsOpen] = useState(false);
//   const toggleDropdown = () => setIsOpen(!isOpen);
//   const closeDropdown = () => setIsOpen(false);

//   return (
//     <div className="overflow-hidden rounded-2xl border border-gray-200 bg-background px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
//       <div className="flex items-center justify-between">
//         <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
//           Monthly Sales
//         </h3>

//         <div className="relative inline-block">
//           <button className="dropdown-toggle" onClick={toggleDropdown}>
//             <MoreDotIcon className="text-gray-400 hover:text-primary-dark dark:hover:text-accent size-6" />
//           </button>
//           <Dropdown isOpen={isOpen} onClose={closeDropdown} className="w-40 p-2">
//             <DropdownItem
//               onItemClick={closeDropdown}
//               className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-primary dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-accent"
//             >
//               View More
//             </DropdownItem>
//             <DropdownItem
//               onItemClick={closeDropdown}
//               className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-danger dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-danger"
//             >
//               Delete
//             </DropdownItem>
//           </Dropdown>
//         </div>
//       </div>

//       <div className="max-w-full overflow-x-auto custom-scrollbar">
//         <div className="-ml-5 min-w-[650px] xl:min-w-full pl-2">
//           <Chart options={options} series={series} type="bar" height={180} />
//         </div>
//       </div>
//     </div>
//   );
// }


import Chart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import { useState } from "react";
import { Dropdown } from "../../components/dropdown/Dropdown";
import { DropdownItem } from "../../components/dropdown/DropdownItem";
import { MoreDotIcon } from "../../../pages/icons";

/**
 * MonthlyContainersChart
 * - Replaces demo "Sales" with a domain metric: "Containers in Port".
 * - Data is static for now; swap with API values when available.
 */
export default function MonthlySalesChart() {
  // ApexCharts options (styling + axes + tooltip)
  const options: ApexOptions = {
    colors: ["#1E3A8A"], // primary bar color (Deep Navy)
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 180,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: { horizontal: false, columnWidth: "39%", borderRadius: 5, borderRadiusApplication: "end" },
    },
    dataLabels: { enabled: false },
    stroke: { show: true, width: 4, colors: ["transparent"] },
    xaxis: {
      categories: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
      fontFamily: "Outfit",
      labels: { colors: "#475467" },
    },
    yaxis: {
      labels: { style: { colors: "#475467" } }, // neutral gray
    },
    grid: {
      borderColor: "#E4E7EC",
      yaxis: { lines: { show: true } },
    },
    fill: { opacity: 1, colors: ["#1E3A8A"] },
    tooltip: {
      theme: "light",
      style: { fontFamily: "Outfit" },
      y: { formatter: (val: number) => `${val}` }, // format tooltip value
      fillSeriesColor: false,
    },
  };

  // 🔁 Replace this static array with live data from your API when ready.
  const series = [
    {
      name: "Containers in Port", // ✅ renamed from "Sales"
      data: [42, 58, 51, 63, 47, 55, 69, 32, 61, 74, 59, 36],
    },
  ];

  // Dropdown state
  const [isOpen, setIsOpen] = useState(false);
  const toggleDropdown = () => setIsOpen((v) => !v);
  const closeDropdown = () => setIsOpen(false);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-background px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex items-center justify-between">
        {/* ✅ Title renamed */}
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Containers in Port (Monthly)
        </h3>

        {/* Actions dropdown */}
        <div className="relative inline-block">
          <button className="dropdown-toggle" onClick={toggleDropdown}>
            <MoreDotIcon className="text-gray-400 hover:text-primary-dark dark:hover:text-accent size-6" />
          </button>
          <Dropdown isOpen={isOpen} onClose={closeDropdown} className="w-40 p-2">
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-primary dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-accent"
            >
              View More
            </DropdownItem>
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-danger dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-danger"
            >
              Delete
            </DropdownItem>
          </Dropdown>
        </div>
      </div>

      {/* Chart */}
      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="-ml-5 min-w-[650px] xl:min-w-full pl-2">
          <Chart options={options} series={series} type="bar" height={180} />
        </div>
      </div>
    </div>
  );
}
