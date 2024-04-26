"use client";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SideBarProps } from "@/constants/mapping";
import { cn } from "@/lib/utils";
import { Computer } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Button } from "../ui/button";
import { logoutAdmin } from "@/lib";
import { logoutTriggerAdminMO } from "@/actions/logoutAdminMO.actions";
interface Props {
  heading: string;

  sideBar: SideBarProps[];
}

const SideBar = ({ sideBar, heading }: Props) => {
  const pathname = usePathname();

  return (
    <>
      <Sheet>
        <SheetTrigger>
          <Menu />
        </SheetTrigger>
        <SheetContent
          className="bg-gradient-to-b w-[350px] from-blue-600 to-blue-300 h-full shadow-lg px-5 py-10 border-r-0"
          side="left"
        >
          <div className="flex items-center gap-4">
            <Computer size={30} color="white" className="ml-3" />
            <h1 className="text-white font-bold text-3xl">{heading}</h1>
          </div>
          <div className="flex-col flex gap-6 mt-12">
            {sideBar.map((item: SideBarProps) => (
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
          <div className="flex flex-col justify-end h-80 w-1/2">
            <Button onClick={async () => {
                await logoutTriggerAdminMO();
                window.location.reload();
              }}>
              Logout
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default SideBar;
