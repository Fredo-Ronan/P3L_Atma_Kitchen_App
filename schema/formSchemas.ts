import { z } from "zod";

export const LoginSchema = z.object({
    username: z.string().min(1, {
        message: "Please enter your username"
    }),
    password: z.string().min(1, {
        message: "Please enter your password"
    })
})

export const RegisterSchema = z.object({
    nama: z.string().min(1, {
        message: "Please enter your name"
    }),
    tanggalLahir: z.string().min(1, {
        message: "Please enter your birthday"
    }),
    telepon: z.string().min(10, {
        message: "Phone Number must be in 10 digit long"
    }),
    email: z.string().email({
        message: "Please enter your email"
    }),
    username: z.string().min(1, {
        message: "Please enter your username"
    }),
    password: z.string().min(6, {
        message: "Password must be 6 characters long"
    })
})

// Forgot Password Form Schemas
export const EmailForgotPasswordSchema = z.object({
    email: z.string().email({
        message: "Please enter your registered email"
    })
})

export const UsernameForgotPasswordSchema = z.object({
    username: z.string().min(1, {
        message: "Please enter your username to reset your password"
    })
})

export const AdminResetPasswordSchema = z.object({
    password: z.string().min(6, {
        message: "Password must be 6 characters long"
    })
})