import { Input } from 'antd'
import Loading from '../../Components/Loading/Loading'
import React, { useEffect, useState } from 'react'
import { IoArrowBackSharp } from 'react-icons/io5'
import { Link } from 'react-router-dom'
import { useGetContactUsQuery, useUpdateContactMutation } from '../../redux/api/settingApi'
import { toast } from 'sonner'

const ContactUs = () => {
    const [inputValue, setInputValue] = useState('')
    // Contact us API
    const { data: getContact, isLoading } = useGetContactUsQuery()
    const [updateContact] = useUpdateContactMutation()

    useEffect(() => {

        setInputValue(getContact?.data?.contact)
    }, [getContact])

    const handleUpdateContact = () => {
        console.log(inputValue);
        const data = {
            contactNumber: inputValue
        }
        updateContact(data).unwrap()
            .then((payload) => toast.success(payload?.message))
            .catch((error) => toast.error(error?.data?.message));
    }
    return (
        <div className='bg-white p-4 rounded-md min-h-[85vh]'>
            <Link to={-1} className='flex items-center  gap-1 text-xl font-medium'> <IoArrowBackSharp />Contact Us</Link>
            {isLoading ? <Loading type="form" /> : <div className='flex mt-10 max-w-[50%] mx-auto gap-2'>
                <div className='flex items-center'>
                    <p className='mr-2 text-xl font-medium'>Mobile Number:</p>
                    <Input onChange={(e) => setInputValue(e.target.value)} value={inputValue} className='w-[500px] py-2' placeholder='Input here...' />
                </div>
                <button onClick={() => handleUpdateContact()} className='bg-black text-white px-8 py-2 rounded-full'>Save</button>
            </div>}
        </div>
    )
}

export default ContactUs