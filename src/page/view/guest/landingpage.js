import React from "react";
import Logo from "../../assets/logo.png"
import { Link } from "react-router-dom";
import NavLandingPage from "../../components/navLandingPage";
import PhotoLanding from "../../assets/landingpage.png"
import AllLogo from "../../assets/AllLogo.png"
import "animate.css"

function LandingPage() {

  return (
    <div className="bg-gradient-to-t from-[#f17b7b] to-transparent min-h-screen">
      <NavLandingPage/>
      
      <main>
        <div className="flex flex-col lg:flex-row justify-around pt-52 mb-32">
          <div className="w-2/3 lg:w-full flex flex-col justify-center ml-4 lg:ml-36 animate__animated animate__slideInLeft">
            <h1 className="font-bold text-2xl lg:text-4xl pb-5 font-poppins">
              Warning System &amp; Panic Button
            </h1>
            <div className="font-normal text-sm lg:text-lg pb-8 font-poppins">
              Berfungsi untuk membantu masyarakat ketika mengalami keadaan darurat seperti bencana kebakaran dan lain sebagainya.
            </div>
            <Link to="/login">
              <button className="py-3 w-40 px-2 rounded-xl font-semibold shadow-lg drop-shadow-3xl bg-[#FEAE1C] border-2 border-[#eeb142] text-white hover:bg-white hover:text-[#FEAE1C]">
                Get Started <i className="fa-sharp fa-solid fa-chevron-right ml-2"></i>
              </button>
            </Link>
          </div>

          <div className="w-2/3 lg:w-full flex justify-center">
            <img src={PhotoLanding} alt="zz" className="w-full lg:w-[28rem] ml-4 lg:ml-24" />
          </div>
        </div>

        <div className="flex justify-center pb-3">
          <img src={AllLogo} alt="AllLogo" className=" w-1/2 h-11 lg:w-1/5 lg:h-11"/>
        </div>

      </main>


      <footer aria-label="Site Footer" className="bg-gray-100">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">

          <div className="flex justify-center text-[#C53F3F]">
            <img src={Logo} alt="IconTabungGas" className="w-12 h h-12" />
            <h1 className="flex justify-center ml-5 items-center text-lg lg:text-xl font-bold"> Warning System & Panic Button </h1>
          </div>

          <p className="mx-auto mt-6 max-w-md text-center leading-relaxed text-gray-500">
              &copy; 2023 PT LSKK - All Right Reserved
              <br />
              Sistem ini dibuat dengan tujuan untuk membantu masyarakat dalam meminta bantuan ketika mengalami keadaan darurat.
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
