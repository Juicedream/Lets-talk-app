import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router"
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";

import {
  StreamVideo,
  StreamVideoClient,
  StreamCall,
  CallControls,
  SpeakerLayout,
  StreamTheme,
  CallingState,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";

import "@stream-io/video-react-sdk/dist/css/styles.css";
import PageLoader from "../components/PageLoader";
import toast from "react-hot-toast";


const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const CallPage = () => {
  const { id: callId } = useParams();
  const [client, setClient] = useState(null);
  // const [chatClient, setChatClient] = useState(null);
  const [call, setCall] = useState(null);
  const [isConnecting, setIsConnecting] = useState(true);
  const { authUser, isLoading } = useAuthUser();

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enable: !!authUser,
  });

  console.log(tokenData?.request);


  useEffect(() => {
    const initCall = async () => {
      if (!tokenData?.request || !authUser || !callId) return;

      try {
        console.log("Initializing Stream video client...");
        const user = {
          id: authUser._id,
          name: authUser.name,
          image: authUser.profilePic,
        };

        const videoClient = new StreamVideoClient({
          apiKey: STREAM_API_KEY,
          user,
          token: tokenData?.request,
        });

        const callInstance = videoClient.call("default", callId);
        await callInstance.join({ create: true });
        console.log("Call joined successfully");

        setClient(videoClient);
        // setChatClient(chatClientForCall);
        setCall(callInstance);
      } catch (error) {
        console.error("Error initializing call:", error);
        toast.error("Could not join the call. Please try again later.");
      } finally {
        setIsConnecting(false);
      }
    };

    initCall();
  }, [tokenData, authUser, callId]);

  if (isLoading || isConnecting) return <PageLoader />;
  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <div className="relative">
        {client && call ? (
         
            <StreamVideo client={client}>
              <StreamCall call={call} theme={StreamTheme.DARK}>
                <CallContent />
              </StreamCall>
            </StreamVideo>
          
        ) : (
          <div className="flex items-center justify-center h-full">
            <p>Could not initialize call. Please refresh or try again later.</p>
          </div>
        )}
      </div>
    </div>
  );
}

const CallContent= () => {
  const {useCallCallingState} = useCallStateHooks();
  const callingState = useCallCallingState();

  const navigate = useNavigate();
  const friendID = useParams().id.split("-")[1]; // Assuming callId is in the format "friendID-callID"
  if(callingState === CallingState.LEFT) return navigate(`/chat/${friendID}`);
  return (
    <StreamTheme>
      <SpeakerLayout />
      <CallControls/>
    </StreamTheme>
  );

}

export default CallPage;