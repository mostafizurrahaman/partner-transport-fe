import { Modal } from 'antd'
import React from 'react'
import { useRefundMutation } from '../../redux/api/auctionManagementApi'
import { toast } from 'sonner'

const RefundModal = ({ openRefundModal, setRefundModal, refundValue }) => {
    const [refund] = useRefundMutation()


    const handleRefund = () => {

        let paymentMethod = refundValue?.paymentMethod

        const data = {
            serviceId: refundValue?.id,
            saleId: refundValue?.transactionId,
            amount: refundValue?.winBid
        }

        // console.log(paymentMethod, data);
        refund({ paymentMethod, data }).unwrap()
            .then((payload) => {
                toast.success(payload?.message)
                setRefundModal(false)

            })
            .catch((error) => {
                toast.error(error?.data?.message)
                setRefundModal(false)

            });



    }


    return (
        <Modal open={openRefundModal} centered footer={false} onCancel={() => setRefundModal(false)}>
            <div className='text-center'>
                <h1 className='text-xl font-medium '>Are you sure want to Refund?</h1>
                <p className='mt-5'>Win Bid amount will be refunded to the user/partner</p>
                <div className='space-x-5 mt-5'>
                    <button onClick={() => handleRefund()} className='bg-black text-white rounded-full px-8 py-2'>Refund</button>
                    <button onClick={() => setRefundModal(false)} className='border rounded-full px-8 py-2' >Cancel</button>
                </div>
            </div>
        </Modal>
    )
}

export default RefundModal