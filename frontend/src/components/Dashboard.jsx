import { Appbar } from "./Appbar";
import { Balance } from "./Balance";
import { Users } from "./Users";

export const Dashboard = () => {
  return (
    <div className="w-full h-full">
      <Appbar />
      <Balance />
      <Users />
    </div>
  );
};
