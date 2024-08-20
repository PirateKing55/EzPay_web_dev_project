import { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export const Balance = () => {
  const token = localStorage.getItem("token");
  const headers = {
    authorization: `Bearer ${token}`,
  };
  const [balance, setBalance] = useState(0.0);
  useEffect(() => {
    axios
      .get("https://ezpay-yaman.onrender.com/api/v1/account/balance", {
        headers,
      })
      .then((response) => {
        setBalance(response.data.balance);
      })
      .catch((error) => {
        console.error("Error:", error.message);
        toast.error(error.response.data.message);
      });
  }, []);
  return (
    <div className="pl-[20px] mb-[20px]">
      <h1 className="text-xl font-semibold text-slate-300">
        Your Balance:{" "}
        <span className="text-white">Rs. {balance.toFixed(2)}</span>
      </h1>
      <Toaster />
    </div>
  );
};
