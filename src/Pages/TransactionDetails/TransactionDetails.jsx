import React from 'react'
import PageName from '../../Components/Shared/PageName'
import img1 from '../../assets/images/prod1.png'
import img2 from '../../assets/images/prod2.png'
import img3 from '../../assets/images/prod3.png'
import img4 from '../../assets/images/prod4.png'
import img5 from '../../assets/images/mob1.png'
import img6 from '../../assets/images/mob2.png'
import img7 from '../../assets/images/mob3.png'
import { useParams } from 'react-router-dom'
import { useGetSingleTransactionQuery } from '../../redux/api/transactionApi'
import { imageUrl } from '../../redux/api/baseApi'
import Loading from '../../Components/Loading/Loading'
const TransactionDetails = () => {
    const { id } = useParams()
    const { data: getSingleData, isLoading } = useGetSingleTransactionQuery(id)
    console.log(getSingleData?.data);
    return (
        <div className='bg-white rounded-md p-5'>
            <PageName name={'Details'} />

            {isLoading ? <Loading type="detail" /> : <div className='max-w-4xl mx-auto mt-10'>
                <div className='flex items-center justify-between'>
                    <p className='font-medium'>User Name : </p>
                    <p>{getSingleData?.data?.payUser?.name}</p>
                </div>
                <div>
                    <p>Items Image</p>
                    <div className='flex items-center  mt-5 gap-5 '>
                        {
                            getSingleData?.data?.serviceId?.image?.map((img, i) => {
                                return (
                                    <img key={i+1} src={`${imageUrl}${img}`} className='h-52 rounded-md  object-contain' alt="" />
                                )
                            })
                        }

                    </div>
                </div>
                <div className='mt-5 space-y-2'>

                    <p className='flex items-center justify-between '><span className='font-medium'>Date : </span> <span>{getSingleData?.data?.createdAt?.split('T')[0]}</span> </p>
                    <p className='flex items-center justify-between'><span className='font-medium'>Category : </span> <span>{getSingleData?.data?.serviceId?.category[0]?.category}</span> </p>
                    <p className='flex items-center justify-between'><span className='font-medium'>Amount : </span> <span>{getSingleData?.data?.amount}</span> </p>
                    {/* <p className='flex items-center justify-between'><span className='font-medium'>Measurement: </span> <span>24 mts</span> </p> */}
                    <p className='flex items-center justify-between'><span className='font-medium'>Weight: </span> <span>{getSingleData?.data?.serviceId?.weightKG} kg</span> </p>
                    <p className='flex items-center justify-between'><span className='font-medium'>Loading Floor: </span> <span>{getSingleData?.data?.serviceId?.loadFloorNo} Floor</span> </p>
                    <p className='flex items-center justify-between'><span className='font-medium'>Unloading Floor: </span> <span>{getSingleData?.data?.serviceId?.unloadFloorNo} Floor</span> </p>
                    <p className='flex items-center justify-between'><span className='font-medium'>Loading Address: </span> <span>{getSingleData?.data?.serviceId?.loadingAddress}</span> </p>
                    <p className='flex items-center justify-between'><span className='font-medium'>Unloading Address: </span> <span>{getSingleData?.data?.serviceId?.loadingAddress}</span> </p>
                    <p className='flex items-center justify-between'><span className='font-medium'>Distance: </span> <span>1.5 km</span> </p>
                    <p className='flex  justify-between gap-5'><span className='font-medium'>Description: </span> <span>{getSingleData?.data?.serviceId?.description}</span> </p>
                    <p className='flex  justify-between gap-5'><span className='font-medium'> Auction Deadline</span> <span>{getSingleData?.data?.serviceId?.deadlineDate?.split('T')[0]} {getSingleData?.data?.serviceId?.deadlineTime}</span> </p>
                    <p className='flex  justify-between gap-5'><span className='font-medium'>Service Date</span> <span>12/08/24 at 10 PM</span> </p>
                    <p className='flex  justify-between gap-5'><span className='font-medium'>Minimum Price</span> <span>$25</span> </p>
                    <p className='flex  justify-between gap-5'><span className='font-medium'>Maximum Price</span> <span>$65</span> </p>
                    <p className='flex  justify-between gap-5'><span className='font-medium'>Status : </span> <span>In Progress</span> </p>
                    <p className='flex  justify-between gap-5'><span className='font-medium'>Complain: </span> <span>I am writing to express my dissatisfaction with the service provided by XYZ Transport on October 10, 2024. I had scheduled a pickup for my household goods to be transported to my new residence. Unfortunately, the service was far below my expectations.</span> </p>
                    <p className='flex  justify-between gap-5'><span className='font-medium'>Complain Against:</span> <span>Mike Jon</span> </p>
                    <p className='font-medium'>Evidence: </p>
                    <div className='flex  items-center gap-5'>
                        {
                            getSingleData?.data?.serviceId?.image?.map((image, i)=>{
                                return (
                                    <img key={i+1} src={`${imageUrl}${image}`}  className='h-52 rounded-md  object-contain' alt="" />

                                )
                            })
                        }
                        {/* <img src={img6} alt="" />
                        <img src={img7} alt="" /> */}
                    </div>
                    <p className='flex  justify-between gap-5 pt-10'><span className='font-medium'>Penalty:${`(%)`} </span> <span>20%</span> </p>
                    <p className='flex  justify-between gap-5'><span className='font-medium'>Reason of Penalty: </span> <span>Product was broken</span> </p>


                </div>


            </div>}

        </div>
    )
}

export default TransactionDetails