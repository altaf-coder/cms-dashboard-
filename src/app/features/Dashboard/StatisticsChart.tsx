// import Chart from "react-apexcharts";
// import { ApexOptions } from "apexcharts";
// import ChartTab from "../common/ChartTab";

// export default function StatisticsChart() {
//   const options: ApexOptions = {
//     legend: {
//       show: false, // Hide legend
//       position: "top",
//       horizontalAlign: "left",
//     },
//     colors: ["#465FFF", "#9CB9FF"], // Define line colors
//     chart: {
//       fontFamily: "Outfit, sans-serif",
//       height: 310,
//       type: "line", // Set the chart type to 'line'
//       toolbar: {
//         show: false, // Hide chart toolbar
//       },
//     },
//     stroke: {
//       curve: "straight", // Define the line style (straight, smooth, or step)
//       width: [2, 2], // Line width for each dataset
//     },

//     fill: {
//       type: "gradient",
//       gradient: {
//         opacityFrom: 0.55,
//         opacityTo: 0,
//       },
//     },
//     markers: {
//       size: 0, // Size of the marker points
//       strokeColors: "#fff", // Marker border color
//       strokeWidth: 2,
//       hover: {
//         size: 6, // Marker size on hover
//       },
//     },
//     grid: {
//       xaxis: {
//         lines: {
//           show: false, // Hide grid lines on x-axis
//         },
//       },
//       yaxis: {
//         lines: {
//           show: true, // Show grid lines on y-axis
//         },
//       },
//     },
//     dataLabels: {
//       enabled: false, // Disable data labels
//     },
//     tooltip: {
//       enabled: true, // Enable tooltip
//       x: {
//         format: "dd MMM yyyy", // Format for x-axis tooltip
//       },
//     },
//     xaxis: {
//       type: "category", // Category-based x-axis
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
//         show: false, // Hide x-axis border
//       },
//       axisTicks: {
//         show: false, // Hide x-axis ticks
//       },
//       tooltip: {
//         enabled: false, // Disable tooltip for x-axis points
//       },
//     },
//     yaxis: {
//       labels: {
//         style: {
//           fontSize: "12px", // Adjust font size for y-axis labels
//           colors: ["#6B7280"], // Color of the labels
//         },
//       },
//       title: {
//         text: "", // Remove y-axis title
//         style: {
//           fontSize: "0px",
//         },
//       },
//     },
//   };

//   const series = [
//     {
//       name: "Sales",
//       data: [180, 190, 170, 160, 175, 165, 170, 205, 230, 210, 240, 235],
//     },
//     {
//       name: "Revenue",
//       data: [40, 30, 50, 40, 55, 40, 70, 100, 110, 120, 150, 140],
//     },
//   ];
//   return (
//     <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
//       <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
//         <div className="w-full">
//           <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
//             Statistics
//           </h3>
//           <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
//             Target you’ve set for each month
//           </p>
//         </div>
//         <div className="flex items-start w-full gap-3 sm:justify-end">
//           <ChartTab />
//         </div>
//       </div>

//       <div className="max-w-full overflow-x-auto custom-scrollbar">
//         <div className="min-w-[1000px] xl:min-w-full">
//           <Chart options={options} series={series} type="area" height={310} />
//         </div>
//       </div>
//     </div>
//   );
// }



// import Chart from "react-apexcharts";
// import { ApexOptions } from "apexcharts";
// import ChartTab from "../../pages/common/ChartTab";

// export default function StatisticsChart() {
//   const options: ApexOptions = {
//     legend: {
//       show: false,
//       position: "top",
//       horizontalAlign: "left",
//     },
//     // ✅ Updated with brand colors
//     colors: ["#1E3A8A", "#10B981"], // Primary Blue + Accent Green
//     chart: {
//       fontFamily: "Outfit, sans-serif",
//       height: 310,
//       type: "line",
//       toolbar: { show: false },
//     },
//     stroke: {
//       curve: "smooth", // ✅ smooth lines for better look
//       width: [3, 3],
//     },
//     fill: {
//       type: "gradient",
//       gradient: {
//         shadeIntensity: 1,
//         opacityFrom: 0.4,
//         opacityTo: 0.05,
//         stops: [0, 90, 100],
//       },
//     },
//     markers: {
//       size: 0,
//       strokeColors: "#fff",
//       strokeWidth: 2,
//       hover: { size: 6 },
//     },
//     grid: {
//       borderColor: "#E4E7EC", // ✅ theme gray
//       xaxis: { lines: { show: false } },
//       yaxis: { lines: { show: true } },
//     },
//     dataLabels: {
//       enabled: false,
//     },
//     tooltip: {
//       enabled: true,
//       theme: "light",
//       style: {
//         fontFamily: "Outfit, sans-serif",
//       },
//       y: {
//         formatter: (val) => `$${val}`,
//       },
//     },
//     xaxis: {
//       type: "category",
//       categories: [
//         "Jan", "Feb", "Mar", "Apr", "May", "Jun",
//         "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
//       ],
//       axisBorder: { show: false },
//       axisTicks: { show: false },
//       labels: {
//         style: {
//           colors: "#475467", // ✅ gray text
//           fontSize: "12px",
//         },
//       },
//     },
//     yaxis: {
//       labels: {
//         style: {
//           fontSize: "12px",
//           colors: ["#475467"], // ✅ theme neutral
//         },
//       },
//       title: {
//         text: "",
//       },
//     },
//   };

