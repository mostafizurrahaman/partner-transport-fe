import React from 'react'
import { FaArrowLeft } from 'react-icons/fa'
import { Link } from 'react-router-dom'

const PageName = ({ name }) => {
  return (
    <div className='flex items-center gap-2'>
      <Link to={-1} className='text-black'><FaArrowLeft size={20} /></Link>
      <span className='font-medium text-xl'>{name}</span>
    </div>
  )
}

export default PageName