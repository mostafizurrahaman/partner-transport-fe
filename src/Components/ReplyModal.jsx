import { Modal } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import React, { useState } from 'react'
import { useReplyTicketMutation } from '../redux/api/supportApi'
import { toast } from 'sonner'

const ReplyModal = ({ replyId, openReplyModal, setOpenReplyModal }) => {

    const [replyTicket] = useReplyTicketMutation()
    const [reply, setReply] = useState('')
    // console.log(replyId);

    const handleReplyTicket = () => {
        console.log(reply)
        const data = {
            reply: reply
        }
        replyTicket({ id: replyId, data }).unwrap()
            .then((payload) => {
                toast.success(payload?.message)
                setOpenReplyModal(false)

            })
            .catch((error) => toast.error(error?.data?.message));
    }

    return (
        <Modal open={openReplyModal} onCancel={() => { setOpenReplyModal(false) }} footer={false} centered>
            <div className='mt-10'>
                <p className='py-2 text-xl'>Reply of the issue</p>
                <TextArea rows={4} onChange={(e) => setReply(e.target.value)} />
                <button onClick={() => handleReplyTicket()} className='bg-black text-white w-full mt-2 rounded-full py-2'>Submit</button>
            </div>
        </Modal>
    )
}

export default ReplyModal