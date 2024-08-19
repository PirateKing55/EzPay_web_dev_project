import { useEffect, useState } from "react";
import { InputBox } from "./InputBox";
import { Button } from "./Button";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export const SendMoney = () => {
  const sendMoneyToId = localStorage.getItem("toUserId");
  const sendMoneyToName = localStorage.getItem("toFirstName");
  const token = localStorage.getItem("token");
  const headers = {
    authorization: `Bearer ${token}`,
  };
  const [amount, setAmount] = useState(null);
  return (
    <div className="w-1/5 border-2 border-lime-400 rounded-lg p-[20px]">
      <h1 className="text-3xl font-medium mb-[20px] text-center text-white">
        Send Money
      </h1>
      <h1 className="text-2xl font-medium text-slate-300 mb-[10px]">
        {sendMoneyToName}
      </h1>
      <h2 className="text-slate-300 mb-[10px]">Amount (in Rs)</h2>
      <InputBox onChange={(e) => setAmount(e.target.value)} />
      <Button
        label={"Initiate Transfer"}
        onclick={async () => {
          try {
            const response = await axios.post(
              "https://ezpay-6twy.onrender.com/api/v1/account/transfer",
              {
                to: sendMoneyToId,
                amount: amount,
              },
              { headers }
            );
            toast.success(response.data.message);
          } catch (error) {
            if (error.response) {
              toast.error(error.response.data.message);
            } else if (error.request) {
              console.error("No Response Received");
            } else {
              console.error("Request Error:", error.message);
            }
          }
        }}
      />
      <Toaster />
    </div>
  );
};
