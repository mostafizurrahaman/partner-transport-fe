import { Modal } from 'antd';
import React from 'react';

const ViewTicketModal = ({openViewTicket, setOpenViewTicket ,complainDetails}) => {
  return (
    <Modal footer={false}  centered open={openViewTicket}  onCancel={()=> setOpenViewTicket(false)}>
       <div>
            <h1 className='text-xl font-medium text-center'>Complain Details</h1>
            <p className='flex justify-between items-center mt-2'><span className='font-medium'>Complain ID : </span> <span>{complainDetails?.complainId}</span></p>
            <p className='flex justify-between items-center mt-2'><span className='font-medium'>Date : </span> <span>{complainDetails?.date}</span></p>
            <p className='flex justify-between items-center mt-2'><span className='font-medium'>User/Partner Name : </span> <span>{complainDetails?.userName}</span></p>
            <p className='flex justify-between items-center mt-2'><span className='font-medium'>Email : </span> <span>{complainDetails?.email}</span></p>
            <p className='flex justify-between items-center mt-2'><span className='font-medium'>Phone : </span> <span>{complainDetails?.contact}</span></p>
            <p className='flex justify-between items-center mt-2'><span className='font-medium'>Status: </span> <span>{complainDetails?.status}</span></p>
            <p className='font-medium mt-5'>
                Description of issue : </p>
            <p >{complainDetails?.complain}</p>
            
        </div>
    </Modal>
  );
}

export default ViewTicketModal;
