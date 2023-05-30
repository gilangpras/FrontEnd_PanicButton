import React, { Component } from "react";
import Services from "../service/services"
import AlertComponent from "../components/alert"
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css"
import { getGuid } from "../helper/index";
import ReactPaginate from "react-paginate";

export default class TableDevice extends Component {
  constructor() {
    super();
    this.state = {
      lists: [],
      items: [],
      currentPage: 0,
      perPage: 5,
      active: 0,
      data: 0,
      show: false,
      handleClose: false,
      list_guid: null,
      guid: '',
    };
    this.useGuid = this.useGuid.bind(this);
  }

  componentDidMount() {
    const guid = getGuid()
    this.getData(1, 100, guid);
  }

  getData(page, limit, guid_user) {
    const data = {
      page: page,
      limit: limit,
      guid_user: guid_user,
    };
    Services.GetAllDevice(data)
      .then(res => {
        const lists = res.data.device;
        this.setState({ lists });
      })
      .catch(error => {
        console.log('Error yaa ', error);
      });
  }

  // Kode untuk button Hidupkan
  useGuid(data) {
    this.setState({ guid: data.guid_device });
    localStorage.setItem('guid_device', data.guid_device);
    localStorage.setItem('name_device', data.name);

    const requestData = {
      guid_device: data.guid_device,
      status: '0',
    };

    Services.OnPanicButton(requestData)
      .then((res) => {
        if (res.status) {
          AlertComponent.Succes('Bel berhasil dihidupkan!');
        } else {
          AlertComponent.Error(res.data.message);
        }
      })
      .catch((error) => {
        console.error(error);
        AlertComponent.Error('Gagal mengirimkan data.');
      });
  }


  // Kode untuk button matikan
  turnOff(data) {
    this.setState({ guid: data.guid_device });
    localStorage.setItem('guid_device', data.guid_device);

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
  }

  // Kode untuk Button Hapus
  deleteGuid(data) {
    confirmAlert({
      title: 'Konfirmasi Hapus',
      message: 'Apakah Anda yakin untuk melakukan ini',
      buttons: [
        {
          label: 'Iya',
          onClick: () => this.delete(data),
        },
        {
          label: 'Tidak',
        },
      ],
    });
  }

  delete(data) {
    Services.DeleteDevice(data.guid)
      .then(res => {
        if (res.status) {
          AlertComponent.Succes(res.data.message);
          window.location.reload(false);
        } else {
          AlertComponent.Warning(res.data.message);
        }
      })
      .catch(error => {
        console.log('Error yaa ', error);
      });
  }

  Close() {
    this.setState({ show: false });
  }

  handlePageClick = (data) => {
    const selectedPage = data.selected;
    this.setState({ currentPage: selectedPage });
  };

  renderTable() {
    const { lists, currentPage, perPage } = this.state;
    const offset = currentPage * perPage;
    const currentPageData = lists.slice(offset, offset + perPage);

    return currentPageData.map((list, index) => {
      const { _id, guid_device, name, type_device, longitude, latitude } = list;
      const deviceNumber = index + 1 + offset;
      return (
        <tr key={_id}>
          <td className=" whitespace-nowrap px-4 py-3 text-center font-medium text-gray-900">{deviceNumber}</td>
          <td className="whitespace-nowrap px-4 py-3 text-gray-700" style={{ maxWidth: "120px", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>{guid_device}</td>
          <td className="whitespace-nowrap px-4 py-3 text-gray-700" style={{ maxWidth: "230px", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>{name}</td>
          <td className=" whitespace-nowrap px-4 py-3 text-gray-700" style={{ maxWidth: "80px", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>{type_device}</td>
          <td className=" whitespace-nowrap px-4 py-3 text-gray-700" style={{ maxWidth: "140px", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>{latitude}</td>
          <td className=" whitespace-nowrap px-4 py-3 text-gray-700" style={{ maxWidth: "140px", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>{longitude}</td>
          <td className=" text-center">

            <button className="inline-block rounded bg-blue-700 hover:bg-blue-800 px-4 py-2 my-1 text-xs font-medium text-white" onClick={e => this.useGuid(list)}>
              Hidupkan
            </button>

            <button className="inline-block rounded bg-[#FEAE1C] hover:bg-[#eea41c] px-4 py-2 ml-3 my-1 text-xs font-medium text-white" onClick={e => this.turnOff(list)}>
              Matikan
            </button>

            <button className="inline-block rounded z-50 bg-red-500 hover:bg-red-600 px-4 py-2 ml-3 my-1 text-xs font-medium text-white" onClick={e => this.deleteGuid(list)}>
              Hapus
            </button>
          </td>
        </tr>
      );
    });
  }

  render() {
    const { lists, perPage } = this.state;

    return (
      <div className="flex px-4 lg:px-24 pt-1 pb-8">
        <div className="overflow-x-auto w-full">
          <table className="w-full border divide-y-2 divide-gray-200 text-sm">
            <thead>
              <tr>
                <th className="whitespace-nowrap px-4 py-2 text-center font-medium text-gray-900">No.</th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">GUID Device</th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">Nama Perangkat</th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">Tipe Perangkat</th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">Latitude</th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">Longitude</th>
                <th className="whitespace-nowrap px-4 py-2 text-center font-medium text-gray-900"> Aksi </th>
              </tr>
            </thead>

            <tbody>{this.renderTable()}</tbody>
          </table>

          <div className="mt-2 flex justify-start lg:justify-end">
          <ReactPaginate
            previousLabel={<span className="mx-2 font-medium text-gray-800 hover:bg-blue-200">previous</span>}
            nextLabel={<span className="mx-2 font-medium text-gray-800 hover:bg-blue-200">next</span>}
            breakLabel={'...'}
            pageCount={Math.ceil(lists.length / perPage)}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={this.handlePageClick}
            containerClassName={'pagination flex border border-gray-300 w-fit rounded-sm p-2'}
            subContainerClassName={' border pages pagination'}
            activeClassName={'bg-blue-500 text-white'}
            breakClassName={'border-r border-gray-300'}
            breakLinkClassName={'px-2'}
            pageClassName={'border-r border-l border-gray-300'}
            pageLinkClassName={'px-2'}
          />
          </div>

        </div>
      </div>
    );
  }
}