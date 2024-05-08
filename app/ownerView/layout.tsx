import SideBar from "@/components/admin/SideBar";
import { sideBarAdmin, sideBarOwner } from "@/constants/mapping";
import { PropsWithChildren } from "react";

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <section className="flex w-full min-h-screen">
      <div>
        <SideBar sideBar={sideBarOwner} heading="Owner"  />
      </div>
      <div className="flex-1 p-12">{children}</div>
    </section>
  );
};

export default Layout;
