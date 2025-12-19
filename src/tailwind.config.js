// /** @type {import('tailwindcss').Config} */
// export default {
//   content: [
//     "./index.html",
//     "./src/**/*.{js,ts,jsx,tsx}",
//   ],
//   theme: {
//     extend: {
//       colors: {
//         primary: {
//           DEFAULT: "#1E3A8A", // Deep Navy Blue
//           light: "#3B82F6",   // Lighter Blue
//           dark: "#1E40AF",    // Darker Blue
//         },
//         accent: "#10B981",      // Emerald Green
//         background: "#F9FAFB",  // Light Gray / Off White
//         warning: "#F59E0B",     // Amber
//         danger: "#EF4444",      // Red
//       },
//     },
//   },
//   plugins: [],
// }

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1E3A8A", // ✅ Deep Navy Blue - CORRECT
          light: "#3B827E",   // ✅ Light Blue (image ke hisaab se)
          dark: "#1E40AF",    // ✅ Darker Blue - CORRECT
        },
        accent: "#10B981",      // ✅ Emerald Green - CORRECT
        background: "#F9FAFB",  // ✅ Light Gray / Off White - CORRECT
        warning: "#F59E0B",     // ✅ Amber - CORRECT
        danger: "#EF4444",      // ✅ Red - CORRECT
      },
    },
  },
  plugins: [],
}