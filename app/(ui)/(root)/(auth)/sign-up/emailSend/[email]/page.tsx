import EmailSendNotif from '@/components/EmailSendNotif'
import React from 'react'

const EmailSendNotifiPage = ({ params }: {params: { email: string }}) => {
  return (
    <div>
        <EmailSendNotif/>
        <h1>Email Send to your email {params.email}</h1>
    </div>
  )
}

export default EmailSendNotifiPage