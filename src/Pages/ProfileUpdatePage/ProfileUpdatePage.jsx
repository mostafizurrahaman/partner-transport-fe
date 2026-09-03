import React, { useState } from 'react'
import Loading from '../../Components/Loading/Loading'
import ProfileUpdateRequest from '../../Components/ProfileUpdateRequest/ProfileUpdateRequest';
import { FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useGetPendingPartnerQuery } from '../../redux/api/dashboardHomeApi';
import { imageUrl } from '../../redux/api/baseApi';
const ProfileUpdatePage = () => {
    const [current, setCurrent] = useState(1);


    //------ALL API ------//
  const { data: getPendingPartner, isLoading } = useGetPendingPartnerQuery()

// console.log(getPendingPartner?.data?.meta);
    const onChange = (page) => {
        setCurrent(page);
    };


     // table data 
  const formattedTableData = getPendingPartner?.data?.data?.slice(0,4)?.map((partner, i) => {
    return (
      {
        key: i + 1,
        name: partner?.name,
        img: `${imageUrl}${partner?.profile_image}`,
        email: partner?.email,
        contact:partner?.phone_number,
        // vichelType: 'car',
        // vichelNumber: "A 23445355",
        drivingLicense: `${imageUrl}${partner?.drivingLicenseImage}`,
        vichelImg: `${imageUrl}${partner?.vehicleFrontImag}`,
        // passport: 759175632578,
        location: partner?.country,
        status : partner?.status
      }
    )
  })




    return (
        <div className='bg-white rounded-md p-5'>
            <div className='flex items-center gap-2 py-2'>
                <Link to={-1}><FaArrowLeft className='text-[var(--primary-color)]' size={20} /></Link>
                <p className='font-semibold '>Partner Registration/ Update Request</p>
            </div>
            {isLoading ? <Loading type="table" /> : <ProfileUpdateRequest dataSource={formattedTableData} />}
            {/* <div className='mt-2 flex items-center justify-center'>
                <Pagination current={current}
                    onChange={onChange}
                    total={11}
                    pageSize={1} 
                    showSizeChanger={false}
                    showTotal={(total, range) => `Showing ${range[0]}-${range[1]} out of ${total}`} />
            </div> */}
        </div>
    )
}

export default ProfileUpdatePage