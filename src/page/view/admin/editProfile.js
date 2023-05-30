import React, { Component } from "react";
import { Navigate } from "react-router-dom";
import AlertComponent from "../../components/alert";
import service from "../../service/services";
import { getGuid } from "../../helper/index";
import NavHomeAdmin from "../../components/admin/navHomeAdmin";

export default class EditProfile extends Component {
  constructor() {
    super();
    this.state = {
      redirectToReferrer: false,
      show: false,
      fullscreen: true,
      email: "",
      name: "",
      password: "",
      phone_number: "",
    };
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  componentDidMount() {
    const data = {
      guid: getGuid(),
    };
    service
      .GetProfile(data)
      .then((res) => {
        if (res.data.status) {
          this.setState({ email: res.data.User.email });
          this.setState({ name: res.data.User.name });
          this.setState({ phone_number: res.data.User.phone_number });
        } else {
          AlertComponent.Error(res.data.status);
        }
      })
      .catch((e) => {
        AlertComponent.Error(e.response.data.message);
      });
  }

  UpdateProfile() {
    const data = {
      guid_user: getGuid(),
      password: this.state.password,
      name: this.state.name,
      email: this.state.email,
      phone_number: this.state.phone_number
    };
    if (this.state.password === "") {
      AlertComponent.Error("Kolom Password Harus Di isi !");
    } else if (this.state.name === "") {
      AlertComponent.Error("Kolom Nama Harus Di isi !");
    } else if (this.state.phone_number === "") {
      AlertComponent.Error("Kolom Nomor Handphone Harus Di isi !");
    } else {
      service
        .UpdateProfile(data)
        .then((res) => {
          if (res.data.status) {
            AlertComponent.Succes(res.data.message);
            this.setState({ redirectToReferrer: true });
            // eslint-disable-next-line no-implied-eval
            setInterval("window.location.reload()", 1000);
          } else {
            AlertComponent.Error(res.data.status);
          }
        })
        .catch((e) => {
          console.log(e);
          AlertComponent.Error("Server tidak merespon");
        });
    }
  }

  handleInputChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  render() {
    if (this.state.redirectToReferrer) {
      return <Navigate to={"/editprofile"} />;
    }
    return (
      <div>
        <NavHomeAdmin />

        <main className="flex flex-col items-center justify-center px-4 py-4 sm:px-6 lg:col-span-7 lg:py-8 lg:px-8 xl:col-span-5 xl:px-12">
          <div className="w-full max-w-md py-6 px-6 rounded-3xl my-5 shadow-xl border">
            <h1 className="text-lg font-poppins font-semibold text-center mb-8">Edit Profile</h1>

            <form className="grid grid-cols-1 gap-6">
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700">
                  Nama
                </label>
                <input
                  className="w-full py-2 px-3 border rounded-md border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  type="text"
                  placeholder="Nama Anda"
                  name="name"
                  value={this.state.name}
                  onChange={this.handleInputChange}
                />
              </div>

              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700">
                  Nomor Handphone
                </label>

                <input
                  type="phone_number"
                  placeholder="Masukan Nomor Handphone"
                  className="w-full py-2 px-3 border rounded-md border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  name="phone_number"
                  value={this.state.phone_number}
                  onChange={this.handleInputChange}
                />
              </div>

              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>

                <input
                  type="email"
                  placeholder="contoh@gmail.com"
                  className="w-full py-2 px-3 border rounded-md border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  name="email"
                  value={this.state.email}
                  onChange={this.handleInputChange}
                />
              </div>

              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>

                <input
                  type="password"
                  placeholder="Masukan password anda"
                  className="w-full border py-2 px-3 rounded-md border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  name="password"
                  value={this.state.password}
                  onChange={this.handleInputChange}
                />
              </div>

              <div className="flex items-center justify-center">
                <button type="submit" onClick={(e) => this.UpdateProfile()} className="w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#FEAE1C] hover:bg-[#eea41c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#e069a5]">Update Profile</button>
              </div>
            </form>
          </div>
        </main>

      </div>
    );
  }
}
