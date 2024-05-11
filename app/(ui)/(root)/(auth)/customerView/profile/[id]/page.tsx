"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Profile from "@/components/customer/Profile";
import { SyncLoader } from "react-spinners";

interface Props {
  params: {
    id: string;
  };
}

const ProfilePage = ({ params }: Props) => {
  const [userData, setUserData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    const res = await axios.get(`/api/customer/${params.id}`);
    setUserData(res.data.data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      {isLoading ? (
        <div className="flex justify-center flex-1 my-10">
          <SyncLoader color="#2563eb" />
        </div>
      ) : (
        <div>
          <Profile data={userData} />
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
