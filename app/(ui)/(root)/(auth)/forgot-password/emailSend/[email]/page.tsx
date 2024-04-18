import NotifPage from '@/components/NotifPage'
import React from 'react'

const EmailSendForgotPassword = ({ params }: { params: { email: string } }) => {
  return (
    <div>
        <NotifPage params={{iconText: "/checklist.svg", notificationText: `Your reset password request succesfully send to your email ${params.email}`, description: "Please check your email and click on the link to prove that you are going to reset your password for your account", navigationBtnText: "Back to Login", route: "/sign-in"}}/>
    </div>
  )
}

export default EmailSendForgotPassword