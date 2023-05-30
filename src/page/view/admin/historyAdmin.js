import React, { useEffect, useState } from "react";
import NavHomeAdmin from "../../components/admin/navHomeAdmin";
import Services from "../../service/services"
import { getGuid } from "../../helper/index";
import ReactPaginate from "react-paginate";

const HistoryAdmin = () => {
  const [lists, setLists] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [perPage] = useState(10);

  useEffect(() => {
    const guid = getGuid();
    getData(1, 100, guid);
  }, []);

  const getData = (page, limit) => {
    const data = {
      page: page,
      limit: limit,
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

  const handlePageClick = (data) => {
    const selectedPage = data.selected;
    setCurrentPage(selectedPage);
  };

  const renderTable = () => {
    const offset = currentPage * perPage;
    const currentPageData = lists.slice(offset, offset + perPage);

    return currentPageData.map((list, index) => {
      const { _id, name_device, username, latitude, longitude, actived } = list;
      const deviceNumber = index + 1 + offset;
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
            className={`inline-block rounded px-4 py-2 my-1 text-center text-white ${actived ? 'bg-[#7DCB85]' : ''}`}
            style={{
              maxWidth: "100px",
              textOverflow: "ellipsis",
              overflow: "hidden",
              whiteSpace: "nowrap",
            }}
            >
            {actived ? "Aktif" : ""}
            </span>
          </td>

          <td className=" text-center">
            <button
              className="inline-block rounded bg-blue-700 hover:bg-blue-800 px-4 py-2 my-1 mx-1 font-medium text-white"
            >
              Kasus Selesai
            </button>

            <button
              className="inline-block rounded bg-blue-700 hover:bg-blue-800 px-4 py-2 my-1 mx-1 font-medium text-white"
            >
              Rute Lokasi
            </button>
          </td>
        </tr>
      );
    });
  };

  return (
    <div className="bg-white">
      <NavHomeAdmin />

      <div class="flex mx-40 my-8 bg-white transition shadow-md hover:shadow-xl">
        <div class="rotate-180 p-2 [writing-mode:_vertical-lr]">
          <time
            datetime="2022-10-10"
            class="flex items-center justify-between gap-4 text-xs font-bold uppercase text-gray-900"
          >
            <span>2023</span>
            <span class="w-px flex-1 bg-gray-900/10"></span>
            <span>copyright</span>
          </time>
        </div>

        <div class="flex justify-center m-6 sm:block sm:basis-56">
          <div class="flex items-center justify-center content-center text-center text-red-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class=" h-24 w-24 object-cover"
            >
              <path
                fill-rule="evenodd"
                d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
        </div>

        <div class="flex flex-1 flex-row justify-between">
          <div class="border-s border-gray-900/10 p-4 sm:border-l-transparent sm:p-6">

            <h3 class="font-bold uppercase text-gray-900">
              Finding the right guitar for your style - 5 tips
            </h3>

            <p class="mt-2 line-clamp-3 text-sm/relaxed text-gray-700">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae
              dolores, possimus pariatur animi temporibus nesciunt praesentium dolore
              sed nulla ipsum eveniet corporis quidem, mollitia itaque minus soluta,
              voluptates neque explicabo tempora nisi culpa eius atque dignissimos.
              Molestias explicabo corporis voluptatem?
            </p>
          </div>

          <div class="sm:flex sm:items-end sm:justify-end">
            <p
              class="block bg-[#FEAE1C] hover:bg-[#eea41c] px-5 py-3 text-center text-xs font-bold uppercase text-white transition"
            >
              Direction
            </p>
          </div>
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
                  Pengguna Panic Button
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Riwayat Perangkat
                </th>

                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Latitude Pengguna
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Longitude Pengguna
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