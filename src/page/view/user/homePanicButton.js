import React from "react";
import NavHomeUser from "../../components/navHomeUser";
import { MapContainer, TileLayer, Marker } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"

const HomeUserPanicButton = () => {
  const handlePanicButtonClick = () => {
    // Fungsi yang akan dijalankan ketika tombol panic ditekan
    // Anda dapat mengisi dengan logika untuk mengirim data ke server
    // dan mengaktifkan fungsi panic button di backend
    // Misalnya: mengirim data lokasi pengguna ke server
    // dan menyimpannya di MongoDB atau sistem penyimpanan lainnya
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // Mengirim data lokasi ke server, misalnya dengan menggunakan axios
          // atau fungsi HTTP request lainnya
          console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
        },
        (error) => {
          // Menangani error jika gagal mendapatkan lokasi pengguna
          console.error(`Error getting location: ${error.message}`);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
    console.log("Panic button clicked!");
  };

  const position = [51.505, -0.09]; // koordinat pusat peta
  const zoom = 13; // level zoom

  const locationIcon = L.icon({
    iconUrl: "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41],
    shadowAnchor: [12, 41],
  });

  return (
    <div>
      <NavHomeUser />
      <div className="flex flex-col lg:flex-row justify-center items-center lg:h-full mx-4 lg:mx-24 my-12">

        <div className="flex flex-col justify-center items-center bg-white w-full lg:w-1/4 lg:max-w-md h-80 p-6 rounded-md shadow-md my-2 lg:mr-4">
          <h1 className="text-3xl font-bold mb-6 text-center">Panic Button</h1>
          <p className="text-gray-600 text-center mb-6">
            Tekan tombol di bawah ini untuk mengirimkan sinyal darurat.
          </p>
          <button
            className="w-full py-4 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-md transition duration-300"
            onClick={handlePanicButtonClick}
          >
            Panic!
          </button>
        </div>

        <div className="flex h-80 w-full lg:w-3/4 shadow-md lg:ml-4 p-1 rounded-lg ">
          <MapContainer center={position} zoom={zoom} className="w-full h-full z-0 ">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="© OpenStreetMap contributors"
            />
            <Marker position={position} icon={locationIcon} />
          </MapContainer>
        </div>

      </div>
    </div>
  );
};

export default HomeUserPanicButton;
