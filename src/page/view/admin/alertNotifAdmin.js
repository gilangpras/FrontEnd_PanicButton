import React, { useEffect, useState } from "react";
import { getGuid } from "../../helper";
import Services from "../../service/services";
import AlertComponent from "../../components/alert"

const AlertNotifAdmin = () => {
  const [lists, setLists] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPopupVisible, setIsPopupVisible] = useState(true);

  useEffect(() => {
    const guid = getGuid();
    getData(1, 100, guid);
  }, []);

  useEffect(() => {
    if (lists.length > 0) {
      const timer = setInterval(() => {
        setCurrentIndex((prevIndex) =>
          prevIndex === lists.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000);

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

  // INI FUNGSI UNTUK CLOSE POPUP ALERT
  const handleDismiss = () => {
    setIsPopupVisible(false);
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
    </div>
  );
};

export default AlertNotifAdmin;
