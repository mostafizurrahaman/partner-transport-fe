import React from 'react'
import Sidebar from '../../Components/Shared/Sidebar'
import Header from '../../Components/Shared/Header'
import { Outlet } from 'react-router-dom'

const MainLayout = () => {
    return (
        <div className="flex gap-0 bg-[#F2F2F2]">
            {/* Sidebar */}
            <div className="w-[300px] bg-[var(--primary-color)] h-screen overflow-y-scroll">
                <Sidebar />
            </div>

            {/* Right Side */}
            <div className="w-full h-screen flex flex-col">
                <Header />
                <div className="flex-1 overflow-y-scroll p-6 bg-[#F2F2F2] content-scroll">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default MainLayout