import React, { useEffect, useState } from "react";
import NavHomeAdmin from "../../components/admin/navHomeAdmin";
import Services from "../../service/services"
import { getGuid } from "../../helper/index";
import ReactPaginate from "react-paginate";
import AlertComponent from "../../components/alert"
import { confirmAlert } from "react-confirm-alert";
import logo from "../../assets/logo.png"
import moment from "moment";
import 'moment/locale/id'
import jsPDF from "jspdf";
import 'jspdf-autotable';

const HistoryAdmin = () => {
  const [lists, setLists] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [perPage] = useState(10);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [allData, setAllData] = useState([]);
  const [printData, setPrintData] = useState([]);
  const [isDataFound, setIsDataFound] = useState(true);

  // Ini fungsi untuk melakukan print pdf
  const handlePrintPdf = () => {
    const pdf = new jsPDF();
    const table = document.getElementById('history-table');

    // Add image to the header
    const imageWidth = 20; // Lebar gambar dalam satuan milimeter
    const imageHeight = 20; // Tinggi gambar dalam satuan milimeter
    pdf.addImage(logo, 'JPEG', 20, 10, imageWidth, imageHeight);

    // ini text pada kop surat
    pdf.setFontSize(16); // Mengatur ukuran teks menjadi 16
    pdf.setFont('poppins', 'bold'); // Mengatur ketebalan teks menjadi tebal
    pdf.text('Pusat Penelitian Teknologi Informasi dan Komunikasi', 53, 20);

    pdf.setFontSize(16); // Mengatur ukuran teks menjadi 16
    pdf.setFont('poppins', 'bold'); // Mengatur ketebalan teks menjadi tebal
    pdf.text('PT. Langgeng Sejahtera Kreasi Komputasi', 66, 26);

    pdf.setFontSize(10); // Mengatur ukuran teks menjadi 10
    pdf.setFont('poppins', 'semibold'); // Mengatur ketebalan teks menjadi tebal
    pdf.text('Jl. Pelajar Pejuang 45 No.65, Lkr. Sel., Kec. Lengkong, Kota Bandung, Jawa Barat 40264', 55, 31);

    // ini kode untuk garis lurus pada kop surat
    const startX = 15; // Titik awal garis lurus (x)
    const endX = 195; // Titik akhir garis lurus (x)
    const startY = 33; // Tinggi garis lurus (y)

    // ini text dibawah kop surat
    pdf.setFontSize(14); // Mengatur ukuran teks menjadi 16
    pdf.setFont('poppins', 'bold'); // Mengatur ketebalan teks menjadi tebal
    pdf.text('Riwayat Pengguna Website Panic Button', 60, 50);

    // ini kode untuk paragraph di pdf
    pdf.setFontSize(12); // Mengatur ukuran teks menjadi 10
    pdf.setFont('poppins', 'semibold'); // Mengatur ketebalan teks menjadi tebal
    const paragraph = 'Surat ini melampirkan terkait data bulanan yang diperoleh dari website panic button tentang seberapa banyak masyarakat yang menggunakan website ini sebagai sarana dan prasarana untuk meminta bantuan pada petugas pemadam kebakaran. Berikut merupakan data kasus yang dilaporkan ke website panic button:';
    const startParagraph = 15; // Titik awal paragraf (x)
    const startHigh = 60; // Tinggi paragraf (y)
    const maxWidth = 180; // Lebar maksimum paragraf (dalam contoh ini, 100)

    // Convert table element to autotable-friendly format
    const tableData = [];
    const headers = [];
    const rows = table.rows;

    // Extract table headers
    for (let i = 0; i < rows[0].cells.length; i++) {
      const headerText = rows[0].cells[i].textContent;
      if (headerText !== "Aksi") {
        headers.push(headerText);
      }
    }

    // Extract table rows
    for (let i = 1; i < rows.length; i++) {
      const rowData = [];
      const cells = rows[i].cells;

      for (let j = 0; j < cells.length; j++) {
        const cellText = cells[j].textContent;
        if (headers[j] !== "Aksi") {
          rowData.push(cellText);
        }
      }

      tableData.push(rowData);
    }

    const options = {
      startY: 80,
      theme: "grid",
      styles: {
        fontSize: 10,
        textColor: [0, 0, 0],
        lineColor: [0, 0, 0],
        lineWidth: 0.2,
      },
      head: [headers],
      body: printData.length > 0 ? printData : tableData,
    };

    if (pdf.internal.getCurrentPageInfo().pageNumber === 1) {
      pdf.line(startX, startY, endX, startY);
      pdf.text(paragraph, startParagraph, startHigh, {
        align: "left",
        maxWidth: maxWidth,
      });
    }
    pdf.autoTable(options);
    pdf.save("history.pdf");
  };

  // ini fungsi untuk dropdown filter kasus
  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  // ini fungsi untuk dropdown filter kasus
  const handleSelectMonth = (month) => {
    setSelectedMonth(month);
    toggleDropdown();
    const filteredData = allData.filter(
      (item) =>
        moment(item.clicked_at).locale("id").format("MMMM") === month
    );
    setLists(filteredData);
    setPrintData(
      filteredData.map((item, index) => [
        index + 1,
        item.username,
        item.phone_number,
        item.name_device,
        moment(item.clicked_at).locale("id").format("LLL"),
        item.caseType,
        `${item.latitude}, ${item.longitude}`,
        item.actived ? "Sudah Selesai" : "Belum Selesai",
      ])
    );
    setIsDataFound(filteredData.length > 0);
  };

  const handleShowAllData = () => {
    setSelectedMonth("");
    setLists(allData);
    setPrintData(
      allData.map((item, index) => [
        index + 1,
        item.username,
        item.phone_number,
        item.name_device,
        moment(item.clicked_at).locale("id").format("LLL"),
        item.caseType,
        `${item.latitude}, ${item.longitude}`,
        item.actived ? "Sudah Selesai" : "Belum Selesai",
      ])
    );
    setIsDataFound(allData.length > 0);
  };

  useEffect(() => {
    const guid = getGuid();
    getData(1, 100, guid);
  }, []);

  const getData = (page, limit, month) => {
    const data = {
      page: page,
      limit: limit,
      month: month, 
    };
    Services.GetAllHistory(data)
      .then((res) => {
        const lists = res.data.history;
        setLists(lists);
        setAllData(lists);
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

  const handleLihatGambar = (image) => {
    // const imageURL = `https://pptik-local.pptik.id:5140/api.v1/images/${image}`;
    const imageURL = `https://pemadam.pptik.id/api/api.v1/images/${image}`;
    window.open(imageURL, "_blank");
  };  

  // INI KODE UNTUK ISI DARI TABLE
  const renderTable = () => {
    const offset = currentPage * perPage;
    const reversedData = [...lists].reverse(); // Membalikkan urutan seluruh data

    // Filter data berdasarkan bulan yang dipilih
    const filteredData = selectedMonth ? reversedData.filter(item => moment(item.clicked_at).locale('id').format('MMMM') === selectedMonth) : reversedData;

    const currentPageData = filteredData.slice(offset, offset + perPage);

    return currentPageData.map((list, index) => {
      const { _id, name_device, username, phone_number, clicked_at, caseType, latitude, longitude, actived } = list;
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
              maxWidth: "50px",
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
            +62{phone_number}
          </td>

          <td
            className="whitespace-nowrap px-4 py-3 text-gray-700"
            style={{
              maxWidth: "250px",
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
              maxWidth: "200px",
              textOverflow: "ellipsis",
              overflow: "hidden",
              whiteSpace: "nowrap",
            }}
          >
            {caseType}
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
            {latitude},{longitude}
          </td>

          <td className="text-center">
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

          <td className=" flex flex-row text-center w-64">
            <button
              className="inline-block rounded bg-[#FEAE1C] hover:bg-[#eea41c] px-4 py-2 my-1 mx-1 text-xs font-medium text-white"
              onClick={() => HistoryPopup(list.guid)}
            >
              Selesaikan Kasus
            </button>

            <button
              className="inline-block rounded bg-blue-700 hover:bg-blue-800 px-4 py-2 my-1 mx-1 text-xs font-medium text-white"
              onClick={() => handleLihatGambar(list.image)}
            >
              Lihat Gambar
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


      <div className="flex flex-col px-4 lg:px-24 pt-1 pb-8">
        <div className="relative flex mb-3 justify-end">

          <div className="inline-flex mr-3 items-center overflow-hidden rounded-md border bg-white">
            <button
              className="h-full p-2 text-gray-600 hover:bg-gray-50 hover:text-gray-700" onClick={toggleDropdown}> Filter Kasus ({selectedMonth || "Semua Bulan"})
              <i className="flex pl-3 justify-center content-center fa-sharp fa-solid fa-sort-down" ></i>
            </button>
          </div>

          <div className="flex justify-center">
            <button className=" px-3 border rounded-md bg-gray-300 text-white hover:bg-gray-400" onClick={handlePrintPdf}>Print Pdf</button>
          </div>

          <div className="relative">
            {isOpen && (
              <div className="absolute mr-24 end-0 z-10 mt-10 w-56 max-h-48 overflow-y-auto divide-y divide-gray-100 rounded-md border border-gray-100 bg-white shadow-lg" role="menu">
                <div className="p-2">
                  <strong className="block p-2 text-xs font-medium uppercase text-gray-400">
                    Bulan
                  </strong>

                  {['Semua Bulan', 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'].map((bulan) => (
                    <button 
                      className="block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700" 
                      role="menuitem" 
                      onClick={() => bulan === 'Semua Bulan' ? handleShowAllData() : handleSelectMonth(bulan)}
                      >
                      {bulan}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="overflow-x-auto w-full">
          <table id="history-table" className="w-full border divide-y-2 divide-gray-200 text-sm">
            <thead>
              <tr>
                <th className="whitespace-nowrap px-4 py-2 text-center font-medium text-gray-900">
                  No.
                </th>

                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Nama Pengguna
                </th>

                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  No. Handphone
                </th>

                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Riwayat Perangkat
                </th>

                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Waktu Meminta Bantuan
                </th>

                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Tipe Kasus
                </th>

                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Koordinat
                </th>

                <th className="whitespace-nowrap px-4 py-2 text-center font-medium text-gray-900">
                  Status Kasus
                </th>

                <th className="whitespace-nowrap px-4 py-2 text-center font-medium text-gray-900" >
                  Aksi
                </th>
              </tr>
            </thead>

            <tbody>{renderTable()}</tbody>
          </table>
          
          {/* Apabila data filter bulan kosong, maka akan menampilkan ini */}
          {!isDataFound && (
            <tr className="flex justify-center">
              <td className="my-4 text-center">
                Tidak ada data pada bulan ini
              </td>
            </tr>
          )}

          <div className="mt-3 mb-4 flex justify-start lg:justify-end">
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