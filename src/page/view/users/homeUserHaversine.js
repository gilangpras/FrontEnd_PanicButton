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
import { getDistance } from 'geolib';
import { URL_MAPS } from "../../service/endpoint";

function HomeUser() {
  const [lists, setLists] = useState([]);
  const [requestTime, setRequestTime] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [nearestDevice, setNearestDevice] = useState(null);
  const mapRef = useRef();


  useEffect(() => {
    const data = {
      device: getGuid(),
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

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setUserLocation({ latitude, longitude });
          },
          (error) => {
            console.error(error);
          }
        );
      } else {
        console.error("Geolocation is not supported by the device.");
      }
  }, []);

  useEffect(() => {
    if (lists.length && userLocation) {
      // Find the nearest device based on user location
      const nearestDevice = lists.reduce((nearest, device) => {
        const userDistance = getDistance(userLocation, {
          latitude: device.latitude,
          longitude: device.longitude,
        });
        if (userDistance < nearest.distance) {
          return { device, distance: userDistance };
        }
        return nearest;
      }, { device: null, distance: Infinity }).device;

      if (nearestDevice) {
        const { latitude, longitude } = nearestDevice;
        mapRef.current.flyTo([latitude, longitude], 15);
      }
    }
  }, [lists, userLocation]);

  useEffect(() => {
    if (lists.length) {
      // eslint-disable-next-line array-callback-return
      lists.map((list) => {
        console.log(list.latitude);
      });
    }
  }, [lists]);

  const getDistanceFromUser = (latitude, longitude) => {
    if (!userLocation) {
      return null;
    }

    const userLat = userLocation.latitude;
    const userLng = userLocation.longitude;

    const distance = calculateDistance(userLat, userLng, latitude, longitude);
    return distance;
  };

  // INI FUNGSI UNTUK MENGHITUNG JARAK LOKASI DARI LOKASI USER DENGAN LOKASI BEL PEMADAM KEBAKARAN
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // radius of the Earth in kilometers
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance.toFixed(2);
  };

  const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
  };

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
    
    // INI KODE UNTUK MENGIRIM LOKASI DEVICE KETIKA MENGKLIK MINTA BANTUAN
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          
          // INI KODE DATA YANG DIKIRIM KE DATABASE PADA COLLECTION HISTORIES
          const historyData = {
            guid_user: guid_user,
            guid_device: data.guid_device,
            name_device: data.name,
            username: username,
            latitude: latitude,
            longitude: longitude,
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
        },
        (error) => {
          console.error(error);
          // AlertComponent.Error("Gagal mendapatkan lokasi perangkat.");
        }
      );
    } else {
      // AlertComponent.Error("Geolocation tidak didukung oleh perangkat.");
    }

    setLists((prevLists) =>
      prevLists.map((list) =>
        list.guid === data.guid ? { ...list, requestTime: currentTime } : list
      )
    );
  };

  return (
    <div className="bg-gradient-to-t from-[#ffffff] to-transparent min-h-screen">
      <NavHomeUser />

      <div className="flex py-3 h-screen w-full shadow-lg rounded-lg">
        <MapContainer
          ref={mapRef}
          center={nearestDevice ? [nearestDevice.latitude, nearestDevice.longitude] : [0, 0]}
          zoom={5}
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
            url={URL_MAPS}
            attribution='Map data © <a href="https://openstreetmap.org">PPTIK & LSKK</a> contributors'
          />

          {/* Marker lokasi pengguna */}
          {userLocation && (
            <Marker position={[userLocation.latitude, userLocation.longitude]} icon={locationIconKorban}>
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

                  {userLocation && (
                    <div className="flex justify-center mt-2">
                      Jarak lokasi Bantuan Terdekat:{" "}
                      {getDistanceFromUser(list.latitude, list.longitude)} km
                    </div>
                  )}

                  <div className="flex justify-center mt-2">
                    <button className="py-2 px-3 bg-red-600 hover:bg-red-300 active:bg-red-600 rounded-lg text-lg text-white shadow-lg" onClick={() => useGuid(list)}>
                      Minta Bantuan!
                    </button>
                  </div>

                  {/* KODE UNTUK MENGAMBIL HISTORY DATE/WAKTU KETIKA BUTTON MINTA BANTUAN DI KLIK */}
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
