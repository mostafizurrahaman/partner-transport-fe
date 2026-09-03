import { Modal } from 'antd'
import React from 'react'
import { imageUrl } from '../redux/api/baseApi'

const ComplainDetailsModal = ({ openComplainModal, setOpenComplainModal, complainDetails }) => {
  return (
    <Modal centered footer={false} open={openComplainModal} onCancel={() => setOpenComplainModal(false)}>
      <div>
        <h1 className='text-xl font-medium text-center'>Complain Details</h1>
        <p className='flex justify-between items-center mt-5'><span className='font-medium'>Complain ID : </span> <span>{complainDetails?.complainId}</span></p>
        <p className='flex justify-between items-center mt-5'><span className='font-medium'>Date : </span> <span>{complainDetails?.date}</span></p>
        <p className='flex justify-between items-center mt-5'><span className='font-medium'>User/Partner Name : </span> <span>{complainDetails?.userName}</span></p>
        <p className='flex justify-between items-center mt-5'><span className='font-medium'>Complain Against : </span> <span>{complainDetails?.complainAgainst}</span></p>
        <p className='flex justify-between items-center mt-5'><span className='font-medium'>Status: </span> <span>{complainDetails?.status}</span></p>
        <p className='font-medium mt-5'>Complain : </p>
        <p >{complainDetails?.complain}</p>
        <p className='font-medium mt-5'>Evidence : </p>
        <div className=' grid grid-cols-3 gap-2'>
          {
            complainDetails?.evidence?.map((evi, i) => {
              return (
                <img key={i+1} src={`${imageUrl}${evi}`} className='h-full rounded-md' alt="" />
              )
            })
          }
          {/* <img src={img} alt="" />
          <img src={img2} alt="" />
          <img src={img3} alt="" /> */}
        </div>
      </div>
    </Modal>
  )
}

export default ComplainDetailsModal