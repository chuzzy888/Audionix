import {
  // Call,
  OwnCapability,
  // StreamCall,
  useCall,
  useCallStateHooks,
  useRequestPermission,
} from "@stream-io/video-react-sdk";
import { Participants } from "./participants";
import { Controls } from "./controls";
// import { useLocation } from "react-router-dom";
import { useUser } from "../../user-context";
import { PermissionRequestsPanel } from "./permission-request";

export const Room = () => {
  const {
    useCallCustomData,
    useParticipants,
    useCallCreatedBy,
    // useHasPermissions,
  } = useCallStateHooks();
  const { user } = useUser();
  useCall();
  const custom = useCallCustomData();
  const participants = useParticipants();
  const createdBy = useCallCreatedBy();
  const { hasPermission, requestPermission } = useRequestPermission(
    OwnCapability.SEND_AUDIO
  );

  return (
    // <div className="bg-red-500">
    //   <h2 className="title">{custom?.title ?? "<Title>"}</h2>
    //   <h3 className="description">{custom?.description ?? "<Description>"}</h3>
    //   <p className="participant-count">{participants.length} participants</p>

    //   <Participants />
    //   {user?.username === createdBy?.id ? (
    //     <>
    //       <PermissionRequestsPanel />
    //     </>
    //   ) : (
    //     <button className="request-permission-btn" onClick={requestPermission}>
    //       {" "}
    //       &#9995;
    //     </button>
    //   )}
    //   {hasPermission && <Controls />}
    // </div>

    // <div className="min-h-screen flex flex-col items-center p-6 bg-background text-foreground">
    //   <h1 className="text-3xl font-bold mb-4">Live Discussion</h1>

    //   <p className="mb-6 text-muted-foreground text-center">
    //     "Understanding the impact of AI on modern society."
    //   </p>

    //   <div className="flex space-x-4 mb-4">
    //     <div className="flex flex-col items-center">
    //       <img
    //         className="w-16 h-16 rounded-full border-2 border-accent bg-muted"
    //         src="https://placehold.co/64x64"
    //         alt="User Avatar"
    //       />
    //       <span className="text-sm mt-2">User 1</span>
    //     </div>
    //     <div className="flex flex-col items-center">
    //       <img
    //         className="w-16 h-16 rounded-full border-2 border-accent bg-muted"
    //         src="https://placehold.co/64x64"
    //         alt="User Avatar"
    //       />
    //       <span className="text-sm mt-2">User 2</span>
    //     </div>
    //   </div>

    //   <div className="flex space-x-4 mb-4">
    //     <button className="bg-destructive text-destructive-foreground p-2 rounded-md">
    //       Mute
    //     </button>
    //     <button className="bg-primary text-primary-foreground p-2 rounded-md">
    //       Go Live
    //     </button>
    //   </div>

    //   <div className="text-center text-muted-foreground">
    //     <span className="text-lg font-bold">5</span> participants
    //   </div>
    // </div>

    <div className="min-h-screen flex flex-col justify-center items-center p-6 bg-background text-foreground">
      <h1 className="text-3xl font-bold mb-4">{custom?.title ?? "<Title>"}</h1>

      <p className="mb-6 text-muted-foreground text-center">
        {custom?.description ?? "<Description>"}
      </p>

      <Participants />

      {user?.username === createdBy?.id ? (
        <div className=" m-3 bg-white  absolute top-0 ">
          <PermissionRequestsPanel />
        </div>
      ) : (
        <button className="request-permission-btn" onClick={requestPermission}>
          {" "}
          &#9995;
        </button>
      )}
      {hasPermission && <Controls />}

      <div className="text-center text-muted-foreground">
        <span className="text-lg font-bold">{participants.length} </span>{" "}
        participants
      </div>
    </div>
  );
};
