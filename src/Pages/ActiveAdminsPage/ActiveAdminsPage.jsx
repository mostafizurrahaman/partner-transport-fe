import React, { useEffect, useState } from 'react'
import { CiSearch } from 'react-icons/ci'
import { IoArrowBack } from 'react-icons/io5'
import { Link } from 'react-router-dom'
import ActiveAdminsTable from '../../Components/ActiveAdminsTable/ActiveAdminsTable'
import img from '../../assets/images/conver1.png'
import { useGetAdminProfileQuery } from '../../redux/api/authApi'
import { io } from 'socket.io-client'
import { imageUrl } from '../../redux/api/baseApi'
import Loading from '../../Components/Loading/Loading'

const ActiveAdminsPage = () => {
    const [activeAdmin, setActiveAdmin] = useState([])
    const { data: getAdmins, isLoading } = useGetAdminProfileQuery()
    // console.log(getAdmins?.data?._id);
    useEffect(() => {
      const socket = io("https://backend.xmoveit.com/", {
        query: {
          id: getAdmins?.data?._id,
        },
        transports: ["websocket"],
      });
      socket.on("active-admin", (data) => {
        setActiveAdmin(data);
      });
  
      // Cleanup on unmount
      return () => {
        socket.disconnect();
      };
  
    }, [getAdmins?.data?._id])
  
  
    const dataSource = activeAdmin?.map(((admin, i) => {
      return (
        {
          key: i+1,
          slNo: i + 1,
          admin: { name: admin?.name, avatar: `${imageUrl}${admin?.profile_image}`, online: true },
          email: admin?.email,
          activity: admin?.phone_number,
          tasksCompleted: admin?.todayCompletedTasks,

        }
      )
    }))
    return (
        <div className='bg-white p-4 rounded-md '>
            <div className='flex items-center justify-between px-2'>
                <div className='flex items-center gap-1 text-xl'>
                    <Link to={-1}><IoArrowBack /></Link>
                    <p>Task Completed</p>
                </div>
                {/* <div className="relative">
                    <input
                        type="text"
                        placeholder="Search here..."
                        className="w-full pl-10 pr-4 py-1 rounded-md border border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 "
                    />
                    <span className="absolute left-3 top-2.5 text-gray-400">

                        <CiSearch />
                    </span>
                </div> */}
            </div>
            {isLoading ? <Loading type="table" /> : <ActiveAdminsTable dataSource={dataSource} pagination={false} />}
        </div>
    )
}

export default ActiveAdminsPage