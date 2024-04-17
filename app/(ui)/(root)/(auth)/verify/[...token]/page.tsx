"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { SyncLoader } from "react-spinners";

const EmailVerificationPage = ({ params }: { params: { token: string[] } }) => {
  const url_token: string = params.token[0];
  const url_id_user: string = params.token[1];
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const verifyToken = async () => {
    const getToken = await fetch("/api/customer/auth/getUserToken", {
      method: "POST",
      body: JSON.stringify({
        id_user: url_id_user,
      }),
    });

    const result = await getToken.json();

    console.log(result);

    if (result.status === "NOT OK") {
      throw new Error("Error while verify token!");
    }

    console.log(url_token)
    console.log(result.data[0].TOKEN)
    console.log(url_token === result.data[0].TOKEN)

    // check if the user token is valid or same as in the database, then return true
    if (url_token === result.data[0].TOKEN) {
      return true;
    }

    return false;
  };

  const activate = async () => {
    const isTokenValid = await verifyToken();

    if (isTokenValid) {
      const resultActivate = await fetch("/api/customer/auth/activation", {
        method: "POST",
        body: JSON.stringify({
          user_id: url_id_user,
        }),
      });

      const activationResult = await resultActivate.json();

      console.log(activationResult);

      // check if the response status is OK on activation query, then return true, otherwise it will throw an error message if the activation is failed
      if (activationResult.status === "OK") {
        return true;
      }

      throw new Error("Activation not working!");
    }

    return false;
  };

  useEffect(() => {
    // if the all the activation step inside the activate function is success then change the value of the isValid state
    (async () => {
      setIsLoading(true);
      if (await activate()) {
        setIsValid(true);
      }
      setIsLoading(false);
    })();
  }, []);

  return (
    <div className="h-screen flex justify-center items-center text-center">
      {isLoading ? (
        <div className="flex flex-col justify-center items-center">
          <SyncLoader 
            color="#0094de"
            size={15}
          />
          <p className="text-xl mt-6">Please wait...</p>
        </div>
      ) : isValid ? (
        <div className="flex flex-col justify-center items-center">
          <Image src="/checklist.svg" alt="" width={100} height={100} className="mb-6"/>
          <p className="text-2xl">Success! Your Account is activated</p>
          <Link href="/sign-in" className="mt-6 inline-block rounded bg-indigo-600 px-5 py-3 text-md font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring">Go to Login Page</Link>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center">
          <Image src="/failed.svg" alt="" width={100} height={100} className="mb-6"/>
          <p className="text-2xl">Failed to activate your account</p>
          <p className="text-md mt-2">This probably due to the wrong link or simply the link has expired, please register again using your other real email account</p>
          <Link href="/sign-up" className="mt-6 inline-block rounded bg-indigo-600 px-5 py-3 text-md font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring">Go to Register Page</Link>
        </div>
      )}
    </div>
  );
};

export default EmailVerificationPage;
