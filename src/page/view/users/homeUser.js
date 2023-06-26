/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useRef, useEffect } from "react";
import NavHomeUser from "../../components/user/navHomeUser";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { getGuid } from "../../helper";
import Service from "../../service/services";
import AlertComponent from "../../components/alert"
import jwtDecode from "jwt-decode";

function HomeUser() {
  const [lists, setLists] = useState([]);
  const [requestTime, setRequestTime] = useState(null);
  const [deviceLocation, setDeviceLocation] = useState(null);
  const mapRef = useRef();

  useEffect(() => {
    const data = {
      // device: getGuid(),
      page:1,
      limit:10
    };

    const token = localStorage.getItem("Token");

    Service.GetAllDevice(data, token)
      .then((res) => {
        const listsData = res.data.device;
        setLists(listsData);
      })
      .catch((error) => {
        console.log("Error: ", error);
      });
      
    // ketika maps leaflet di render maka Mendapatkan lokasi perangkat
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setDeviceLocation({ latitude, longitude });
        },
        (error) => {
          console.error(error);
        }
      );
    } else {
      console.error("Geolocation tidak didukung oleh perangkat.");
    }
  }, []);

  useEffect(() => {
    if (deviceLocation) {
      mapRef.current.flyTo([deviceLocation.latitude, deviceLocation.longitude], 15);
    }
  }, [deviceLocation]);  

  useEffect(() => {
    if (lists.length) {
      // eslint-disable-next-line array-callback-return
      lists.map((list) => {
        console.log(list.latitude);
      });
    }
  }, [lists]);

  const locationIcon = L.icon({
    iconUrl:
      "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41],
    shadowAnchor: [12, 41],
  });

  const locationIconKorban = L.icon({
    iconUrl:
      "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41],
    shadowAnchor: [12, 41],
  });

  const handleSelectChange = (e) => {
    const selectedOption = e.target.value;
    const selectedList = lists.find((list) => list.name === selectedOption);
    if (selectedList) {
      const { latitude, longitude } = selectedList;
      mapRef.current.flyTo([latitude, longitude], 15);
    }
  };

  // Kode untuk button Minta Bantuan yang dikirimkan ke TOPIC (Aktuator) RABBITMQ!
  const useGuid = (data) => {
    localStorage.setItem('guid_device', data.guid_device);
    localStorage.setItem('name_device', data.name);

    const requestData = {
      guid_device: data.guid_device,
      status: '0',
    };

    Service.OnPanicButton(requestData)
      .then((res) => {
        if (res.status) {
          AlertComponent.Succes('Bantuan akan segera datang ke lokasi!');
        } else {
          AlertComponent.Error(res.data.message);
        }
      })
      .catch((error) => {
        console.error(error);
        AlertComponent.Error('Gagal mengirimkan data.');
      });
  
    // INI KODE UNTUK MENGIRIMKAN DATA DEVICE DAN LOKASI USER KETIKA MENGKLIK BUTTON MINTA BANTUAN UNTUK DISIMPAN KE DATABASE
    const currentTime = new Date();
    setRequestTime(currentTime);

    const token = localStorage.getItem("Token");
    const decodedToken = jwtDecode(token);
    const guid_user = decodedToken.guid; // Mengambil GUID dari token
    const username = decodedToken.name; // Mengambil GUID dari token

    const historyData = {
      guid_user: guid_user,
      guid_device: data.guid_device,
      name_device: data.name,
      username: username,
      latitude: deviceLocation.latitude,
      longitude: deviceLocation.longitude,
      latitude_device: data.latitude,
      longitude_device: data.longitude,
      clicked_at: currentTime,
    };

    Service.AddHistory(historyData)
      .then((res) => {
        if (res.data.status) {
          // AlertComponent.Success(res.data.message);
        } else {
          // AlertComponent.Error(res.data.message);
        }
      })
      .catch((error) => {
        console.error(error);
        // AlertComponent.Error("Gagal menyimpan data history.");
      });


    setLists((prevLists) =>
      prevLists.map((list) =>
        list.guid === data.guid ? { ...list, requestTime: currentTime } : list
      )
    );
  };

  const hitungJarak = (targetLocation) => {
    if (deviceLocation) {
      const deviceLatLng = L.latLng(
        deviceLocation.latitude,
        deviceLocation.longitude
      );
      const targetLatLng = L.latLng(
        targetLocation.latitude,
        targetLocation.longitude
      );
  
      const jarakMeter = deviceLatLng.distanceTo(targetLatLng);
      const jarakKilometer = jarakMeter / 1000;
  
      return {
        meter: jarakMeter.toFixed(2),
        kilometer: jarakKilometer.toFixed(2)
      };
    }
    return null;
  };

  return (
    <div className="bg-gradient-to-t from-[#ffffff] to-transparent min-h-screen">
      <NavHomeUser />

      <div className="flex py-3 h-screen w-full shadow-lg rounded-lg">
        <MapContainer
          ref={mapRef}
          center={deviceLocation ? [deviceLocation.latitude, deviceLocation.longitude] : [0, 0]}
          zoom={4}
          className="w-full h-full z-0"
        >
          <select
            className="absolute font-semibold right-4 top-4 lg:w-72 z-[99999] h-10 lg:h-10 rounded-lg bg-white ring-1 ring-gray-300 flex items-center px-3 outline-none"
            onChange={handleSelectChange}
          >
            <option readOnly>Pilih Perangkat Sesuai Kecamatan</option>
            {lists.map((list) => (
              <option key={list.guid} value={list.name}>
                {list.name}
              </option>
            ))}
          </select>

          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution='Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
          />

          {deviceLocation && (
            <Marker position={[deviceLocation.latitude, deviceLocation.longitude]} icon={locationIconKorban}>
              <Popup>Lokasi Anda</Popup>
            </Marker>
          )}

          {lists.map((list) => (
            <Marker
              key={list.guid}
              position={[list.latitude, list.longitude]}
              icon={locationIcon}
            >
              <Popup>
                <div>
                  <span className="flex justify-center font-bold">
                    {list.name}
                  </span>

                  {/* Kode untuk menampilkan jarak */}
                  {deviceLocation && (
                    <div className="flex justify-center mt-2">
                      Jarak lokasi Bantuan Terdekat: {" "}
                      {hitungJarak(list).meter < 1000 ? `${hitungJarak(list).meter} Meter` : `${hitungJarak(list).kilometer} Kilometer`}
                    </div>
                  )}

                  <div className="flex justify-center mt-2">
                    <button className="py-2 px-3 bg-red-600 hover:bg-red-300 active:bg-red-600 rounded-lg text-lg text-white shadow-lg" onClick={() => useGuid(list)}>
                      Minta Bantuan!
                    </button>
                  </div>

                  {/* KODE UNTUK MENGAMBIL HISTORY DATE KETIKA BUTTON MINTA BANTUAN DI KLIK */}
                  {list.requestTime && (
                    <div className="flex justify-center mt-2">
                      Waktu klik: {list.requestTime.toLocaleString()}
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}

export default HomeUser;