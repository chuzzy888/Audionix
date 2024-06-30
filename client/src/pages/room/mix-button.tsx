import { useCallStateHooks } from "@stream-io/video-react-sdk";

export const MicButton = () => {
  const { useMicrophoneState } = useCallStateHooks();
  const { microphone, isMute } = useMicrophoneState();

  return (
    <button
      style={{
        backgroundColor: "rgb(125, 7, 236)",
        padding: "5px",
        color: "white",
        borderRadius: "5px",
      }}
      onClick={async () => {
        if (isMute) {
          await microphone?.enable();
        } else {
          await microphone?.disable();
        }
      }}
    >
      {isMute ? "Unmute" : "Mute"}
    </button>
  );
};
