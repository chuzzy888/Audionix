import "@stream-io/video-react-sdk/dist/css/styles.css";
import { TbLogout2 } from "react-icons/tb";

import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
  // useNavigate,
} from "react-router-dom";
import Home from "./pages/main";
import { SignIn } from "./pages/sign-in";

import { Room } from "./pages/room";
import { StreamCall } from "@stream-io/video-react-sdk";
import { useUser } from "./user-context";
import Cookies from "universal-cookie";

export default function App() {
  const { call, setUser, setCall } = useUser();
  const cookies = new Cookies();
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route
          path="/room/:roomId"
          element={
            call ? (
              <StreamCall call={call}>
                <Room />{" "}
              </StreamCall>
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>

      <button
        className="logout-button absolute top-0 m-2 hover:bg-red-500 hover:text-white bg-gray-300 p-1 px-2 text-black  rounded-md"
        onClick={() => {
          cookies.remove("token");
          cookies.remove("name");
          cookies.remove("username");
          setUser(null);
          setCall(undefined);
          window.location.pathname = "/sign-in";
        }}
      >
        {" "}
        <TbLogout2 className="text-xl" />
      </button>
    </Router>
  );
}
// {/* <StreamVideo client={client}>
//   <StreamCall call={call}>
//     {/** We will introduce the <MyUILayout /> component later */}
//     * <MyUILayout />
//   </StreamCall>
// </StreamVideo>; */}
