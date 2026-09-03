import { Table } from 'antd'
import React from 'react'
import { CiSearch } from 'react-icons/ci'
import { FaArrowLeft } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import img1 from '../../assets/images/user1.png'
import img2 from '../../assets/images/user2.png'
import { MdBlock } from 'react-icons/md'
import { IoEyeOutline } from 'react-icons/io5'
const Drivers = () => {
  const columns = [
    {
      title: "SL no",
      dataIndex: "key",
      key: "key",
    },
    {
      title: "Driver's Name",
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
      title: "NID/Passport No",
      dataIndex: "nid",
      key: "nid",
    },
    {
      title: "Vehicle Type",
      dataIndex: "vehicleType",
      key: "vehicleType",
    },
    {
      title: "Vehicle Number",
      dataIndex: "vehicleNumber",
      key: "vehicleNumber",
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: () => (
        <div className="flex gap-2">
          <button className="bg-[var(--primary-color)] text-white p-2 rounded">
          <IoEyeOutline size={20} />
          </button>
          <button className="bg-red-500 text-white p-2 rounded">
          <MdBlock size={20} />
          </button>
        </div>
      ),
    },
  ];



  const dataSource = [
    {
      key: "#12333",
      name: "Kathryn Murp",
      img: img1, // Replace 'img1' with the actual image import or URL
      email: "bockely@att.com",
      contactNumber: "(201) 555-0124",
      nid: "759175632578",
      vehicleType: "Car",
      vehicleNumber: "KH01 AE2342",
    },
    {
      key: "#12334",
      name: "Devon Lane",
      img: img2, // Replace 'img2' with the actual image import or URL
      email: "csilvers@rizon.com",
      contactNumber: "(219) 555-0114",
      nid: "759175632578",
      vehicleType: "Bike",
      vehicleNumber: "KH01 AE2342",
    },
    {
      key: "#12335",
      name: "Foysal Rahman",
      img: img1, // Replace 'img3' with the actual image import or URL
      email: "qamaho@gmail.com",
      contactNumber: "(316) 555-0116",
      nid: "759175632578",
      vehicleType: "Pickup",
      vehicleNumber: "KH01 AE2342",
    },
    {
      key: "#12336",
      name: "Hari Danang",
      img: img1, // Replace 'img4' with the actual image import or URL
      email: "xterris@gmail.com",
      contactNumber: "(907) 555-0101",
      nid: "759175632578",
      vehicleType: "Car",
      vehicleNumber: "KH01 AE2342",
    },
    {
      key: "#12337",
      name: "Floyd Miles",
      img: img2, // Replace 'img5' with the actual image import or URL
      email: "xterris@gmail.com",
      contactNumber: "(505) 555-0125",
      nid: "759175632578",
      vehicleType: "Bike",
      vehicleNumber: "KH01 AE2342",
    },
    
  ];


  return (
    <div className='p-5 bg-white rounded-md'>

      <div className="flex justify-between item-center ">
        <div className="flex items-center gap-2">
          <Link to={-1}><FaArrowLeft size={18} className='text-[var(--primary-color)] ' /></Link>
          <span className='font-semibold text-[20px]'>Driver</span></div>
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

      {/* User Management table */}
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

export default Drivers