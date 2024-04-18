"use client";
import NotifPage from "@/components/NotifPage";
import { StatusCodesP3L } from "@/constants/statusCodesP3L";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { SyncLoader } from "react-spinners";

const ResetTokenVerificationPage = ({
  params,
}: {
  params: { customer: string[] };
}) => {
  const { push } = useRouter();
  const token = params.customer[0];
  const id_customer = params.customer[1];

  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const verifToken = async () => {
    const resultVerifToken = await fetch(
      "/api/customer/auth/resetPassTokenVerif",
      {
        method: "POST",
        body: JSON.stringify({
          token: token,
        }),
      }
    );

    const resultVerif = await resultVerifToken.json();

    if (resultVerif.status === StatusCodesP3L.NOT_OK) {
      return false;
    }

    return true;
  };

  useEffect(() => {
    // if the all the activation step inside the activate function is success then change the value of the isValid state
    (async () => {
      setIsLoading(true);
      if (await verifToken()) {
        setIsValid(true);
        push(`/forgot-password/reset/${id_customer}`);
      }
      setIsLoading(false);
    })();
  }, []);

  return (
    <div>
      {isLoading ? (
        <div className="flex flex-col justify-center items-center h-screen">
          <SyncLoader />
          <p className="mt-4 text-xl">Please wait....</p>
        </div>
      ) : !isValid ? (
        <>
          <NotifPage
            params={{
              iconText: "/failed.svg",
              notificationText: "Failed to verify your password reset request",
              description: "Please check the link or try again reset password",
              navigationBtnText: "Back to Login",
              route: "/sign-in",
            }}
          />
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default ResetTokenVerificationPage;
