import React, { useState } from 'react'
import { FaArrowLeft, FaStar, FaRegStar } from 'react-icons/fa'
import { Link, useParams } from 'react-router-dom'
import {
    useGetPartnerDetailsQuery,
    useGetPartnerRatingsSummaryQuery
} from '../../redux/api/partnerManagementApi'
import { imageUrl } from '../../redux/api/baseApi'
import { Image, Progress, Rate, Tag } from 'antd'
import Loading from '../../Components/Loading/Loading'

const PartnerDetails = () => {
    const { id } = useParams()
    const { data: getPartnerDetails, isLoading } = useGetPartnerDetailsQuery(id)
    const partnerId = getPartnerDetails?.data?._id || id
    const { data: ratingsData, isLoading: ratingsLoading } = useGetPartnerRatingsSummaryQuery(partnerId, {
        skip: !partnerId
    })

    const [activeTab, setActiveTab] = useState('ratings')
    const [starFilter, setStarFilter] = useState('all')

    const partner = getPartnerDetails?.data
    const ratingsSummary = ratingsData?.data?.summary || {}
    const reviews = ratingsData?.data?.reviews || []

    const fullAddress = [
        partner?.street,
        partner?.exterior_number,
        partner?.interior_number,
        partner?.city,
        partner?.state,
        partner?.country
    ].filter(Boolean).join(", ")

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, i) => (
            i < Math.round(rating)
                ? <FaStar key={i} className="text-yellow-400" />
                : <FaRegStar key={i} className="text-yellow-400" />
        ))
    }

    const filteredReviews = reviews.filter((rev) => {
        if (starFilter === 'all') return true
        return Math.round(rev.rating || 0) === Number(starFilter)
    })

    const avgRating = ratingsSummary.averageRating !== undefined 
        ? Number(ratingsSummary.averageRating).toFixed(1)
        : (partner?.rating ? Number(partner.rating).toFixed(1) : "0.0")

    const totalRatingsCount = ratingsSummary.totalReviews || reviews.length || 0

    return (
        <div className='bg-white p-6 rounded-lg shadow-sm'>
            <div className='flex items-center gap-3 border-b pb-4'>
                <Link to={-1} className='p-2 hover:bg-gray-100 rounded-full transition-colors'>
                    <FaArrowLeft size={18} className='text-gray-700' />
                </Link>
                <div>
                    <h1 className='font-bold text-xl text-gray-900'>Partner Profile & Performance</h1>
                    <p className='text-xs text-gray-500'>Detailed overview of operational data, bank info, and verified customer ratings</p>
                </div>
            </div>

            {isLoading ? <Loading type="detail" /> : (
                <div className='mt-6'>
                    {/* Partner Header Card */}
                    <div className='flex flex-col sm:flex-row items-center justify-between gap-6 p-6 bg-gray-50 rounded-xl border border-gray-100'>
                        <div className='flex items-center gap-5'>
                            <Image
                                className='rounded-full object-cover shadow-sm'
                                width={85}
                                height={85}
                                src={partner?.profile_image ? `${imageUrl}${partner.profile_image}` : '/default-avatar.png'}
                                alt={partner?.name}
                            />
                            <div>
                                <div className='flex items-center gap-2'>
                                    <h2 className='text-2xl font-bold text-gray-900'>{partner?.name}</h2>
                                    <Tag color={partner?.is_block ? "red" : "green"}>
                                        {partner?.is_block ? "Blocked" : "Active Partner"}
                                    </Tag>
                                </div>
                                <p className='text-sm text-gray-500 mt-0.5'>{partner?.email} • {partner?.phone_number || "No phone"}</p>
                                <div className='flex items-center gap-2 mt-2'>
                                    <div className='flex items-center text-yellow-400'>
                                        {renderStars(avgRating)}
                                    </div>
                                    <span className='font-bold text-gray-800 text-sm'>{avgRating}</span>
                                    <span className='text-gray-500 text-xs'>({totalRatingsCount} verified ratings)</span>
                                </div>
                            </div>
                        </div>

                        {/* Top Performance Badges */}
                        <div className='flex items-center gap-4 text-center'>
                            <div className='bg-white px-5 py-3 rounded-lg border border-gray-200 shadow-2xs'>
                                <p className='text-xs text-gray-500 font-medium uppercase'>Average Rating</p>
                                <p className='text-xl font-bold text-blue-600 mt-0.5'>★ {avgRating}</p>
                            </div>
                            <div className='bg-white px-5 py-3 rounded-lg border border-gray-200 shadow-2xs'>
                                <p className='text-xs text-gray-500 font-medium uppercase'>Rated Services</p>
                                <p className='text-xl font-bold text-gray-900 mt-0.5'>{totalRatingsCount}</p>
                            </div>
                            <div className='bg-white px-5 py-3 rounded-lg border border-gray-200 shadow-2xs'>
                                <p className='text-xs text-gray-500 font-medium uppercase'>Completed Moves</p>
                                <p className='text-xl font-bold text-emerald-600 mt-0.5'>{ratingsSummary.completedServicesCount || 0}</p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Tabs */}
                    <div className='flex items-center gap-8 mt-6 border-b'>
                        <button
                            onClick={() => setActiveTab('ratings')}
                            className={`pb-3 font-semibold text-sm transition-all border-b-2 ${
                                activeTab === 'ratings'
                                    ? 'text-blue-600 border-blue-600'
                                    : 'text-gray-500 border-transparent hover:text-gray-700'
                            }`}
                        >
                            Ratings & Performance (Feature 8)
                        </button>
                        <button
                            onClick={() => setActiveTab('basic')}
                            className={`pb-3 font-semibold text-sm transition-all border-b-2 ${
                                activeTab === 'basic'
                                    ? 'text-blue-600 border-blue-600'
                                    : 'text-gray-500 border-transparent hover:text-gray-700'
                            }`}
                        >
                            Basic & Vehicle Info
                        </button>
                        <button
                            onClick={() => setActiveTab('bank')}
                            className={`pb-3 font-semibold text-sm transition-all border-b-2 ${
                                activeTab === 'bank'
                                    ? 'text-blue-600 border-blue-600'
                                    : 'text-gray-500 border-transparent hover:text-gray-700'
                            }`}
                        >
                            Bank & Tax Info
                        </button>
                    </div>

                    {/* TAB 1: RATINGS & PERFORMANCE SECTION */}
                    {activeTab === 'ratings' && (
                        <div className='mt-8 space-y-8'>
                            {/* Performance Breakdown Grid */}
                            <div className='grid grid-cols-1 md:grid-cols-12 gap-6'>
                                {/* Left Rating Card */}
                                <div className='md:col-span-4 bg-gradient-to-br from-gray-50 to-blue-50/40 p-6 rounded-xl border border-gray-200 flex flex-col items-center justify-center text-center'>
                                    <p className='text-xs font-semibold text-gray-500 uppercase tracking-wider'>Customer Satisfaction Index</p>
                                    <div className='text-5xl font-black text-gray-900 mt-3 flex items-center gap-2'>
                                        <span>{avgRating}</span>
                                        <span className='text-2xl text-gray-400 font-normal'>/ 5.0</span>
                                    </div>
                                    <div className='mt-3'>
                                        <Rate disabled allowHalf value={Number(avgRating)} />
                                    </div>
                                    <p className='text-xs text-gray-500 mt-3'>
                                        Based on <strong>{totalRatingsCount}</strong> reviews from completed transport services.
                                    </p>
                                </div>

                                {/* Right Rating Distribution */}
                                <div className='md:col-span-8 bg-white p-6 rounded-xl border border-gray-200'>
                                    <h3 className='font-bold text-gray-900 text-sm mb-4'>Rating Distribution (1 to 5 Stars)</h3>
                                    <div className='space-y-2.5'>
                                        {(ratingsSummary.starBreakdown || [
                                            { star: 5, count: 0, percentage: 0 },
                                            { star: 4, count: 0, percentage: 0 },
                                            { star: 3, count: 0, percentage: 0 },
                                            { star: 2, count: 0, percentage: 0 },
                                            { star: 1, count: 0, percentage: 0 },
                                        ]).map((item) => (
                                            <div key={item.star} className='flex items-center gap-3 text-xs'>
                                                <span className='w-12 font-medium text-gray-700 flex items-center gap-1'>
                                                    {item.star} <FaStar className='text-yellow-400' />
                                                </span>
                                                <div className='flex-1'>
                                                    <Progress
                                                        percent={item.percentage}
                                                        strokeColor={
                                                            item.star >= 4 ? '#22c55e' : item.star === 3 ? '#eab308' : '#ef4444'
                                                        }
                                                        showInfo={false}
                                                    />
                                                </div>
                                                <span className='w-16 text-right text-gray-500 font-medium'>
                                                    {item.count} ({item.percentage}%)
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* User Comments & Rating History */}
                            <div className='border-t pt-6'>
                                <div className='flex flex-wrap items-center justify-between gap-4 mb-6'>
                                    <div>
                                        <h3 className='font-bold text-lg text-gray-900'>Verified Customer Reviews & Feedback</h3>
                                        <p className='text-xs text-gray-500'>Monitor real comments, rating details, and historical partner ratings</p>
                                    </div>

                                    {/* Star Filter Pills */}
                                    <div className='flex items-center gap-1.5 bg-gray-100 p-1 rounded-lg text-xs'>
                                        <button
                                            onClick={() => setStarFilter('all')}
                                            className={`px-3 py-1 rounded-md font-medium transition-colors ${
                                                starFilter === 'all' ? 'bg-white text-blue-600 shadow-2xs' : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                        >
                                            All ({reviews.length})
                                        </button>
                                        {[5, 4, 3, 2, 1].map((s) => (
                                            <button
                                                key={s}
                                                onClick={() => setStarFilter(String(s))}
                                                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                                                    starFilter === String(s) ? 'bg-white text-blue-600 shadow-2xs' : 'text-gray-600 hover:text-gray-900'
                                                }`}
                                            >
                                                {s}★
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {ratingsLoading ? (
                                    <Loading />
                                ) : filteredReviews.length === 0 ? (
                                    <div className='text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300'>
                                        <p className='text-gray-500 text-sm'>No customer reviews found matching filter.</p>
                                    </div>
                                ) : (
                                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                        {filteredReviews.map((review) => (
                                            <div key={review._id} className='p-4 border rounded-xl bg-white hover:border-blue-300 transition-all shadow-2xs'>
                                                <div className='flex items-start justify-between'>
                                                    <div className='flex items-center gap-3'>
                                                        <img
                                                            src={review?.userId?.profile_image ? `${imageUrl}${review.userId.profile_image}` : '/default-avatar.png'}
                                                            className='w-10 h-10 rounded-full object-cover border'
                                                            alt=""
                                                        />
                                                        <div>
                                                            <p className='font-semibold text-sm text-gray-900'>{review?.userId?.name || 'Customer'}</p>
                                                            <p className='text-gray-400 text-xs'>{review?.userId?.email}</p>
                                                        </div>
                                                    </div>
                                                    <div className='flex items-center gap-1 bg-yellow-50 px-2 py-0.5 rounded border border-yellow-200'>
                                                        <FaStar className='text-yellow-400 text-xs' />
                                                        <span className='font-bold text-xs text-yellow-700'>{review.rating}</span>
                                                    </div>
                                                </div>

                                                <p className='mt-3 text-sm text-gray-700 leading-relaxed bg-gray-50/50 p-2.5 rounded-lg border border-gray-100'>
                                                    "{review.comment}"
                                                </p>

                                                <div className='mt-3 flex items-center justify-between text-xs text-gray-400'>
                                                    <span>
                                                        {new Date(review.createdAt).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric'
                                                        })}
                                                    </span>
                                                    {review.serviceId?._id && (
                                                        <span className='font-mono text-gray-500'>
                                                            Service: #{review.serviceId._id.slice(-6)}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* TAB 2: BASIC & VEHICLE INFO */}
                    {activeTab === 'basic' && (
                        <div className='max-w-2xl mx-auto mt-8 space-y-4'>
                            <div className='bg-gray-50 p-5 rounded-xl border space-y-3 text-sm'>
                                <p className='flex justify-between'><span className='font-medium text-gray-600'>Email:</span> <span className='text-gray-900'>{partner?.email}</span></p>
                                <p className='flex justify-between'><span className='font-medium text-gray-600'>Phone Number:</span> <span className='text-gray-900'>{partner?.phone_number || "N/A"}</span></p>
                                <p className='flex justify-between'><span className='font-medium text-gray-600'>Location:</span> <span className='text-gray-900'>{partner?.city}, {partner?.state}, {partner?.country}</span></p>
                                <p className='flex justify-between'><span className='font-medium text-gray-600'>Street & Exterior:</span> <span className='text-gray-900'>{partner?.street} #{partner?.exterior_number}</span></p>
                            </div>

                            <div className='pt-4'>
                                <h3 className='font-bold text-gray-800 mb-3 text-sm'>Vehicle Photos</h3>
                                <div className='grid grid-cols-3 gap-3'>
                                    <div className='border rounded-lg p-2 text-center'>
                                        <p className='text-xs text-gray-500 mb-1 font-medium'>Front</p>
                                        <Image className='rounded object-cover' width="100%" height={140} src={`${imageUrl}${partner?.vehicleFrontImage}`} alt="Front" />
                                    </div>
                                    <div className='border rounded-lg p-2 text-center'>
                                        <p className='text-xs text-gray-500 mb-1 font-medium'>Side</p>
                                        <Image className='rounded object-cover' width="100%" height={140} src={`${imageUrl}${partner?.vehicleSideImage}`} alt="Side" />
                                    </div>
                                    <div className='border rounded-lg p-2 text-center'>
                                        <p className='text-xs text-gray-500 mb-1 font-medium'>Back</p>
                                        <Image className='rounded object-cover' width="100%" height={140} src={`${imageUrl}${partner?.vehicleBackImage}`} alt="Back" />
                                    </div>
                                </div>
                            </div>

                            <div className='grid grid-cols-2 gap-4 pt-4'>
                                <div className='border rounded-lg p-3'>
                                    <p className='font-medium text-xs text-gray-600 mb-2'>License Plate</p>
                                    <Image className='rounded object-cover' width="100%" height={130} src={`${imageUrl}${partner?.licensePlateImage}`} alt="Plate" />
                                </div>
                                <div className='border rounded-lg p-3'>
                                    <p className='font-medium text-xs text-gray-600 mb-2'>Driving License</p>
                                    <Image className='rounded object-cover' width="100%" height={130} src={`${imageUrl}${partner?.drivingLicenseImage}`} alt="License" />
                                </div>
                                <div className='border rounded-lg p-3'>
                                    <p className='font-medium text-xs text-gray-600 mb-2'>Vehicle Insurance</p>
                                    <Image className='rounded object-cover' width="100%" height={130} src={`${imageUrl}${partner?.vehicleInsuranceImage}`} alt="Insurance" />
                                </div>
                                <div className='border rounded-lg p-3'>
                                    <p className='font-medium text-xs text-gray-600 mb-2'>Registration Card</p>
                                    <Image className='rounded object-cover' width="100%" height={130} src={`${imageUrl}${partner?.vehicleRegistrationCardImage}`} alt="Registration" />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB 3: BANK & TAX INFO */}
                    {activeTab === 'bank' && (
                        <div className='max-w-xl mx-auto mt-8 bg-gray-50 p-6 rounded-xl border space-y-3 text-sm'>
                            <h3 className='font-bold text-gray-900 text-base mb-4'>Financial & Legal Identification</h3>
                            <p className='flex justify-between'><span className='font-medium text-gray-600'>Bank Name:</span> <span className='text-gray-900'>{partner?.bank_name || "N/A"}</span></p>
                            <p className='flex justify-between'><span className='font-medium text-gray-600'>Account Holder:</span> <span className='text-gray-900'>{partner?.bank_holder_name || "N/A"}</span></p>
                            <p className='flex justify-between'><span className='font-medium text-gray-600'>Account Number:</span> <span className='text-gray-900 font-mono'>{partner?.bank_account_number || "N/A"}</span></p>
                            <p className='flex justify-between'><span className='font-medium text-gray-600'>Routing Number:</span> <span className='text-gray-900 font-mono'>{partner?.routing_number || "N/A"}</span></p>
                            <p className='flex justify-between'><span className='font-medium text-gray-600'>Date of Birth:</span> <span className='text-gray-900'>{partner?.date_of_birth || "N/A"}</span></p>
                            <p className='flex justify-between'><span className='font-medium text-gray-600'>Registered Tax Address:</span> <span className='text-gray-900 text-right max-w-xs'>{fullAddress || "N/A"}</span></p>
                            <p className='flex justify-between'><span className='font-medium text-gray-600'>Postal Code:</span> <span className='text-gray-900'>{partner?.address_postal_code || "N/A"}</span></p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default PartnerDetails