import React, { useState, useRef, useEffect } from "react";
import NavHomeUser from "../../components/navHomeUser";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import { getGuid } from "../../helper";
import Service from "../../service/services"

function HomeUser() {

  // const handlePanicButtonClick = () => {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(
  //       (position) => {
  //         const { latitude, longitude } = position.coords;
  //         console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
  //       },
  //       (error) => {
  //         console.error(`Error getting location: ${error.message}`);
  //       }
  //     );
  //   } else {
  //     console.error("Geolocation is not supported by this browser.");
  //   }
  //   console.log("Panic button clicked!");
  // };


  const [lists, setLists] = useState([]);

  const mapRef = useRef()

  const getData = (guid_user) => {
    Service.GetDevice({ guid_user })
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
    const selectedList = lists.find(list => list.name === selectedOption);
    if (selectedList) {
      const { latitude, longitude } = selectedList;
      mapRef.current.flyTo([latitude, longitude], 15);
    }
  };

  return (
    <div className="bg-gradient-to-t from-[#ffffff] to-transparent min-h-screen">
      <NavHomeUser />

      {/* INI KODINGAN UNTUK SETTINGAN LEAFLET */}
      <div className="flex py-3 h-screen w-full shadow-lg rounded-lg ">
        <MapContainer ref={mapRef} center={[-6.929213436061369, 107.62671551019933]} zoom={15} className="w-full h-full z-0">
          <select
            className='absolute font-semibold right-4 top-4 lg:w-72 z-[99999] h-10 lg:h-10 rounded-lg bg-white ring-1 ring-gray-300 flex items-center px-3 outline-none'
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
                  <span className="flex justify-center font-bold">
                    {list.name}
                  </span>

                  <span className="flex justify-center">
                    Tipe Perangkat: 
                  {list.type_device}</span>

                  <div className='w-52 py-2 flex items-center justify-around'>
                    <button
                      className='py-2 px-3 bg-red-600 hover:bg-red-300 active:bg-red-600 rounded-lg text-white shadow-lg'
                    >
                      Minta Bantuan!
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>


  );
}


export default (HomeUser)