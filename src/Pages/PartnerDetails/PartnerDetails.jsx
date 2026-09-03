import React, { useState } from 'react'
import { FaArrowLeft, FaStar, FaRegStar } from 'react-icons/fa'
import { Link, useParams } from 'react-router-dom'
import { useGetPartnerDetailsQuery, useGetPartnerReviewsQuery } from '../../redux/api/partnerManagementApi'
import { imageUrl } from '../../redux/api/baseApi'
import { Image } from 'antd'
import Loading from '../../Components/Loading/Loading'

const PartnerDetails = () => {
    const { id } = useParams()
    //Get partner details api
    const { data: getPartnerDetails, isLoading } = useGetPartnerDetailsQuery(id)
    const { data: reviewsData, isLoading: reviewsLoading } = useGetPartnerReviewsQuery(getPartnerDetails?.data?._id, {
        skip: !getPartnerDetails?.data?._id
    })

    const [activeTab, setActiveTab] = useState('basic')

    const partner = getPartnerDetails?.data;
    const reviews = reviewsData?.data || [];

    const fullAddress = [
        partner?.street,
        partner?.exterior_number,
        partner?.interior_number,
        partner?.city,
        partner?.state,
        partner?.country
    ].filter(Boolean).join(", ");

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, i) => (
            i < rating
                ? <FaStar key={i} className="text-yellow-400" />
                : <FaRegStar key={i} className="text-yellow-400" />
        ))
    }

    return (
        <div className=' bg-white p-5 rounded-md'>
            <div className='flex  items-center gap-2 '>
                <Link to={-1}><FaArrowLeft size={20} className='text-blue-600' /></Link>
                <p className='font-semibold text-[20px]'>Partner Details</p>
            </div>
            {isLoading ? <Loading type="detail" /> : <div>
                <div className='flex flex-col justify-center items-center'>
                    <Image className='w-36 rounded-full' width={100} height={100} src={`${imageUrl}${getPartnerDetails?.data?.profile_image}`} alt="" />
                    <p className='text-xl font-medium mt-2'>{getPartnerDetails?.data?.name}</p>
                    {partner?.rating > 0 && (
                        <div className='flex items-center gap-1 mt-1'>
                            {renderStars(Math.round(partner.rating))}
                            <span className='text-gray-500 text-sm ml-1'>({partner.rating.toFixed(1)})</span>
                        </div>
                    )}
                </div>

                <div className='flex items-center justify-center gap-5 mt-5'>
                    <p onClick={() => setActiveTab('basic')} className={`cursor-pointer font-medium ${activeTab === 'basic' ? 'text-blue-600 border-b border-b-blue-600' : ''}`}>Basic Info</p>
                    <p onClick={() => setActiveTab('bank')} className={`cursor-pointer font-medium ${activeTab === 'bank' ? 'text-blue-600 border-b border-b-blue-600' : ''}`}>Bank Info</p>
                    <p onClick={() => setActiveTab('reviews')} className={`cursor-pointer font-medium ${activeTab === 'reviews' ? 'text-blue-600 border-b border-b-blue-600' : ''}`}>Reviews</p>
                </div>
                {
                    activeTab === 'basic' ? <div className='max-w-lg mx-auto mt-10 space-y-3'>
                        <p className='flex items-center justify-between'><span className='font-medium'>Email:</span> <span className='text-gray-500'>{getPartnerDetails?.data?.email}</span></p>
                        <p className='flex items-center justify-between'><span className='font-medium'>Phone Number:</span> <span className='text-gray-500'>{getPartnerDetails?.data?.phone_number ? getPartnerDetails?.data?.phone_number : "N/A"}</span></p>
                        <p className='flex items-center justify-between'><span className='font-medium'>Location:</span> <span className='text-gray-500'>{ }{getPartnerDetails?.data?.city},{getPartnerDetails?.data?.state},{getPartnerDetails?.data?.country}</span></p>

                        <div>
                            <p>Vehicle Photos: </p>
                            <div className='mt-5 flex gap-2  justify-between'>
                                <Image className='w-36' width={160} height={300} src={`${imageUrl}${getPartnerDetails?.data?.vehicleFrontImage}`} alt="" />
                                <Image className='w-36' width={160} height={300} src={`${imageUrl}${getPartnerDetails?.data?.vehicleSideImage}`} alt="" />
                                <Image className='w-36' width={160} height={300} src={`${imageUrl}${getPartnerDetails?.data?.vehicleBackImage}`} alt="" />
                            </div>
                        </div>
                        <div className='grid grid-cols-2 gap-5'>
                            <div className='w-full my-2 '>
                                <p className='my-2 font-medium text-xl'>Vehicle license plate:</p>
                                <Image className='w-44 h-36' width={250} height={300} src={`${imageUrl}${getPartnerDetails?.data?.licensePlateImage}`} alt="" />
                                <p className='my-5 font-medium text-xl'>Vehicle insurance photo:</p>
                                <Image className='w-full h-36' width={250} height={300} src={`${imageUrl}${getPartnerDetails?.data?.vehicleInsuranceImage}`} alt="" />

                            </div>
                            <div className='w-full my-2'>
                                <p className='my-2 font-medium text-xl'>Driving License:</p>
                                <Image className='w-44 h-36' width={250} height={300} src={`${imageUrl}${getPartnerDetails?.data?.drivingLicenseImage}`} alt="" />
                                <p className='my-5 font-medium text-xl'>Vehicle registration card :</p>
                                <Image className='w-full h-36' width={250} height={300} src={`${imageUrl}${getPartnerDetails?.data?.vehicleRegistrationCardImage}`} alt="" />

                            </div>
                        </div>
                    </div> : activeTab === 'bank' ? <div className='max-w-lg mx-auto mt-10 space-y-3'>
                        <p className='flex items-center justify-between'><span className=''>Bank Name:</span> <span className='text-gray-500'>{getPartnerDetails?.data?.bank_name}</span></p>
                        <p className='flex items-center justify-between'><span className=''>Account Holder Name:</span> <span className='text-gray-500'>{getPartnerDetails?.data?.bank_holder_name}</span></p>
                        <p className='flex items-center justify-between'><span className=''>Account Number:</span> <span className='text-gray-500'>{getPartnerDetails?.data?.bank_account_number
                        }</span></p>
                        <p className='flex items-center justify-between'><span className=''>Routing Number:</span> <span className='text-gray-500'>{getPartnerDetails?.data?.
                            routing_number}</span></p>

                        <p className='flex items-center justify-between'><span className=''>Date of Birth:</span> <span className='text-gray-500'>{getPartnerDetails?.data?.date_of_birth}</span></p>
                        <p>Address: {fullAddress || "N/A"} </p>
                        <p className='flex items-center justify-between'><span className=''>City :</span> <span className='text-gray-500'>{getPartnerDetails?.data?.city}</span></p>
                        <p className='flex items-center justify-between'><span className=''>State :</span> <span className='text-gray-500'>{getPartnerDetails?.data?.state}</span></p>
                        <p className='flex items-center justify-between'><span className=''>Country :</span> <span className='text-gray-500'>{getPartnerDetails?.data?.country}</span></p>
                        <p className='flex items-center justify-between'><span className=''>Postal Code :</span> <span className='text-gray-500'>{getPartnerDetails?.data?.address_postal_code}</span></p>
                    </div> : <div className='max-w-2xl mx-auto mt-10'>
                        {reviewsLoading ? <Loading /> : reviews.length === 0 ? (
                            <p className='text-center text-gray-500'>No reviews yet</p>
                        ) : (
                            <div className='space-y-4'>
                                <p className='font-medium text-lg'>All Reviews ({reviews.length})</p>
                                {reviews.map((review) => (
                                    <div key={review._id} className='border rounded-lg p-4'>
                                        <div className='flex items-center gap-3'>
                                            <img
                                                src={review?.userId?.profile_image ? `${imageUrl}${review.userId.profile_image}` : '/default-avatar.png'}
                                                className='w-10 h-10 rounded-full object-cover'
                                                alt=""
                                            />
                                            <div>
                                                <p className='font-medium'>{review?.userId?.name || 'Unknown User'}</p>
                                                <p className='text-gray-400 text-xs'>{new Date(review.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                            </div>
                                            <div className='ml-auto flex items-center gap-1'>
                                                {renderStars(review.rating)}
                                            </div>
                                        </div>
                                        <p className='mt-3 text-gray-600'>{review.comment}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                }
            </div>}
        </div>
    )
}

export default PartnerDetails