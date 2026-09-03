import { Form, Input, Modal } from 'antd'
import React, { useState } from 'react'
import { GoPlus } from 'react-icons/go'
import { IoArrowBackSharp } from 'react-icons/io5'
import { Link } from 'react-router-dom'
const { TextArea } = Input;
const FAQ = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const faq = [
    {
      question: 'How do I book an appointment?',
      answer: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal ."
    },
    {
      question: 'Can I cancel or reschedule an appointment?',
      answer: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal ."
    },
    {
      question: 'How do I join a telemedicine consultation?',
      answer: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal ."
    },
    {
      question: 'How do I access my medical records?',
      answer: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal ."
    },
  ]

  // add question and answer modal function
  const handleAddFaq = () => {
    console.log('click');
    setIsModalOpen(true)

  }
  return (
    <div className='bg-white rounded-md p-5'>
      <div className='flex'>
        <Link to={-1} className='py-1 px-2 rounded-md flex justify-start items-center gap-1  '><IoArrowBackSharp className='text-[var(--primary-color)]' /></Link> <p className='font-semibold text-[18px]'>FAQ</p>
      </div>


      {/* all question and answer */}

      <div className='grid grid-cols-2 gap-5 mt-2'>
        {
          faq.map((qusetion, i) => <div key={i} className='p-2'>
            <p className='pb-3'>Question no: {i + 1}</p>
            <p className='bg-[#F2F2F2] p-2 rounded-md'>How do I book an appointment?</p>
            <p className='py-2'>Answer</p>
            <p className='bg-[#F2F2F2] p-2 rounded-md'>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal .</p>
          </div>)
        }


      </div>
      <div className='flex items-center justify-center mt-20'>
        <button onClick={() => handleAddFaq()} className='flex items-center gap-2 bg-[var(--primary-color)] text-white px-10 py-2 rounded-3xl'><GoPlus size={20} /><span> Add FAQ</span></button>
      </div>


      {/* Modal  */}


      <Modal centered open={isModalOpen} footer={false} onCancel={() => setIsModalOpen(false)}>
        <p className='text-center font-semibold pb-5 text-xl'>Add FAQ</p>
        <Form>
          <Form.Item>
            <Input placeholder="Type Answer Here.." variant="filled" />

          </Form.Item>
          <Form.Item>
            <TextArea rows={4} placeholder="Type question here.." variant="filled" maxLength={6} />
          </Form.Item>
          <div className='flex items-center justify-center mt-2'>
            <button onClick={() => handleAddFaq()} className='flex w-full items-center justify-center gap-2 bg-[var(--primary-color)] text-white px-10 py-2 text-xl rounded-3xl'> Save</button>
          </div>
        </Form>

      </Modal>


    </div>
  )
}

export default FAQ