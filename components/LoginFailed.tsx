'use client';
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useEffect } from "react";

const LoginFailed = () => {
    const { toast } = useToast();

    useEffect(() => {
        toast({
            variant: "destructive",
            title: "Login Failed!",
            description: "Your username or password is not correct",
            action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
    }, []);
  return (
    <div></div>
  )
}

export default LoginFailed