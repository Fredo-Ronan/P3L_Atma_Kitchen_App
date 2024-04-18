import SideBarAdmin from "@/components/admin/SideBarAdmin";
import React, { PropsWithChildren } from "react";

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <section className="flex w-full min-h-screen">
      <div>
        <SideBarAdmin />
      </div>
      <div className="flex-1 p-12">{children}</div>
    </section>
  );
};

export default Layout;
