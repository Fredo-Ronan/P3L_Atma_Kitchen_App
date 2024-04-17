import EmailSendNotif from '@/components/EmailSendNotif'
import NotifPage from '@/components/NotifPage'
import React from 'react'

const EmailSendNotifiPage = ({ params }: {params: { email: string }}) => {
  return (
    <div>
        <EmailSendNotif/>
        <NotifPage params={{iconText: "/checklist.svg", notificationText: `Email Already send to ${params.email}`, navigationBtnText: "Back to Login", route: "/sign-in", description: "Please check your registered email and click on the given link to activate your account"}}/>
    </div>
  )
}

export default EmailSendNotifiPage