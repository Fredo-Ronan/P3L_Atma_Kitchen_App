import SideBar from "@/components/admin/SideBar";
import { sideBarAdmin } from "@/constants/mapping";
import { PropsWithChildren } from "react";

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <section className="flex flex-col w-full min-h-screen p-10">
      <div>
        <SideBar sideBar={sideBarAdmin} heading="Admin" />
      </div>

      <div className="flex-1 mt-8">{children}</div>
    </section>
  );
};

export default Layout;
