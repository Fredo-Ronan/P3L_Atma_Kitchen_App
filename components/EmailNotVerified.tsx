'use client';
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useEffect } from "react";

const EmailNotVerified = () => {
    const { toast } = useToast();

    useEffect(() => {
        toast({
            variant: "destructive",
            title: "Email Not Verified!",
            description: "Please check your registered email to activate your account",
            action: <ToastAction altText="Try again">OK</ToastAction>,
        });
    }, []);
  return (
    <div></div>
  )
}

export default EmailNotVerified