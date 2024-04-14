'use client';
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useEffect } from "react";

const EmailSendNotif = () => {
    const { toast } = useToast();

    useEffect(() => {
        toast({
            variant: "default",
            title: "Email Verification Send",
            description: "Please check your email to verify and activate your account!",
            action: <ToastAction altText="Try again">OK</ToastAction>,
        });
    }, []);
  return (
    <div></div>
  )
}

export default EmailSendNotif