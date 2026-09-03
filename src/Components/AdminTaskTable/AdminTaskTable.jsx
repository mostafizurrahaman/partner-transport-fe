import { Button, Table } from 'antd'
import React from 'react'
const AdminTaskTable = ({dataSource }) => {
    const columns = [
        {
          title: "SL no.",
          dataIndex: "slNo",
          key: "slNo",
          width: "10%",
        },
        {
          title: "Task",
          dataIndex: "task",
          key: "task",
          width: "40%",
        },
        {
          title: "Assigned Admin",
          dataIndex: "admin",
          key: "admin",
          width: "30%",
          render: (admin) => (
            <div className="flex items-center">
              <img src={admin.avatar} size="large"  className='h-10 w-10 rounded-md' style={{ marginRight: 10 }} />
              {admin.name}
            </div>
          ),
        },
        {
          title: "Status",
          dataIndex: "status",
          key: "status",
          width: "20%",
          render: (status) => (
            <Button
              type="text"
              style={{
                color: "#31A24C",
                backgroundColor: "#E6F4EA",
                fontWeight: "bold",
                borderRadius: "20px",
              }}
            >
              {status}
            </Button>
          ),
        },
      ];
    return (
        <div style={{ padding: "20px" }}>
            <Table
                dataSource={dataSource}
                columns={columns}
                pagination={false}
                // pagination={{
                //     total: 1239,
                //     pageSize: 11,
                //     showSizeChanger: false,
                //     showQuickJumper: true,
                // }}
                bordered={false}
            />
        </div>
    )
}

export default AdminTaskTable