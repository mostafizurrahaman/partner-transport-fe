import { Avatar, Button, Pagination, Space, Table, Tag } from "antd";
import React, { useState } from "react";
import { CiSearch } from "react-icons/ci";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { EyeOutlined } from "@ant-design/icons";
import { GoReply } from "react-icons/go";
import ReplyModal from "../../Components/ReplyModal";
import ViewTicketModal from "../../Components/ViewTicketModal";
import { useGetAllTicketQuery } from "../../redux/api/supportApi";
import { imageUrl } from "../../redux/api/baseApi";
import Loading from '../../Components/Loading/Loading';

const Ticket = () => {
  const [openReplyModal, setOpenReplyModal] = useState(false);
  const [openViewTicket, setOpenViewTicket] = useState(false);
  const [complainDetails, setComplainDetails] = useState(false);
  const [search, setSearch] = useState("");
  const [replyId, setReplyId] = useState("");
  const [page, setPage] = useState(1);

  // All APIs
  const { data: getAllTicket, isLoading } = useGetAllTicketQuery({ page, search });


  const formattedTableData = getAllTicket?.data?.tickets?.map((ticket, i) => {
    return {
      key: i + 1,
      complainId: ticket?._id,
      date: ticket?.createdAt?.split("T")[0],
      userName: ticket?.user?.name,
      userAvatar: (
        <img src={`${imageUrl}${ticket?.user?.profile_image}`} alt="" />
      ),
      complain: ticket?.description,
      email: ticket?.user?.email,
      contact: ticket?.number,
      status: ticket?.status,
    };
  });

  const columns = [
    {
      title: "Ticket ID",
      dataIndex: "complainId",
      key: "complainId",
    },

    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "User/Partner Name",
      key: "user",
      render: (text, record) => (
        <Space>
          <Avatar src={record.userAvatar} />
          {record.userName}
        </Space>
      ),
    },
    {
      title: "Description of the issue",
      dataIndex: "complain",
      key: "complain",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },

    {
      title: "Contact Number",
      dataIndex: "contact",
      key: "contact",
    },

    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "";
        switch (status) {
          case "Pending":
            color = "blue";
            break;
          case "Replied":
            color = "green";
            break;
          case "In-progress":
            color = "orange";
            break;
          default:
            color = "gray";
        }
        return (
          <Tag className="rounded-full px-5 py-2" color={color}>
            {status}
          </Tag>
        );
      },
    },
    {
      title: "View",
      key: "view",
      render: (_, record) => (
        <Button
          onClick={() => {
            setOpenViewTicket(true);
            setComplainDetails(record);
          }}
          type="primary"
          icon={<EyeOutlined />}
        />
      ),
    },
    {
      title: "Reply",
      key: "penalty",
      render: (_, record) => (
        <Button
          onClick={() => {
            setOpenReplyModal(true);
            setReplyId(record?.complainId);
          }}
          className="bg-red-500 text-white"
          type="danger"
          icon={<GoReply size={20} />}
        />
      ),
    },
  ];
  return (
    <div className="p-5 bg-white rounded-md">
      <div className="flex justify-between item-center ">
        <div className="flex items-center gap-2">
          <Link to={-1}>
            <FaArrowLeft size={18} className="text-[var(--primary-color)] " />
          </Link>
          <span className="font-semibold text-[20px]">Support</span>
        </div>
        <div>
          <div className="relative">
            <input
              onChange={(e) => setSearch(e.target.value)}
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

      <div className="mt-5">
        {isLoading ? <Loading type="table" /> : <Table
          columns={columns}
          dataSource={formattedTableData}
          className="custom-pagination"
          pagination={false}
        />}
        <div className="flex justify-center pt-5">
          <Pagination
            onChange={(page) => setPage(page)} 
            current={getAllTicket?.data?.currentPage}
            total={getAllTicket?.data?.totalTickets}
          />
        </div>
      </div>

      <ReplyModal
        replyId={replyId}
        openReplyModal={openReplyModal}
        setOpenReplyModal={setOpenReplyModal}
      />
      <ViewTicketModal
        complainDetails={complainDetails}
        openViewTicket={openViewTicket}
        setOpenViewTicket={setOpenViewTicket}
      />
    </div>
  );
};

export default Ticket;
