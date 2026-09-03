import React, { useState } from 'react'
import PageName from '../../Components/Shared/PageName'
import { CiSearch } from 'react-icons/ci'
import MostTaskCompleteAdminTable from '../../Components/MostTaskCompleteAdminTable/MostTaskCompleteAdminTable'
import { useGetMostTaskCompletedAdminsQuery } from '../../redux/api/auditDashboardApi'
import { imageUrl } from '../../redux/api/baseApi'
import { Pagination } from 'antd'
import Loading from '../../Components/Loading/Loading'
const MostTaskCompleteAdmins = () => {
    const [page, setPage] = useState(1)
    const [searchTerm, setSearchTerm] = useState("")
    const { data : getMostTaskAdmin, isLoading} = useGetMostTaskCompletedAdminsQuery({page, searchTerm})

    const dataSource = getMostTaskAdmin?.data?.data?.slice(0,3)?.map((user, i)=>{
        return (
            {
                key: user,
                slNo: user?.adminId,
                admin: { name: user?.name, avatar: `${imageUrl}${user?.image}` },
                email: user?.email,
                ticketsAttended: user?.ticketsAttended,
                complaintsAttended: user?.complaintsAttended,
                totalTasksCompleted: user?.totalTasksCompleted,
            }
        )
    })

   
    return (
        <div className='bg-white p-4  rounded-md'>
            <div className=' justify-between flex'>
                <PageName name={'Most Tasks Completed By Admins'} />
                <div>
                    <div className="relative">
                        <input
                        onChange={(e)=>setSearchTerm(e.target.value)}
                            type="text"
                            placeholder="Search here..."
                            className="w-full pl-10 pr-4 py-1 rounded-md border border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 "
                        />
                        <span className="absolute left-3 top-2.5 text-gray-400">

                            <CiSearch />
                        </span>
                    </div>
                </div>
            </div>
            {isLoading ? <Loading type="table" /> : <MostTaskCompleteAdminTable dataSource={dataSource} pagination={false}  />}
            <div className='flex justify-center'>
                <Pagination 
                 onChange={(page)=> setPage(page)}
                 pageSize={getMostTaskAdmin?.data?.meta?.limit}
                 page={getMostTaskAdmin?.data?.meta?.total}
                 />
            </div>
        </div>
    )
}

export default MostTaskCompleteAdmins