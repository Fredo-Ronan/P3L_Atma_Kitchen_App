import { getLoggedInUserData, logoutCustomer } from "@/lib";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import { Button } from "@/components/ui/button";
import NavbarP3L from "@/components/NavbarP3L";

const CustomerHomePage = async () => {
  const userData = await getLoggedInUserData();

  // console.log("Data Fetched from customer home page");
  // console.log(JSON.parse(userData!));

  return (
    <div>
      <NavbarP3L userData={userData}/>
      <h1>Customer Home Page</h1>

      {userData !== null ? (
        <>
          <p>{userData}</p>
          <Button asChild>
            <form
              action={async () => {
                "use server";
                await logoutCustomer();
                redirect("/sign-in");
              }}
            >
              <button type="submit">Logout</button>
            </form>
          </Button>
        </>
      ) : (
        <></>
      )}


      {/* {userData === null ? (
        <>
          <Button asChild>
            <Link href={"/sign-up"}>Sign Up</Link>
          </Button>
          <Button asChild>
            <Link href={"/sign-in"}>Sign In</Link>
          </Button>
        </>
      ) : (
        <></>
      )} */}
    </div>
  );
};

export default CustomerHomePage;
