"use client";

import { Anchor, Ship, Truck } from "lucide-react";
import {  STEPS } from "./constants";
import { useState } from "react";

export default function ShipmentTracking() {
  const [selected, setSelected] = useState("hbl");
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto bg-white shadow-xl rounded-2xl p-6">
        {/* Header Section */}
        <div className="mb-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">
                CMS Track
              </h1>
            </div>
          </div>

          <div className="mb-8">
            <p className="text-sm font-medium text-gray-700 mb-3">
              Select Tracking Type
            </p>
            <div className="flex flex-row md:gap-4 gap-2 w-full">
              <label
                className={`flex items-center md:gap-3 gap-2 px-3 py-3 rounded-xl cursor-pointer border-2 transition-all
          ${
            selected === "hbl"
              ? "border-blue-500 bg-blue-50"
              : "border-gray-200 bg-white hover:border-blue-400"
          }`}
              >
                <input
                  type="radio"
                  name="trackingType"
                  value="hbl"
                  checked={selected === "hbl"}
                  onChange={() => setSelected("hbl")}
                  className="hidden"
                />

                <div className="w-5 h-5 rounded-full border-2 border-gray-500 flex items-center justify-center">
                  <div
                    className={`w-3 h-3 rounded-full bg-blue-600 transition-transform duration-200
              ${selected === "hbl" ? "scale-100" : "scale-0"}`}
                  />
                </div>

                <span className="font-medium text-gray-800 select-none">
                  HBL / HAWB #
                </span>
              </label>

              <label
                className={`flex items-center md:gap-3 gap-2 px-3 py-3 rounded-xl cursor-pointer border-2 transition-all
          ${
            selected === "container"
              ? "border-blue-500 bg-blue-50"
              : "border-gray-200 bg-white hover:border-blue-400"
          }`}
              >
                <input
                  type="radio"
                  name="trackingType"
                  value="container"
                  checked={selected === "container"}
                  onChange={() => setSelected("container")}
                  className="hidden"
                />

                <div className="w-5 h-5 rounded-full border-2 border-gray-500 flex items-center justify-center">
                  <div
                    className={`w-3 h-3 rounded-full bg-blue-600 transition-transform duration-200
              ${selected === "container" ? "scale-100" : "scale-0"}`}
                  />
                </div>

                <span className="font-medium text-gray-800 select-none">
                  Container #
                </span>
              </label>
            </div>
          </div>

          <div className="mb-8">
            <div className="relative">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Enter up to 5 tracking numbers, separated by commas..."
                    className="w-full border-2 border-gray-200 rounded-xl px-5 py-4 pl-12 text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      ></path>
                    </svg>
                  </div>
                </div>
                <button className="bg-gradient-to-r bg-[#104e90] hover:bg-[#519fcc] text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 flex items-center justify-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    ></path>
                  </svg>
                  Track Shipment
                </button>
              </div>
              <p className="mt-3 text-sm text-gray-500 ml-2">
                *Enter Up to 5 numbers, Separated with a comma(,)
              </p>
            </div>
          </div>
        </div>

        <div className="mb-12 bg-gradient-to-br from-white to-gray-50 border border-gray-100 rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-[#104e90] to-[#0c3469] p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <h2 className="text-2xl font-bold text-white">
                BL / AWB Information
              </h2>
            </div>
          </div>

          <div className="p-6 md:p-8">
            <div className="mb-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">
                        HBL/HAWB# :
                      </p>
                      <p className="text-2xl font-bold text-gray-900">YLKS</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">
                        Container# :
                      </p>
                      <p className="text-2xl font-bold text-gray-900">-</p>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="w-full md:w-56 h-52 md:h-32 overflow-hidden rounded-xl shadow-lg border border-gray-200">
                    <img
                      src="https://static.vecteezy.com/system/resources/previews/026/428/326/original/3d-illustration-of-shipping-cargo-container-cargo-shipment-delivery-logistics-and-freight-transportation-service-international-trade-import-and-export-illustration-png.png"
                      alt="Shipping Container"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <div className="bg-white p-6 border-r border-gray-200">
                  <div className="flex flex-col">
                    <p className="text-sm font-medium text-gray-500 mb-2">
                      Quantity:
                    </p>
                    <p className="text-2xl font-bold text-gray-900">24</p>
                  </div>
                </div>

                <div className="bg-white p-6 border-r border-gray-200">
                  <div className="flex flex-col">
                    <p className="text-sm font-medium text-gray-500 mb-2">
                      Package:
                    </p>
                    <p className="text-2xl font-bold text-gray-900">PKG</p>
                  </div>
                </div>

                <div className="bg-white p-6 border-r border-gray-200">
                  <div className="flex flex-col">
                    <p className="text-sm font-medium text-gray-500 mb-2">
                      Weight:
                    </p>
                    <div className="flex items-baseline gap-1">
                      <p className="text-2xl font-bold text-gray-900">
                        11,309.000
                      </p>
                      <span className="text-lg text-gray-600">KG</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6">
                  <div className="flex flex-col">
                    <p className="text-sm font-medium text-gray-500 mb-2">
                      CBM:
                    </p>
                    <p className="text-2xl font-bold text-gray-900">13.716</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">
                Shipping Route & Schedule
              </h3>

              <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <div className="hidden lg:grid lg:grid-cols-5 bg-gray-50 text-sm font-semibold text-gray-700 border-b border-gray-200">
                  <div className="p-4 border-r border-gray-200 text-center">
                    Place of Receipt
                  </div>
                  <div className="p-4 border-r border-gray-200 text-center">
                    Loading Port
                  </div>
                  <div className="p-4 border-r border-gray-200 text-center">
                    Transship
                  </div>
                  <div className="p-4 border-r border-gray-200 text-center">
                    Discharge Port
                  </div>
                  <div className="p-4 text-center">Place of Delivery</div>
                </div>

                <div className="lg:hidden bg-gray-50 p-4 border-b border-gray-200">
                  <div className="text-sm font-semibold text-gray-700 text-center">
                    Shipping Route Details
                  </div>
                </div>

                <div className="hidden lg:grid lg:grid-cols-5 text-sm bg-white">
                  <div className="p-5 border-r border-gray-100 flex flex-col items-center justify-center text-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                      <svg
                        className="w-5 h-5 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        ></path>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        ></path>
                      </svg>
                    </div>
                    <p className="font-semibold text-gray-900">
                      Karachi, Pakistan
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Origin</p>
                  </div>

                  <div className="p-5 border-r border-gray-100 flex flex-col items-center justify-center text-center">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-2">
                      <svg
                        className="w-5 h-5 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        ></path>
                      </svg>
                    </div>
                    <p className="font-semibold text-gray-900">Port Qasim</p>
                    <div className="space-y-1 mt-1">
                      <p className="text-xs text-gray-500">ETD: Nov 14, 2018</p>
                      <p className="text-xs text-green-600">
                        ATD: Nov 13, 2018
                      </p>
                    </div>
                  </div>

                  <div className="p-5 border-r border-gray-100 flex flex-col items-center justify-center text-center">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mb-2">
                      <svg
                        className="w-5 h-5 text-orange-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                      </svg>
                    </div>
                    <p className="font-semibold text-gray-900">
                      Jebel Ali (DXB)
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Transshipment Hub
                    </p>
                  </div>

                  <div className="p-5 border-r border-gray-100 flex flex-col items-center justify-center text-center">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mb-2">
                      <svg
                        className="w-5 h-5 text-purple-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        ></path>
                      </svg>
                    </div>
                    <p className="font-semibold text-gray-900">Singapore</p>
                    <div className="space-y-1 mt-1">
                      <p className="text-xs text-gray-500">ETA: Dec 14, 2018</p>
                      <p className="text-xs text-green-600">
                        ATA: Dec 19, 2018
                      </p>
                    </div>
                  </div>

                  <div className="p-5 flex flex-col items-center justify-center text-center">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mb-2">
                      <svg
                        className="w-5 h-5 text-indigo-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                      </svg>
                    </div>
                    <p className="font-semibold text-gray-900">
                      Los Angeles, USA
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Final Destination
                    </p>
                  </div>
                </div>

                <div className="lg:hidden bg-white divide-y divide-gray-200">
                  <div className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-4 h-4 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          ></path>
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          ></path>
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm font-semibold text-gray-900">
                              Place of Receipt
                            </p>
                            <p className="text-xs text-gray-500">Origin</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="ml-11">
                      <p className="text-sm font-medium text-gray-800">
                        Karachi, Pakistan
                      </p>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-4 h-4 text-green-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                          ></path>
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm font-semibold text-gray-900">
                              Loading Port
                            </p>
                            <p className="text-xs text-gray-500">Departure</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="ml-11 space-y-1">
                      <p className="text-sm font-medium text-gray-800">
                        Port Qasim
                      </p>
                      <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-gray-600">
                            ETD:{" "}
                            <span className="font-medium">Nov 14, 2018</span>
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-green-600 font-medium">
                            ATD: Nov 13, 2018
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-4 h-4 text-orange-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          ></path>
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm font-semibold text-gray-900">
                              Transship Port
                            </p>
                            <p className="text-xs text-gray-500">
                              Transfer Point
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="ml-11">
                      <p className="text-sm font-medium text-gray-800">
                        Jebel Ali (DXB)
                      </p>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-4 h-4 text-purple-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                          ></path>
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm font-semibold text-gray-900">
                              Discharge Port
                            </p>
                            <p className="text-xs text-gray-500">Arrival</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="ml-11 space-y-1">
                      <p className="text-sm font-medium text-gray-800">
                        Singapore
                      </p>
                      <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-gray-600">
                            ETA:{" "}
                            <span className="font-medium">Dec 14, 2018</span>
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-green-600 font-medium">
                            ATA: Dec 19, 2018
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-4 h-4 text-indigo-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          ></path>
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm font-semibold text-gray-900">
                              Place of Delivery
                            </p>
                            <p className="text-xs text-gray-500">
                              Final Destination
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="ml-11">
                      <p className="text-sm font-medium text-gray-800">
                        Los Angeles, USA
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <div className="min-h-screen bg-white p-1 font-sans">
            <div className="max-w-6xl mx-auto">
              <div className="mb-8">
                <h2 className="font-bold text-lg mb-12 text-[#1E3A8A]">
                  Events
                </h2>

                {/* Timeline Section */}
                <div className="relative mb-16 px-0">
                  <div className="absolute top-[200px] left-[10px] right-[10px] h-[3px] bg-[#519fcc] z-0 md:block hidden"></div>

                  <div className="flex flex-col md:flex-row justify-between relative z-10 w-full">
                    {STEPS.timeline.map((item, idx) => (
                      <div
                        key={idx}
                        className="relative flex flex-col w-full md:w-1/4 h-[280px]"
                      >
                        <div className="absolute left-[9px] top-[30px] h-[170px] w-[1px] bg-gray-400"></div>
                        <div className="absolute left-[6px] top-[90px] w-[7px] h-[7px] bg-[#519fcc] rounded-full"></div>

                        <div className="pl-6">
                          <div className="bg-[#1E3A8A] text-white text-[11px] py-1 px-3 rounded-sm font-medium inline-block mb-2">
                            {item.date}
                          </div>

                          <div className="text-[12px] font-bold text-[#1E3A8A] uppercase">
                            {item.title}
                          </div>

                          {item.location && (
                            <div className="text-[12px] font-bold text-gray-600 uppercase">
                              {item.location}
                            </div>
                          )}
                        </div>

                        <div className="absolute left-0 top-[191px] w-[20px] h-[20px] bg-white border-[4px] border-[#104e90] rounded-full z-20"></div>

                        <div className="absolute top-[220px] left-0 w-full pr-4">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[13px] text-[#1E3A8A]">
                              {item.status_label}
                            </span>

                            <div className="text-[#104e90]">
                              {item.icon_type === "truck" && <Truck />}
                              {item.icon_type === "ship" && <Ship />}
                              {item.icon_type === "anchor" && <Anchor />}
                              {item.icon_type === "truck_end" && <Truck />}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Events Table */}
                <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="p-4 text-left font-bold text-[#1E3A8A] text-sm">
                          Status
                        </th>
                        <th className="p-4 text-left font-bold text-[#1E3A8A] text-sm">
                          Location
                        </th>
                        <th className="p-4 text-left font-bold text-[#1E3A8A] text-sm">
                          Event Date
                        </th>
                        <th className="p-4 text-left font-bold text-[#1E3A8A] text-sm">
                          Remarks
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {STEPS.table.map((row, i) => (
                        <tr
                          key={i}
                          className="border-b border-gray-100 hover:bg-gray-50"
                        >
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
                              <span className="text-sm font-medium text-[#1E3A8A]">
                                {row.status}
                              </span>
                            </div>
                          </td>

                          <td className="p-4 text-sm text-[#1E3A8A]">
                            {row.location || "-"}
                          </td>

                          <td className="p-4 text-sm text-[#1E3A8A]">
                            {row.date}
                          </td>

                          <td className="p-4 text-sm text-[#1E3A8A]">
                            {row.remarks || "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
