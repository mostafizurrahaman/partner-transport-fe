import { Form, Input, Modal } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import React, { useEffect } from 'react'
import { usePenaltyCostMutation } from '../redux/api/supportApi'
import { toast } from 'sonner'

const PenaltyModal = ({ openPenaltyModal, setOpenPenaltyModal, serviceId }) => {
    const [penaltyCost] = usePenaltyCostMutation()
    
    const [form] = Form.useForm()
    const onFinish = (value) => {
        const data = {
            id : serviceId?.complainId,
            serviceId: serviceId?.orderId,
            amountPercent: value?.amountPercent,
            reason: value?.reason

        }
        penaltyCost(data).unwrap()
            .then((payload) => {
                toast.success(payload?.message)
                setOpenPenaltyModal(false)

            })
            .catch((error) => toast.error(error?.data?.message));
    }

    useEffect(() => {
        form.setFieldsValue({
            user: serviceId?.userName
        })
    }, [serviceId, form])

    return (
        <Modal open={openPenaltyModal} onCancel={() => setOpenPenaltyModal(false)} centered footer={false}>
            <Form form={form} onFinish={onFinish} layout='vertical' className='mt-5'>
                <Form.Item label='User/Partner Name' name="user" >
                    <Input />
                </Form.Item>
                <Form.Item label='Penalty Percentage' name={'amountPercent'}>
                    <Input />
                </Form.Item>
                <Form.Item label='Reason of penalty' name={'reason'}>
                    <TextArea rows={4} />
                </Form.Item>
                <Form.Item>
                    <button type='submit' className='bg-black text-white w-full mt-2 rounded-full py-2'>Submit</button>
                </Form.Item>

            </Form>


        </Modal>
    )
}

export default PenaltyModal