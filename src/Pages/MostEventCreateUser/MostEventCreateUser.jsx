import React, { useState } from 'react'
import PageName from '../../Components/Shared/PageName'
import { CiSearch } from 'react-icons/ci'
import MostCreateEventUserTable from '../../Components/MostCreateEventUserTable/MostCreateEventUserTable'
import { useGetMostCreateUserQuery } from '../../redux/api/auditDashboardApi'
import { Pagination } from 'antd'
import Loading from '../../Components/Loading/Loading'
const MostEventCreateUser = () => {
    const [searchQuery, setSearchQuery] = useState('')
    const [page, setPage] = useState(1)
    const { data: mostCreateUser, isLoading } = useGetMostCreateUserQuery({ searchQuery, page })
    // console.log(mostCreateUser?.data);

    const dataSource = mostCreateUser?.data?.users?.map((user, i) => {
        return (
            {
                key: i + 1,
                slNo: i + 1,
                user: { name: user?.name },
                email: user?.email,
                eventsCreated: user?.serviceCount,
            }
        )
    })


    return (
        <div className='bg-white p-4 rounded-md'>
            <div className=' justify-between flex px-5 py-2'>
                <PageName name={'Most Events Created By Users'} />
                <div>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search here..."
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-1 rounded-md border border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 "
                        />
                        <span className="absolute left-3 top-2.5 text-gray-400">

                            <CiSearch />
                        </span>
                    </div>
                </div>
            </div>
            <div>
                {isLoading ? <Loading type="table" /> : <MostCreateEventUserTable dataSource={dataSource} pagination={false} />}
                <div className='flex items-center justify-center'>
                    <Pagination
                        onChange={(page) => setPage(page)}
                        total={mostCreateUser?.data?.totalUsers} 
                        pageSize={10}
                    />
                </div>
            </div>
        </div>
    )
}

export default MostEventCreateUser