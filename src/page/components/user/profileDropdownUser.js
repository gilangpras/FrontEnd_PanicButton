import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";
import "react-confirm-alert/src/react-confirm-alert.css"

function ProfileDropdownUser() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function handleLogout(event) {
    event.preventDefault();
    swal({
      title: "Konfirmasi Logout",
      text: "Apakah Anda yakin ingin keluar?",
      icon: "warning",
      buttons: ["Batal", "Logout"],
      dangerMode: true,
    }).then((willLogout) => {
      if (willLogout) {
        localStorage.clear();
        navigate("/login");
      }
    });
  }

  function handleEditProfile() {
    navigate("/editprofileuser")
  }

  return (
    <div className="relative">
      <button
        className=" text-gray-300 py-2 px-4 rounded-full"
        onClick={toggleDropdown}
      >
        <i className="fa-solid fa-user text-lg border border-gray-300 py-2 px-2 text-gray-500 rounded-full"></i>
      </button>
      {isOpen && (
        <div
          className="absolute right-0 z-10 mt-2 w-56 rounded-md border border-gray-100 bg-white shadow-lg"
          role="menu"
        >
          <div className="p-2">
            <button
              className="block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
              role="menuitem"
              onClick={handleEditProfile}
            >
              Edit Profile
            </button>

            <form className="border-t-2" onSubmit={handleLogout}>
              <button
                type="submit"
                className="flex w-full items-center gap-2 rounded-lg px-4 py-2 text-sm text-red-700 hover:bg-red-50"
              >
                <i className="fa-solid fa-right-from-bracket"></i>

                Logout
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfileDropdownUser;
