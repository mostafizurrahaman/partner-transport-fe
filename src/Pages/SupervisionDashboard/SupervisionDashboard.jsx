import React, { useEffect, useState } from 'react'
import { PieChart, Pie, Cell } from "recharts";
import AdminTaskTable from '../../Components/AdminTaskTable/AdminTaskTable';
import { Link } from 'react-router-dom';
import ActiveAdmins from '../../Components/ActiveAdmins/ActiveAdmins';
import { useGetCompletedTaskQuery, useGetTskCountQuery } from '../../redux/api/supervisorDashboardApi';
import { imageUrl } from '../../redux/api/baseApi';
import { useGetAdminProfileQuery } from '../../redux/api/authApi';
import { io } from 'socket.io-client';
import Loading from '../../Components/Loading/Loading';

const SupervisionDashboard = () => {

    // Get all APIs
    const { data: getAllTask, isLoading } = useGetTskCountQuery()
    const { data: getCompletedTask } = useGetCompletedTaskQuery({ searchTerm : '', page : 1 });
  
    const data = [
        { name: "Completed", value: Number(getAllTask?.data?.completionRate) },
        { name: "Ongoing", value: 100 - Number(getAllTask?.data?.completionRate) },
    ];

    
      const [activeAdmin, setActiveAdmin] = useState([])
      const { data: getAdmins } = useGetAdminProfileQuery()



      useEffect(() => {
        const socket = io("https://backend.xmoveit.com/", {
          query: {
            id: getAdmins?.data?._id,
            role : getAdmins?.data?.authId?.role
          },
          transports: ["websocket"],
        });
        socket.on("active-admin", (data) => {
          setActiveAdmin(data);
        });
    
        return () => {
          socket.disconnect();
        };
    
      }, [getAdmins?.data?._id])

    

    // Colors for the chart
    const COLORS = ["#0088FE", "#FFBB28"];

    const dataSource = getCompletedTask?.data?.data?.slice(0,4).map((user, i) => {
        return (
            {
                key: i+1,
                slNo: i + 1,
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
        <div className=' p-4 rounded-md'>
            {isLoading ? <Loading type="dashboard" /> : <div className='flex items-center justify-between gap-10'>
                <div className='bg-white w-full py-8 rounded-md text-center '>
                    <p className='text-2xl'>Active Admins</p>
                    <p className='text-2xl font-semibold'>{activeAdmin?.length}</p>
                </div>
                <div className='bg-white w-full py-8 rounded-md text-center '>
                    <p className='text-2xl'>Total Tasks</p>
                    <p className='text-2xl font-semibold'>{getAllTask?.data?.totalTasks}</p>
                </div>
                <div className='bg-white w-full py-8 rounded-md text-center '>
                    <p className='text-2xl'>Complete Tasks</p>
                    <p className='text-2xl font-semibold'>{getAllTask?.data?.completedTasks}</p>
                </div>
                <div className='bg-white w-full py-8 rounded-md text-center '>
                    <p className='text-2xl'>Tasks in Progress</p>
                    <p className='text-2xl font-semibold'>{getAllTask?.data?.tasksInProgress}</p>
                </div>
            </div>}

            <div className='grid grid-cols-12 gap-5 mt-5'>
                <div className='col-span-8 bg-white rounded-md '>
                    <div className='flex items-center justify-between px-5'>
                        <div className='mt-2 ml-2 text-2xl font-medium'>Task Completed</div>
                        <Link to={'/task-completed'} className='text-blue-500'>View All</Link>
                    </div>
                    <AdminTaskTable dataSource={dataSource} />
                </div>
                <div className='bg-white  col-span-4 rounded-md flex flex-col items-center justify-center ' style={{ textAlign: "center" }}>
                    <h3 className='text-2xl font-semibold py-2'>Task Completion Rate</h3>
                    <PieChart width={200} height={200} className='mx-auto'>
                        {/* Create the Pie */}
                        <Pie
                            data={data}
                            cx="50%" // Center X
                            cy="50%" // Center Y
                            innerRadius={60}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {/* Map colors to the segments */}
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        {/* Add a Legend */}

                    </PieChart>
                    <div className='flex items-center justify-center '>
                        <span className='bg-[#0088FE]  h-3 w-3 mr-1'></span>
                        <p>Complete</p>

                        <span className='bg-[#FFBB28]  h-3 w-3 ml-10 mr-1'></span>
                        <p><span className=''></span>Ongoing</p>
                    </div>
                </div>
            </div>
            <ActiveAdmins activeAdmin={activeAdmin} />

        </div>
    )
}

export default SupervisionDashboard