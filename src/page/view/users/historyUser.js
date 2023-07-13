import React, { useEffect, useState } from "react";
import NavHomeUser from "../../components/user/navHomeUser";
import Services from "../../service/services"
// import { getGuid } from "../../helper/index";
import ReactPaginate from "react-paginate";
import jwtDecode from "jwt-decode";

const HistoryUser = () => {
  const [lists, setLists] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [perPage] = useState(10);

  useEffect(() => {
    getData(1, 100);
  }, []);

  const getData = (page, limit) => {
    const token = localStorage.getItem("Token");
    const decodedToken = jwtDecode(token);
    const guid_user = decodedToken.guid;

    const data = {
      page: page,
      limit: limit,
      guid_user: guid_user,
    };
    Services.GetAllHistory(data)
      .then((res) => {
        const filteredLists = res.data.history.filter(item => item.guid_user === guid_user);
        setLists(filteredLists);
      })
      .catch((error) => {
        console.log("Error yaa ", error);
      });
  };

  

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
      const { _id, name_device, username, clicked_at, latitude, longitude, caseType, actived } = list;
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
              maxWidth: "150px",
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

          <td
            className="text-center whitespace-nowrap px-4 py-3 text-gray-700"
            style={{
              maxWidth: "200px",
              textOverflow: "ellipsis",
              overflow: "hidden",
              whiteSpace: "nowrap",
            }}
          >
            {caseType}
          </td>

          <td className=" text-center">
            <span
              className={`inline-block px-1 py-1 my-1 mx-1 text-center text-xs font-medium text-white ${actived ? 'bg-[#38a8438a]' : 'bg-[#ffb039ec]'}`}
              style={{
                maxWidth: "150px",
                textOverflow: "ellipsis",
                overflow: "hidden",
                whiteSpace: "nowrap",
              }}
            >
              {actived ? "Kasus Selesai" : "Kasus Dalam Penanganan"}
            </span>
          </td>

        </tr>
      );
    });
  };

  return (
    <div className="bg-gray-50">
      <NavHomeUser />

      <section class="bg-gray-50">
        <div class="p-8 md:p-12 lg:px-16 lg:py-14">
          <div class="mx-auto max-w-lg text-center">
            <h2 class="text-2xl font-bold text-gray-900 md:text-3xl">
              Riwayat Pelaporan Panic Button 
            </h2>

            <p class="text-gray-500 sm:mt-4">
              Halaman ini berisi tentang riwayat user dalam penggunaan warning system & panic button,
              sehingga user bisa mengetahui terkait status kasus pelaporannya yang sedang dalam penanganan ataupun yang sudah selesai.
            </p>
          </div>

        </div>
      </section>

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
                  Perangkat Yang Dihubungi
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
                  Jenis Kasus
                </th>

                <th className="whitespace-nowrap px-4 py-2 text-center font-medium text-gray-900">
                  Status Kasus
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

export default HistoryUser;