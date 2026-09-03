import React, { useState, useRef, useMemo, useEffect } from 'react';
import JoditEditor from 'jodit-react';
import { Link } from 'react-router-dom';
import { IoArrowBackSharp } from 'react-icons/io5';
import { useGetPrivacyPolicyQuery, useUpdatePrivacyPolicyMutation } from '../../redux/api/settingApi';
import { toast } from 'sonner';
import Loading from '../../Components/Loading/Loading';

const PrivacyPolicy = () => {
  const editor = useRef(null);
  const [content, setContent] = useState('');
  const [isLoading, seLoading] = useState(false)

  const { data: getPrivacyPolicy, isLoading: isDataLoading } = useGetPrivacyPolicyQuery()
  const [updatePrivacyPolicy] = useUpdatePrivacyPolicyMutation()



  const handleTerms = () => {
    const data = {
      description: content
    }
    updatePrivacyPolicy(data).unwrap()
      .then((payload) => toast.success("Update Privacy Policy successfully!"))
      .catch((error) => toast.error(error?.data?.message));
  }
  const config = {
    readonly: false,
    placeholder: 'Start typings...',
    style: {
      height: 400,
    },
    buttons: [
      'image', 'fontsize', 'bold', 'italic', 'underline', '|',
      'font', 'brush',
      'align'
    ]
  }
  useEffect(() => {
    setContent(getPrivacyPolicy?.data?.description)
  }, [getPrivacyPolicy])
  return (
    <>
      <div className='flex justify-start items-center gap-2 mb-3 relative m-5'>
        <div className='absolute top-6 left-2 flex items-center'>
          <Link to={-1} className='py-1 px-2 rounded-md flex justify-start items-center gap-1  '><IoArrowBackSharp className='text-[var(--primary-color)]' /></Link> <p className='font-semibold'>Privacy Policy</p>
        </div>
      </div>

      <div className="custom-jodit-editor mx-5 ">
        {isDataLoading ? <Loading type="editor" /> : <JoditEditor
          ref={editor}
          value={content}
          config={config}
          tabIndex={1}
          onBlur={newContent => setContent(newContent)}
          onChange={newContent => { }}
        />}
        <div className='flex items-center   justify-center mt-5'>
          <button onClick={handleTerms} className='bg-[var(--primary-color)]  text-white px-4 py-2 rounded-full test'>Save Changes</button>
        </div>

      </div>
    </>
  )
}

export default PrivacyPolicy