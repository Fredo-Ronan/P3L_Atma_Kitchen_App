"use client";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { loginTrigger } from "@/actions/login.actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { LoginSchema } from "@/schema/formSchemas";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import { ClipLoader } from "react-spinners";

const CustomerLoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof LoginSchema>) => {
    setIsLoading(true);
    await loginTrigger(data);
  };

  const forgetPasswordCustomer = () => {
    console.log("FORGOT");
    window.location.href = "/forgot-password";
  };

  const forgetPasswordAdmin = () => {
    window.location.href = "/forgot-password-admin";
  };

  return (
    <div className="flex h-screen">
      {/* Left Side */}
      <div className="w-full bg-gray-100 lg:w-1/2 flex items-center justify-center">
        <div className="max-w-md w-full p-6">
          <h1 className="text-4xl font-bold mb-6 text-black text-center">
            Log In
          </h1>
          <h1 className="text-sm font-semibold mb-10 text-gray-500 text-center">
            Login untuk menemukan produk - produk unggulan Atma Kitchen{" "}
          </h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Dialog>
                <DialogTrigger className="w-full text-end font-semibold text-gray-600 hover:text-black hover:cursor-pointer transition-all duration-200">
                  Lupa Password?
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="text-2xl">
                      Lupa Password?
                    </DialogTitle>
                    <DialogDescription className="text-lg">
                      Pilih role anda untuk mengubah password akun anda
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex flex-col gap-4 w-full">
                    <Button
                      type="button"
                      className="text-lg"
                      onClick={() => forgetPasswordCustomer()}
                    >
                      Customer
                    </Button>
                    <Button
                      type="button"
                      className="text-lg"
                      onClick={() => forgetPasswordAdmin()}
                    >
                      Admin/MO
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              <Button type="submit" className="w-full">
                {isLoading ? <ClipLoader color="#ffffff" size={16} /> : "Login"}
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-sm text-gray-600 text-center">
            <p>
              Tidak punya akun?{" "}
              <Link href="/sign-up" className="text-black hover:underline">
                Daftar disini
              </Link>
            </p>
          </div>
        </div>
      </div>
      {/* Right Side */}
      <div className="left-side lg:flex items-center justify-center flex-1 bg-gradient-to-r from-blue-600 to-blue-400 text-white">
        <div className="left-side-content">
          <h1 className="text-4xl font-bold mb-6 text-yellow-300">
            Welcome To
          </h1>
          <h1 className="text-6xl font-bold mb-6">Atma Kitchen</h1>
        </div>
      </div>
    </div>
  );
};

export default CustomerLoginPage;
