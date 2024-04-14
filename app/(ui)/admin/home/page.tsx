import { logoutAdmin } from '@/lib';
import { redirect } from 'next/navigation';
import React from 'react'

const AdminHomePage = () => {
  return (
    <div>
      <h1>Admin Home Page</h1>
      <form action={
        async () => {
          "use server";
          await logoutAdmin();
          redirect('/admin/sign-in');
        }
      }>
        <button type="submit">Logout</button>
      </form>
    </div>
  )
}

export default AdminHomePage