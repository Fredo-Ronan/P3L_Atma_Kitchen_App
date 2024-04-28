import NotifPage from '@/components/NotifPage'
import React from 'react'

const FailedLoginPage = () => {
  return (
    <div>
        <NotifPage params={{iconText: "/failed.svg", notificationText: "Failed To Login!", description: "Your username or password is incorrect", navigationBtnText: "Back to Login", route: "/sign-in"}}/>
    </div>
  )
}

export default FailedLoginPage