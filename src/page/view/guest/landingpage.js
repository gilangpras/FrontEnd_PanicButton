import React from "react";
import Logo from "../../assets/logo.png"
import { Link } from "react-router-dom";
import NavLandingPage from "../../components/navLandingPage";
import PhotoLanding from "../../assets/landingpage.png"
import "animate.css"

function LandingPage() {

  return (
    <div className="bg-gradient-to-t from-[#f17b7b] to-transparent min-h-screen">
      <NavLandingPage/>
      
      <main>
        <div className=" flex justify-around pt-24 mb-32">

          <div className=" w-1/2 flex flex-col justify-center ml-36 animate__animated animate__slideInLeft" >
            <h1 className="font-bold text-4xl pb-5 font-poppins animate__animated animate__slideInLeft">
              Warning System & Panic Button
            </h1>
            <div className="font-normal text-lg pb-12 font-poppins">
              Berfungsi untuk membantu masyarakat ketika mengalami 
              <br />
              keadaan darurat seperti bencana kebakaran dan lain sebagainya.
            </div>
            <Link to="/login">
              <button className="py-3 w-40 px-2 rounded-xl font-semibold shadow-lg drop-shadow-3xl bg-[#FEAE1C] border-2 border-[#eeb142] text-white hover:bg-white hover:text-[#FEAE1C]">
                Get Started
                <i className="fa-sharp fa-solid fa-chevron-right ml-2"></i>
              </button>
            </Link>
          </div>

          <div className="w-1/2 ">
            <img src={PhotoLanding} alt="zz" className="w-[28rem] ml-24" />
          </div>
        </div>
      </main>

      <footer aria-label="Site Footer" className="bg-gray-100">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">

          <div className="flex justify-center text-[#C53F3F]">
            <img src={Logo} alt="IconTabungGas" className="w-12 h h-12" />
            <h1 className="flex justify-center ml-5 items-center text-xl font-bold"> Warning System & Panic Button </h1>
          </div>

          <p className="mx-auto mt-6 max-w-md text-center leading-relaxed text-gray-500">
              &copy; 2023 PT LSKK - All Right Reserved
              <br />
              Sistem ini dibuat untuk membantu masyarakat untuk meminta bantuan dalam keadaan darurat.
          </p>

          <nav aria-label="Footer Nav" className="mt-5">
            <ul className="flex flex-wrap justify-center gap-6 md:gap-8 lg:gap-12">
              <Link to='/'>
                <li>
                  <button className="relative font-sm text-gray-700 before:absolute before:-bottom-1 before:h-0.5 before:w-full before:scale-x-0 before:bg-[#FEAE1C] before:transition hover:before:scale-x-100">
                    Beranda
                  </button>
                </li>
              </Link>

              <Link to='/tentangkami'>
                <li>
                  <button className="relative font-sm text-gray-700 before:absolute before:-bottom-1 before:h-0.5 before:w-full before:scale-x-0 before:bg-[#FEAE1C] before:transition hover:before:scale-x-100">
                    Tentang Kami
                  </button>
                </li>
              </Link>
            </ul>
          </nav>

          <ul className="mt-6 flex justify-center gap-3 md:gap-6">
            <li>
              <button
                className="text-gray-700 transition hover:text-gray-700/75"
                onClick={() => window.location.href = 'https://www.facebook.com/lskkgroup/'}
              >
                <span className="sr-only">Facebook</span>
                <i className="fa-brands fa-facebook"></i>
              </button>
            </li>

            <li>
              <button
                className="text-gray-700 transition hover:text-gray-700/75"
                onClick={() => window.location.href = 'https://www.instagram.com/lskk_id/'}
              >
                <span className="sr-only">Instagram</span>
                <i className="fa-brands fa-instagram"></i>
              </button>
            </li>

            <li>
              <button
                className="text-gray-700 transition hover:text-gray-700/75"
                onClick={() => window.location.href = 'https://github.com/lskk'}
              >
                <span className="sr-only">GitHub</span>
                <i className="fa-brands fa-github"></i>
              </button>
            </li>

          </ul>
        </div>
      </footer>

    </div>
  );
}

export default LandingPage;
