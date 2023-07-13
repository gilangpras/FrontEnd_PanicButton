import React, { useState, useEffect, useRef } from "react";
import NavHomeAdmin from "../../components/admin/navHomeAdmin";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import Modal from "react-responsive-modal";
import "react-responsive-modal/styles.css"
import Service from "../../service/services"
import AlertComponent from "../../components/alert"
import { getGuid } from "../../helper";
import TableDevice from "../../components/tableDevice";
import AlertNotifAdmin from "./alertNotifAdmin";

const HomeUserPanicButton = () => {

  const handlePanicButtonClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
        },
        (error) => {
          console.error(`Error getting location: ${error.message}`);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
    console.log("Panic button clicked!");
  };


  const [lists, setLists] = useState([]);
  const [deviceLocation, setDeviceLocation] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  // Custom component to handle map click event
  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        setSelectedLocation(e.latlng);
      },
    });

    return null;
  };

  useEffect(() => {
    if (selectedLocation) {
      console.log("Selected Location:", selectedLocation);
    }
  }, [selectedLocation]);

  useEffect(() => {
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

  // useEffect(() => {
  //   if (deviceLocation) {
  //     mapRef.current.flyTo([deviceLocation.latitude, deviceLocation.longitude], 15);
  //   }
  // }, [deviceLocation]); 

  const mapRef = useRef(null)

  const getData = (guid_user) => {
    let data = {
      guid_user: guid_user,
      page: 1,
      limit: 50
    }
    Service.GetAllDevice(data)
      .then(res => {
        const listsData = res.data.device;
        setLists(listsData);
      })
      .catch(error => {
        console.log('Error yaa ', error);
      });
  };

  useEffect(() => {
    const guid = getGuid();
    getData(guid);
  }, []);

  useEffect(() => {
    if (lists.length) {
      // eslint-disable-next-line array-callback-return
      lists.map((list) => {
        console.log(list.latitude)
      })
    }
  }, [lists])

  // Set Icon Default
  const locationIcon = L.icon({
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
    if (selectedList && mapRef.current) {
      const { latitude, longitude } = selectedList;
      mapRef.current.flyTo([latitude, longitude], 15);
    }
  };

  // INI BATAS KODE  (KODE DIATAS BERISI TENTANG LEAFLET)


  // KODE DIBAWAH SETINGAN TENTANG ADD DEVICE YANG BERUPA MODAL
  const [state, setState] = useState({
    name: "",
    type_device: "",
    guid_user: "",
    guid_device: "",
    longitude: setLongitude,
    latitude: setLatitude,
    redirectToReferrer: false,
    open: false,
  });

  const handleInputChange = (event) => {
    setState((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };

  const onOpenModal = () => {
    setState((prevState) => ({
      ...prevState,
      open: true,
    }));
  };

  const onCloseModal = () => {
    setState((prevState) => ({
      ...prevState,
      open: false,
    }));
  };

  useEffect(() => {
    const data = {
      guid: getGuid(),
    };
    Service.GetProfile(data)
      .then((res) => {
        if (res.data.status) {
          setState((prevState) => ({
            ...prevState,
            guid_user: res.data.User.guid,
          }));
        } else {
          AlertComponent.Error(res.data.status);
        }
      })
      .catch((e) => {
        AlertComponent.Error(e.response.data.message);
      });
  }, []);

  const validateInput = (e) => {
    e.preventDefault();
    const { name, type_device, guid_user, guid_device, longitude, latitude } = state;
    if (name === "") {
      AlertComponent.Error("Nama tidak boleh kosong !");
      return false;
    } else if (type_device === "") {
      AlertComponent.Error("Tipe Device tidak boleh kosong !");
      return false;
    } else if (guid_user === "") {
      AlertComponent.Error("GUID user tidak boleh kosong !");
      return false;
    } else if (guid_device === "") {
      AlertComponent.Error("GUID device tidak boleh kosong !");
      return false;
    } else if (longitude === "") {
      AlertComponent.Error("Longitude tidak boleh kosong !");
      return false;
    } else if (latitude === "") {
      AlertComponent.Error("Latitude tidak boleh kosong !");
      return false;
    } else {
      onSubmit();
    }
  };

  const onSubmit = () => {
    const data = {
      name: state.name,
      type_device: state.type_device,
      guid_user: state.guid_user,
      guid_device: state.guid_device,
      latitude: latitude,
      longitude: longitude,
    };

    const token = localStorage.getItem("Token");

    Service.RegisterDevice(data, token)
      .then((res) => {
        if (res.data.status) {
          setState((prevState) => ({
            ...prevState,
            redirectToReferrer: true,
          }));
          AlertComponent.Succes(res.data.message);
          setInterval(() => window.location.reload(false), 1000);
        } else {
          AlertComponent.Succes(res.data.message);
        }
      })
      .catch((error) => {
        console.error(error);
        AlertComponent.Error(
          "Gagal Registrasi, GUID Device sudah pernah digunakan!"
        );
      });
  };

  return (
    <div>
      <NavHomeAdmin />

      <AlertNotifAdmin />

      <div className="flex lg:flex-row lg:h-full mx-4 lg:mx-24 mt-6 justify-end">
        <button
          className="text-sm font-semibold bg-[#FEAE1C] hover:bg-[#eea41c] text-white py-2 px-3 rounded-md"
          onClick={onOpenModal}
        >
          Tambah Device +
        </button>
      </div>

      <Modal open={state.open} onClose={onCloseModal} center className="overflow-hidden bg-opacity-50" styles={{ modal: { borderRadius: '10px', width: '80%' } }}>
        <h2 className="text-lg font-medium  text-center mx-20 lg:mx-24">Register Device</h2>

        <div className="flex lg:flex-row">
          <div className="p-5 mx-auto" style={{ width: '100%' }}>
            <form>
              <div className="mb-2">
                <label className="block text-gray-500">Nama Perangkat</label>
                <input className="w-full px-3 py-2 border-2 rounded-lg"
                  type="text"
                  name="name"
                  value={state.name}
                  onChange={handleInputChange}
                />
              </div>

              <div className="mb-2">
                <label className="block text-gray-500">Tipe Device</label>
                <select
                  type="text"
                  name="type_device"
                  value={state.type_device}
                  className="w-full px-3 py-2 border-2 rounded-lg"
                  onChange={handleInputChange}
                >
                  <option readOnly>Pilih Tipe Device</option>
                  <option value="Aktuator">Aktuator</option>
                  <option value="Sensor">Sensor</option>
                </select>
              </div>

              <div className="mb-2">
                <label className="block text-gray-500">GUID User</label>
                <input className="w-full px-3 py-2 border-2 rounded-lg"
                  type="text"
                  name="guid_user"
                  value={state.guid_user}
                />
              </div>

              <div className="mb-2">
                <label className="block text-gray-500">GUID Device</label>
                <input className="w-full px-3 py-2 border-2 rounded-lg"
                  type="text"
                  name="guid_device"
                  value={state.guid_device}
                  onChange={handleInputChange} />
              </div>

              <div className="mb-2">
                <label className="block text-gray-500">Latitude</label>
                <input className="w-full px-3 py-2 border-2 rounded-lg"
                  type="text"
                  name="latitude"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                />
              </div>

              <div className="mb-2">
                <label className="block text-gray-500">Longitude</label>
                <input className="w-full px-3 py-2 border-2 rounded-lg"
                  type="text"
                  name="longitude"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                />
              </div>

              <button className="bg-[#FEAE1C] text-white px-3 py-2 rounded-lg mt-4"
                type="submit"
                onClick={(e) => validateInput(e)}
              >
                Submit
              </button>

            </form>
          </div>

          <div className="flex pt-5 h-[460px] w-3/4 shadow-lg p-1 rounded-lg ">
            <MapContainer
              ref={mapRef}
              center={deviceLocation ? [deviceLocation.latitude, deviceLocation.longitude] : [0, 0]}
              zoom={15}
              className="w-full h-full z-0">

              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                attribution='Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
              />

              {/* Render the custom MapClickHandler component */}
              <MapClickHandler />

              {/* Display selected location with marker */}
              {selectedLocation && (
                <Marker position={selectedLocation} icon={locationIcon} eventHandlers={{
                  click: (e) => {
                    setSelectedLocation(e.latlng);
                    setLatitude(e.latlng.lat);
                    setLongitude(e.latlng.lng);
                  },
                }}>
                  <Popup>
                    <div>
                      <span className="flex justify-center font-bold">Lokasi yang Dipilih</span>
                      <span className="flex justify-center">Latitude: {selectedLocation.lat}</span>
                      <span className="flex justify-center">Longitude: {selectedLocation.lng}</span>
                    </div>
                  </Popup>
                </Marker>
              )}
            </MapContainer>
          </div>

        </div>
      </Modal>

      {/* INI KODINGAN UNTUK PANIC BUTTON */}
      <div className="flex flex-col lg:flex-row justify-center items-center lg:h-full mx-4 lg:mx-24">
        <div className="flex flex-col justify-center items-center bg-white w-full lg:w-1/4 lg:max-w-md h-80 p-6 rounded-md shadow-lg my-2 lg:mr-4">
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


        {/* INI KODINGAN UNTUK SETTINGAN LEAFLET */}
        <div className="flex h-80 w-full lg:w-3/4 shadow-lg lg:ml-4 p-1 rounded-lg ">
          <MapContainer ref={mapRef} center={[-5.408750223738104, 105.27570990621037]} zoom={15} className="w-full h-full z-0">
            <select
              className='absolute right-4 top-4 w-40 lg:w-56 z-[99999] h-8 lg:h-10 rounded-lg bg-white ring-1 ring-gray-300 flex items-center px-3 outline-none'
              onChange={handleSelectChange}
            >
              <option readOnly>Pilih Perangkat</option>
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

            {lists.map((list) => (
              <Marker
                key={list.guid}
                position={[list.latitude, list.longitude]}
                icon={locationIcon}
                eventHandlers={{
                  mouseover: (e) => {
                    e.target.openPopup()
                  }
                }}
              >
                <Popup>
                  <div>
                    <span className="flex justify-center font-bold">{list.name}</span>
                    <span className="flex justify-center">Tipe Perangkat: {list.type_device}</span>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>


      {/* INI KODINGAN UNTUK DAFTAR PERANGKAT */}
      <h1 className="flex px-4 lg:px-24 text-xl text-gray-900 font-bold mt-5 mb-2 justify-center">DAFTAR PERANGKAT</h1>
      <TableDevice />

    </div>
  );
};

export default HomeUserPanicButton;
