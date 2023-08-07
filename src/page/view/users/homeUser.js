/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useRef, useEffect } from "react";
import NavHomeUser from "../../components/user/navHomeUser";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { getGuid } from "../../helper";
import Service from "../../service/services";
import Services from "../../service/services_history"
import AlertComponent from "../../components/alert"
import jwtDecode from "jwt-decode";
import Modal from "react-responsive-modal";
import "react-responsive-modal/styles.css"
import Markerpemadam from "../../assets/markerpemadam.png"
import userlocation from "../../assets/userlocation.png"

function HomeUser() {
  const [lists, setLists] = useState([]);
  const [requestTime, setRequestTime] = useState(null);
  const [deviceLocation, setDeviceLocation] = useState(null);
  const [saveImage, setSaveImage] = useState (null);
  const [errors, setErrors] = useState({});
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
    iconUrl: Markerpemadam,
    iconSize: [50, 60],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41],
    shadowAnchor: [12, 41],
  });

  const locationIconKorban = L.icon({
    iconUrl: "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
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
  
  // Fungsi untuk validasi form sebelum mengirimkan data pada modal minta bantuan
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!state.phone_number.trim()) {
      newErrors.phone_number = "Nomor telepon harus diisi";
      isValid = false;
    }

    if (!state.caseType) {
      newErrors.caseType = "Jenis laporan harus dipilih";
      isValid = false;
    }

    if (!state.address_user.trim()) {
      newErrors.address_user = "Titik acuan alamat harus diisi";
      isValid = false;
    }

    if (!saveImage) {
      newErrors.image = "Bukti kejadian harus diunggah";
      isValid = false;
    }

    setErrors(newErrors);

    return isValid;
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
          // AlertComponent.Succes('Bantuan akan segera datang ke lokasi!');
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
      phone_number: state.phone_number,
      caseType: state.caseType,
      address_user: state.address_user,
      image: saveImage,
    };

    Services.AddHistory(historyData)
      .then((res) => {
        if (res.data.status) {
          AlertComponent.Succes('Bantuan akan segera datang ke lokasi!');
          window.location.reload(2000)
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

  // Ini state untuk menyimpan data pada modal minta bantuan
  const [state, setState] = useState({
    phone_number: "",
    caseType: "",
    address_user: "",
    image: "",
    redirectToReferrer: false,
    open: false,
  });

  // ini fungsi untuk bisa mengganti inputan pada form modal minta bantuan
  const handleInputChange = (event) => {
    if (event.target.type === 'file') {
      console.log(event.target.files[0]);
      let uploaded = event.target.files[0];
      setSaveImage(uploaded);
    } else {
      setState((prevState) => ({
        ...prevState,
        [event.target.name]: event.target.value,
      }));
    }
  };
  
  // Ini state untuk menampung data device pada modal minta bantuan, sehingga device bisa sesuai dengan yang dipilih pada marker
  const [selectedDevice, setSelectedDevice] = useState(null);

  const onOpenModal = (data) => {
    setSelectedDevice(data);
    setState((prevState) => ({
      ...prevState,
      open: true,
    }));
  };

  const onCloseModal = () => {
    setState((prevState) => ({
      ...prevState,
      open: false,
      phone_number: "",
      caseType: "",
      address_user: "",
      image: null,
    }));
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
            <option value="" disabled selected>Pilih Lokasi Pemadam Kebakaran Terdekat</option>
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
              <Popup>
                <span className="flex justify-center font-bold">
                  Lokasi Anda
                </span>
              </Popup>
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

                  {/* <div className="flex justify-center mt-2">
                    <button className="py-2 px-3 bg-red-600 hover:bg-red-300 active:bg-red-600 rounded-lg text-lg text-white shadow-lg" onClick={() => useGuid(list)}>
                      Minta Bantuan!
                    </button>
                  </div> */}

                  <div className="flex justify-center mt-2">
                    <button className="py-2 px-3 bg-red-600 hover:bg-red-300 active:bg-red-600 rounded-lg text-lg text-white shadow-lg" onClick={() => onOpenModal(list)}>
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
      
      
      {state.open && selectedDevice && (
        <Modal open={state.open} onClose={onCloseModal} center className="overflow-hidden bg-opacity-50" styles={{ modal: { borderRadius: '10px', width: '80%' } }}>
          <h2 className="text-lg font-medium  text-center mx-20 lg:mx-24">Verifikasi Kejadian</h2>

          <div className="flex lg:flex-row">
            <div className="p-5 mx-auto" style={{ width: '100%' }}>
              <form>
                <div className="mb-2">
                  <label className="block text-gray-500">
                    Kontak yang bisa dihubungi
                    <span style={{ color: 'red', marginLeft: '5px' }}>*</span>
                  </label>
                  <input className="w-full px-3 py-2 border-2 rounded-lg"
                    type="number"
                    name="phone_number"
                    value={state.phone_number}
                    onChange={handleInputChange}
                  />
                  {errors.phone_number && <span className="text-red-500">{errors.phone_number}</span>}
                </div>

                <div className="mb-2">
                  <label className="block text-gray-500">
                    Jenis Laporan
                    <span style={{ color: 'red', marginLeft: '5px' }}>*</span>
                  </label>
                  <select
                    type="text"
                    name="caseType"
                    value={state.caseType}
                    className="w-full px-3 py-2 border-2 rounded-lg"
                    onChange={handleInputChange}
                  >
                    <option value="" disabled selected>Pilih Jenis Laporan</option>
                    <option value="Pemadaman Kebakaran">Pemadaman Kebakaran</option>
                    <option value="Penanganan Bahan Beracun">Penanganan Bahan Beracun</option>
                    <option value="Penyelamatan (Non-Kebakaran)">Penyelamatan (Non-Kebakaran)</option>
                    <option value="Kasus Lainnya">Kasus Lainnya</option>
                  </select>
                  {errors.caseType && <span className="text-red-500">{errors.caseType}</span>}
                </div>

                <div className="mb-2">
                  <label className="block text-gray-500">
                    Titik Acuan Alamat
                    <span style={{ color: 'red', marginLeft: '5px' }}>*</span>
                  </label>
                  <input className="w-full px-3 py-2 border-2 rounded-lg"
                    type="text"
                    name="address_user"
                    value={state.address_user}
                    onChange={handleInputChange}
                  />
                  {errors.address_user && <span className="text-red-500">{errors.address_user}</span>}
                </div>

                <div className="mb-2">
                  <label className="block text-gray-500">
                    Bukti Kejadian
                    <span style={{ color: 'red', marginLeft: '5px' }}>*</span>
                  </label>
                  <input className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    type="file"
                    name="image"
                    onChange={handleInputChange}
                  />
                  {errors.image && <span className="text-red-500">{errors.image}</span>}
                </div>

                <button className="py-2 px-3 mt-3 bg-red-600 hover:bg-red-300 active:bg-red-600 rounded-lg text-lg text-white shadow-lg"
                  type="submit"
                  onClick={(e) => {
                    e.preventDefault();
                    if (validateForm()) {
                      useGuid(selectedDevice);
                    }
                  }}
                >
                  Minta Bantuan
                </button>

              </form>
            </div>

          </div>
        </Modal>
      )}

    </div>
  );
}

export default HomeUser;