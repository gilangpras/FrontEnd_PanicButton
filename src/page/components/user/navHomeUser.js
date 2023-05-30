import React from "react";
import { useState, useEffect } from "react";
import Logo from '../../assets/logo.png'
import ProfileDropdownUser from "./profileDropdownUser";
import AlertComponent from "../alert"
import Service from "../../service/services"
import { getGuid } from "../../helper/index";
import { Link } from "react-router-dom";

function NavHomeUser() {
  const [name, setName] = useState("");

  useEffect(() => {
    const data = {
      guid: getGuid(),
    };

    Service
      .GetProfile(data)
      .then((res) => {
        if (res.data.status) {
          setName(res.data.User.name);
        } else {
          AlertComponent.Error(res.data.status);
        }
      })
      .catch((e) => {
        AlertComponent.Error(e.response.data.message);
      });
  }, []);


  return (
    <div className="bg-white">
      <header className="container shadow-sm max-w-full flex justify-between h-20 px-4 md:px-24 items-center flex-wrap">
        <Link to={"/homeuser"}>
          <div className="flex flex-row items-center text-center">
            <img alt="icon-tabungGas" src={Logo} className="w-12 " />
            <h1 className="px-5 font-bold text-red-500 text-lg  font-poppins">
              Panic Button
            </h1>
          </div>
        </Link>

        <div className="flex w-auto h-auto items-center">
          <h1 className="font-bold text-gray-500 hidden sm:block">
            Selamat Datang, {name}!
          </h1>
          <span
            aria-hidden="true"
            className="block h-6 w-px ml-5 rounded-full bg-gray-200"
          ></span>

          <ProfileDropdownUser />
        </div>
      </header>
    </div>


  )
}

export default (NavHomeUser)