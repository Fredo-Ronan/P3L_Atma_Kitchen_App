import Image from "next/image";
import Link from "next/link";
import React from "react";

const NotifPage = ({ params }: {params: { iconText: string, notificationText: string, description: string, navigationBtnText: string, route: string }}) => {
  return (
    <div className="grid h-screen place-content-center bg-white px-4">
      <div className="text-center flex flex-col items-center">
      {params.iconText.includes("svg") ?
        <Image src={params.iconText} alt="" className="mb-6" width={100} height={100}/>
        :
        <div className="text-9xl font-black text-gray-200">{params.iconText}</div>
      }

        <p className="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          {params.notificationText.includes("%40") ?
            params.notificationText.replaceAll("%40", "@") : params.notificationText
          }
        </p>

        <p className="mt-4 text-gray-500">{params.description}</p>

        <Link
          href={params.route}
          className="mt-6 inline-block rounded bg-indigo-600 px-5 py-3 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring"
        >
          {params.navigationBtnText}
        </Link>
      </div>
    </div>
  );
};

export default NotifPage;
