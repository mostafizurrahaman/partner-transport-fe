import { Pagination, Table } from 'antd'
import React, { useState } from 'react'
import { CiSearch } from 'react-icons/ci'
import { Link } from 'react-router-dom'
import { FaArrowLeft } from 'react-icons/fa'
import { MdOutlineMessage } from 'react-icons/md'
import { IoEyeOutline } from 'react-icons/io5'
import ConversationModal from '../../Components/ConversationModal/ConversationModal'
import { useGetAllTransactionQuery } from '../../redux/api/transactionApi'
import { imageUrl } from '../../redux/api/baseApi'
import { useGetConversationQuery } from '../../redux/api/auctionManagementApi'
import { skipToken } from '@reduxjs/toolkit/query/react'
import { useGetAllVariableQuery } from '../../redux/api/variableManagementApi'
import Loading from '../../Components/Loading/Loading'
import { render } from 'react-dom'
const Transaction = () => {
  const [page, setPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [openConversationModal, setOpenConversationModal] = useState(false)
  const [senderId, setSendId] = useState()
  const [receiverId, setReceiveId] = useState()
  const [serviceId, setServiceId] = useState()


  //-------- transaction all api ---------//
  const { data: allVariables } = useGetAllVariableQuery()
  const perDollarMexicanPeso = allVariables?.data?.perDollarMexicanPeso || 20
  const { data: getAllTransaction, isLoading } = useGetAllTransactionQuery({ page, searchTerm })
  // console.log(getAllTransaction?.data?.result);

  const { data: getConversation, isLoading: isLoadingConversation, error } = useGetConversationQuery(
    senderId && receiverId
      ? { senderId, receiverId, serviceId }
      : skipToken
  );


  const columns = [
    {
      title: "Transaction ID",
      dataIndex: 'orderId',
      key: 'orderId'
    },
    {
      title: "Date", dataIndex: 'date', key: 'date'
    },
    {
      title: 'Sender', dataIndex: 'user', render: (text, record) => {
        return (
          <div className='flex items-center gap-2'>
            <img src={record?.userImg} style={{ width: 60, height: 60 }} alt="" />
            <p className='font-medium'>{record?.userName}</p>
          </div>

        )
      }
    },
    {
      title: 'Receiver', dataIndex: 'partner', render: (text, record) => {
        return (
          <div className='flex items-center gap-2'>
            <img src={record?.partnerImage} style={{ width: 60, height: 60 }} alt="" />
            <p className='font-medium'>{record?.partnerName}</p>
          </div>

        )
      }
    },
    {
      title: "Type", dataIndex: 'itemType', key: 'itemType'
    },
    // {
    //   title: "Category", dataIndex: 'category', key: 'category'
    // },
    {
      title: "Win Bid (USD)", dataIndex: 'winBid', key: 'winBid',
      render: (text, record) => {
        return (
          <p>{record?.winBid} USD</p>
        )
      }
    },
    {
      title: "Win Bid (MXN)", dataIndex: 'winBid', key: 'winBid',
      render: (text, record) => {
        return (
          <p>{(record?.winBid * perDollarMexicanPeso).toFixed(2)} MXN</p>
        )
      }
    },

    {
      title: "Payment Status", dataIndex: 'status', key: 'status'
    },
    {
      title: <div style={{ textAlign: 'end', fontWeight: 'bold' }}>Details</div>, dataIndex: 'key', key: 'key', render: (_, record) => {
        return (
          <div className='flex items-center justify-end  '>
            <Link to={`/transaction/${record?.id}`} className='bg-[var(--secondary-color)] text-white p-2 rounded-md '><IoEyeOutline size={20} /></Link>
          </div>
        )
      }
    },
    {
      title: "Chat", dataIndex: 'key', key: 'key', render: (_, record) => {
        return (
          <div className='flex items-center '>
            <div style={{ color: "white" }} onClick={() => {
              setSendId(record?.senderId)
              setReceiveId(record?.receiverId)
              setServiceId(record?.serviceId)
              setOpenConversationModal(true)

            }} className=' cursor-pointer bg-yellow-500 text-white p-2 rounded-md'><MdOutlineMessage size={20} /></div>
          </div>
        )
      }
    },

  ]

  const formattedTableData = getAllTransaction?.data?.result?.map((transaction, i) => {

    return (
      {
        id: transaction?._id,
        orderId: transaction?.transactionId,
        senderId: transaction?.payUser?._id,
        receiverId: transaction?.receiveUser?._id,
        serviceId: transaction?.serviceId?._id || transaction?.serviceId,
        date: transaction?.createdAt?.split('T')[0],
        userImg: `${imageUrl}${transaction?.payUser?.profile_image}`,
        userName: transaction?.payUser?.name,
        partnerName: transaction?.receiveUser?.name,
        partnerImage: `${imageUrl}${transaction?.receiveUser?.profile_image}`,
        itemType: transaction?.payType,
        // category: transaction?.serviceId?.category[0]?.category,
        winBid: transaction?.amount,
        actionRefund: false,
        status: transaction?.paymentStatus,

      }
    )
  })



  const handleRefund = () => {
    setRefundModal(true)
  }



  /** item category and status search functionality */
  const handleChange = (value) => {
    console.log(value);
  }

  return (
    <div className='p-5 bg-white rounded-md'>

      <div className="flex justify-between item-center ">
        <div className="flex items-center gap-2">
          <Link to={-1}><FaArrowLeft size={18} className='text-[var(--primary-color)] ' /></Link>
          <span className='font-semibold text-[20px]'>Transaction</span></div>
        <div>
          <div className="relative">
            <input
              type="text"
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search here..."
              className="w-full pl-10 pr-4 py-1 rounded-md border border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 "
            />
            <span className="absolute left-3 top-2.5 text-gray-400">

              <CiSearch />
            </span>
          </div>
        </div>
      </div>


      <div className='mt-5'>
        {isLoading ? <Loading type="table" /> : <Table title={() => (
          <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '16px' }}>

          </div>
        )} className="custom-pagination" columns={columns} dataSource={formattedTableData} pagination={false} />}
        <div className='flex justify-center mt-4'>
          <Pagination
            onChange={(page) => setPage(page)}
            pageSize={getAllTransaction?.data?.meta?.limit}
            current={getAllTransaction?.data?.meta?.page}
            total={getAllTransaction?.data?.meta?.total}
          />
        </div>
      </div>

      <ConversationModal setOpenConversationModal={setOpenConversationModal} openConversationModal={openConversationModal} getConversation={getConversation} senderId={senderId} serviceId={serviceId} isLoading={isLoadingConversation} />
    </div>
  )
}

export default Transaction