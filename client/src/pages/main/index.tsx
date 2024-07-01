// src/components/Home.js

import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import "../../App.css";
import { Call, StreamVideo } from "@stream-io/video-react-sdk";
import { useUser } from "../../user-context";
import CryptoJS from "crypto-js";
import { BsPeopleFill } from "react-icons/bs";

interface Room {
  id: string;
  title: string;
  description: string;
  participantsLength: number;
  createdBy: string;
}

interface NewRoom {
  name: string;
  description: string;
}

const Home = () => {
  const { user, isLoading, client, setCall } = useUser();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<Room[]>([]);

  const [newRoom, setNewRoom] = useState<NewRoom>({
    name: "",
    description: "",
  });

  const hashRoomName = (roomName: string): string => {
    const hash = CryptoJS.SHA256(roomName).toString(CryptoJS.enc.Base64);
    return hash.replace(/[^a-zA-Z0-9_-]/g, "");
  };

  const createRoom = async () => {
    const { name, description } = newRoom;
    if (!client || !user || !name || !description) return;
    const roomID = hashRoomName(name);
    const call = client.call("audio_room", roomID);
    await call.join({
      create: true,
      data: {
        members: [{ user_id: user.username }],
        custom: {
          title: name,
          description,
        },
      },
    });
    setCall(call);
    navigate(`/room/${roomID}`);
  };

  const joinRoom = async (roomId: string) => {
    const call = client?.call("audio_room", roomId);
    await call?.join();
    setCall(call);
    navigate("/room/" + roomId);
  };

  useEffect(() => {
    if (client) fetchListOfCalls();
  }, [client]);

  type CustomCallData = {
    description?: string;

    title?: string;
  };

  const fetchListOfCalls = async () => {
    const callsQueryResponse = await client?.queryCalls({
      filter_conditions: { ongoing: true },
      limit: 25,
      watch: true,
    });
    if (!callsQueryResponse) {
      console.log("Error fetching calls");
    } else {
      const getCallInfo = async (call: Call): Promise<Room> => {
        const callInfo = await call.get();
        const customData = callInfo.call.custom;
        const { title, description } = (customData || {}) as CustomCallData;
        const participantsLength = callInfo.members.length ?? 0;
        const createdBy = callInfo.call.created_by.name ?? "";
        const id = callInfo.call.id ?? "";
        return {
          id,
          title: title ?? "",
          description: description ?? "",
          participantsLength,
          createdBy,
        } as Room;
      };
      const roomPromises = await callsQueryResponse.calls.map((call) =>
        getCallInfo(call)
      );
      const rooms = await Promise.all(roomPromises);
      setRooms(rooms);
    }
  };

  if (isLoading) return <h1> ...</h1>;
  if (!isLoading && !user) {
    console.log(user);
    return <Navigate to="/sign-in" />;
  }

  if (!client) return;

  return (
    <StreamVideo client={client!}>
      <div className="min-h-screen flex flex-col md:flex-row">
        {/* <div className="flex-1  flex items-center justify-center p-10  bg-center">
          <h1>Welcome, {user?.name}</h1>

          <div className="form">
            <h2> Create Your Own Room</h2>
            <input
              placeholder="Room Name..."
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewRoom((prev) => ({ ...prev, name: e.target.value }))
              }
            />
            <input
              placeholder="Room Description..."
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewRoom((prev) => ({ ...prev, description: e.target.value }))
              }
            />
            <button
              onClick={createRoom}
              style={{ backgroundColor: "rgb(125, 7, 236)" }}
            >
              {" "}
              Create Room
            </button>
            <h2>Available Rooms</h2>
          </div>
        </div> */}

        <div className="flex-1 flex items-center justify-center p-10 bg-center  bg-black">
          <div className="max-w-lg w-full bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-2xl font-bold text-center mb-6">
              Welcome, {user?.name}
            </h1>

            <div className="form space-y-6">
              <h2 className="text-xl font-semibold text-gray-700">
                Create Your Own Room
              </h2>
              <input
                placeholder="Room Name..."
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setNewRoom((prev) => ({ ...prev, name: e.target.value }))
                }
              />
              <input
                placeholder="Room Description..."
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setNewRoom((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              />
              <button
                onClick={createRoom}
                className="w-full py-3 bg-indigo-600 text-white font-bold rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Create Room
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1  bg-gray-100 p-10 ">
          <h2 className="text-xl font-semibold text-gray-700 mt-6 ">
            Available Rooms
          </h2>
          {rooms.map((room) => (
            // <div
            //   className="card bg-green-500 p-8 rounded-md text-center cursor-pointer"
            //   key={room.id}
            //   onClick={() => joinRoom(room.id)}
            // >
            //   <h4 className="text-white font-bold text-xl absolute top-24 m-2 bg-black p-1 px-5 rounded-xl">
            //     {room.title}
            //   </h4>
            //   <p>{room.description}</p>
            //   <p> {room.participantsLength} Participants</p>
            //   <p> Created By: {room.createdBy}</p>
            //   <div className="shine"></div>
            // </div>

            <div
              className="bg-card p-4 rounded-lg shadow-lg max-w-md mx-auto cursor-pointer"
              key={room.id}
              onClick={() => joinRoom(room.id)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold text-foreground">
                    {room.title}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {room.description}
                  </p>
                </div>
                <img
                  alt="mic-icon"
                  className="w-6 h-6"
                  src="https://openui.fly.dev/openui/24x24.svg?text=🎤"
                />
              </div>
              <div className="mt-4 flex justify-between items-center">
                <div className="flex items-center">
                  {/* <img
                    src="https://placehold.co/40x40"
                    alt="Profile picture"
                    className="w-10 h-10 rounded-full border-2 border-primary"
                  /> */}
                  <BsPeopleFill className="w-10 h-10 rounded-full border-2 border-green-600" />

                  <div className="ml-2">
                    <p className="text-sm text-foreground">{room.createdBy}</p>
                    <p className="text-xs text-muted-foreground">Host</p>
                  </div>
                </div>
                <div className=" bg-black text-gray-300 rounded-full px-2 py-1">
                  <span className="text-sm font-semibold">
                    {room.participantsLength} Participants
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </StreamVideo>
  );
};

export default Home;
