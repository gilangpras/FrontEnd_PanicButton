import React, { useEffect, useState } from "react";
import NavHomeAdmin from "../../components/admin/navHomeAdmin";
import Services from "../../service/services"
import { getGuid } from "../../helper/index";
import ReactPaginate from "react-paginate";
import AlertComponent from "../../components/alert"
import { confirmAlert } from "react-confirm-alert";

const HistoryAdmin = () => {
  const [lists, setLists] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [perPage] = useState(10);

  useEffect(() => {
    const guid = getGuid();
    getData(1, 100, guid);
  }, []);

  const getData = (page, limit, guid) => {
    const data = {
      page: page,
      limit: limit,
      guid: guid,
    };
    Services.GetAllHistory(data)
      .then((res) => {
        const lists = res.data.history;
        setLists(lists);
      })
      .catch((error) => {
        console.log("Error yaa ", error);
      });
  };

  // kode ini merupakan fungsi untuk button menyelesaikan kasus
  const HistoryPopup = (guid) => {
    confirmAlert({
      customUI: ({ onClose }) => (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8">
            <h2 className="text-xl font-bold mb-4">Konfirmasi Selesai</h2>
            <p className="text-gray-700 mb-4">Apakah Anda yakin ingin menyelesaikan kasus ini?</p>
            <div className="flex justify-end">
              <button
                className="px-4 py-2 mr-2 bg-blue-500 text-white rounded"
                onClick={() => {
                  onClose();
                  updateHistory(guid);
                }}
              >
                Iya
              </button>
              <button
                className="px-4 py-2 bg-gray-400 text-white rounded"
                onClick={onClose}
              >
                Tidak
              </button>
            </div>
          </div>
        </div>
      ),
    });
  };
  
  const updateHistory = async (guid) => {
    const requestData = {
      guid: guid,
      actived: true,
    };

    try {
      const response = await Services.UpdateHistory(requestData.guid, requestData);

      if (response.status) {
        // Proses update berhasil
        AlertComponent.Succes(response.data.message);
          window.location.reload(3000);
        } else {
          AlertComponent.Warning(response.data.message);
      }
    } catch (error) {
      console.log(error);
      AlertComponent.Error("Failed to update history");
    }
  };
  // Sampai sinii untuk menyelesaikan kasusnya


  // ini kode untuk klik pagination
  const handlePageClick = (data) => {
    const selectedPage = data.selected;
    setCurrentPage(selectedPage);
  };

  // INI KODE UNTUK ISI DARI TABLE
  const renderTable = () => {
    const offset = currentPage * perPage;
    const reversedData = [...lists].reverse(); // Membalikkan urutan seluruh data

    const currentPageData = reversedData.slice(offset, offset + perPage);

    return currentPageData.map((list, index) => {
      const { _id, name_device, username, clicked_at, latitude, longitude, actived } = list;
      const deviceNumber = index + 1 + offset;
      

      // Fungsi variabel moment dibawah untuk mengubah tampilan waktu menjadi format Indonesia
      const moment = require('moment');
      require('moment/locale/id');

      return (
        <tr key={_id}>

          <td
            className=" whitespace-nowrap px-4 py-3 text-center font-medium text-gray-900"
            style={{
              maxWidth: "10px",
              textOverflow: "ellipsis",
              overflow: "hidden",
              whiteSpace: "nowrap",
            }}
          >
            {deviceNumber}
          </td>

          <td
            className="whitespace-nowrap px-4 py-3 text-gray-700"
            style={{
              maxWidth: "30px",
              textOverflow: "ellipsis",
              overflow: "hidden",
              whiteSpace: "nowrap",
            }}
          >
            {username}
          </td>

          <td
            className="whitespace-nowrap px-4 py-3 text-gray-700"
            style={{
              maxWidth: "200px",
              textOverflow: "ellipsis",
              overflow: "hidden",
              whiteSpace: "nowrap",
            }}
          >
            {name_device}
          </td>

          <td
            className="whitespace-nowrap px-4 py-3 text-gray-700"
            style={{
              maxWidth: "200px",
              textOverflow: "ellipsis",
              overflow: "hidden",
              whiteSpace: "nowrap",
            }}
          >
            {moment(clicked_at).locale('id').format('LLL')}
          </td>

          <td
            className="whitespace-nowrap px-4 py-3 text-gray-700"
            style={{
              maxWidth: "100px",
              textOverflow: "ellipsis",
              overflow: "hidden",
              whiteSpace: "nowrap",
            }}
          >
            {latitude}
          </td>

          <td
            className="whitespace-nowrap px-4 py-3 text-gray-700"
            style={{
              maxWidth: "100px",
              textOverflow: "ellipsis",
              overflow: "hidden",
              whiteSpace: "nowrap",
            }}
          >
            {longitude}
          </td>

          <td className=" text-center">
            <span
              className={`inline-block px-1 py-1 my-1 mx-1 text-center text-xs font-medium text-white ${actived ? 'bg-[#38a8438a]' : 'bg-[#fe26266c]'}`}
              style={{
                maxWidth: "130px",
                textOverflow: "ellipsis",
                overflow: "hidden",
                whiteSpace: "nowrap",
              }}
            >
              {actived ? "Sudah Selesai" : "Belum Selesai"}
            </span>
          </td>

          <td className=" flex flex-row text-center">
            <button
              className="inline-block rounded bg-[#FEAE1C] hover:bg-[#eea41c] px-4 py-2 my-1 mx-1 text-xs font-medium text-white"
              onClick={() => HistoryPopup(list.guid)}
            >
              Selesaikan Kasus
            </button>

            <button
              className="inline-block rounded bg-blue-700 hover:bg-blue-800 px-4 py-2 my-1 mx-1 text-xs font-medium text-white"
              onClick={() => {

                // Redirect ke Google Maps dengan koordinat yang didapatkan
                window.location.href = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
              }}
            >
              Rute GMaps
            </button>
          </td>
        </tr>
      );
    });
  };

  return (
    <div className="bg-white">
      <NavHomeAdmin />

      <div className="flex flex-col sm:flex-row w-auto bg-white mx-4 sm:mx-32 mt-10 mb-6 justify-center">
        <div className="flex text-gray-600 items-center justify-center text-center">
          <i class="flex mb-3 w-32 lg:w-72 text-center fa-solid fa-clock-rotate-left fa-4x"></i>
        </div>

        <div className="flex flex-col w-auto">
          <h2 class="text-xl w-auto font-bold text-gray-700 text-center lg:text-left lg:text-2xl">
            History pengguna ketika menggunakan Panic Button
          </h2>

          <p class="mt-2 text-gray-500 text-center lg:text-left lg:text-base">
            Ini merupakan halaman History Admin yang berisi tentang Log atau History
            dari pengguna yang meminta bantuan di website Panic Button. Data History berisi
            tentang Nama pengguna, titik kordinat, device yang dipilih dan lain sebagainya.
          </p>
        </div>
      </div>

      <div className="flex px-4 lg:px-24 pt-1 pb-8">
        <div className="overflow-x-auto w-full">
          <table className="w-full border divide-y-2 divide-gray-200 text-sm">
            <thead>
              <tr>
                <th className="whitespace-nowrap px-4 py-2 text-center font-medium text-gray-900">
                  No.
                </th>

                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Nama Pengguna
                </th>

                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Riwayat Perangkat
                </th>

                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Waktu Meminta Bantuan
                </th>

                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Latitude
                </th>

                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Longitude
                </th>

                <th className="whitespace-nowrap px-4 py-2 text-center font-medium text-gray-900">
                  Status Kasus
                </th>

                <th className="whitespace-nowrap px-4 py-2 text-center font-medium text-gray-900">
                  Aksi
                </th>
              </tr>
            </thead>

            <tbody>{renderTable()}</tbody>
          </table>

          <div className="mt-2 flex justify-start lg:justify-end">
            <ReactPaginate
              previousLabel={<span className="mx-2 font-medium text-gray-800 hover:bg-blue-200">previous</span>}
              nextLabel={<span className="mx-2 font-medium text-gray-800 hover:bg-blue-200">next</span>}
              breakLabel={"..."}
              pageCount={Math.ceil(lists.length / perPage)}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={handlePageClick}
              containerClassName={"pagination flex border border-gray-300 w-fit rounded-sm p-2"}
              subContainerClassName={" border pages pagination"}
              activeClassName={"bg-blue-500 text-white"}
              breakClassName={"border-r border-gray-300"}
              breakLinkClassName={"px-2"}
              pageClassName={"border-r border-l border-gray-300"}
              pageLinkClassName={"px-2"}
            />
          </div>

        </div>
      </div>

    </div>
  )
}

export default HistoryAdmin;