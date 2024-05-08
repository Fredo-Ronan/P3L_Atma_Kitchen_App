import EmailNotVerified from '@/components/EmailNotVerified'
import NotifPage from '@/components/NotifPage'
import React from 'react'

const NotVerifiedLogin = () => {
  return (
    <div>
        <NotifPage params={{iconText: "/failed.svg", notificationText: "Not Verified", description: "Please activate your account with link send to your email", navigationBtnText: "Back to Login", route: "/sign-in"}}/>
    </div>
  )
}

export default NotVerifiedLogin