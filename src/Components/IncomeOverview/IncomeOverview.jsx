
import { Select } from 'antd';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useIncomeOverViewQuery } from '../../redux/api/dashboardHomeApi';
import { useState } from 'react';

const IncomeOverview = () => {
    const [year, setYear] = useState("2025")
    const { data: incomeOverview } = useIncomeOverViewQuery(year)
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
    

    const formattedIncomeOverview = incomeOverview?.data?.data?.map(month => {
        return (
            {
                name: month?.month,
                uv: month?.totalIncome,
            }
        )
    })


    const handleChange = (value) => {
        setYear(value)
    };
    return (
        <>
            <div className='flex justify-between items-center'>
                <div className='ml-6'>
                    <p className='text-2xl font-semibold text-[#333333] mr-2 pb-5'>Income Overview</p>

                </div>
                <Select
                    defaultValue={year}
                    style={{ width: 120 }}
                    onChange={handleChange}
                    options={items} 
                />
            </div>
            <div className='w-full h-[400px]'>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        width={400}
                        height={400}
                        data={formattedIncomeOverview}
                        margin={{
                            top: 10,
                            right: 30,
                            left: 0,
                            bottom: 0,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Area type="monotone" dataKey="uv" stroke="#007BFF" opacity={1} fillOpacity={1} fill="#007BFF" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </>
    )
}

export default IncomeOverview