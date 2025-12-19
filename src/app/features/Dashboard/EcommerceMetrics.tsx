
import Badge from "../../components/badge/Badge";
import { ArrowDownIcon, ArrowUpIcon, BoxIconLine, GroupIcon } from "../../../pages/icons";

// export default function EcommerceMetrics() {
//   return (
//     <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
//       {/* <!-- Metric Item Start --> */}
//       <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
//         <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
//           <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
//         </div>

//         <div className="flex items-end justify-between mt-5">
//           <div>
//             <span className="text-sm text-gray-500 dark:text-gray-400">
//               Customers
//             </span>
//             <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
//               3,782
//             </h4>
//           </div>
//           <Badge color="success">
//             <ArrowUpIcon />
//             11.01%
//           </Badge>
//         </div>
//       </div>
//       {/* <!-- Metric Item End --> */}

//       {/* <!-- Metric Item Start --> */}
//       <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
//         <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
//           <BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />
//         </div>
//         <div className="flex items-end justify-between mt-5">
//           <div>
//             <span className="text-sm text-gray-500 dark:text-gray-400">
//               Orders
//             </span>
//             <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
//               5,359
//             </h4>
//           </div>

//           <Badge color="error">
//             <ArrowDownIcon />
//             9.05%
//           </Badge>
//         </div>
//       </div>
//       {/* <!-- Metric Item End --> */}
//     </div>
//   );
// }


// import {
//   ArrowDownIcon,
//   ArrowUpIcon,
//   BoxIconLine,
//   GroupIcon,
// } from "../../pages/icons";
// import Badge from "../../pages/ui/badge/Badge";

export default function EcommerceMetrics() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-primary/20 bg-background p-5 dark:border-primary/40 dark:bg-primary/5 md:p-6">
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 dark:bg-primary/30">
          <GroupIcon className="text-primary size-6 dark:text-accent" />
        </div>

        <div className="flex items-end justify-between mt-5">
          {/* <div>
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Customers
            </span>
            <h4 className="mt-2 font-bold text-primary text-title-sm dark:text-accent">
              3,782
            </h4>
          </div> */}
          <Badge color="success">
            <ArrowUpIcon />
            11.01%
          </Badge>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}

      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-primary/20 bg-background p-5 dark:border-primary/40 dark:bg-primary/5 md:p-6">
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-accent/10 dark:bg-accent/25">
          <BoxIconLine className="text-accent size-6 dark:text-accent" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            {/* <span className="text-sm text-gray-600 dark:text-gray-300">
              Orders
            </span> */}
            <h4 className="mt-2 font-bold text-accent text-title-sm dark:text-accent">
              5,359
            </h4>
          </div>

          <Badge color="error">
            <ArrowDownIcon />
            9.05%
          </Badge>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}
    </div>
  );
}
