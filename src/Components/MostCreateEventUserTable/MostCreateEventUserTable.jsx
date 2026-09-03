import { Table } from 'antd'
import React from 'react'

const MostCreateEventUserTable = ({dataSource, pagination}) => {
    const columns = [
        {
            title: "SL no.",
            dataIndex: "slNo",
            key: "slNo",
            width: "10%",
        },
        {
            title: "User Name",
            dataIndex: "user",
            key: "user",
            width: "30%",
            render: (user) => (
                <div style={{ display: "flex", alignItems: "center" }}>
                    <img src={user.avatar} size="large" style={{ marginRight: 10 }} />
                    {user.name}
                </div>
            ),
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
            width: "40%",
        },
        {
            title: "Events Created",
            dataIndex: "eventsCreated",
            key: "eventsCreated",
            width: "20%",
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

export default MostCreateEventUserTable