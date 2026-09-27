import React, { useState } from "react";
import PageName from "../../Components/Shared/PageName";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation } from "swiper/modules";
import { RxStarFilled } from "react-icons/rx";
import MapComponent from "../../Components/MapComponent";
import { useParams } from "react-router-dom";
import { useGetAuctionManagementDetailsQuery } from "../../redux/api/auctionManagementApi";
import { imageUrl } from "../../redux/api/baseApi";
import { Image } from "antd";
import Loading from '../../Components/Loading/Loading';
import ClaimFilingModal from '../../Components/ClaimFilingModal';
import { WarningOutlined } from '@ant-design/icons';


const AuctionDetails = () => {
  const [googleApiLoaded, setGoogleApiLoaded] = useState(false);
  const [openClaimModal, setOpenClaimModal] = useState(false);

  const { id } = useParams();
  const { data: getAuctionDetails, isLoading } = useGetAuctionManagementDetailsQuery(id);

  console.log(getAuctionDetails?.data?.result?.confirmedPartner);

  const [swiperRef, setSwiperRef] = useState(null);
  const [openMapModal, setOpenMapModal] = useState(false);
  const handleLoad = () => {
    setGoogleApiLoaded(true);
  };

  return (
    <div className="bg-white rounded-md p-5">
      <div className="flex items-center justify-between">
        <PageName name={"Auction Details"} />
        <button
          onClick={() => setOpenClaimModal(true)}
          className="flex items-center gap-1.5 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 px-4 py-1.5 rounded-full font-medium text-sm transition-colors cursor-pointer"
        >
          <WarningOutlined />
          <span>File Claim (Feature 10)</span>
        </button>
      </div>

      <ClaimFilingModal
        open={openClaimModal}
        onCancel={() => setOpenClaimModal(false)}
        serviceId={id}
      />

      {isLoading ? <Loading type="detail" /> : <div className="max-w-4xl mx-auto mt-10">
        <div>
          <p>Items Image</p>
          <div className="flex items-center  justify-between mt-5 gap-5 ">
            <Image.PreviewGroup>
              {getAuctionDetails?.data?.result?.image?.map((img, i) => (
                <Image
                  key={i}
                  src={`${imageUrl}${img}`}
                  alt={`preview-${i}`}
                  width={250}
                  height={144}
                  style={{ borderRadius: "8px", objectFit: "cover" }}
                  preview={{ mask: "Click to preview" }}
                />
              ))}
            </Image.PreviewGroup>
          </div>
        </div>
        <div className="mt-8 border-t pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            {/* Left Column: Basic & Performance Info */}
            <div className="space-y-6">
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">User Name</p>
                <p className="text-lg font-medium text-gray-900 mt-1">{getAuctionDetails?.data?.result?.user?.name || "N/A"}</p>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Partner</p>
                <p className="text-lg font-medium text-gray-900 mt-1">
                  {getAuctionDetails?.data?.result?.confirmedPartner?.name || "N/A"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Date</p>
                  <p className="text-gray-800 mt-1">{getAuctionDetails?.data?.result?.createdAt?.split("T")[0]}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Category</p>
                  <p className="text-gray-800 mt-1">{getAuctionDetails?.data?.result?.category[0]?.category}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Amount</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">${getAuctionDetails?.data?.result?.winBid || getAuctionDetails?.data?.result?.price}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Measurement</p>
                  <p className="text-gray-800 mt-1">{getAuctionDetails?.data?.result?.weightMTS} mts</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Weight</p>
                  <p className="text-gray-800 mt-1">{getAuctionDetails?.data?.result?.weightKG} kg</p>
                </div>
              </div>
            </div>

            {/* Right Column: Logistics & Status */}
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Loading Floor</p>
                  <p className="text-gray-800 mt-1">{getAuctionDetails?.data?.result?.loadFloorNo} Floor</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Unloading Floor</p>
                  <p className="text-gray-800 mt-1">{getAuctionDetails?.data?.result?.unloadFloorNo} Floor</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Distance</p>
                  <p className="text-gray-800 mt-1 font-medium">{getAuctionDetails?.data?.result?.distance} km</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Auction Deadline</p>
                <p className="text-gray-800 mt-1">
                  {getAuctionDetails?.data?.result?.deadlineDate?.split("T")[0]} at {getAuctionDetails?.data?.result?.deadlineTime}
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Service Date</p>
                <p className="text-gray-800 mt-1">
                  {getAuctionDetails?.data?.result?.scheduleDate?.split("T")[0]} at {getAuctionDetails?.data?.result?.scheduleTime}
                </p>
              </div>

              {/* Status Section */}
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 grid grid-cols-1 gap-4">
                <div>
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Auction Status:</p>
                  <p className="text-lg font-bold text-gray-900 mt-1 capitalize">{getAuctionDetails?.data?.result?.status}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 border-t border-gray-200 pt-3">
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">User Status</p>
                    <p className="text-sm font-medium text-gray-700 mt-1 capitalize">{getAuctionDetails?.data?.result?.user_status?.replace(/_/g, ' ') || "None"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Partner Status</p>
                    <p className="text-sm font-medium text-gray-700 mt-1 capitalize">{getAuctionDetails?.data?.result?.partner_status?.replace(/_/g, ' ') || "None"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Full Width Info */}
          <div className="mt-10 space-y-10 border-t pt-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Loading Address</p>
                <p className="text-gray-800 text-lg leading-relaxed bg-blue-50/30 p-4 rounded-lg border border-blue-100/50">{getAuctionDetails?.data?.result?.loadingAddress}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Unloading Address</p>
                <p className="text-gray-800 text-lg leading-relaxed bg-orange-50/30 p-4 rounded-lg border border-orange-100/50">{getAuctionDetails?.data?.result?.unloadingAddress}</p>
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Description</p>
              <p className="text-gray-800 text-lg leading-relaxed whitespace-pre-wrap italic bg-gray-50/50 p-5 rounded-lg border border-gray-100 font-serif">{getAuctionDetails?.data?.result?.description}</p>
            </div>
          </div>
        </div>

        {/* Goods Loaded Images */}
        {getAuctionDetails?.data?.result?.goodsLoadedImages?.length > 0 && (
          <div className="mt-10">
            <p className="text-xl font-semibold">Goods Loaded Images</p>
            <div className="flex flex-wrap gap-5 mt-5">
              <Image.PreviewGroup>
                {getAuctionDetails?.data?.result?.goodsLoadedImages?.map((img, i) => (
                  <Image
                    key={i}
                    src={`${imageUrl}/${img.replace("uploads/", "")}`}
                    alt={`goods-loaded-${i}`}
                    width={250}
                    height={144}
                    style={{ borderRadius: "8px", objectFit: "cover" }}
                    preview={{ mask: "Click to preview" }}
                  />
                ))}
              </Image.PreviewGroup>
            </div>
          </div>
        )}

        {/* Delivered Images */}
        <div className="mt-10">
          <p className="text-xl font-semibold">Delivered Images</p>
          {getAuctionDetails?.data?.result?.deliveredImages?.length > 0 ? (
            <div className="flex flex-wrap gap-5 mt-5">
              <Image.PreviewGroup>
                {getAuctionDetails?.data?.result?.deliveredImages?.map((img, i) => (
                  <Image
                    key={i}
                    src={`${imageUrl}/${img.replace("uploads/", "")}`}
                    alt={`delivered-${i}`}
                    width={250}
                    height={144}
                    style={{ borderRadius: "8px", objectFit: "cover" }}
                    preview={{ mask: "Click to preview" }}
                  />
                ))}
              </Image.PreviewGroup>
            </div>
          ) : (
            <p className="text-gray-500 mt-3">No delivered images yet</p>
          )}
        </div>

        {/* Winner section */}
        <p className=" mt-10 text-xl font-semibold">Winning Partner</p>
        {getAuctionDetails?.data?.result?.confirmedPartner ? (
          <div className="flex flex-col items-center bg-[#F2F2F2] rounded-md h-full justify-center mt-10 p-5">
            <div className=" h-20 w-20 mx-auto ">
              <img
                className="rounded-md"
                src={`${imageUrl}${getAuctionDetails?.data?.result?.confirmedPartner?.profile_image}`}
                alt=""
              />
            </div>
            <p className="font-medium py-2">
              {getAuctionDetails?.data?.result?.confirmedPartner?.name}
            </p>

            <p className="flex items-center py-2">
              <span>Rating : </span>{" "}
              <RxStarFilled className="text-orange-300 mx-2" />{" "}
              <span className="font-medium">
                {getAuctionDetails?.data?.result?.confirmedPartner?.rating}/5.0
              </span>
            </p>

            <div className="flex gap-10">
              <p>
                <span>Email : </span>
                {getAuctionDetails?.data?.result?.confirmedPartner?.email}
              </p>

              <p>
                Phone Number :{" "}
                {
                  getAuctionDetails?.data?.result?.confirmedPartner
                    ?.phone_number
                }
              </p>
            </div>
            <div className="flex gap-20 mt-5">
              <div>
                <p>license Plate Image : </p>
                <Image
                  width={250}
                  height={144}
                  src={`${imageUrl}${getAuctionDetails?.data?.result?.confirmedPartner?.licensePlateImage}`}
                  className="h-40 w-40 rounded-md"
                  alt=""
                />
              </div>
              <div>
                <p>vehicle Insurance Image: </p>
                <Image
                  width={250}
                  height={144}
                  src={`${imageUrl}${getAuctionDetails?.data?.result?.confirmedPartner?.vehicleInsuranceImage}`}
                  className="h-40 w-40 rounded-md"
                  alt=""
                />
              </div>
            </div>
          </div>
        ) : (
          <p>Partner Not selected yet!</p>
        )}

        <div className="mt-20">
          <Swiper
            onSwiper={setSwiperRef}
            slidesPerView={3}
            centeredSlides={true}
            spaceBetween={30}
            pagination={{
              type: "fraction",
            }}
            navigation={true}
            modules={[Pagination, Navigation]}
            className="mySwiper"
          >
            {getAuctionDetails?.data?.result?.bids?.map((user, i) => {
              return (
                <SwiperSlide>
                  <div
                    key={i + 1}
                    className="flex flex-col items-center bg-[#F2F2F2] rounded-md h-full justify-center"
                  >
                    <div className=" h-20 w-20 mx-auto ">
                      <img
                        className="h-5 w-5 rounded-full"
                        src={`${imageUrl}${user?.partner?.profile_image}`}
                        alt=""
                      />
                    </div>
                    <p className="font-medium py-2">{user?.partner?.name}</p>

                    <p className="flex items-center py-2">
                      <span>Rating : </span>{" "}
                      <RxStarFilled className="text-orange-300 mx-2" />{" "}
                      <span className="font-medium">
                        {user?.partner?.rating}/5.0
                      </span>
                    </p>
                    <p>
                      <span>Bid : </span>{" "}
                      <span className="font-medium text-blue-500">
                        ${user?.price?.toFixed(2)}
                      </span>
                    </p>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>}
      <div>{/* <MapComponent/> */}</div>

      <MapComponent
        getAuctionDetails={getAuctionDetails}
        googleApiLoaded={googleApiLoaded}
      />
    </div>
  );
};

export default AuctionDetails;
