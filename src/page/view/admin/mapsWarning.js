import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { URL_MAPS } from "../../service/endpoint";
import markerpemadam from "../../assets/markerpemadam.png";

const MapsWarning = () => {
  const position = [-6.929178936918189,107.61915134592869];
  const mapRef = useRef(null);
  const locationIcon = L.icon({
    iconUrl: markerpemadam,
    iconSize: [50, 50],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41],
    shadowAnchor: [12, 41],
  });
  return (
    <div className="flex h-80 w-full lg:w-3/4 shadow-lg lg:ml-4 p-1 rounded-lg ">
    {/* <div className="flex justify-center"> */}
    <MapContainer
        ref={mapRef}
        center={[-6.929178936918189,107.61915134592869]}
        zoom={15}
        className="w-full h-full z-0"
      >

        <TileLayer
          url={URL_MAPS}
          attribution='Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
        />
         <Marker position={position}  icon={locationIcon}>
      <Popup>
        A pretty CSS3 popup. <br /> Easily customizable.
      </Popup>
    </Marker>
      </MapContainer>
    {/* </div> */}
      
    </div>
  );
};
export default MapsWarning;
