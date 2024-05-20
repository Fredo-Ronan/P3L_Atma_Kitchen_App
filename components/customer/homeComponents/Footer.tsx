import React from 'react'
import { IoMdMail, IoMdInformationCircle  } from "react-icons/io";
import { FaLocationDot, FaInstagram } from "react-icons/fa6";

const Footer = () => {
  return (
    <div className='mt-24 bg-slate-50 font-poetsen'>
        <hr />
        {/* main wrapper */}
        <div className='py-14 px-28 flex gap-24'>
            {/* <img src="/assets/images/UAJY_LOGO.png" alt="" width={50} /> */}
            {/* Left Content Wrapper */}
            <div>
                <p className='font-bold text-2xl'>Atma Kitchen</p>
                <div className='mt-6 flex flex-col gap-4'>
                    <a href="">
                        <div className='flex items-center gap-2'>
                            <IoMdInformationCircle size={30} />
                            <p>Tentang Kami</p>
                        </div>
                    </a>
                    <a href="https://maps.app.goo.gl/hi9RHFPgmjNKrqoGA">
                        <div className='flex items-center gap-2'>
                            <FaLocationDot size={30} />
                            <p className='max-w-96'>Jl. Babarsari No.43, Janti, Caturtunggal, Kec. Depok, Kab. Sleman, Daerah Istimewa Yogyakarta</p>
                        </div>
                    </a>
                    <a href="mailto:atmakitchen@mail.com">
                        <div className='flex items-center gap-2'>
                            <IoMdMail size={30}/>
                            <p className='font-bold text-blue-500'>atmakitchen@mail.com</p>
                        </div>
                    </a>
                </div>
            </div>

            {/* Social Content Wrapper */}
            <div>
                <p className='font-bold text-2xl'>Social</p>
                <div className='mt-6 flex flex-col gap-4'>
                    <a href="">
                        <div className='flex items-center gap-2'>
                            <FaInstagram size={30} />
                            <p className='font-bold'>@atmakitchen</p>
                        </div>
                    </a>
                </div>
            </div>

            {/* Maps Content Wrapper */}
            <div>
                <p className='font-bold text-2xl'>Map</p>
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3953.0981282414386!2d110.41355417500489!3d-7.779419492240218!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a59f1fb2f2b45%3A0x20986e2fe9c79cdd!2sUniversitas%20Atma%20Jaya%20Yogyakarta%20-%20Kampus%203%20Gedung%20Bonaventura%20Babarsari!5e0!3m2!1sid!2sid!4v1716198411872!5m2!1sid!2sid" width="700" height="300" style={{border: "0"}} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
            </div>
        </div>
        <div className='text-center pb-10'>
            <p className='opacity-50'>© Copyright 2024 by Kelompok 5 | Proyek Pembangunan Perangkat Lunak</p>
        </div>
    </div>
  )
}

export default Footer