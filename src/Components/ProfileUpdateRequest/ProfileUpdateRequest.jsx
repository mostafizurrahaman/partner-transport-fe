import { Modal, Table, Image } from 'antd';
import React, { useState } from 'react'
import { IoEyeOutline } from 'react-icons/io5';
import { useApprovedDeclinePartnerMutation } from '../../redux/api/dashboardHomeApi';
import { toast } from 'sonner';
const ProfileUpdateRequest = ({ dataSource }) => {
    // console.log(pagination)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [requestUser, setRequestuser] = useState({})
    // approved api
    const [approvedDeclinePartner] = useApprovedDeclinePartnerMutation()

    console.log("=== requestUser ====", requestUser);

    const handleShowRequestUserDelails = (data) => {
        setIsModalOpen(true)
        setRequestuser(data)
    }

    // -----handle approved user function ----//
    const handleApproved = (email) => {
        const data = {
            partnerEmail: email,
            status: "approved"
        }
        approvedDeclinePartner(data).unwrap()
            .then((payload) => toast.success(payload?.message))
            .catch((error) => toast.error(error?.data?.message));
    }

    //---handle decline partner -----//
    const handleDeclinePartner = (email) => {
        const data = {
            partnerEmail: email,
            status: "declined"
        }
        approvedDeclinePartner(data).unwrap()
            .then((payload) => toast.success(payload?.message))
            .catch((error) => toast.error(error?.data?.message));
    }


    const columns = [
        {
            title: "SL no.",
            dataIndex: "key",
            key: "key",
        },
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            render: (_, record) => {
                return (
                    <div className="flex items-center gap-2">
                        <Image
                            src={record?.img}
                            className="w-[40px] h-[40px] rounded-[8px]"
                            width={40}
                            height={40}
                            preview={false}
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
            key: "email  ",
        },

        {
            title: "Contact Number",
            dataIndex: "contact",
            key: "contact",
        },
        // {
        //     title: "NID/Passport No",
        //     dataIndex: "passport",
        //     key: "contact  ",
        // },

        {
            title: "Actions",
            dataIndex: "key",
            key: "key",
            render: (_, record) => {
                return (
                    <div className="flex items-center justify-center gap-1">
                        <button onClick={() => handleShowRequestUserDelails(record)} className="px-2 py-2 rounded-md text-black font-semibold bg-[var(--secondary-color)]   ">

                            <IoEyeOutline size={25} className='text-white' />
                        </button>
                    </div>
                );
            },
            align: 'center'
        },
        {
            title: "Verification",
            dataIndex: "key",
            key: "key",

            render: (_, record) => {
                return (
                    <div className="flex items-center justify-center gap-1">
                        <button className={`px-6 py-2 rounded-3xl 
                            text-green-500 font-semibold bg-transparent border border-green-500 hover:bg-green-500 hover:text-white`}>
                            <p onClick={() => handleApproved(record?.email)} className='hover:text-white'>
                                Approved
                            </p>
                        </button>
                        <button disabled={record?.status === 'declined'} onClick={() => handleDeclinePartner(record?.email)} className={`px-6 py-2 rounded-3xl font-semibold bg-transparent border  hover:text-white ${record?.status === 'declined' ? "text-gray-400 hover:text-gray-400" : "text-red-600 border-red-600 hover:bg-red-600 "}
`}>
                            <p className=''>
                                Decline
                            </p>
                        </button>
                    </div>
                );
            },
            align: "center",
        },
    ];
    return (
        <div className=''>
            <Table dataSource={dataSource} columns={columns} className="custom-pagination" pagination={false} />
            <Modal open={isModalOpen} centered footer={false} onCancel={() => setIsModalOpen(false)} width={600} >
                <div className='flex flex-col items-center justify-center '>
                    <Image src={requestUser.img} className='w-[80px] h-[80px] rounded-full' width={80} height={80} preview alt="" />
                    <p className='mt-5 font-semibold text-2xl'>{requestUser?.name}</p>
                    <p>{requestUser?.email}</p>
                    <div className='w-full'>
                        <div className='flex justify-between items-center'>
                            <p className='font-semibold mt-5'>Phone Number:</p>
                            <p>{requestUser?.contact}</p>
                        </div>
                        <div className='flex justify-between items-center'>
                            <p className='font-semibold mt-5'>Location:</p>
                            <p>{requestUser?.address}</p>
                        </div>
                        {/* <div className='flex justify-between items-center'>
                            <p className='font-semibold mt-5'>Vehicle Type:</p>
                            <p>{requestUser?.vichelType}</p>
                        </div> */}
                        {/* <div className='flex justify-between items-center'>
                            <p className='font-semibold mt-5'>Vehicle Number:</p>
                            <p>{requestUser?.vichelNumber}</p>
                        </div> */}
                        {/* <div className='flex justify-between items-center'>
                            <p className='font-semibold mt-5'>Location:</p>
                            <p>{requestUser?.location}</p>
                        </div> */}
                        <div className=''>
                            <p className='font-semibold mt-5'>Vehicle Photo:</p>
                            <div className='flex items-center gap-2'>
                                <Image src={requestUser?.vehicleFrontImage} className='mx-auto mt-5 h-40 w-40' width={180} height={180} preview alt="" />
                                <Image src={requestUser?.vehicleBackImage} className='mx-auto mt-5 h-40 w-40' width={180} height={180} preview alt="" />
                                <Image src={requestUser?.vehicleSideImage} className='mx-auto mt-5 h-40 w-40' width={180} height={180} preview alt="" />
                            </div>
                        </div>
                        <div className='grid grid-cols-2 gap-5 mt-2'>
                            <div className='w-full my-2 '>
                                <p className='my-2 font-medium text-xl'>Vehicle license plate:</p>
                                <Image className='h-36 w-60 px-5' width={250} height={180} src={requestUser?.licensePlateImage} preview alt="" />
                                <p className='my-5 font-medium text-xl'>Vehicle insurance photo:</p>
                                <Image className=' px-5 h-36 w-60' width={250} height={180} src={requestUser?.vehicleInsuranceImage} preview alt="" />
                            </div>
                            <div className='w-full my-2'>
                                <p className='my-2 font-medium text-xl'>Driving License:</p>
                                <Image className=' px-5 h-36 w-60' width={250} height={180} src={requestUser?.drivingLicenseImage} preview alt="" />
                                <p className='my-5 font-medium text-xl'>Vehicle registration Card:</p>
                                <Image className=' px-5 h-36 w-60' width={250} height={180} src={requestUser?.vehicleRegistrationCardImage} preview alt="" />

                            </div>
                        </div>
                    </div>
                </div>

            </Modal>
        </div>
    )
}

export default ProfileUpdateRequest