import { Modal } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { imageUrl } from "../../redux/api/baseApi";
import Loading from "../Loading/Loading";
import { MdOutlineMessage } from "react-icons/md";

const ChatBubble = ({ message, getConversation, senderId }) => {
  // console.log(message);
  // Check if current user is the sender of this message
  const isSelf = senderId === message?.senderId;

  // Get the correct profile image based on who sent the message
  const getProfileImage = () => {
    if (isSelf) {
      // Current user/admin's profile image (sender)
      return message?.senderDetails?.profile_image ||
        getConversation?.data?.participants?.sender?.details?.profile_image;
    } else {
      // Other participant's profile image (receiver)
      return message?.receiverDetails?.profile_image ||
        getConversation?.data?.participants?.receiver?.details?.profile_image;
    }
  };

  const profileImage = getProfileImage();
  const imageSource = profileImage ? `${imageUrl}${profileImage}` : `${imageUrl}/default-avatar.png`;

  return (
    <div
      className={`flex items-start space-x-2 ${isSelf ? "flex-row-reverse" : ""
        } mb-4`}
    >
      <img
        src={imageSource}
        alt="Profile"
        className={`h-10 w-10 rounded-full flex-shrink-0 ${isSelf ? "ml-2" : "mr-2"
          }`}
      />

      <div
        className={`flex flex-col max-w-xs ${isSelf ? "bg-blue-500 text-white" : "bg-gray-300 text-black"
          } p-3 rounded-lg`}
      >
        <p className="whitespace-pre-wrap">{message.text}</p>
        <span className={`text-xs ${isSelf ? "text-blue-100" : "text-gray-600"}`}>
          {message.time}
        </span>
      </div>
    </div>
  );
};

const ConversationModal = ({
  openConversationModal,
  setOpenConversationModal,
  getConversation,
  senderId,
  setConversationIds,
  serviceId,
  isLoading,
}) => {
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  // Sync messages from API — reset first, then load fresh data
  useEffect(() => {
    if (!openConversationModal) {
      setMessages([]);
      return;
    }
    if (getConversation?.data?.conversation?.messages) {
      setMessages([...getConversation.data.conversation.messages].reverse());
    } else if (getConversation !== undefined) {
      // API responded but no messages found
      setMessages([]);
    }
  }, [getConversation, openConversationModal]);


  // Connect socket and listen for realtime messages
  useEffect(() => {
    if (!openConversationModal || !senderId) return;

    const socket = io("https://backend.xmoveit.com/", {
      query: { id: senderId, role: "ADMIN" },
      transports: ["websocket"],
    });

    socket.on(`new-message/${senderId}`, (newMsg) => {
      setMessages((prev) => {
        const exists = prev.some((m) => m._id === newMsg._id || m.id === newMsg._id);
        if (exists) return prev;
        return [...prev, newMsg];
      });
    });

    if (serviceId) {
      socket.on(`new-message-service/${serviceId}`, (newMsg) => {
        setMessages((prev) => {
          const exists = prev.some((m) => m._id === newMsg._id || m.id === newMsg._id);
          if (exists) return prev;
          return [...prev, newMsg];
        });
      });
    }

    return () => {
      socket.disconnect();
    };
  }, [openConversationModal, senderId]);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const participantSenderId = getConversation?.data?.participants?.sender?.id;
  const participantReceiverId = getConversation?.data?.participants?.receiver?.id;

  console.log("=== PARTICIPANT IDs ===");
  console.log("User   (sender)  ID:", participantSenderId);
  console.log("Partner(receiver)ID:", participantReceiverId);
  console.log("senderId prop      :", senderId);
  console.log("======================", messages);


  return (
    <div>
      <Modal
        onCancel={() => {
          setOpenConversationModal(false);
          setMessages([]);
          // setConversationIds({})
        }}
        open={openConversationModal}
        centered
        footer={false}
        width={800}
      >
        <div className="text-center text-xl font-medium border-b pb-2">
          Conversation Overview
        </div>

        <div className="p-6  mx-auto bg-white rounded-lg space-y-4 max-h-[80vh] overflow-y-auto">
          {isLoading ? (
            <Loading type="chat" />
          ) : messages.length > 0 ? (
            messages.map((msg) => (
              <ChatBubble
                key={msg._id || msg.id}
                message={msg}
                getConversation={getConversation}
                senderId={senderId}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
              <div className="bg-gray-100 p-4 rounded-full mb-4">
                <MdOutlineMessage size={40} className="text-gray-400" />
              </div>
              <p className="text-lg font-medium text-gray-600">No conversation found</p>
              <p className="text-sm text-center">There are no messages in this service context yet.</p>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </Modal>
    </div>
  );
};

export default ConversationModal;
