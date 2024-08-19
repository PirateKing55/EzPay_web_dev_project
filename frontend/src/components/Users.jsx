import { InputBox } from "./InputBox";
import { Button } from "./Button";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Users = () => {
  const [filter, setFilter] = useState("");
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("token");
  const headers = {
    authorization: `Bearer ${token}`,
  };
  useEffect(() => {
    axios
      .get("https://ezpay-6twy.onrender.com/api/v1/user/bulk?filter=" + filter, {
        headers,
      })
      .then((response) => setUsers(response.data.user))
      .catch((error) => {
        console.error("Error:", error.message);
      });
  }, [filter]);
  return (
    <div className="p-[20px]">
      <InputBox
        onChange={(e) => setFilter(e.target.value)}
        placeholder={"Search for users"}
      />
      {users.map((user) => {
        return (
          <User key={user._id} firstName={user.firstName} userId={user._id} />
        );
      })}
    </div>
  );
};

const User = ({ firstName, userId }) => {
  const capitalizeLetter = (word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  };
  const capitalizedFirstName = capitalizeLetter(firstName);
  const navigate = useNavigate();
  return (
    <div className="flex justify-between p-[20px] border-b-[1px] border-lime-400">
      <div className="flex items-center justify-center">
        <h1 className="text-xl font-semibold text-slate-300">
          {capitalizedFirstName}
        </h1>
      </div>
      <div>
        <Button
          label={"Send Money"}
          onclick={() => {
            localStorage.setItem("toUserId", userId);
            localStorage.setItem("toFirstName", capitalizedFirstName);
            navigate("/send");
          }}
        />
      </div>
    </div>
  );
};
