import { NavLink } from "react-router-dom";
import HomeIcon from "../../assets/icons/home.svg?react";
import WalletIcon from "../../assets/icons/piggy-bank.svg?react";
import Envelope from "../../assets/icons/envelope.svg?react";
import Plus from "../../assets/icons/plus.svg?react";
import User from "../../assets/icons/user.svg?react";
export default function NavigationBar() {
  return (
    <nav className="fixed pb-5 bottom-0 w-full bg-sky-800 text-white shadow-md">
      <div className="flex justify-around items-center py-2">
        <NavLink
          to="/home"
          className={({ isActive }) =>
            `flex items-center text-center px-4 py-2 rounded-md ${
              isActive ? "bg-lime-500 text-white" : "hover:text-gray-300"
            }`
          }
        >
          <HomeIcon className="w-6 h-6" />
        </NavLink>

        <NavLink
          to="/wallet"
          className={({ isActive }) =>
            `flex items-center text-center px-4 py-2 rounded-md ${
              isActive ? "bg-yellow-400 text-white" : "hover:text-gray-300"
            }`
          }
        >
          <WalletIcon className={"w-6 h-6"} />
        </NavLink>

        <NavLink
          to="/post"
          className={({ isActive }) =>
            `flex items-center justify-center w-12 h-12 text-white rounded-xl shadow-lg ${
              isActive
                ? "bg-lime-500 text-white"
                : "hover:bg-lime-600 transition duration-200"
            }`
          }
        >
          <Plus className={"w-6 h-6"} />
        </NavLink>

        <NavLink
          to="/messages"
          className={({ isActive }) =>
            `flex  items-center text-center px-4 py-2 rounded-md ${
              isActive ? "bg-lime-500 text-white" : "hover:text-gray-300"
            }`
          }
        >
          <Envelope className={"w-6 h-6"} />
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex items-center text-center px-4 py-2 rounded-md ${
              isActive ? "bg-lime-500 text-white" : "hover:text-gray-300"
            }`
          }
        >
          <User className={"w-6 h-6"} />
        </NavLink>
      </div>
    </nav>
  );
}
