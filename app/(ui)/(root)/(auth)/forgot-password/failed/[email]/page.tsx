import NotifPage from '@/components/NotifPage'
import React from 'react'

const FailedForgotPasswordPage = ({ params }: { params: { email: string } }) => {
  return (
    <div>
        <NotifPage params={{iconText: "/failed.svg", notificationText: `Email ${params.email} doesn't exists`, description: "Please check your registered email or create an account if you not have one", navigationBtnText: "Back to Login", route: "/sign-in"}}/>
    </div>
  )
}

export default FailedForgotPasswordPage