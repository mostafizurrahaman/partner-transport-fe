import React from 'react'

const TransactionCard = () => {
  return (
    <div className='mt-5 grid grid-cols-4 gap-5 justify-center items-center '>
        <div className='bg-[#EAF8F6] rounded-md shadow-sm text-center py-6'>
            <p className='text-[24px]'>Total Income</p>
            <span>Yearly</span>
            <p className='font-bold text-[36px]'>$8584.00</p>
        </div>
        <div className='bg-[#EAF8F6] rounded-md shadow-sm text-center py-8 '>
            <p className='text-[24px]'>Monthly</p>
            <p className='font-bold text-[36px]'>$560.00</p>
        </div>
        <div className='bg-[#EAF8F6] rounded-md shadow-sm text-center py-8'>
            <p className='text-[24px]'>Weekly</p>
            <p className='font-bold text-[36px]'>$1250.00</p>
        </div>
        <div className='bg-[#EAF8F6] rounded-md shadow-sm text-center py-8'>
            <p className='text-[24px]'>Monthly</p>
            <p className='font-bold text-[36px]'>$2584.00</p>
        </div>
        
    </div>
  )
}

export default TransactionCard