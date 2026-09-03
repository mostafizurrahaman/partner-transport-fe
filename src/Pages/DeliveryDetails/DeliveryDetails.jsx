import { Table } from 'antd'
import React from 'react'
import { CiSearch } from 'react-icons/ci'
import { FaArrowLeft } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import img1 from '../../assets/images/user1.png'
import img2 from '../../assets/images/user2.png'

const DeliveryDetails = () => {

  const columns = [
    {
      title: "Order ID",
      dataIndex: "key",
      key: "key",
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
      title: "Delivery Date",
      dataIndex: "deliveryDate",
      key: "deliveryDate  ",
    },

    {
      title: "Driver Name",
      dataIndex: "driverName",
      key: "driverName",
    },
    {
      title: "Deliver Fee",
      dataIndex: "deliveryFee",
      key: "deliveryFee",
    },
    {
      title: "Pickup  Location",
      dataIndex: "pickupLocation",
      key: "pickupLocation",
    },
    {
      title: "Delivery Address",
      dataIndex: "deliveryAddress",
      key: "deliveryAddress",
    },


    {
      title: "Status",
      dataIndex: "status",
      key: "status",

      render: (_, record) => {
        return (
          <div className="flex items-center justify-center gap-1">
            <button
              className={`px-8 py-2 rounded-3xl font-semibold  border 
    ${record?.status === 'pending' ? 'border-yellow-500 text-yellow-500 hover:bg-yellow-500' :
                  record?.status === 'complete' ? 'border-[var(--primary-color)] text-[var(--primary-color)] hover:bg-[var(--primary-color)] hover:text-white' :
                    record?.status === 'canceled' ? 'border-red-500 text-red-500 hover:bg-red-500' : ''} 
    hover:text-white`}
            >
              <Link to={`/single-user-details/id`} className='hover:text-white '>
                {record?.status}
              </Link>
            </button>

          </div>
        );
      },
      align: "center",
    },
  ];


  const dataSource = [
    {
      key: "#12333",
      name: "Kathryn Murphy",
      img: img1,
      deliveryDate: "1/04/22",
      driverName: "Cameron Williamson",
      deliveryFee: "$24",
      pickupLocation: "Midland Park, NJ 072",
      deliveryAddress: "West Greenwich, RI7",
      status: "pending"

    },
    {
      key: "#12333",
      name: "Kathryn Murphy",
      img: img2,

      deliveryDate: "2/05/24",
      driverName: "Cameron Williamson",
      deliveryFee: "$20",
      pickupLocation: "Midland Park, NJ 072",
      deliveryAddress: "West Greenwich, RI7",
      status: "complete"
    },
    {
      key: "#12333",
      name: "Devon Lane",
      img: img1,
      deliveryDate: "1/04/22",
      driverName: "Cameron Williamson",
      deliveryFee: "$24",
      pickupLocation: "Midland Park, NJ 072",
      deliveryAddress: "West Greenwich, RI7",
      status: "canceled"
    },
    {
      key: "#12333",
      name: "Devon Lane",
      img: img2,
      deliveryDate: "1/04/22",
      driverName: "Cameron Williamson",
      deliveryFee: "$24",
      pickupLocation: "Midland Park, NJ 072",
      deliveryAddress: "West Greenwich, RI7",
      status: "pending"
    },
  ];
  return (
    <div className='p-5 bg-white rounded-md'>

      <div className="flex justify-between item-center ">
        <div className="flex items-center gap-2">
          <Link to={-1}><FaArrowLeft size={18} className='text-[var(--secondary-color)] ' /></Link>
          <span className='font-semibold text-[20px]'>Delivery Details</span></div>
        <div>
          <div className="relative">
            <input
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


      <div className='mt-5'>
        <Table dataSource={dataSource} columns={columns} className="custom-pagination" pagination={{
          pageSize: 5,
          showTotal: (total, range) => `Showing ${range[0]}-${range[1]} out of ${total}`,
          locale: {
            items_per_page: '',
            prev_page: 'Previous',
            next_page: 'Next',
          },
        }} />
      </div>


    </div>
  )
}

export default DeliveryDetails