//   const series = [
//     {
//       name: "Sales",
//       data: [180, 190, 170, 160, 175, 165, 170, 205, 230, 210, 240, 235],
//     },
//     {
//       name: "Revenue",
//       data: [40, 30, 50, 40, 55, 40, 70, 100, 110, 120, 150, 140],
//     },
//   ];

//   return (
//     <div className="rounded-2xl border border-gray-200 bg-background px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
//       <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
//         <div className="w-full">
//           <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
//             Statistics
//           </h3>
//           <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
//             Target you’ve set for each month
//           </p>
//         </div>
//         <div className="flex items-start w-full gap-3 sm:justify-end">
//           <ChartTab />
//         </div>
//       </div>

//       <div className="max-w-full overflow-x-auto custom-scrollbar">
//         <div className="min-w-[1000px] xl:min-w-full">
//           <Chart options={options} series={series} type="area" height={310} />
//         </div>
//       </div>
//     </div>
//   );
// }

import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import ChartTab from "../../components/common/ChartTab";

export default function StatisticsChart() {
  const options: ApexOptions = {
    legend: {
      show: false,
      position: "top",
      horizontalAlign: "left",
    },
    // ✅ Updated with brand colors
    colors: ["#1E3A8A", "#10B981"], // Primary Blue + Accent Green
    chart: {
      fontFamily: "Outfit, sans-serif",
      height: 310,
      type: "line",
      toolbar: { show: false },
    },
    stroke: {
      curve: "smooth", // ✅ smooth lines for better look
      width: [3, 3],
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.05,
        stops: [0, 90, 100],
      },
    },
    markers: {
      size: 0,
      strokeColors: "#fff",
      strokeWidth: 2,
      hover: { size: 6 },
    },
    grid: {
      borderColor: "#E4E7EC", // ✅ theme gray
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      enabled: true,
      theme: "light",
      style: {
        fontFamily: "Outfit, sans-serif",
      },
      y: {
        formatter: (val) => `${val}`, // Dollar sign hata do
      },
    },
    xaxis: {
      type: "category",
      categories: [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
      ],
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: {
          colors: "#475467", // ✅ gray text
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "12px",
          colors: ["#475467"], // ✅ theme neutral
        },
      },
      title: {
        text: "",
      },
    },
  };

  // ⛔ Removed demo series: "Sales" and "Revenue".
  // Keep this array typed so it can be empty without TS errors.
  const series: { name: string; data: number[] }[] = [
    // {
    //   name: "Sales",
    //   data: [180, 190, 170, 160, 175, 165, 170, 205, 230, 210, 240, 235],
    // },
    // {
    //   name: "Revenue",
    //   data: [40, 30, 50, 40, 55, 40, 70, 100, 110, 120, 150, 140],
    // },
    {
      name: "Active Containers",  // ✅ Container management ke hisaab se
      data: [45, 52, 48, 58, 55, 62, 68, 65, 75, 72, 78, 80],
    },
    {
      name: "Booked Shipments",   // ✅ Logistics ke hisaab se
      data: [30, 25, 35, 40, 45, 35, 50, 55, 60, 65, 70, 75],
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-background px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
        <div className="w-full">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Container Statistics  
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            Monthly container and shipment targets  {/* Target ki jagah */}
          </p>
        </div>
        <div className="flex items-start w-full gap-3 sm:justify-end">
          <ChartTab />
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-[1000px] xl:min-w-full">
          <Chart options={options} series={series} type="area" height={310} />
        </div>
      </div>
    </div>
  );
}
