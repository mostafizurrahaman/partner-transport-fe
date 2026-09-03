import React, { useEffect, useState } from 'react'
import { Input, Modal } from 'antd';
import { IoMdSend } from 'react-icons/io';
import { io } from 'socket.io-client';
import { useGetAdminProfileQuery } from '../../redux/api/authApi';

const ChatBubble = ({ message, receiverId }) => {
  const isSelf = message.senderId !== receiverId;
  return (
    <div className={`flex items-start space-x-2 ${isSelf ? 'flex-row-reverse text-right' : ''} mb-4`}>
      <div className={`flex flex-col max-w-xs ${isSelf ? 'bg-blue-600 text-white' : 'bg-[#5C5C5C] text-white'} p-3 rounded-lg`}>
        <p className="whitespace-pre-wrap">{message.text}</p>
        <span className={`text-xs ${isSelf ? 'text-gray-400' : 'text-white'}`}>{message.time}</span>
      </div>
    </div>
  );
};

const ChatModal = ({ openChatModal, setOpenChatModal, data, receiverId, sendNoticeId }) => {
  const { data: getAdmins } = useGetAdminProfileQuery();
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);

  const role = getAdmins?.data?.authId?.role;

  console.log(role);

  useEffect(() => {
    // if (!receiverId) return;

    // console.log(receiverId);

    const newSocket = io(`https://backend.xmoveit.com/?id=${receiverId}&role=${role}`);
    setSocket(newSocket);

    // Listen for new messages
    newSocket.on(`new-message/${sendNoticeId}`, (message) => {
      setMessages((prevMessages) => {
        const isMessageExists = prevMessages.some((msg) => msg.id === message.id);
        if (isMessageExists) return prevMessages;
        return [...prevMessages, message];
      });
    });

    return () => {
      newSocket.disconnect();
    };
  }, [receiverId, sendNoticeId, role]); 

  // console.log(receiverId);
  useEffect(() => {
    if (data?.conversation?.messages) {
      setMessages([...data.conversation.messages].reverse());
    }
  }, [data]);

  const handleSendMessage = () => {
    if (newMessage.trim() && socket) {
      const messageData = {
        text: newMessage,
        senderId: sendNoticeId,
      };
      socket.emit("new-message", messageData);
      console.log(messages);
      
      setNewMessage('');
    }
  };

  return (
    <Modal onCancel={() => {
      setOpenChatModal(false);
      setMessages([]);
    }} open={openChatModal} centered footer={false} width={800} >
      <div className='text-center text-xl font-medium border-b pb-2'>Conversation Overview</div>
      {
        data?.conversation ? (
          <div className="p-6  mx-auto bg-white rounded-lg space-y-4 max-h-[80vh] overflow-y-auto">
            {messages?.map((msg) => (
              <ChatBubble key={msg?.id} message={msg} receiverId={receiverId} />
            ))}
            <div className='flex items-center gap-2'>
              <Input value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder='Message...' className='bg-gray-100 border-none py-2' />
              <button onClick={handleSendMessage} className='bg-blue-600 p-2 text-white rounded-md'>
                <IoMdSend size={20} />
              </button>
            </div>
          </div>
        ) : (
          <div>
            <p className='text-center my-10'>No Conversation Started</p>
            <div className='flex items-center gap-2'>
              <Input onChange={(e) => setNewMessage(e.target.value)} placeholder='Message...' className='bg-gray-100 border-none py-2' />
              <button onClick={handleSendMessage} className='bg-blue-600 p-2 text-white rounded-md'>
                <IoMdSend size={20} />
              </button>
            </div>
          </div>
        )
      }
    </Modal>
  );
};

export default ChatModal;
