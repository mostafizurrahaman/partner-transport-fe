import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Badge } from 'antd';
import { IoIosNotificationsOutline } from "react-icons/io";
import { useGetAdminProfileQuery } from '../../redux/api/authApi';
import { imageUrl } from '../../redux/api/baseApi';
import { io } from 'socket.io-client';
const Header = () => {
  const navigate = useNavigate()
  const {data : getAdmin} = useGetAdminProfileQuery();
  // console.log(getAdmin?.data?._id);

  useEffect(() => {
    const socket = io("https://backend.xmoveit.com/", {
      query: {
        id: getAdmin?.data?._id,
      },
      transports: ["websocket"],
    });
    socket.on("active-admin", (data) => {
    //   setActiveAdmin(data);
    });

    return () => {
      socket.disconnect();
    };

  }, [getAdmin?.data?._id])
  return (
    <div className='w-full py-4 bg-[var(--primary-color)] flex justify-end items-center  gap-4'>
    <div>
        <Link to="/notification" style={{ boxShadow: "0px 0px 10px 2px rgba(0,0,0,0.24)" }} className=' bg-[#F2F2F2] h-10 flex items-center w-10 rounded-full p-2'>
            <Badge>
                <IoIosNotificationsOutline className='text-[var(--secondary-color)]' size={25} />
            </Badge>
        </Link>
    </div>
    <div onClick={() => navigate('/profile')} className='flex justify-end items-center gap-1 border-gray-400 p-[2px] px-4 rounded-md cursor-pointer'>
        <img className='h-10 w-10  rounded-full' src={`${imageUrl}${getAdmin?.data?.profile_image}`} alt="" />
        <p className='font-medium text-white'>{getAdmin?.data?.name}</p>
    </div>
</div>
  )
}

export default Header