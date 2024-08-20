import { InputBox } from "./InputBox";
import { Button } from "./Button";
import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

export const SignUp = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  return (
    <div className="w-1/5 border-2 border-lime-400 rounded-lg p-[20px]">
      <h1 className="text-white text-center mt-[10px] mb-[10px] text-3xl font-semibold">
        Sign Up
      </h1>
      <p className="text-slate-300 text-center mb-[20px]">
        Enter your information to create an account
      </p>
      <p className="text-white font-medium mb-[5px]">First Name</p>
      <InputBox
        onChange={(e) => {
          setFirstName(e.target.value);
        }}
        placeholder={"Monkey"}
      />
      <p className="text-white font-medium mb-[5px]">Last Name</p>
      <InputBox
        onChange={(e) => {
          setLastName(e.target.value);
        }}
        placeholder={"Luffy"}
      />
      <p className="text-white font-medium mb-[5px]">Email</p>
      <InputBox
        onChange={(e) => {
          setEmail(e.target.value);
        }}
        placeholder={"luffy@xyz.com"}
      />
      <p className="text-white font-medium mb-[5px]">Password</p>
      <InputBox
        onChange={(e) => {
          setPassword(e.target.value);
        }}
        placeholder={""}
      />
      <Button
        label={"Sign Up"}
        onclick={async () => {
          try {
            const response = await axios.post(
              "http://localhost:3000/api/v1/user/signup",
              {
                username: email,
                firstName: firstName,
                lastName: lastName,
                password: password,
              }
            );
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("firstName", response.data.firstName);
            navigate("/dashboard");
          } catch (error) {
            // handle errors
            if (error.response) {
              // The request was made and the server responded with a status code
              // that falls out of the range of 2xx
              toast.error(error.response.data.message);
            } else if (error.request) {
              // The request was made but no response was received
              console.error("No Response Received");
            } else {
              // Something happened in setting up the request that triggered an Error
              console.error("Request Error:", error.message);
            }
          }
        }}
      />
      <Toaster />
      <p className="text-slate-300 text-center mt-[10px]">
        Already have an account?{" "}
        <Link className="underline cursor-pointer" to={"/signin"}>
          Login
        </Link>
      </p>
    </div>
  );
};
