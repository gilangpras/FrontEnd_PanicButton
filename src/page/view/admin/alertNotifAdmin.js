import React, { useEffect, useState } from "react";
import { getGuid } from "../../helper";
import Services from "../../service/services";
import AlertComponent from "../../components/alert"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";
import markerpemadam from "../../assets/markerpemadam.png"
import userlocation from "../../assets/userlocation.png"

const AlertNotifAdmin = () => {
  const [lists, setLists] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPopupVisible, setIsPopupVisible] = useState(true);
  const [latitudeDevice, setLatitudeDevice] = useState(null);
  const [longitudeDevice, setLongitudeDevice] = useState(null);
  const [latitudeKorban, setLatitudeKorban] = useState(null);
  const [longitudeKorban, setLongitudeKorban] = useState(null);

  useEffect(() => {
    const guid = getGuid();
    getData(1, 100, guid);
  }, []);

  // INI KODE UNTUK INTERVAL 3 DETIK PADA ALERT NOTIF
  useEffect(() => {
    if (lists.length > 0) {
      const timer = setInterval(() => {
        setCurrentIndex((prevIndex) =>
          prevIndex === lists.length - 1 ? 0 : prevIndex + 1
        );
      }, 3000);

      return () => {
        clearInterval(timer);
      };
    }
  }, [lists]);

  const getData = (page, limit, guid) => {
    const data = {
      page: page,
      limit: limit,
      guid: guid,
    };
    Services.GetAllHistory(data)
      .then((res) => {
        const filteredLists = res.data.history.filter(
          (list) => list.actived === false
        );
        setLists(filteredLists);
      })
      .catch((error) => {
        console.log("Error: ", error);
      });
  };

  // Fungsi variabel moment dibawah untuk mengubah tampilan waktu menjadi format Indonesia
  const moment = require('moment');
  require('moment/locale/id');

  // INI FUNGSI UNTUK BUTTON RUTE GMAPS DI POPUP ALERT
  const handleGMapsRoute = () => {
    const selectedList = lists[currentIndex];
    const latitude = selectedList.latitude;
    const longitude = selectedList.longitude;

    window.location.href = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
  };

  // INI FUNGSI UNTUK MEMATIKAN BELL KETIKA ADA NOTIF POPUP ALERT
  const turnOff = () => {
    const data = lists[currentIndex];

    const requestData = {
      guid_device: data.guid_device,
      status: '1',
    };

    Services.OnPanicButton(requestData)
      .then((res) => {
        if (res.status) {
          AlertComponent.Succes('Bel berhasil dimatikan!');
        } else {
          AlertComponent.Error(res.data.message);
        }
      })
      .catch((error) => {
        console.error(error);
        AlertComponent.Error('Gagal mengirimkan data.');
      });
  };

  const locationIcon = L.icon({
    iconUrl: markerpemadam,
    iconSize: [50, 50],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41],
    shadowAnchor: [12, 41],
  });

  const locationIconKorban = L.icon({
    iconUrl: userlocation,
    iconSize: [50, 50],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41],
    shadowAnchor: [12, 41],
  });

  // INI FUNGSI UNTUK CLOSE POPUP ALERT
  const handleDismiss = () => {
    setIsPopupVisible(false);
  };

  // INI FUNGSI UNTUK CLOSE POP UP MAPS LEAFLET
  const handlePopupClose = () => {
    setIsPopupVisible(false);
  };

  // Fungsi yang dijalankan ketika button rute leaflet dijalankan
  const ruteLeaflet = () => {
    const selectedList = lists[currentIndex];
    const latitudeDevice = selectedList.latitude_device;
    const longitudeDevice = selectedList.longitude_device;
    const latitudeKorban = selectedList.latitude;
    const longitudeKorban = selectedList.longitude;

    // Menampilkan pop up modal maps leaflet
    setIsPopupVisible(true);

    // Menyimpan data latitude, longitude, latitude_device dan longitude_device pada state
    setLatitudeDevice(latitudeDevice);
    setLongitudeDevice(longitudeDevice);
    setLatitudeKorban(latitudeKorban);
    setLongitudeKorban(longitudeKorban);
  };

  // INI FUNGSI UNTUK MENGAMBIL RUTE JALAN PADA MAPS LEAFLET
  const Routing = () => {
    const map = useMap();

    useEffect(() => {
      if (latitudeDevice && longitudeDevice && map) {
        L.Routing.control({
          routeWhileDragging: false,
          dragging: true,
          waypoints: [
            L.latLng(latitudeDevice, longitudeDevice),
            L.latLng(latitudeKorban, longitudeKorban),
          ],
          createMarker: () => { return null }
        }).addTo(map);
      }
    }, [map]);
  };


  return (
    <div className="flex w-screen justify-center fixed z-[9999] top-0">
      {isPopupVisible && lists.length > 0 && (
        <div
          role="alert"
          className="flex justify-center mt-2 rounded-xl border border-gray-100 bg-white p-4 shadow-xl w-auto"
        >
          <div className="flex items-start gap-4">
            <span className="text-red-600">
              <i className="fa-solid fa-triangle-exclamation"></i>
            </span>

            <div className="flex-1">
              <h2 className="block font-medium text-red-700">
                Terdapat Kasus Kebakaran.
              </h2>

              <p className="mt-1 text-sm text-gray-700">
                {lists[currentIndex].username} meminta bantuan pada {moment(lists[currentIndex].clicked_at).locale('id').format('LLL')}
              </p>

              <div className="mt-4 flex gap-2">
                <button 
                  className="inline-flex text-sm items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
                  onClick={handleGMapsRoute}>
                   Rute GMaps 
                  <i className="fa-solid fa-up-right-from-square"></i>
                </button>

                <button 
                  className="block text-sm border border-indigo-600 rounded-lg px-4 py-2 text-indigo-700 transition hover:bg-gray-100"
                  onClick={ruteLeaflet}
                >
                  Rute Leaflet
                </button>

                <button 
                  className="block text-sm rounded-lg px-4 py-2 text-gray-700 transition hover:bg-gray-100"
                  onClick={turnOff}>
                  Matikan Bell
                </button>
              </div>
            </div>

            <button className="text-gray-500 transition hover:text-gray-600" onClick={handleDismiss}>
              <span className="sr-only">Dismiss popup</span>

              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>
      )}
      {isPopupVisible && latitudeDevice && longitudeDevice && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-[9999]">
          <div className="relative w-screen h-screen">
            <MapContainer
              center={[latitudeDevice, longitudeDevice]}
              zoom={15}
              className="w-full h-full"
            >
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                attribution='Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
              />
              
              <Routing />
              
              <Marker position={[latitudeDevice, longitudeDevice]} icon={locationIcon}>
                <Popup open>
                  <span className="flex justify-center font-bold">
                    Lokasi Pemadam Kebakaran
                  </span>
                </Popup>
              </Marker>

              <Marker position={[latitudeKorban, longitudeKorban]} icon={locationIconKorban}>
                <Popup open>
                  <span className="flex justify-center font-bold">
                    Lokasi Korban
                  </span>
                </Popup>
              </Marker>
            </MapContainer>

            <button
              className="absolute z-[9999] top-4 right-4 bg-white rounded-full p-2 text-gray-500 hover:text-gray-600 "
              onClick={handlePopupClose}
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlertNotifAdmin;
