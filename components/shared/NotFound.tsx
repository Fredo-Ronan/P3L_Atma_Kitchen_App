import Image from "next/image";
import React from "react";

const NotFound = () => {
  return (
    <div className="flex justify-center flex-col gap-6 items-center mt-5">
      <Image
        src="/assets/images/404.png"
        width={500}
        height={350}
        alt="404"
        className="object-contain"
      />
      <h2 className="font-bold text-red-600 text-2xl">
        Data tidak ditemukan! - 404
      </h2>
    </div>
  );
};

export default NotFound;
