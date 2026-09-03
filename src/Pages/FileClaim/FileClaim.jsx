import { Avatar, Button, Pagination, Select, Space, Table } from 'antd'
import React, { useState } from 'react'
import { CiEdit, CiSearch } from 'react-icons/ci'
import { Link } from 'react-router-dom'
import { FaArrowLeft } from 'react-icons/fa'
import user2 from '../../assets/images/user2.png'
import { EyeOutlined } from '@ant-design/icons';
import PenaltyModal from '../../Components/PenaltyModal'
import ComplainDetailsModal from '../../Components/ComplainDetailsModal'
import { useGetAllFileClaimQuery, useUpdateClaimedStatusMutation } from '../../redux/api/supportApi'
import { imageUrl } from '../../redux/api/baseApi'
import { toast } from 'sonner'
import Loading from '../../Components/Loading/Loading'

const FileClaim = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)
  const [openPenaltyModal, setOpenPenaltyModal] = useState(false)
  const [openComplainModal, setOpenComplainModal] = useState(false)
  const [complainDetails, setComplainDetails] = useState()
  const [serviceId, setServiceId] = useState()

  // console.log(complainDetails);
  // All APIs
  const { data: getAllFileClaim, isLoading } = useGetAllFileClaimQuery({ searchTerm, page });
  const [updateClaimedStatus] = useUpdateClaimedStatusMutation()


  const formattedTableData = getAllFileClaim?.data?.data?.map((file, i) => {
    return (
      {
        key: i + 1,
        complainId: file?._id,
        orderId: file?.serviceId?._id,
        date: file?.createdAt?.split('T')[0],
        userName: file?.serviceId?.mainService === 'move' ? file?.user?.name : file?.serviceId?.confirmedPartner?.name ,
        userAvatar: file?.serviceId?.mainService === 'move' && file?.user?.profile_image
        ? <img src={`${imageUrl}${file?.user?.profile_image}`} alt="Avatar" />
        : file?.serviceId?.user?.profile_image
          ? <img src={`${imageUrl}${file?.serviceId?.user?.profile_image}`} alt="Avatar" />
          : <img src={user2} alt="Avatar" />,
        
        
        complain: file?.description?.slice(0, 20),
        complainAgainst: file?.serviceId?.mainService === 'move' ? file?.serviceId?.confirmedPartner?.name : file?.serviceId?.user?.name,
        complainAgainstAvatar: file?.serviceId?.mainService === 'move' && file?.serviceId?.confirmedPartner?.profile_image
          ? <img src={`${imageUrl}${file?.serviceId?.confirmedPartner?.profile_image}`} alt="Confirmed Partner Avatar" />
          : file?.serviceId?.user?.profile_image
            ? <img src={`${imageUrl}${file?.serviceId?.user?.profile_image}`} alt="Avatar" />
            : <img src={user2} alt="Avatar" />,
        status: file?.status,
        evidence: file?.fileClaimImage
      }
    )
  })

  const handleStatusChange = (value, id) => {

    const data = {
      claimId: id,
      status: value
    }
    updateClaimedStatus(data).unwrap()
      .then((payload) => toast.success(payload?.message))
      .catch((error) => toast.error(error?.data?.message));
  }


  const columns = [
    {
      title: 'Complain ID',
      dataIndex: 'complainId',
      key: 'complainId',
    },
    {
      title: 'Order ID',
      dataIndex: 'orderId',
      key: 'orderId',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'User/Partner Name',
      key: 'user',
      render: (text, record) => (
        <Space>
          <Avatar src={record.userAvatar} />
          {record.userName}
        </Space>
      ),
    },
    {
      title: 'Complain',
      dataIndex: 'complain',
      key: 'complain',
    },
    {
      title: 'Complain Against',
      key: 'complainAgainst',
      render: (text, record) => (
        <Space>

          <Avatar src={record.complainAgainstAvatar} />
          {record.complainAgainst}
        </Space>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (_, status) => {
        let color = '';
        switch (status) {
          case 'pending':
            color = 'blue';
            break;
          case 'Resolved':
            color = 'green';
            break;
          case 'In-progress':
            color = 'orange';
            break;
          default:
            color = 'gray';
        }
        return (
          <>
            {/* <Tag className='rounded-full px-5 py-2' color={color}>{status}</Tag> */}
            <Select
              size={10}
              defaultValue={status?.status}
              onChange={(value) => handleStatusChange(value, status.complainId)}
              style={{
                width: 150,
              }}
              options={[
                { value: 'pending', label: 'Pending' },
                { value: 'in-progress', label: 'In Progress' },
                { value: 'resolved', label: 'Resolved' },
              ]}
            />
          </>
        );
      },
    },
    {
      title: 'View',
      key: 'view',
      render: (_, record) => (
        <Button onClick={() => {
          setOpenComplainModal(true)
          setComplainDetails(record)
        }} type="primary" icon={<EyeOutlined />} />
      ),
    },
    {
      title: 'Penalty',
      key: 'penalty',
      render: (_, record) => (
        <Button onClick={() => {
          setOpenPenaltyModal(true)
          setServiceId(record)
        }} className='bg-red-500 text-white' type="danger" icon={<CiEdit size={20} />} />
      ),
    },
  ];
  return (
    <div className='p-5 bg-white rounded-md'>

      <div className="flex justify-between item-center ">
        <div className="flex items-center gap-2">
          <Link to={-1}><FaArrowLeft size={18} className='text-[var(--primary-color)] ' /></Link>
          <span className='font-semibold text-[20px]'>Support</span></div>
        <div>
          <div className="relative">
            <input
              type="text"
              onChange={(e) => setSearchTerm(e.target?.value)}
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

        {isLoading ? <Loading type="table" /> : <Table columns={columns} dataSource={formattedTableData} className="custom-pagination" pagination={false} />}
        <div className='flex justify-center mt-5'>
          <Pagination
            current={page}
            onChange={(page) => setPage(page)}
            total={getAllFileClaim?.data?.meta?.total}
            pageSize={getAllFileClaim?.data?.meta?.limit}
          />
        </div>
      </div>

      <PenaltyModal setOpenPenaltyModal={setOpenPenaltyModal} openPenaltyModal={openPenaltyModal} serviceId={serviceId} />
      <ComplainDetailsModal openComplainModal={openComplainModal} setOpenComplainModal={setOpenComplainModal} complainDetails={complainDetails} />
    </div>
  )
}

export default FileClaim