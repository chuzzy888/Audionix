import * as yup from "yup";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import "../../App.css";
import { StreamVideoClient, User } from "@stream-io/video-react-sdk";
import { Navigate, useNavigate } from "react-router-dom";
import { useUser } from "../../user-context";
import Cookies from "universal-cookie";
import { PEOPLES_IMAGES } from "../../avatars";

interface FormValues {
  username: string;
  name: string;
}

export const SignIn = () => {
  const schema = yup.object().shape({
    username: yup
      .string()
      .matches(/^[a-zA-Z0-9_.@$]+$/, "Invalid username")
      .required("Username is required"),
    name: yup.string().required("Name is required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
  });

  const cookies = new Cookies(null, { path: "/" });

  const { setUser, setClient, isLoading } = useUser();

  const navigate = useNavigate();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const { username, name } = data;

    const response = await fetch("http://localhost:3001/auth/createUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        name,
        image:
          PEOPLES_IMAGES[Math.floor(Math.random() * PEOPLES_IMAGES.length)],
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch token");
    }

    const responseData = await response.json();
    console.log(responseData);
    const user: User = {
      id: username,
      name,
    };

    const myClient = new StreamVideoClient({
      apiKey: "grs7vtwsg6mr",
      user,
      token: responseData.token,
    });

    const expires = new Date();
    expires.setDate(expires.getDate() + 1);
    cookies.set("token", responseData.token, {
      expires,
    });
    cookies.set("username", username, {
      expires,
    });
    cookies.set("name", name, {
      expires,
    });
    setClient(myClient);
    setUser({ name, username });
    navigate("/");
  };

  if (cookies.get("username") && !isLoading) return <Navigate to="/" />;

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div
        className="flex-1 bgc flex items-center justify-center p-10 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.pexels.com/photos/6953868/pexels-photo-6953868.jpeg?auto=compress&cs=tinysrgb&w=600')",
          backgroundBlendMode: "darken",
        }}
      >
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold text-white mb-4">
            "Your Voice, Our World - Welcome to{" "}
            <span className="text-green-300">Audionix</span> "
          </h1>
          <p className="text-white mb-8 text-gray-300">
            Connect and converse in real-time worldwide. Host shows, join
            discussions, and let your voice be heard. Audionix – Your Voice, Our
            World.
          </p>
        </div>
      </div>

      {/* <div className="flex-1 flex items-center justify-center p-10 relative">
        <div className="max-w-md w-full">
          <h1>Welcome to Audionix 2.0</h1>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label>Username: </label>
              <input type="text" {...register("username")} />
              {errors.username && (
                <p style={{ color: "red" }}>{errors.username.message}</p>
              )}
            </div>
            <div>
              <label>Name: </label>
              <input type="text" {...register("name")} />
              {errors.name && (
                <p style={{ color: "red" }}>{errors.name.message}</p>
              )}
            </div>
            <button type="submit">Sign In</button>
          </form>
        </div>
      </div> */}

      <div className="flex-1 flex items-center justify-center bg-gray-100 p-10">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-center mb-6">
            Welcome to Audionix 2.0
          </h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Username:
              </label>
              <input
                type="text"
                {...register("username")}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              {errors.username && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.username.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name:
              </label>
              <input
                type="text"
                {...register("name")}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              {errors.name && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.name.message}
                </p>
              )}
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-indigo-600 text-white font-bold rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
