import React, { useEffect, useState } from "react";
import PageName from "../../Components/Shared/PageName";
import { Pagination, Select, Table } from "antd";
import { IoEyeOutline } from "react-icons/io5";
import { MdOutlineMessage } from "react-icons/md";
import { Link } from "react-router-dom";
import RefundModal from "../../Components/RefundModal/RefundModal";
import ConversationModal from "../../Components/ConversationModal/ConversationModal";
import { CiSearch } from "react-icons/ci";
import {
  useGetAllAuctionQuery,
  useGetAllCategoryQuery,
  useGetConversationQuery,
} from "../../redux/api/auctionManagementApi";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { imageUrl } from "../../redux/api/baseApi";
import { useGetAllVariableQuery } from "../../redux/api/variableManagementApi";
import Loading from "../../Components/Loading/Loading";
import { render } from "react-dom";

const AuctionManagement = () => {
  const [conversationIds, setConversationIds] = useState({});
  // const [senderId, setSenderId] = useState('')
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [itemType, setItemType] = useState("");
  const [orderStatus, setOrderStatus] = useState("dec");
  const [page, setPage] = useState(1);
  const [auctionStatus, setAuctionStatus] = useState(() => {
    return localStorage.getItem("auctionStatus") || "move";
  });
  const [selectedCategory, setSelectedCategory] = useState("");
  const { data: allVariables } = useGetAllVariableQuery()
  const dollarToPeso = allVariables?.data?.perDollarMexicanPeso || 20;

  const { data: getAllAuction, isLoading } = useGetAllAuctionQuery({
    auctionStatus,
    page,
    itemType,
    selectedCategory,
    status,
    search,
    order: orderStatus
  });
  const { data: getAllCategory } = useGetAllCategoryQuery({
    auctionStatus,
    itemType,
  });
  const [senderId, setSendId] = useState();
  const [receiverId, setReceiveId] = useState();
  const [serviceId, setServiceId] = useState();
  const [refundValue, setRefundValue] = useState();

  console.log(orderStatus)

  // Save the selected status to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem("auctionStatus", auctionStatus);
  }, [auctionStatus]);

  const {
    data: getConversation,
    isLoading: isLoadingConversation,
    error,
  } = useGetConversationQuery(
    senderId && receiverId
      ? { senderId, receiverId, serviceId }
      : skipToken
  );

  const [openRefundModal, setRefundModal] = useState(false);
  const [openConversationModal, setOpenConversationModal] = useState(false);

  const handleOpenChat = (value) => {
    setSendId(value?.senderId);
    setReceiveId(value?.receiverId);
    setServiceId(value?.id);
    setOpenConversationModal(true);
  };

  const columns = [
    {
      title: "Sl No",
      dataIndex: "slno",
      key: "slno",
    },
    {
      title: "Auction ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "User",
      dataIndex: "user",
      render: (text, record) => {
        return (
          <div className="flex items-center gap-2">
            <img
              src={record?.userImg}
              style={{ width: 60, height: 60 }}
              alt=""
            />
            <p className="font-medium">{record?.userName}</p>
          </div>
        );
      },
    },
    {
      title: "Assigned Partner",
      dataIndex: "partner",
      render: (text, record) => {
        return (
          <div className="flex items-center gap-2">
            <img
              src={record?.partnerImage}
              style={{ width: 60, height: 60 }}
              alt=""
            />
            <p className="font-medium">{record?.partnerName}</p>
          </div>
        );
      },
    },
    {
      title: "Item Type",
      dataIndex: "itemType",
      key: "itemType",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Win Bid (USD)",
      dataIndex: "winBid",
      key: "winBid",
      render: (text, record) => {
        return (
          <p>{record?.winBid} USD</p>
        )
      }
    },
    {
      title: "Win Bid (mexican peso)",
      dataIndex: "winBidPeso",
      key: "winBidPeso",
      render: (text, record) => {
        return (
          <p>{record?.winBidPeso} MXN</p>
        )
      }
    },
    {
      title: "Action",
      dataIndex: "actionRefund",
      key: "actionRefund",
      render: (text, record) => {
        return (
          <button
            disabled={
              record?.actionRefund !== "paid" || record?.status === "completed"
            }
            onClick={() => handleRefund(record)}
            className={`border rounded-full text-center px-5 py-1 
    ${record?.actionRefund === "paid" && record?.status !== "completed"
                ? "text-red-500 cursor-pointer border-red-500"
                : "text-gray-600 border-gray-600 cursor-not-allowed"
              }`}
          >
            Refund
          </button>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text, record) => {
        return (
          <div
            className={` text-center  border rounded-full py-1 
                        ${record?.status === "completed"
                ? " border-[#2AB9A4] text-[#2AB9A4]"
                : record?.status === "accepted"
                  ? "border-[#338BFF] text-[#338BFF]"
                  : record?.status === "claimed"
                    ? "border-red-500 text-red-500"
                    : "border-yellow-400 text-yellow-400"
              }`}
          >
            {record?.status}
          </div>
        );
      },
    },
    {
      title: "Action",
      dataIndex: "key",
      key: "key",
      render: (_, record) => {
        return (
          <div className="flex items-center ">
            <Link
              to={`auction-details/${record?.id}`}
              className="bg-[var(--secondary-color)] text-white p-2 rounded-md "
            >
              <IoEyeOutline size={20} />
            </Link>
          </div>
        );
      },
    },
    {
      title: "Chat",
      dataIndex: "key",
      key: "key",
      render: (_, record) => {
        const isDisabled = !record?.senderId || !record?.receiverId;
        return (
          <div className="flex items-center ">
            <button
              style={{
                color: "white",
                cursor: isDisabled ? "not-allowed" : "pointer",
              }}
              disabled={!record?.senderId || !record?.receiverId}
              onClick={() => {
                if (!isDisabled) handleOpenChat(record);
              }}
              className=" cursor-pointer bg-yellow-500 text-white p-2 rounded-md"
            >
              <MdOutlineMessage size={20} />
            </button>
          </div>
        );
      },
    },
  ];

  const formattedTableData = getAllAuction?.data?.data?.map((auction, i) => {
    return {
      id: auction?._id,
      slno: i + 1,
      date: auction?.scheduleDate?.split("T")[0],
      paymentMethod: auction?.paymentMethod,
      transactionId: auction?.transactionId,
      senderId: auction?.user?._id,
      receiverId: auction?.confirmedPartner?._id,
      userImg: `${imageUrl}/${auction?.user?.profile_image}`,
      userName: auction?.user?.name,
      partnerName: auction?.confirmedPartner?.name,
      partnerImage: `${imageUrl}/${auction?.confirmedPartner?.profile_image}`,
      itemType: auction?.service,
      category: auction?.category[0]?.category,
      winBid: auction?.winBid?.toFixed(2),
      winBidPeso: (auction?.winBid * dollarToPeso).toFixed(2),
      actionRefund: auction?.paymentStatus,
      status: auction?.status,
    };
  });

  const handleRefund = (value) => {
    setRefundModal(true);
    setRefundValue(value);
  };

  // Category select options
  const category = Array.isArray(getAllCategory?.data?.data)
    ? getAllCategory.data.data.map((cat, i) => ({
      value: cat?._id,
      label: cat?.category,
      key: i + 1,
    }))
    : [];

  /** item category and status search functionality */
  const handleChange = (value) => {
    setItemType(value);
  };

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
  };

  // Handel status function
  const handleStatus = (value) => {
    setStatus(value);
  };
  const handleShowOrder = (value) => {
    setOrderStatus(value)
  }
  return (
    <div>
      <div className=" justify-between flex">
        <PageName name={"Auction Management"} />
        <div>
          <div className="relative">
            <input
              type="text"
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search here..."
              className="w-full pl-10 pr-4 py-1 rounded-md border border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 "
            />
            <span className="absolute left-3 top-2.5 text-gray-400">
              <CiSearch />
            </span>
          </div>
        </div>
      </div>

      {/* search auction */}
      <div className="flex items-center mt-5 justify-between">
        <div className="flex items-center gap-2  px-2">
          <div
            onClick={() => {
              setAuctionStatus("");
              setPage(1);
            }}
            className={`border px-8 py-1 border-black rounded-full cursor-pointer ${auctionStatus === "" ? "bg-black text-white" : ""
              }`}
          >
            All
          </div>
          <div
            onClick={() => {
              setAuctionStatus("move");
              setPage(1);
            }}
            className={`border px-8 py-1 border-black rounded-full cursor-pointer ${auctionStatus === "move" ? "bg-black text-white" : ""
              }`}
          >
            Move
          </div>
          <div
            onClick={() => {
              setAuctionStatus("sell");
              setPage(1);
            }}
            className={`border px-8 py-1 border-black rounded-full cursor-pointer ${auctionStatus === "sell" ? "bg-black text-white" : ""
              }`}
          >
            Sell
          </div>
        </div>
        <div className="flex gap-5">
          <div>
            <p className="mb-2">Item Type</p>
            <Select
              defaultValue="All"
              style={{ width: 200 }}
              onChange={handleChange}
              options={[
                { value: "", label: "All" },
                { value: "Goods", label: "Goods" },
                { value: "Waste", label: "Waste" },
                { value: "Second-hand items", label: "Second-hand items" },
                {
                  value: "Recyclable materials",
                  label: "Recyclable materials",
                },
              ]}
            />
          </div>
          <div>
            <p className="mb-2">Category</p>
            <Select
              defaultValue="All"
              style={{ width: 200 }}
              onChange={handleCategoryChange}
              options={[{ value: "", label: "All" }, ...category]}
              virtual={false}
            />
          </div>
          <div>
            <p className="mb-2">Status</p>
            <Select
              defaultValue="All"
              style={{ width: 200 }}
              onChange={handleStatus}
              options={[
                { value: "", label: "all" },
                { value: "pending", label: "pending" },
                { value: "accepted", label: "accepted" },
                { value: "rescheduled", label: "rescheduled" },
                { value: "pick-up", label: "pick-up" },
                { value: "in-progress", label: "in-progress" },
                { value: "completed", label: "completed" },
                { value: "cancel", label: "cancel" },
              ]}
            />
          </div>
          <div>
            <p className="mb-2">Select Order</p>
            <Select
              defaultValue={"dec"}
              onChange={handleShowOrder}
              options={[
                { value: "dec", label: "Ascending" },
                { value: "asc", label: "Descending" },
              ]}
            />
          </div>
        </div>
      </div>

      {/* Auction Table data */}
      <div className="mt-8">
        {isLoading ? <Loading type="table" /> : <Table
          columns={columns}
          dataSource={formattedTableData}
          pagination={false}
        />}
        <div className="flex  justify-center items-center bg-white py-5">
          <Pagination
            total={getAllAuction?.data?.meta?.total || 1}
            pageSize={getAllAuction?.data?.meta?.limit || 10}
            onChange={(page) => setPage(page)}
          />
        </div>
      </div>
      <RefundModal
        openRefundModal={openRefundModal}
        setRefundModal={setRefundModal}
        refundValue={refundValue}
      />
      <ConversationModal
        setOpenConversationModal={setOpenConversationModal}
        setConversationIds={setConversationIds}
        getConversation={getConversation}
        openConversationModal={openConversationModal}
        senderId={senderId}
        serviceId={serviceId}
        isLoading={isLoadingConversation}
      />
    </div>
  );
};

export default AuctionManagement;
