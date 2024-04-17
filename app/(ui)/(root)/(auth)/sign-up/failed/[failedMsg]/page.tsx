import EmailAlreadyInUseNotif from '@/components/EmailAlreadyInUseNotif'
import NotifPage from '@/components/NotifPage'
import React from 'react'

const RegisterFailedPage = ({ params }: {params: { failedMsg: string }}) => {
  return (
    <div>
        {params.failedMsg.includes("already_in_use") ? <EmailAlreadyInUseNotif/> : <></>}
        {/* {params.failedMsg.replaceAll("_", " ")} */}
        <NotifPage params={{iconText: "/failed.svg", notificationText: params.failedMsg.replaceAll("_", " "), navigationBtnText: "Back to Register", route: "/sign-up", description: "Your email is already in use, please use your another email or make a brand new one"}}/>
    </div>
  )
}

export default RegisterFailedPage