import { Table } from 'antd'
import React from 'react'

const ActiveAdminsTable = ({dataSource , pagination}) => {
  
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
              <img src={admin.avatar} className='h-12 rounded-full w-12' size="large" style={{ marginRight: 10 }} />
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span>{admin.name}</span>
                {admin.online && (
                  <span
                    style={{
                      color: "green",
                      fontSize: "10px",
                    }}
                  >
                    ● Online
                  </span>
                )}
              </div>
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
          title: "Phone Number",
          dataIndex: "activity",
          key: "activity",
          width: "25%",
        },
        {
          title: "Task Completed Today",
          dataIndex: "tasksCompleted",
          key: "tasksCompleted",
          width: "10%",
          align: "center",
        },
      ];
    return (
        <div>
            <div style={{ padding: "20px" }}>
                <Table
                    dataSource={dataSource}
                    columns={columns}
                    pagination={pagination}
                    bordered={false}
                />
            </div>
        </div>
    )
}

export default ActiveAdminsTable