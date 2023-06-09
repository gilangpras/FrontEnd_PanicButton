import React from "react";
import NavLandingPage from "../../components/navLandingPage";
import Logo from "../../assets/logo.png"
import LSKK from "../../assets/LSKK.png"
import AllLogo from "../../assets/AllLogo.png"
import { Link } from "react-router-dom";

function AboutPage() {

  return (
    <div className="bg-gradient-to-t from-[#ffffff] min-h-screen">
      <NavLandingPage />

      <main className="relative">
        <div className="flex justify-around pt-52 pb-40 lg:pb-72 ">
          <div className="w-full flex flex-col justify-center content-center items-center text-center mx-60">
            <div className="flex mb-7 text-center content-center justify-center items-center">
              <img src={LSKK} alt="lskkLogo" className="w-20 h-20" />
              <h1 className="font-bold text-4xl text-gray-700 ml-6 mr-7"> X </h1>
              <img src={Logo} alt="IconTabunggas" className="w-20 h-20" />
            </div>

            <div className=" flex justify-center items-center">
              <h1 className="font-bold text-2xl lg:text-4xl pb-5 font-poppins">
                Warning System & Panic Button
              </h1>
            </div>
            <div className="font-normal w-64 lg:w-auto text-base lg:text-lg font-poppins">
              Sistem ini dibangun di PT LSKK yang berada di Kota Bandung, Jawa Barat.
              Kegunaan sistem ini diharapkan mampu membantu masyarakat dalam melakukan komunikasi
              ke pihak pemadam kebakaran apabila menghadapi keadaan darurat agar bantuan dapat segera datang.
            </div>

            <div className="flex justify-center pt-5">
              <img src={AllLogo} alt="AllLogo" className=" w-42 h-42 lg:w-1/3 lg:h-13" />
            </div>
          </div>
        </div>

        <svg
          className="absolute bottom-0 left-0 w-full h-auto"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
        >
          <path
            fill="#C53F3F"
            fillOpacity="0.8"
            d="M0,32L48,42.7C96,53,192,75,288,101.3C384,128,480,160,576,186.7C672,213,768,235,864,240C960,245,1056,235,1152,208C1248,181,1344,139,1392,117.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </main>

      {/* FOOTER */}
      <footer aria-label="Site Footer" className="bg-gray-100">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex justify-center text-[#C53F3F]">
            <img src={Logo} alt="IconTabungGas" className="w-12 h-12" />
            <h1 className="flex justify-center ml-5 items-center text-lg xl:text-xl font-bold">
              Warning System & Panic Button
            </h1>
          </div>

          <p className="mx-auto mt-6 max-w-md text-center leading-relaxed text-gray-500">
            &copy; 2023 PT LSKK - All Right Reserved
            <br />
            Sistem ini dibuat dengan tujuan untuk membantu masyarakat dalam meminta bantuan ketika mengalami keadaan darurat.
          </p>

          <nav aria-label="Footer Nav" className="mt-5">
            <ul className="flex flex-wrap justify-center gap-6 md:gap-8 lg:gap-12">
              <Link to="/">
                <li>
                  <button className="relative font-sm text-gray-700 before:absolute before:-bottom-1 before:h-0.5 before:w-full before:scale-x-0 before:bg-[#FEAE1C] before:transition hover:before:scale-x-100">
                    Beranda
                  </button>
                </li>
              </Link>

              <Link to="/tentangkami">
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
                onClick={() => (window.location.href = "https://www.facebook.com/lskkgroup/")}
              >
                <span className="sr-only">Facebook</span>
                <i className="fa-brands fa-facebook"></i>
              </button>
            </li>

            <li>
              <button
                className="text-gray-700 transition hover:text-gray-700/75"
                onClick={() => (window.location.href = "https://www.instagram.com/lskk_id/")}
              >
                <span className="sr-only">Instagram</span>
                <i className="fa-brands fa-instagram"></i>
              </button>
            </li>

            <li>
              <button
                className="text-gray-700 transition hover:text-gray-700/75"
                onClick={() => (window.location.href = "https://github.com/lskk")}
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

export default AboutPage;