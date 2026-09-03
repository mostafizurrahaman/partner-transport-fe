import React, { useState } from 'react';
import PageName from '../../Components/Shared/PageName';
import { Form, Input, Modal, Pagination, Table } from 'antd';
import { IoEyeOutline } from 'react-icons/io5'; 
import { useGetAllBankTransferQuery, usePaymentBankTransferMutation } from '../../redux/api/variableManagementApi';
import { imageUrl } from '../../redux/api/baseApi';
import { toast } from 'sonner';
import UserOpenModals from '../../Components/UserOpenModal/UserModalsOpen';
import Loading from '../../Components/Loading/Loading';

const BankTransfer = () => {
  const [page, setPage] = useState(1)
  const [transferId, setTransferId] = useState('')
  const [singleUser, setSingleUser] = useState()
  const [openUserModal, setUserOpenModals] = useState(false)
  const [openBankTransferModal, setOpenBankTransferModal] = useState(false)
  // Get All API
  const { data: getAllBankTransfer, isLoading } = useGetAllBankTransferQuery(page);
  const [paymentBankTransfer] = usePaymentBankTransferMutation()

  const onFinish = (values) => {
   
    const data = {
      withdrawId: transferId,
      bankTransferId: values?.bankTransferId
    }
    paymentBankTransfer(data).unwrap()
      .then((payload) => {
        toast.success(payload?.message)
        setOpenBankTransferModal(false)
      })
      .catch((error) => toast.error(error?.data?.message));
  }

  const dataSource = getAllBankTransfer?.data?.result?.map((user, i) => {
    return (
      {
        key: i + 1,
        id: user?._id,
        name: user?.name,
        role: user?.userType,
        img: `${imageUrl}${user?.user?.profile_image}`,
        email: user?.user?.email,
        contactNumber: user?.user?.phone_number,
        location: user?.user?.address_city,
        accountHolderName: user?.user?.bank_holder_name,
        HolderType: user?.user?.bank_holder_type,
        accountNumber: user?.user?.bank_account_number,
        routing: user?.user?.routing_number,
        dob: user?.user?.date_of_birth,
        line: user?.user?.address_line,
        city: user?.user?.address_city,
        state: user?.user?.address_state,
        postalCode: user?.user?.address_postal_code,
        requestAmount: `$${user?.request_amount}`,
        totalBalance: user?.user?.wallet,
        // accountNo: '4256875521',
        status: user?.status

      }
    )
  })


  const columns = [

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
      title: 'Role', dataIndex: 'role', key: 'role'
    },
    {
      title: "Request Amount",
      dataIndex: "requestAmount",
      key: "requestAmount",
    },
    {
      title: "Total Balance",
      dataIndex: "totalBalance",
      key: "totalBalance",
    },

    {
      title: "Account No.",
      dataIndex: "accountNo",
      key: "accountNo",
    },
    {
      title: "Status", dataIndex: 'status', key: 'status', render: (text, record) => {
        return (
          <>
            {
              record?.status === "Completed" ? (<div className={` text-center border rounded-full py-1 ${record?.status === 'Completed' ? ' border-[#2AB9A4] text-[#2AB9A4]' : ""}`}>{record?.status}</div>) : (<button onClick={() => {
                setOpenBankTransferModal(true)
                setTransferId(record?.id)
              }} className='border-[#338BFF] text-[#338BFF] text-center border rounded-full py-1 w-full'>{record?.status}</button>)
            }

          </>
        )
      }
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
  ];
  return (
    <div className='p-2 bg-white rounded-md'>
      <PageName name={'Bank Transfer'} />
      <div className='mt-5'>
        {isLoading ? <Loading type="table" /> : <Table dataSource={dataSource} columns={columns} className="custom-pagination" pagination={false} />}
        <div className='flex items-center justify-center py-2'>
          <Pagination
            onChange={(page) => setPage(page)}
            pageSize={getAllBankTransfer?.data?.meta?.limit}
            total={getAllBankTransfer?.data?.meta?.totalPage}
          />
        </div>
      </div>

      <UserOpenModals singleUser={singleUser} setUserOpenModals={setUserOpenModals} openUserModal={openUserModal} />

      <Modal centered footer={false} open={openBankTransferModal} onCancel={() => setOpenBankTransferModal(false)}>
        <p className='text-center text-xl font-medium mb-2'>Status</p>
        <Form layout='vertical' onFinish={onFinish}>
          <Form.Item name='bankTransferId' label='Transaction ID'>
            <Input />
          </Form.Item>
          <div className='flex items-center gap-2'>
            <button type='submit' className='bg-black text-white px-4 rounded-full py-2 w-full'>Complete</button>
            <button onClick={() => setOpenBankTransferModal(false)} type='button' className='border-black text-black border px-4 rounded-full py-2 w-full'>Close</button>
          </div>
        </Form>
      </Modal>

    </div>
  );
}

export default BankTransfer;
