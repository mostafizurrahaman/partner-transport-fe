import { Table } from 'antd';
import React from 'react'

const MostTaskCompleteAdminTable = ({dataSource , pagination}) => {
    const columns = [
        {
          title: "SL no.",
          dataIndex: "slNo",
          key: "slNo",
          width: "10%",
        },
        {
          title: "Admin Name",
          dataIndex: "admin",
          key: "admin",
          width: "25%",
          render: (admin) => (
            <div style={{ display: "flex", alignItems: "center" }}>
              <img className='w-10 h-10 rounded-md' src={admin.avatar} size="large" style={{ marginRight: 10 }} />
              {admin.name}
            </div>
          ),
        },
        {
          title: "Email",
          dataIndex: "email",
          key: "email",
          width: "30%",
        },
        {
          title: "Tickets Attended",
          dataIndex: "ticketsAttended",
          key: "ticketsAttended",
          width: "10%",
          align: "center",
        },
        {
          title: "Complaints Attended",
          dataIndex: "complaintsAttended",
          key: "complaintsAttended",
          width: "10%",
          align: "center",
        },
        {
          title: "Total Task Completed",
          dataIndex: "totalTasksCompleted",
          key: "totalTasksCompleted",
          width: "15%",
          align: "center",
        },
      ];
      
    return (
        <div style={{ padding: "20px" }}>
            <Table
                dataSource={dataSource}
                columns={columns}
                pagination={pagination}
                bordered={false}
            />
        </div>
    )
}

export default MostTaskCompleteAdminTable