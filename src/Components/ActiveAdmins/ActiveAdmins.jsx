import React  from 'react'
import ActiveAdminsTable from '../ActiveAdminsTable/ActiveAdminsTable'
import { Link } from 'react-router-dom';
import { imageUrl } from '../../redux/api/baseApi';
const ActiveAdmins = ({activeAdmin}) => {


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
    <div className='bg-white p-4 mt-4 rounded-md' >
      <div className='flex justify-between items-center px-4 text-xl'>
        <p>Active Admins</p>
        <Link to={'/active-admins'} className='text-blue-500'>View all</Link>
      </div>
      <ActiveAdminsTable dataSource={dataSource} pagination={false} />
    </div>
  )
}

export default ActiveAdmins