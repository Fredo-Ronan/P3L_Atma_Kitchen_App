'use client';
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useEffect } from "react";

const EmailAlreadyInUseNotif = () => {
  const { toast } = useToast();

  useEffect(() => {
    toast({
      variant: "destructive",
      title: "Email already exists!",
      description: "Please use another email or make a brand new one",
      action: <ToastAction altText="Try again">OK</ToastAction>,
    });
  }, []);

  return <div></div>;
};

export default EmailAlreadyInUseNotif;
