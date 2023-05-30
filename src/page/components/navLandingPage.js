import React, { Component } from "react"
import Logo from '../assets/logo.png'
import { Link } from "react-router-dom";

export default class NavLandingPage extends Component {

render() {
  return (
    <div className="bg-white shadow-sm fixed top-0 w-full z-10">
        <header className="container mx-auto px-4 lg:px-24 flex flex-row items-center justify-between h-20">
          <Link to='/'>
            <div className="flex items-center">
              <img alt="icon-tabungGas" src={Logo} className="w-12" />
              <h1 className="ml-5 font-bold text-red-600 text-md lg:text-lg font-poppins"> Panic Button</h1>
            </div>
          </Link>

        <div className="flex-1">
          <nav aria-label="Site Nav">
            <ul className="flex flex-row font-medium font-poppins space-x-12 mr-14 justify-end">
              <Link to='/'>
                <li className="hidden sm:block">
                  <span className="relative font-medium text-black before:absolute before:-bottom-1 before:h-0.5 before:w-full before:scale-x-0 before:bg-[#FEAE1C] before:transition hover:before:scale-x-100">
                    Beranda
                  </span>
                </li>
              </Link>

              <Link to='/tentangkami'>
                <li className="hidden sm:block">
                  <span className="relative font-medium text-black before:absolute before:-bottom-1 before:h-0.5 before:w-full before:scale-x-0 before:bg-[#FEAE1C] before:transition hover:before:scale-x-100">
                    Tentang Kami
                  </span>
                </li>
              </Link>
            </ul>
          </nav>
        </div>


        <div className="flex flex-row mr-18">
        <Link to='/login'>
          <button className="border-2 text-sm font-semibold text-[#FEAE1C] border-[#FEAE1C] font-poppins      
            rounded-xl py-1.5 px-5 mr-2"> Masuk
          </button>
          </Link>

          <Link to='/register'>
          <button className="border-2 text-sm font-semibold bg-[#FEAE1C] text-white border-[#FEAE1C] font-poppins      
            rounded-xl py-1.5 px-5"> Daftar
          </button>
          </Link>
        </div>
      </header>
      </div>
    )
  }
}