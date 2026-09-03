import { Button, Table } from "antd";
import { IoArrowBackSharp } from "react-icons/io5";
import { RiDeleteBin6Line } from "react-icons/ri";
import {
  useDeleteNotificationMutation,
  useGetAllNotificationQuery,
} from "../../redux/api/settingApi";
import { toast } from "sonner";
import Loading from '../../Components/Loading/Loading';

const Notification = () => {
  const { data: getAllNotification, isLoading } = useGetAllNotificationQuery();
  const [deleteNotification] = useDeleteNotificationMutation();

  const data = getAllNotification?.data?.result?.map((data, i) => {
    return {
      key: data?._id,
      seen : data?.seen,
      title: data?.title?.eng,
      notification: data?.message?.eng,
    };
  });

  const columns = [
    {
      dataIndex: "notification",
      key: "notification",
      render: (_, record) => {
        return (
          <div >
            <span>{record?.title}</span>
            <p className="text-lg">{record?.notification}</p>
          </div>
        );
      },
    },
    
    {
      key: "action",
      width: "50px",
      render: (_, record) => (
        <Button
          type="text"
          icon={<RiDeleteBin6Line size={20} className="text-[#D9000A]" />}
          onClick={() => handleDelete(record.key)}
        />
      ),
    },
  ];
  const handleDelete = (key) => {
    deleteNotification(key)
      .unwrap()
      .then((payload) => toast.success(payload?.message))
      .catch((error) => toast.error(error?.data?.message));
  };

//   const handleSeenNotification = ()=>{
//     seenNotification().unwrap()
//     .then((payload) => console.log('fulfilled', payload))
//     .catch((error) => console.error('rejected', error));
//   }



  return (
    <div className="bg-white p-4 rounded-md">
      <div className="flex justify-between items-center my-5">
        <h3 className="text-[#242424] text-[20px] font-semibold flex items-center gap-2">
          {" "}
          <IoArrowBackSharp className="text-[#2AB9A4]" />
          Notifications
        </h3>
        {/* <div onClick={()=> handleSeenNotification()} className="cursor-pointer border-black border-b">Read All</div> */}
      </div>
      {isLoading ? <Loading type="table" /> : <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        className="custom-pagination"
      />}
    </div>
  );
};

export default Notification;
