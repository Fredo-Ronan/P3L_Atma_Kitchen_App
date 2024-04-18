import NotifPage from '@/components/NotifPage'
import React from 'react'

const SuccessResetPasswordPage = () => {
  return (
    <div>
        <NotifPage params={{iconText: "/checklist.svg", notificationText: "Successfully reset your password", description: "Your password has been reset", navigationBtnText: "Go to Login", route: "/sign-in"}}/>
    </div>
  )
}

export default SuccessResetPasswordPage