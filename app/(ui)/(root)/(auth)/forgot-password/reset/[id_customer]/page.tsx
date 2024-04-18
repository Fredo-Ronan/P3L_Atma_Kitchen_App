import { resetPassword } from '@/actions/resetPassword.actions';
import React from 'react'

const ResetPasswordCustomerPage = ({ params }: { params: { id_customer: string } }) => {

  const id_customer = params.id_customer;

  return (
    <div className="flex h-screen items-center bg-blue-300">
      <div className="lg:w-2/5 w-auto mx-auto my-10 bg-white p-8 rounded-xl shadow shadow-slate-300">
        <h1 className="text-4xl font-medium">Buat Password Baru</h1>
        <p className="text-slate-500 mt-2">
          Buat password baru anda
        </p>

        <form
          action={async (formData) => {
            'use server';
            formData.append("id_customer", id_customer);
            await resetPassword(formData);
          }}
          className="my-10"
        >
          <div className="flex flex-col space-y-5">
            <label htmlFor="password">
              <p className="font-medium text-slate-700 pb-2">New Password</p>
              <input
                id="password"
                name="password"
                type="password"
                className="w-full py-3 border border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow"
                placeholder="Masukkan password baru"
              />
            </label>

            <button
              type="submit"
              className="w-full py-3 font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-lg border-blue-500 hover:shadow inline-flex space-x-2 items-center justify-center transition-all duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"
                />
              </svg>

              <span>Confirm</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ResetPasswordCustomerPage