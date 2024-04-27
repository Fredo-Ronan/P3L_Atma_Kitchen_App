"use client";
import { checkEmail } from "@/actions/checkEmail.actions";
import React, { useState } from "react";
import { EmailForgotPasswordSchema } from "@/schema/formSchemas";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ClipLoader } from "react-spinners";

const ForgotPasswordPage = () => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof EmailForgotPasswordSchema>>({
    resolver: zodResolver(EmailForgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof EmailForgotPasswordSchema>) => {
    // console.log(data);
    setIsLoading(true);
    await checkEmail(data);
  };

  return (
    <div className="flex h-screen items-center bg-blue-300">
      <div className="lg:w-2/5 w-auto mx-auto my-10 bg-white p-8 rounded-xl shadow shadow-slate-300">
        <h1 className="text-4xl font-medium">Reset password</h1>
        <p className="text-slate-500 mt-2 mb-4">
          Masukkan email yang anda daftarkan pada akun anda yang ingin anda
          pulihkan
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      className="text-lg focus:border-slate-500"
                      placeholder="Masukkan email yang anda daftarkan"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              {isLoading ? (
                <ClipLoader color="#ffffff" size={20} />
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"
                    />
                  </svg>

                  <span className="mx-2 text-lg">Reset password</span>
                </>
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
