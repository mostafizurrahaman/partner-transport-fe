"use client"
import { Form, Input, Modal, Pagination, Popconfirm, Switch, Table } from 'antd'
import React, { useState } from 'react'
import { CiSearch } from 'react-icons/ci'
import { FaArrowLeft } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { IoEyeOutline } from 'react-icons/io5'
import UserOpenModals from '../../Components/UserOpenModal/UserModalsOpen';
import { CgNotes } from 'react-icons/cg'
import { BsChatLeftText } from 'react-icons/bs'
import TextArea from 'antd/es/input/TextArea'
import ConversationModal from '../../Components/ConversationModal/ConversationModal'
import ChatModal from '../../Components/ChatModal/ChatModal'
import { useBlockUnBlockUserMutation, useDeleteUserMutation, useGetAllUserQuery, useGetMessageQuery, useSendNoticeMutation } from '../../redux/api/userManagementApi'
import { imageUrl } from '../../redux/api/baseApi'
import { toast } from 'sonner'
import { useGetAdminProfileQuery } from '../../redux/api/authApi'
import Loading from '../../Components/Loading/Loading'
import { RiDeleteBin6Line } from 'react-icons/ri'
const UserManagement = () => {
  const [page, setPage] = useState(1)
  const [form] = Form.useForm()
  const [searchTerms, setSearchTerms] = useState('')
  const [openModal, setOpenModal] = useState(false)
  const [singleUser, setSingleUser] = useState()
  const [openUserModal, setUserOpenModals] = useState(false)
  const [openChatModal, setOpenChatModal] = useState(false)
  const [sendAllChecked, setSendAllChecked] = useState(false)
  const [sendNoticeId, setSendNoticeId] = useState('')
  // api endpoints
  const { data: getAllUser, isLoading } = useGetAllUserQuery({ searchTerms, page })
  const [deleteUser] = useDeleteUserMutation()
  const [blockUnblockUser] = useBlockUnBlockUserMutation()
  const { data: userId } = useGetAdminProfileQuery()
  const [sendNotice] = useSendNoticeMutation()
  // Get message api

  let receiverId = userId?.data?._id

  // console.log(receiverId);
  const { data: getMessage , isLoading: isLoadingMessage} = useGetMessageQuery({ senderId: sendNoticeId, receiverId: userId?.data?._id })
  const onChange = (checked) => {
    const data = {
      role: checked?.role,
      email: checked?.email,
      is_block: !checked?.isBlock
    }
    blockUnblockUser(data).unwrap()
      .then((payload) => toast.success(payload?.message))
      .catch((error) => toast.error(error?.data?.message));
  }

  // Handle Delete user
  const handleDeleteUser = (id) => {
    deleteUser(id).unwrap()
      .then((payload) => toast.success(payload?.message))
      .catch((error) => toast.error(error?.data?.message));
  }

  const columns = [
    {
      title: "Id's",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "User's Name",
      dataIndex: "name",
      key: "name",
      render: (_, record) => {
        return (
          <div className="flex items-center gap-2">
            <img
              src={record?.img}
              className="w-[40px] h-[40px] rounded-[8px]"
              alt=""
            /> 
            <p className="font-medium">{record?.name}</p>
          </div>
        );
      },
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Contact Number",
      dataIndex: "contactNumber",
      key: "contactNumber",
    },

    {
      title: "Location",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "Active/Inactive",
      dataIndex: "action",
      key: "action",
      render: (_, record) => {
        return (
          <Switch checked={record?.isBlock} onChange={() => onChange(record)} />
        )
      },
    },
    {
      title: "View Details",
      dataIndex: "viewDetails",
      key: "viewDetails",
      render: (_, record) => (
        <div className='flex items-center '>
          <div style={{ color: "white" }} onClick={() => {
            setUserOpenModals(true)
            setSingleUser(record)
          }} className=' cursor-pointer bg-blue-500 text-white p-2 rounded-md'><IoEyeOutline size={20} /></div>
        </div>
      ),
    },

    {
      title: "Notice",
      dataIndex: "notice",
      key: "notice",
      render: (_, record) => {
        return (
          <div className='flex items-center '>
            <div style={{ color: "white" }} onClick={() => {
              setOpenModal(true)
              setSendNoticeId(record?.id)
            }} className=' cursor-pointer bg-[#FF5454] text-white p-2 rounded-md'><CgNotes size={20} /></div>
          </div>
        )
      },
    },

    {
      title: "Chat",
      dataIndex: "chat",
      key: "chat",
      render: (_, record) => (
        <div className='flex items-center '>
          <div style={{ color: "white" }} onClick={() => {
            setOpenChatModal(true)
            setSendNoticeId(record?.id)
          }} className=' cursor-pointer bg-[#F2AA00] text-white p-2 rounded-md'><BsChatLeftText size={20} /></div>
        </div>
      ),
    },
    {
      title: "Action",
      dataIndex: 'action',
      key: "action",
      render: (_, record) => (
        <div>
          <Popconfirm
            onConfirm={() => handleDeleteUser(record?.id)}
            title={'Are you sure delete this user?'}
            description="Delete User!"
            okText="Yes"
            cancelText="No"
            placement='topLeft'
          >
            <RiDeleteBin6Line size={22} className='text-red-500 cursor-pointer' />
          </Popconfirm>
        </div>
      )
    }
  ];
  const tableData = getAllUser?.data?.map((user, i) => {
    console.log(user);
    return {
      id: user?._id,
      key: i + 1,
      name: user?.name,
      img: `${imageUrl}${user?.profile_image}`,
      email: user?.email,
      contactNumber: user?.phone_number,
      balance: user?.wallet,
      location: user?.city,
      accountHolderName: user?.bank_holder_name,
      bankName : user?.bank_name,
      // HolderType: user?.bank_holder_type,
      accountNumber: user?.bank_account_number,
      routing: user?.routing_number,
      dob: user?.date_of_birth,
      
      line: user?.address_line,
      city: user?.address_city,
      country : user?.country,
      state: user?.state,
      postalCode: user?.address_postal_code,
      isBlock: user?.authId?.is_block,
      role: user?.authId?.role
    }
  })?.reverse()



  const handleSendNotice = (data) => {

    sendNotice({ data, sendAllChecked, sendNoticeId }).unwrap()
      .then((payload) => {
        toast.success(payload?.message)
        form.resetFields("")
        setOpenModal(false)
      })
      .catch((error) => toast.error(error?.data?.message));

  }


  const handleSendAll = (e) => {
    setSendAllChecked(e.target.checked);
  }




  return (
    <div className='p-5 bg-white rounded-md'>

      <div className="flex justify-between item-center ">
        <div className="flex items-center gap-2">
          <Link to={-1}><FaArrowLeft size={18} className='text-[var(--primary-color)] ' /></Link>
          <span className='font-semibold text-[20px]'>User Management</span></div>
        <div>
          <div className="relative">
            <input
              onChange={(e) => setSearchTerms(e.target.value)}
              type="text"
              placeholder="Search here..."
              className="w-full pl-10 pr-4 py-1 rounded-md border border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 "
            />
            <span className="absolute left-3 top-2.5 text-gray-400">

              <CiSearch />
            </span>
          </div>
        </div>
      </div>


      {/* User Management table */}
      <div className='mt-5'>
        {isLoading ? <Loading type="table" /> : <Table dataSource={tableData} columns={columns} className="custom-pagination" pagination={false} />}
        <div className='flex  items-center justify-center mt-5'>
          <Pagination
            onChange={(page) => setPage(page)}
            total={getAllUser?.meta?.total}
            pageSize={getAllUser?.meta?.limit}
          />
        </div>
      </div>

      <UserOpenModals singleUser={singleUser} setUserOpenModals={setUserOpenModals} openUserModal={openUserModal} />
      <Modal centered open={openModal} footer={false} onCancel={() => setOpenModal(false)} >
        <p className='text-center text-2xl'>Important Notice</p>
        <Form onFinish={handleSendNotice} form={form} >
          <div className='flex items-center justify-between mt-5'>
            <p className='  font-medium mb-2'>Important Notice</p>
            <Form.Item>
              <label className="flex items-center space-x-2">
                <input type="checkbox" onChange={handleSendAll} className="form-checkbox h-4 w-4 text-blue-600" />
                <span>Send to All</span>
              </label>
            </Form.Item>
          </div>
          <Form.Item name="title"
            rules={[
              {
                required: true,
                message: "Title is required!!"
              }
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="message">
            <TextArea placeholder='Write here...' style={{ resize: 'none', height: "250px" }} />
          </Form.Item>
          <div className='flex items-center justify-center mt-5'>
            <button className='px-8 py-2 rounded-full text-white bg-black w-full'>Send</button>
          </div>
        </Form>
      </Modal>
      <ChatModal openChatModal={openChatModal}  setOpenChatModal={setOpenChatModal} data={getMessage?.data} receiverId={receiverId} sendNoticeId={sendNoticeId} />
    </div>
  )
}

export default UserManagement