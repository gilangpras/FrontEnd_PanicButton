import React, { Component } from "react"
import Logo from '../assets/logo.png'
import { Link } from "react-router-dom";

export default class NavLandingPage extends Component {

render() {
  return (
    <div className="bg-white">
      <header className="container shadow-sm max-w-full mx-auto flex flex-row h-20 px-24 items-center">
        <Link to='/'>
          <div className="flex flex-row items-center text-center">
            <img alt="icon-tabungGas" src={Logo} className="w-12" />
            <h1 className="px-5 font-bold text-red-600 text-lg font-poppins"> Panic Button</h1>
          </div>
        </Link>

        <div class="flex-1 ">
          <nav aria-label="Site Nav">
            <ul class="flex flex-row font-medium font-poppins space-x-12 mr-14 justify-end">
              <Link to='/'>
                  <li>
                      <text class="relative font-medium text-black before:absolute before:-bottom-1 before:h-0.5 before:w-full before:scale-x-0 before:bg-[#FEAE1C] before:transition hover:before:scale-x-100">
                          Beranda
                      </text>
                  </li>
              </Link>

              <Link to='/tentangkami'>
                  <li>
                      <text class="relative font-medium text-black before:absolute before:-bottom-1 before:h-0.5 before:w-full before:scale-x-0 before:bg-[#FEAE1C] before:transition hover:before:scale-x-100">
                          Tentang Kami
                      </text>
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