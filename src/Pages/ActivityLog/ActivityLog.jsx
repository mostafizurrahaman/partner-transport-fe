import { DatePicker, Select } from 'antd'
import Loading from '../../Components/Loading/Loading'
import React, { useState } from 'react'
import { CiSearch } from 'react-icons/ci';
import { FaArrowLeft } from 'react-icons/fa';
import { MdOutlineFileDownload } from 'react-icons/md';
import { Link } from 'react-router-dom';
import ActivityLogTable from '../../Components/ActivityLogTable/ActivityLogTable';
import { useGetAllActivityQuery, useGetAllAdminQuery } from '../../redux/api/activeityLogApi';
import { CSVLink } from 'react-csv';
const ActivityLog = () => {
    const [page, setPage] = useState(1)
    const [searchTerm, setSearchTerm] = useState('')
    const [email, setAdminName] = useState('')
    const [date, setDate] = useState('')
    const [type, setActionType] = useState('')
    const [status, setStatus] = useState('')
    const { data: getActivityLog, isLoading } = useGetAllActivityQuery({ page, searchTerm, email, date, type, status })
    const { data: getAllAdmin } = useGetAllAdminQuery()


    const selectAdmin = getAllAdmin?.data?.map((admin, i) => {
        return (
            { value: admin?.email, label: admin?.name }
        )
    })


    // CSV Downloader function
    const headers = [
        { label: 'Timestamp', key: 'timestamp' },
        { label: 'Id', key: 'id' },
        { label: 'Admin Name', key: 'name' },
        { label: 'Email', key: 'email' },
        { label: 'Action Type', key: 'actionType' },
        { label: 'Result', key: 'result' },

    ]


    const dataSource = getActivityLog?.data?.data?.map((activity, i) => {
        return (
            {
                key: i + 1,
                id: activity?._id,
                timestamp: activity?.time,
                ids: activity?.id,
                admin: { name: activity?.admin?.name, avatar: activity?.admin?.profile_image },
                name: activity?.admin?.name,
                actionType: activity?.types,
                actionDescription: activity?.description,
                result: activity?.status,
                email: activity?.email
            }
        )
    })

    /** item category and status search functionality */
    const handleChange = (value) => {
        setAdminName(value)

    }
    // Filter data by date function
    const handleDateChange = (date, dateString) => {
        setDate(dateString);
    }

    // Filter data by action functionality
    const handleAction = (value) => {
        setActionType(value)
    }

    // Filter result 
    const handleResult = (value) => {
        setStatus(value)
    }


    return (
        <div className='bg-white p-4 rounded-md'>
            <div className="flex justify-between item-center pb-5 ">
                <div className="flex items-center gap-2">
                    <Link to={-1}><FaArrowLeft size={18} className='text-[var(--primary-color)] ' /></Link>
                    <span className='font-semibold text-[20px]'>Activity Log</span></div>
                <div>
                    <div className="relative">
                        <input
                            type="text"
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search here..."
                            className="w-full pl-10 pr-4 py-1 rounded-md border border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 "
                        />
                        <span className="absolute left-3 top-2.5 text-gray-400">

                            <CiSearch />
                        </span>
                    </div>
                </div>
            </div>
            <div className='flex justify-between items-center'>
                <div className='flex gap-5'>
                    <div>
                        <p className='mb-2'>Date</p>
                        <DatePicker onChange={handleDateChange} />

                    </div>
                    <div>
                        <p className='mb-2'>Admin Name</p>
                        <Select
                            defaultValue="Select Admin"
                            style={{ width: 200 }}
                            onChange={handleChange}
                            options={selectAdmin}
                        />
                    </div>
                    <div>
                        <p className='mb-2'>Action Type</p>
                        <Select
                            defaultValue="Select Action"
                            style={{ width: 200 }}
                            onChange={handleAction}
                            options={[
                                { value: 'Create', label: 'Create' },
                                { value: 'Refund', label: 'Refund' },
                                { value: 'Withdraw', label: 'Withdraw' },
                                { value: 'Delete', label: 'Delete' },
                                { value: 'Failed', label: 'Failed' },
                            ]}
                        />
                    </div>
                    <div>
                        <p className='mb-2'>Result</p>
                        <Select
                            defaultValue="Select result"
                            style={{ width: 200 }}
                            onChange={handleResult}
                            options={[
                                { value: 'Success', label: 'Success' },
                                { value: 'Error', label: 'Error' },
                            ]}
                        />
                    </div>
                </div>
                <div>
                   {
                    getActivityLog?.data?.data?.length > 0 &&  <CSVLink data={dataSource}
                    headers={headers}
                    filename="data.csv"
                    target="_blank" className='flex items-center gap-2 bg-black rounded-full text-white px-4 py-2'><MdOutlineFileDownload />Download CSV</CSVLink>
                   }
                </div>
            </div>
            <div>
                {isLoading ? <Loading type="table" /> : <ActivityLogTable dataSource={dataSource} setPage={setPage} metaData={getActivityLog?.data?.meta} />}
            </div>
        </div>
    )
}

export default ActivityLog