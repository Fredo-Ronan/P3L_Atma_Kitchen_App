'use client';
import React, { useState, useEffect } from "react";
import axios from "axios";
import { ClipLoader } from "react-spinners";

const Page = () => {
  const [isLoading, setIsLoading] = useState(false); // Deklarasi isLoading dan setIsLoading

  const postData = async () => {
    setIsLoading(true);
    try {
      const res = await axios.post("/api/presensiKaryawan");
      console.log("Presensi karyawan berhasil disimpan:", res.data);
    } catch (error) {
      console.error(
        "Terjadi kesalahan saat menyimpan presensi karyawan:",
        error
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    postData();
  }, []);

  return (
    <div>
      {isLoading ? (
        <div className="flex justify-center items-center">
          <ClipLoader />
        </div>
      ) : (
        <>Page</>
      )}
    </div>
  );
};

export default Page;
