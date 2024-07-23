// import { useCall, PermissionRequestEvent } from "@stream-io/video-react-sdk";
// import { useCallback, useEffect, useState } from "react";

// export const PermissionRequestsPanel = () => {
//   // this hook will take the call instance from the <StreamCall /> context.
//   const call = useCall();
//   const [permissionRequests, setPermissionRequests] = useState<
//     PermissionRequestEvent[]
//   >([]);

//   useEffect(() => {
//     return call?.on("call.permission_request", (event) => {
//       const request = event as PermissionRequestEvent;
//       setPermissionRequests((reqs) => [...reqs, request]);
//     });
//   }, [call]);

//   const handlePermissionRequest = useCallback(
//     async (request: PermissionRequestEvent, accept: boolean) => {
//       const { user, permissions } = request;
//       try {
//         if (accept) {
//           await call?.grantPermissions(user.id, permissions);
//         } else {
//           await call?.revokePermissions(user.id, permissions);
//         }
//         setPermissionRequests((reqs) => reqs.filter((req) => req !== request));
//       } catch (err) {
//         console.error(`Error granting or revoking permissions`, err);
//       }
//     },
//     [call]
//   );

//   if (!permissionRequests.length) return null;

//   return (
//     // <div className="permission-requests">
//     //   <h4>Permission Requests</h4>
//     //   {permissionRequests.map((request) => (
//     //     <div className="permission-request" key={request.user.id}>
//     //       <span>
//     //         {request.user.name} requested to {request.permissions.join(", ")}
//     //       </span>
//     //       <button
//     //         onClick={() => handlePermissionRequest(request, true)}
//     //         style={{ backgroundColor: "green" }}
//     //       >
//     //         Approve
//     //       </button>
//     //       <button onClick={() => handlePermissionRequest(request, false)}>
//     //         Deny
//     //       </button>
//     //     </div>
//     //   ))}
//     // </div>

//     <div className="bg-card shadow-lg rounded-lg p-4 w-full max-w-sm mx-auto my-5">
//       <div className="flex items-center mb-4">
//         <img
//           // undefinedhidden="true"
//           alt="notification-icon"
//           src="https://openui.fly.dev/openui/24x24.svg?text=🔔"
//           className="mr-2 h-4"
//         />
//         <h2 className="text-lg font-semibold text-card-foreground">
//           Permission Request
//         </h2>
//       </div>
//       {permissionRequests.map((request) => (
//         <div key={request.user.id}>
//           <p className="text-muted-foreground mb-4">
//             {request.user.name} requests permission to{" "}
//             {request.permissions.join(", ")}.
//           </p>
//           <div className="flex justify-end space-x-2">
//             <button
//               className="bg-red-500 text-white py-1 px-3 hover:bg-red-400 rounded transition ease-in-out duration-300"
//               onClick={() => handlePermissionRequest(request, false)}
//             >
//               Deny
//             </button>
//             <button
//               className="bg-green-600 text-white py-1 px-3 hover:bg-green-500 rounded transition ease-in-out duration-300"
//               onClick={() => handlePermissionRequest(request, true)}
//             >
//               Approve
//             </button>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

import { useCall, PermissionRequestEvent } from "@stream-io/video-react-sdk";
import { useCallback, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

export const PermissionRequestsPanel = () => {
  const call = useCall();
  const [permissionRequests, setPermissionRequests] = useState<
    PermissionRequestEvent[]
  >([]);
  const [isOpen, setIsOpen] = useState(false);
  const [currentRequest, setCurrentRequest] =
    useState<PermissionRequestEvent | null>(null);

  useEffect(() => {
    return call?.on("call.permission_request", (event) => {
      const request = event as PermissionRequestEvent;
      setPermissionRequests((reqs) => [...reqs, request]);
      setCurrentRequest(request);
      setIsOpen(true);
    });
  }, [call]);

  const handlePermissionRequest = useCallback(
    async (accept: boolean) => {
      if (!currentRequest) return;
      const { user, permissions } = currentRequest;
      try {
        if (accept) {
          await call?.grantPermissions(user.id, permissions);
        } else {
          await call?.revokePermissions(user.id, permissions);
        }
        setPermissionRequests((reqs) =>
          reqs.filter((req) => req !== currentRequest)
        );
        setIsOpen(false);
      } catch (err) {
        console.error(`Error granting or revoking permissions`, err);
      }
    },
    [call, currentRequest]
  );

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Permission Request
                  </Dialog.Title>
                  <div className="mt-2">
                    {currentRequest && (
                      <p className="text-sm text-gray-500">
                        {currentRequest.user.name} requests permission to{" "}
                        {currentRequest.permissions.join(", ")}.
                      </p>
                    )}
                  </div>

                  <div className="mt-4 flex justify-end space-x-2">
                    <button
                      className="inline-flex justify-center rounded-md border border-transparent bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                      onClick={() => handlePermissionRequest(false)}
                    >
                      Deny
                    </button>
                    <button
                      className="inline-flex justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                      onClick={() => handlePermissionRequest(true)}
                    >
                      Approve
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};
