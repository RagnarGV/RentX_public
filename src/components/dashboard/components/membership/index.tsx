"use client";
import { Input } from "@nextui-org/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
// import { payment } from '../../../../../actions/payment';
// import { DotsIcon } from "@/components/icons/accounts/dots-icon";
// import { ExportIcon } from "@/components/icons/accounts/export-icon";
// import { InfoIcon } from "@/components/icons/accounts/info-icon";
// import { TrashIcon } from "@/components/icons/accounts/trash-icon";
// import { HouseIcon } from "@/components/icons/breadcrumb/house-icon";
// import { UsersIcon } from "@/components/icons/breadcrumb/users-icon";
// import { SettingsIcon } from "@/components/icons/sidebar/settings-icon";
// import { TableWrapper } from "@/components/table/table";
// import { AddUser } from "./add-user";
import { HouseIcon } from "../icons/breadcrumb/house-icon";
import { UsersIcon } from "../icons/breadcrumb/users-icon";
import { TrashIcon } from "@radix-ui/react-icons";
import { DotsIcon } from "../icons/accounts/dots-icon";
import { ExportIcon } from "../icons/accounts/export-icon";
import { InfoIcon } from "../icons/accounts/info-icon";
import { SettingsIcon } from "../icons/sidebar/settings-icon";
import { TableWrapper } from "../table/table";
import Modal from "@/components/auth/modal";
import { userInfo } from "../../../../../actions/userInfo";
import { CardAgents } from "../home/card-agents";
import { MembershipTypeCards } from "./membershipTypesCards";
import {
  getMembership,
  getMembershipTypes,
} from "../../../../../actions/membership";

import { MembershipInfoType, MembershipsType, PropertyInfoType } from "@/types";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { landlordInfo } from "../../../../../actions/landlord";

export const Membership = () => {
  const [membershipDuration, setMembershipDuration] = useState("1");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [memberships, setMemberships] = useState<[MembershipsType]>();
  // Mock data for user, membership, payment, and plans
  const user = { name: "John Doe", email: "john.doe@example.com" };
  const membership = {
    type: "Elite",
    startDate: "2023-01-01",
    endDate: "2023-12-31",
    paymentCycle: "Monthly",
  };
  const payment = { card: "**** **** **** 3889", date: "2023-06-01" };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };
  const [memInfo, setMemInfo] = useState<MembershipInfoType>();
  const [propertyInfo, setPropertyInfo] = useState<PropertyInfoType>();
  useEffect(() => {
    getMembership().then((data: any) => {
      setMemInfo(data);
    });
  }, []);

  useEffect(() => {
    getMembershipTypes().then((data: any) => {
      setMemberships(data);
    });
    landlordInfo().then((data: any) => {
      setPropertyInfo(data);
    });
  }, []);

  const handleMembershipDuration = (e: any) => {
    setMembershipDuration(e);
  };

  return (
    <>
      <div className="container">
        <div className="my-4 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
          <h2 className="text-3xl font-semibold text-gray-900 dark:text-gray-300 mt-6">
            Membership
          </h2>

          <div className="flex flex-col gap-4 w-full sm:w-3/4 md:w-1/2 lg:w-1/3 max-w-md">
            <CardAgents custom={toggleModal} />
          </div>

          {((membershipDuration && memInfo?.Membership_Info.length! <= 0) ||
            memInfo?.Membership_Info[0]?.membershipExpireDate! <
              new Date()) && (
            <>
              <h2 className="mt-6 text-xl md:text-2xl lg:text-3xl">
                Select Membership Plan
              </h2>
              <div className="text-right">
                <button
                  className="bg-transparent hover:bg-lime-100 text-green-700 font-semibold py-2 px-4 border border-green-500  rounded"
                  onClick={() => handleMembershipDuration("1")}
                >
                  Monthly
                </button>{" "}
                <button
                  className="bg-transparent hover:bg-lime-100 text-green-700 font-semibold  py-2 px-4 border border-green-500  rounded"
                  onClick={() => handleMembershipDuration("12")}
                >
                  Yearly
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {memberships?.map((mem) => (
                  <React.Fragment key={mem.id}>
                    {Number(propertyInfo?.Property_Info[0].rentAmt) > 1500 ? (
                      mem.membershipType === "Gold Membership" && (
                        <MembershipTypeCards
                          id={mem.id}
                          membershipType={mem.membershipType}
                          membershipAmt={mem.membershipAmt}
                          membershipDuration={membershipDuration}
                          membershipAmenities={mem.membershipAmenities}
                        />
                      )
                    ) : (
                      <MembershipTypeCards
                        id={mem.id}
                        membershipType={mem.membershipType}
                        membershipAmt={mem.membershipAmt}
                        membershipDuration={membershipDuration}
                        membershipAmenities={mem.membershipAmenities}
                      />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* {modal} */}

      {/* Modal */}
      {isModalOpen && memInfo?.Membership_Info.length! > 0 && (
        <div
          id="default-modal"
          className="fixed left-0 top-0 w-full h-full bg-black bg-opacity-30 z-50 overflow-auto backdrop-blur flex justify-center items-center"
        >
          <div className="relative p-4 w-full  max-w-2xl max-h-full">
            <div className="relative bg-white rounded-lg shadow  dark:bg-gray-700">
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Membership Info
                </h3>
                <button
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                  onClick={toggleModal}
                >
                  <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              <div className="p-4 md:p-5 space-y-4">
                <div className="container mx-auto p-4">
                  <h1 className="text-2xl font-bold mb-4">Membership Info</h1>
                  <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                    {/* User Info */}
                    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                        Profile
                      </h2>
                      <p className="text-gray-700 dark:text-gray-300">
                        Name: {memInfo?.name}
                      </p>
                      <p className="text-gray-700 dark:text-gray-300">
                        Email: {memInfo?.email}
                      </p>
                    </div>

                    {/* Membership Details */}
                    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                        Membership Details
                      </h2>
                      <p className="text-gray-700 dark:text-gray-300">
                        Membership Type:{" "}
                        {memInfo?.Membership_Info[0].membershipType}
                      </p>
                      <p className="text-gray-700 dark:text-gray-300">
                        Start Date:{" "}
                        {memInfo?.Membership_Info[0].membershipStartDate.toString()}
                      </p>
                      <p className="text-gray-700 dark:text-gray-300">
                        End Date:{" "}
                        {memInfo?.Membership_Info[0].membershipExpireDate.toString()}
                      </p>
                      <p className="text-gray-700 dark:text-gray-300">
                        Payment Cycle:{" "}
                        {memInfo?.Membership_Info[0].membershipDuration} Months
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                <Button variant="default" onClick={toggleModal} type="button">
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
