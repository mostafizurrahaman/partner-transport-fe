import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { CiSearch } from 'react-icons/ci';
import { useGetConversationMessageQuery, useGetMessagesConversationQuery } from '../../redux/api/variableManagementApi';
import { imageUrl } from '../../redux/api/baseApi';
import Loading from '../../Components/Loading/Loading';


const ChatBubble = ({ message, senderId, senderImage, receiverImage }) => {
  const isSelf = message.senderId === senderId;
  return (
    <>
      <div className={`flex items-start space-x-2 ${isSelf ? 'flex-row-reverse text-right' : ''} mb-4`}>
        <img
          src={`${isSelf ? `${imageUrl}${senderImage}` : `${imageUrl}${receiverImage}`}`}
          size="large"
          className={isSelf ? 'ml-2 h-10 rounded-full w-10' : 'mr-2 h-10 rounded-full w-10'}
          alt="profile"
        />
        <div className={`flex flex-col max-w-xs ${isSelf ? 'bg-black text-white' : 'bg-[#5C5C5C] text-white'} p-3 rounded-lg`}>
          <p className="whitespace-pre-wrap">{message.text}</p>
          <span className={`text-xs ${isSelf ? 'text-gray-400' : 'text-white'}`}>{message.time}</span>
        </div>
      </div>
    </>
  );
};

const ReviewConversation = () => {
  const [senderImage, setSenderImage] = useState('')
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [receiverImage, setReceiverImage] = useState('')
  const [senderId, setSenderId] = useState('')
  const [receiverId, setReceiverId] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const { data: getConversation, isLoading } = useGetConversationMessageQuery(searchTerm)
  const { data: getMessage } = useGetMessagesConversationQuery({ senderId, receiverId })

  const bottomRef = useRef(null);

  useEffect(() => {
    // scroll down when messages load or change
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [getMessage?.data]);

  const handleConversation = (person) => {
    setSenderId(person[0]?._id)
    setReceiverId(person[1]?._id)
    setReceiverImage(person[1]?.profile_image)
    setSenderImage(person[0]?.profile_image)
    setSelectedConversation(person)
  }

  return (
    <div className='bg-white p-5 rounded-md h-[86vh]'>
      <div className="flex justify-between item-center pb-5">
        <div className="flex items-center gap-2">
          <Link to={-1}><FaArrowLeft size={18} className='text-[var(--primary-color)] ' /></Link>
          <span className='font-semibold text-[20px]'>Review Conversation</span>
        </div>
        <div>
          <div className="relative">
            <input
              onChange={(e) => setSearchTerm(e.target.value)}
              type="text"
              placeholder="Search here..."
              className="w-full pl-10 pr-4 py-1 rounded-md border border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 "
            />
            <span className="absolute left-3 top-2.5 text-gray-400">
              <CiSearch />
            </span>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-12 gap-2 h-full'>
        {/* Left Sidebar - Conversation List */}
        <div className='col-span-3 mt-2 max-h-[80vh] overflow-y-auto'>
          <p className='bg-[#f2f2f2] border-b font-medium text-xl p-2'>Conversation Betweens</p>
          {
            isLoading ? <Loading type="list" /> : getConversation?.data?.map(participant => {
              const isSelected = selectedConversation === participant?.participants;
              return (
                <div 
                  key={participant._id}
                  onClick={() => handleConversation(participant?.participants)} 
                  className={`flex cursor-pointer items-center gap-5 py-4 border p-2 mb-2 shadow-md ${isSelected ? "bg-white" : "bg-gray-200"}`}
                >
                  <div className='flex'>
                    <img className='h-10 rounded-full w-10 ' src={`${imageUrl}${participant?.participants[0]?.profile_image}`} alt="" />
                    <img className='ml-[-10px] h-10 rounded-full w-10' src={`${imageUrl}${participant?.participants[1]?.profile_image}`} alt="" />
                  </div>
                  <p>{participant?.participants[0]?.name} & {participant?.participants[1]?.name}</p>
                </div>
              )
            })
          }

        </div>

        {/* Right Sidebar - Conversation Overview */}
        <div className='col-span-9 max-h-[77vh] overflow-y-auto'>
          <div className='text-xl font-medium border-b pb-2'>Conversation Overview</div>
          <div className="p-6 bg-white rounded-lg space-y-4">
            {
              getMessage?.data ? (
                <>
                  {getMessage?.data?.conversation?.messages?.slice()?.reverse()?.map((msg) => (
                    <ChatBubble 
                      key={msg._id} 
                      message={msg} 
                      senderId={senderId} 
                      receiverImage={receiverImage} 
                      senderImage={senderImage} 
                    />
                  ))}
                  {/* invisible div for auto-scroll */}
                  <div ref={bottomRef} />
                </>
              ) : (
                <div className='flex items-center justify-center min-h-[60vh]'>
                  <p className='text-4xl font-semibold'>Select a conversation</p>
                </div>
              )
            }
            
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReviewConversation;
