'use client';
import { logoutTrigger } from "@/actions/logoutCustomer.actions";
import { Button } from "../ui/button";
import { useState } from "react";
import { ClipLoader } from "react-spinners";

const Profile = ({ data }: any) => {
  const customerData = data;
  const [isLoading, setIsLoading] = useState(false);

  const { id_customer, nama_customer, email_customer, tanggal_lahir, telepon } =
    customerData;

  const logout = () => {
    setIsLoading(true);
    logoutTrigger();
  }

  return (
    <div className="flex justify-center mt-20 h-screen">
      <div className="w-4/5 h-4/5 md:w-3/5 md:h-3/5 lg:w-4/5 lg:h-2/5 xl:w-1/3 xl:h-1/3 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-4 text-center">Profil Customer</h1>
        <p className="mb-2 ml-7 text-lg">Nama   : {nama_customer}</p>
        <p className="mb-2 ml-7 text-lg">Email  : {email_customer}</p>
        <p className="mb-2 ml-7 text-lg">No Telepon : {telepon}</p>
        <p className="mb-2 ml-7 text-lg">Tanggal Lahir  : {tanggal_lahir}</p>
        <Button onClick={logout}>
          {isLoading ? <ClipLoader color="#fffff"/> : "Logout"}
        </Button>
      </div>
    </div>
  );
};

export default Profile;
