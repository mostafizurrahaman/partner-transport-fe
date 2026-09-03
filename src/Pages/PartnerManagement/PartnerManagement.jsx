import { Form, Input, Modal, Pagination, Popconfirm, Switch, Table } from 'antd'
import React, { useEffect, useState } from 'react'
import { CiSearch } from 'react-icons/ci'
import { FaArrowLeft } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { IoEyeOutline } from 'react-icons/io5'
import { BsChatLeftText } from 'react-icons/bs'
import { CgNotes } from 'react-icons/cg'
import TextArea from 'antd/es/input/TextArea'
import { useBlockUnBlockPartnerMutation, useDeletePartnerMutation, useGetAllPartnerQuery, useSendNoticePartnerMutation } from '../../redux/api/partnerManagementApi'
import { imageUrl } from '../../redux/api/baseApi'
import { toast } from 'sonner'
import { useGetAdminProfileQuery } from '../../redux/api/authApi'
import { useGetMessageQuery } from '../../redux/api/userManagementApi'
import ChatModal from '../../Components/ChatModal/ChatModal'
import { RiDeleteBin6Line } from 'react-icons/ri'
import { useGetAllVariableQuery } from '../../redux/api/variableManagementApi'
import Loading from '../../Components/Loading/Loading'
const PartnerManagement = () => {
  const [form] = Form.useForm()
  const [page, setPage] = useState(1)
  const [searchTerms, setSearchTerms] = useState('')
  const [sendAllChecked, setSendAllChecked] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [sendNoticeId, setSendNoticeId] = useState('')

  // Partner Management api
    const { data: allVariables } = useGetAllVariableQuery()
  const perDollarMexicanPeso = allVariables?.data?.perDollarMexicanPeso || 20
  // console.log(perDollarMexicanPeso);
  const { data: getAllPartner, isLoading } = useGetAllPartnerQuery({ page, searchTerms });
  const [sendNoticePartner] = useSendNoticePartnerMutation()
  const [blockUnblockPartner] = useBlockUnBlockPartnerMutation()
  const [deletePartner] = useDeletePartnerMutation() 

  const [receiverId, setReceiverId] = useState('')
  const [senderId, setSenderId] = useState('')
  const [openChatModal, setOpenChatModal] = useState(false)

  const { data: userId } = useGetAdminProfileQuery()
  useEffect(() => {
    setReceiverId(userId?.data?._id)
  }, [userId])

  const { data: getMessage } = useGetMessageQuery({ senderId: senderId, receiverId: receiverId })



  const onChange = (checked) => {
    const data = {
      role: checked?.role,
      email: checked?.email,
      is_block: !checked?.isBlock
    }
    blockUnblockPartner(data).unwrap()
      .then((payload) => toast.success(payload?.message))
      .catch((error) => toast.error(error?.data?.message));
  }

  // Send notice function
  const handleSendNotice = (data) => {
    sendNoticePartner({ data, sendAllChecked, sendNoticeId }).unwrap()
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

  // console.log(getAllPartner?.data?.meta);

  const handleDeletePartner =(id)=>{
    deletePartner(id).unwrap()
    .then((payload) => toast.success(payload?.message))
    .catch((error) => toast.error(error?.data?.message));
  }

  const formattedTable = getAllPartner?.data?.data?.map((partner, i) => {
    return (
      {
        id: partner?._id,
        key: i + 1,
        name: partner?.name,
        img: `${imageUrl}${partner?.profile_image}`,
        email: partner?.email,
        contactNumber: partner?.phone_number,
        location: partner?.city,
        accountHolderName: partner?.bank_holder_name,
        HolderType: partner?.bank_holder_type,
        accountNumber: partner?.bank_holder_number,
        routing: partner,
        dob: partner?.date_of_birth,
        walletBalance: partner?.wallet?.toFixed(2),
        walletBalanceMxn: (partner?.wallet * perDollarMexicanPeso).toFixed(2),

        // businessName: 'Governance structures',
        // website: 'www.google.com',
        line: partner?.routing_number,
        city: partner?.city,
        state: partner?.status,
        postalCode: partner?.address_postal_code,
        role: partner?.authId?.role,
        isBlock: partner?.authId?.is_block

      }
    )
  })
  const columns = [
    {
      title: "ID's",
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
    // {
    //   title: "Location",
    //   dataIndex: "location",
    //   key: "location",
    // },
    {
      title: "Wallet Balance (USD)",
      dataIndex: "walletBalance",
      key: "walletBalance",
      render: (text, record) => {
        return (
          <p>{record?.walletBalance} USD</p>
        )
      }
    },
    {
      title: "Wallet Balance (MXN)",
      dataIndex: "walletBalanceMxn",
      key: "walletBalanceMxn",
      render: (text, record) => {
        return (
          <p>{record?.walletBalanceMxn} MXN</p>
        )
      }

    },

    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (_, record) => (
        <div className='flex items-center gap-2'>
          <Switch size='small' checked={record?.isBlock} onChange={() => onChange(record)} />
          {/* <p>{isActive ? 'Activate' : 'Deactivate'}</p> */}

          {/* <p>Active</p> */}
        </div>
      ),
    },
    {
      title: "View Details",
      dataIndex: "viewDetails",
      key: "viewDetails",
      render: (_, record) => {
        return (
          <div className='flex items-center '>
            <Link to={`/partner-management/${record?.id}`} style={{ color: "white" }} className=' cursor-pointer bg-blue-500 text-white p-2 rounded-md'><IoEyeOutline size={20} /></Link>
          </div>
        )
      },
    },
    {
      title: "Notice",
      dataIndex: "notice",
      key: "notice",
      render: (_, record) => (
        <div className='flex items-center '>
          <div style={{ color: "white" }} onClick={() => {
            setOpenModal(true)
            setSendNoticeId(record?.id)
          }} className=' cursor-pointer bg-[#FF5454] text-white p-2 rounded-md'><CgNotes size={20} /></div>
        </div>
      ),
    },
    {
      title: "Chat",
      dataIndex: "chat",
      key: "chat",
      render: (_, record) => (
        <div className='flex items-center '>
          <div style={{ color: "white" }} onClick={() => {
            setOpenChatModal(true)
            setSenderId(record?.id)
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
            onConfirm={() => handleDeletePartner(record?.id)}
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



  return (
    <div className='p-5 bg-white rounded-md'>

      <div className="flex justify-between item-center ">
        <div className="flex items-center gap-2">
          <Link to={-1}><FaArrowLeft size={18} className='text-[var(--primary-color)] ' /></Link>
          <span className='font-semibold text-[20px]'>Partner Management</span></div>
        <div>
          <div className="relative">
            <input
              type="text"
              onChange={(e) => setSearchTerms(e.target.value)}
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
        {isLoading ? <Loading type="table" /> : <Table dataSource={formattedTable} columns={columns} className="custom-pagination" pagination={false} />}
        <div className='flex items-center justify-center py-2'>
          <Pagination
            onChange={(page) => setPage(page)}
            pageSize={getAllPartner?.data?.meta?.limit}
            total={getAllPartner?.data?.meta?.total}
          />
        </div>
      </div>

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
      {/* <ConversationModal setOpenConversationModal={setOpenConversationModal} openConversationModal={openConversationModal} /> */}
      <ChatModal openChatModal={openChatModal} setOpenChatModal={setOpenChatModal} data={getMessage?.data} receiverId={receiverId} sendNoticeId={senderId} />

    </div>
  )
}

export default PartnerManagement