import React from 'react'

const CustomToast = ({ props }: { props: { title: string, description: string } }) => {
  return (
    <div className='flex flex-col'>
        <p className='text-xl font-bold'>{props.title}</p>
        <p className='text-lg mt-2'>{props.description}</p>
    </div>
  )
}

export default CustomToast