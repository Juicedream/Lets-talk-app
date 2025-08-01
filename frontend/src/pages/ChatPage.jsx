import { useEffect, useState } from "react";
import { useParams } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";
import {
  Channel,
  ChannelHeader,
  MessageList,
  MessageInput,
  Window,
  Thread,
  Chat,
  useTypingContext
} from "stream-chat-react";
import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";
import ChatLoader from "../components/ChatLoader";
import CallButton from "../components/CallButton";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;
// console.log("Stream API Key:", STREAM_API_KEY);

const ChatPage = () => {
  const { id: targetUserId } = useParams();
  // console.log("Chat ID:", id);
  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);


  const { authUser } = useAuthUser();
  // console.log("Auth User:", authUser);
  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser, //this will run only when authuser is available
  });

  useEffect(() => {
    const initChat = async () => {
      if (!authUser || !tokenData?.request) return;
      try {
        console.log("Initializing stream chat...");
        const client = StreamChat.getInstance(STREAM_API_KEY);
        await client.connectUser(
          {
            id: authUser._id,
            name: authUser.name,
            image: authUser.profilePicture,
          },
          tokenData?.request
        );
        //create a channel with the target user
        const channelId = [authUser._id, targetUserId].sort().join("-");
        const currChannel = client.channel("messaging", channelId, {
          members: [authUser._id, targetUserId],
        });
        await currChannel.watch();
        setChatClient(client);
        setChannel(currChannel);
        // toast.success("Chat initialized successfully!");

      } catch (error) {
        console.error("Error initializing chat:", error);
        toast.error("Failed to initialize chat. Please try again later.");
      }finally {
        setLoading(false);
      }
      
    };
    initChat();
  }, [tokenData, authUser, targetUserId]);


  const handleVideoCall = () => {
    // toast.error("Video call feature is not implemented yet.");
    if(channel){
      const callUrl = `${window.location.origin}/call/${channel.id}`;

      channel.sendMessage({
        text: `I've started a video call. Join me here: ${callUrl}`,
      });
      toast.success("Video call link sent successfully!");
    }
  }
  const handlePhoneCall = () => {
    // toast.error("Phone call feature is not implemented yet.");
     if (channel) {
       const callUrl = `${window.location.origin}/call/${channel.id}`;

       channel.sendMessage({
         text: `Calling you. Join me here: ${callUrl}`,
       });
       toast.success("Call started successfully!");
     }
  };

  if(loading || !chatClient || !channel) return <ChatLoader />
  return (
    <div className="h-[93vh]">
      <Chat client={chatClient}>
        <Channel channel={channel}>
          <div className="w-full relative">
            <CallButton handleVideoCall={handleVideoCall} showCall={false} handlePhoneCall={handlePhoneCall} />
           
            <Window>
              <ChannelHeader />
              <MessageList />
             <TypingIndicator />
              <MessageInput audioRecordingEnabled focus />
            </Window>
            <Thread />
          </div>
        </Channel>
      </Chat>
    </div>
  );
};
export default ChatPage;


const TypingIndicator = () => {
  const { typing } = useTypingContext();

  const usersTyping = Object.values(typing || {}).filter(Boolean);
  if (usersTyping.length === 0) return null;

  // return (
  //   <div className="text-xs px-4 py-1 text-gray-500 italic">
  //     {usersTyping.map((u) => u.user.name).join(", ")} is typing...
  //   </div>
  // );
};
