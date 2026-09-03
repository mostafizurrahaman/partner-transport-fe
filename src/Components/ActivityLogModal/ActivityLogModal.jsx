import { Modal } from 'antd'
import React from 'react'

const ActivityLogModal = ({openModal , setOpenModal, singleActivity}) => {
  return (
    <Modal centered footer={false} open={openModal} onCancel={()=> setOpenModal(false)}  >
        <p className='text-xl text-center font-semibold' >Activity Log Details</p>
        <div className='flex flex-col items-center justify-center mt-5 space-y-2'>
            <p className='flex justify-between w-full text-[18px]'><span>Timestamp:</span> <span>{singleActivity?.timestamp}</span></p>
            <p className='flex justify-between w-full text-[18px]'><span>ID:</span> <span>{singleActivity?.id}</span></p>
            <p className='flex justify-between w-full text-[18px]'><span>Name:</span> <span>{singleActivity?.admin?.name}</span></p>
            <p className='flex justify-between w-full text-[18px]'><span>Email:</span> <span>{singleActivity?.email}</span></p>
            <p className='flex justify-between w-full text-[18px]'><span>Action Type:</span> <span>{singleActivity?.actionType}</span></p>
            <p className='flex justify-between w-full text-[18px]'><span className='mr-2'>Description: </span> <span>{singleActivity?.actionDescription}</span></p>
            <p className='flex justify-between w-full text-[18px]'><span>Result:</span> <span>{singleActivity?.result}</span></p>
        </div>
    </Modal>
  )
}

export default ActivityLogModal