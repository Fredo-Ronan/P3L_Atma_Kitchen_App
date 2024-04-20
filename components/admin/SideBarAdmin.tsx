"use client";
import { Computer } from "lucide-react";
import { sideBarAdmin, SideBarAdminProps } from "@/constants/mapping";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const SideBarAdmin = () => {
  const pathname = usePathname();

  return (
    <div className="w-[296px] bg-gradient-to-b from-blue-600 to-blue-300 h-full shadow-lg px-5 py-10">
      <div className="flex items-center gap-4">
        <Computer size={30} color="white" className="ml-3"/>
        <h1 className="text-white font-bold text-3xl">Admin</h1>
      </div>
      <div className="flex-col flex gap-6 mt-12">
        {sideBarAdmin.map((item: SideBarAdminProps) => (
          <Link
            href={item.link}
            key={item.link}
            className={cn("text-white font-semibold text-lg p-3 rounded", {
              "bg-blue-600/70": pathname === item.link,
            })}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SideBarAdmin;
