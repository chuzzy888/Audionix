import { useCall, PermissionRequestEvent } from "@stream-io/video-react-sdk";
import { useCallback, useEffect, useState } from "react";

export const PermissionRequestsPanel = () => {
  // this hook will take the call instance from the <StreamCall /> context.
  const call = useCall();
  const [permissionRequests, setPermissionRequests] = useState<
    PermissionRequestEvent[]
  >([]);

  useEffect(() => {
    return call?.on("call.permission_request", (event) => {
      const request = event as PermissionRequestEvent;
      setPermissionRequests((reqs) => [...reqs, request]);
    });
  }, [call]);

  const handlePermissionRequest = useCallback(
    async (request: PermissionRequestEvent, accept: boolean) => {
      const { user, permissions } = request;
      try {
        if (accept) {
          await call?.grantPermissions(user.id, permissions);
        } else {
          await call?.revokePermissions(user.id, permissions);
        }
        setPermissionRequests((reqs) => reqs.filter((req) => req !== request));
      } catch (err) {
        console.error(`Error granting or revoking permissions`, err);
      }
    },
    [call]
  );

  if (!permissionRequests.length) return null;

  return (
    // <div className="permission-requests">
    //   <h4>Permission Requests</h4>
    //   {permissionRequests.map((request) => (
    //     <div className="permission-request" key={request.user.id}>
    //       <span>
    //         {request.user.name} requested to {request.permissions.join(", ")}
    //       </span>
    //       <button
    //         onClick={() => handlePermissionRequest(request, true)}
    //         style={{ backgroundColor: "green" }}
    //       >
    //         Approve
    //       </button>
    //       <button onClick={() => handlePermissionRequest(request, false)}>
    //         Deny
    //       </button>
    //     </div>
    //   ))}
    // </div>

    <div className="bg-card shadow-lg rounded-lg p-4 w-full max-w-sm mx-auto my-5">
      <div className="flex items-center mb-4">
        <img
          // undefinedhidden="true"
          alt="notification-icon"
          src="https://openui.fly.dev/openui/24x24.svg?text=🔔"
          className="mr-2 h-4"
        />
        <h2 className="text-lg font-semibold text-card-foreground">
          Permission Request
        </h2>
      </div>
      {permissionRequests.map((request) => (
        <div key={request.user.id}>
          <p className="text-muted-foreground mb-4">
            {request.user.name} requests permission to{" "}
            {request.permissions.join(", ")}.
          </p>
          <div className="flex justify-end space-x-2">
            <button
              className="bg-red-500 text-white py-1 px-3 hover:bg-red-400 rounded transition ease-in-out duration-300"
              onClick={() => handlePermissionRequest(request, false)}
            >
              Deny
            </button>
            <button
              className="bg-green-600 text-white py-1 px-3 hover:bg-green-500 rounded transition ease-in-out duration-300"
              onClick={() => handlePermissionRequest(request, true)}
            >
              Approve
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
