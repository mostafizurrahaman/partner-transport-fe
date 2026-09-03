import React, { useState } from 'react'
import AdminTaskTable from '../../Components/AdminTaskTable/AdminTaskTable'
import img from '../../assets/images/conver1.png'
import { Link } from 'react-router-dom'
import { IoArrowBack } from 'react-icons/io5'
import { CiSearch } from 'react-icons/ci'
import { useGetCompletedTaskQuery } from '../../redux/api/supervisorDashboardApi'
import { imageUrl } from '../../redux/api/baseApi'
import { Pagination } from 'antd'
import Loading from '../../Components/Loading/Loading'
const CompletedTask = () => {
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('')


    const { data: getCompletedTask, isLoading } = useGetCompletedTaskQuery({ searchTerm, page });
    const pageSize = getCompletedTask?.data?.meta?.limit || 10;



    const dataSource = getCompletedTask?.data?.data?.map((user, i) => {
        return (
            {
                key: i + 1,
                slNo: (page - 1) * pageSize + (i + 1),
                task: user?.task,
                admin: {
                    name: user?.assignedAdmin,
                    avatar: `${imageUrl}${user?.image}`,
                },
                status: user?.status,
            }
        )
    })


    return (
        <div className='bg-white rounded-md p-4'>
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-1 text-xl'>
                    <Link to={-1}><IoArrowBack /></Link>
                    <p>Task Completed</p>
                </div>
                <div className="relative">
                    <input
                        onChange={(e) => setSearchTerm(e.target.value)}
                        type="text"
                        placeholder="Search here..."
                        className="w-full pl-10 pr-4 py-1 rounded-md border border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 "
                    />
                    <span className="absolute left-3 top-2.5 text-gray-400">

                        <CiSearch />
                    </span>
                </div>
            </div>
            {isLoading ? <Loading type="table" /> : <AdminTaskTable dataSource={dataSource} />}
            <div className='flex justify-center'>
                <Pagination
                    onChange={(page) => setPage(page)}
                    total={getCompletedTask?.data?.meta?.total}
                    pageSize={getCompletedTask?.data?.meta?.limit}
                />
            </div>
        </div>
    )
}

export default CompletedTask