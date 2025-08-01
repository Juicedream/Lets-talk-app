import { PhoneIcon, VideoIcon } from "lucide-react";

const CallButton = ({ handleVideoCall, handlePhoneCall, showCall = true }) => {
  return (
    <div className="p-3 border-b flex items-center justify-end max-w-7xl mx-auto w-full absolute top-0 gap-2">
      <button
        onClick={handleVideoCall}
        className="btn btn-success btn-sm text-white"
      >
        <VideoIcon className="size-6" />
      </button>
      {showCall && (
        <button
          onClick={handlePhoneCall}
          className="btn btn-outline btn-sm text-success"
        >
          <PhoneIcon className="size-6" />
        </button>
      )}
    </div>
  );
};
export default CallButton;
