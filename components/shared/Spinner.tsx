import Image from "next/image";
import React from "react";

const Spinner = () => {
  return (
    <div>
      <Image
        src="/assets/icons/spin.svg"
        width={20}
        height={20}
        alt="spin"
        className="animate-spin"
      />
    </div>
  );
};

export default Spinner;
