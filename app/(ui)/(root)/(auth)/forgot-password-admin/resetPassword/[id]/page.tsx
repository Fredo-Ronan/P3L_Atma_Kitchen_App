'use client';
import React, { useState } from 'react'
import { AdminResetPasswordSchema } from '@/schema/formSchemas';
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
import { resetPasswordAdmin } from '@/actions/resetPasswordAdmin.actions';

const AdminResetPasswordPage = ({ params }: { params: { id: string } }) => {
    const [isLoading, setIsLoading] = useState(false);
    const form = useForm<z.infer<typeof AdminResetPasswordSchema>>({
        resolver: zodResolver(AdminResetPasswordSchema),
        defaultValues: {
            password: ""
        }
    });

    const onSubmit = async (data: z.infer<typeof AdminResetPasswordSchema>) => {
        // console.log(data);
        // console.log(params.id);
        setIsLoading(true);
        await resetPasswordAdmin({ password: data.password, id_users: params.id });
    }
  return (
    <div className="flex h-screen items-center bg-blue-300">
      <div className="lg:w-2/5 w-auto mx-auto my-10 bg-white p-8 rounded-xl shadow shadow-slate-300">
        <h1 className="text-4xl font-medium">Reset password</h1>
        <p className="text-slate-500 mt-2 mb-4">
          Masukkan Password Baru Anda
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      className="text-lg focus:border-slate-500"
                      placeholder="Masukkan password baru anda"
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
                  <span className="mx-2 text-lg">Confirm Password</span>
                </>
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default AdminResetPasswordPage