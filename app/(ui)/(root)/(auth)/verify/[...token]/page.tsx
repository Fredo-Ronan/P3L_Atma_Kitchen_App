"use client";
import React, { useEffect, useState } from "react";

const EmailVerificationPage = ({ params }: { params: { token: string[] } }) => {
  const url_token: string = params.token[0];
  const url_id_user: string = params.token[1];
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const verifyToken = async () => {
    const getToken = await fetch("/api/customer/getUserToken", {
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
      const resultActivate = await fetch("/api/customer/activation", {
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
    <div>
      {isLoading ? (
        <>
          <h1>LOADING!</h1>
        </>
      ) : isValid ? (
        <>
          <h2>Success! Your Account is activated</h2>
        </>
      ) : (
        <>
          <h2>Email Not Valid or Link is not valid</h2>
        </>
      )}
    </div>
  );
};

export default EmailVerificationPage;
