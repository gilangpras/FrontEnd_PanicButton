/* eslint-disable no-useless-constructor */
import React, { Component } from "react";
import { Link } from "react-router-dom";
import Logo from "../../assets/logo.png"
import Service from "../../service/services"
import AlertComponent from "../../components/alert"
import { Navigate } from "react-router-dom";

export default class LoginPage extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      redirectToReferrer: false,
    };
    this.OnLogin = this.OnLogin.bind(this);
    this.Validasi = this.Validasi.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  Validasi(e) {
    e.preventDefault()
    if (this.state.email === "") {
      AlertComponent.Error("Email Harus Di isi !");
    } else if (this.state.password === "") {
      AlertComponent.Error("Password Harus Di isi !");
    } else {
      this.OnLogin();
    }
  }

  handleInputChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  OnLogin() {
    const data = {
      email: this.state.email,
      password: this.state.password,
    };
    Service.Login(data)
      .then((res) => {
        if (res.data.status) {
          this.setState({ redirectToReferrer: true });
          localStorage.setItem("Token", res.data.token);
          AlertComponent.Succes(res.data.message);
          this.interval = setInterval(
            () => window.location.reload(false),
            1000
          );
        } else {
          AlertComponent.Succes(res.data.message);
        }
      })
      .catch((err) => {
        AlertComponent.Error("Email dan Password Salah !");
      });
  }
  
  render() {
    if (this.state.redirectToReferrer) {
      return <Navigate to={"/homeuser"} />;
    }

    return (
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          
          <Link to={"/"}>
            <div className="flex flex-row justify-center">
              <img alt="icon-tabungGas" src={Logo} className="w-28 mb-4" />
            </div>
          </Link>
      
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
              <h2 className="mb-10 text-center text-3xl font-bold text-gray-700">
                Masukan akun anda
              </h2>
            </div>
      
            <form className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    value={this.state.email}
                    onChange={this.handleInputChange}
                  />
                </div>
              </div>
      
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="mt-1">
                  <input
                    name="password"
                    type="password"
                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    value={this.state.password}
                    onChange={this.handleInputChange}
                  />
                </div>
              </div>
      
              <div className="flex justify-center">
                <div className="flex items-center">
                  <h3 className="block text-xs">
                    Apakah kamu sudah memiliki akun?
                    <Link to="/register">
                      <span className="text-[#FEAE1C] ml-1 font-semibold underline">Daftar</span>
                    </Link>
                  </h3>
                </div>
              </div>
              <div>
              <Link to="/homeuser">
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#FEAE1C] hover:bg-[#dd9919] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FEAE1C]"
                  onClick={(e) => this.Validasi(e)}
                >
                  Sign in
                  <i className="fa-sharp fa-solid fa-arrow-up ml-2 mt-1"></i>
                </button>
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>    
      );
    }
  }
