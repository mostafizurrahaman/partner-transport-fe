import { Select } from 'antd';
import React, { PureComponent, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { usePartnerGrowthOverviewQuery } from '../../redux/api/dashboardHomeApi';

const DailyOverViewChart = () => {
    const [year, setYear] = useState("2025")
    const {data :  getUserGrowth} = usePartnerGrowthOverviewQuery(year)
    const data = getUserGrowth?.data?.data?.map(mon=>{
        return (
                {
                    name: mon?.month,
                    uv: mon?.count,
                }
        )
    })

    const handleChange = (value) => {
        setYear(value)
    };
    const items = [
     
        {
            label: 2024,
            key:"2024",
            value:'2024'
        },
        {
            label:2025,
            key:"2025",
            value :'2025'
        },
        {
            label:2026,
            key:"2026",
            value:'2026'
        },
        {
            label:2027,
            key:"2027",
            value:'2027'
        },
    ];
    return (
        <>
            <div className='flex justify-between items-center'>
                <div className='ml-6'>
                    <p className='text-2xl font-semibold text-[#333333] '>User & Partner Growth</p>
                    {/* <div className='flex items-center gap-5 my-2'>
                        <div>
                            <p>Yearly Growth</p>
                            <p className='font-medium'>78.18%</p>
                        </div>
                        <div>
                            <p>Monthly</p>
                            <p className='font-medium'>82.00%</p>
                        </div>
                        <div>
                            <p>Daily</p>
                            <p className='font-medium'>89.80%</p>
                        </div>
                    </div> */}
                </div>
                <Select
                    defaultValue="2025"
                    style={{ width: 120 }}
                    onChange={handleChange}
                    options={items}
                />
            </div>
            <div className='w-full h-[400px]'>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        width={300}
                        height={500}
                        data={data}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="1 1" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="uv" stackId="a" fill="#007BFF" barSize={25} radius={[20, 20, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </>
    )
}

export default DailyOverViewChart