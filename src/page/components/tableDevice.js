import React, { Component } from "react";
import Services from "../service/services"
import AlertComponent from "../components/alert"
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css"
import { getGuid } from "../helper/index";
import ReactPaginate from "react-paginate";
import Modal from "react-responsive-modal";

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
      showModal: false, // Tambahkan state untuk menampilkan modal
      name: "", // Tambahkan state untuk menyimpan nilai input nama
      type_device: "", // Tambahkan state untuk menyimpan nilai input tipe device
      guid_user: "", // Tambahkan state untuk menyimpan nilai input GUID user
      guid_device: "",
      latitude: "", // Tambahkan state untuk menyimpan nilai input latitude
      longitude: "", // Tambahkan state untuk menyimpan nilai input longitude
      deviceToUpdate: null, // Tambahkan state untuk menyimpan perangkat yang akan diupdate
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

  showModal = (device) => {
    const { name, type_device, guid_user, guid_device, latitude, longitude } = device;
    this.setState({
      showModal: true,
      name,
      type_device,
      guid_user,
      guid_device,
      latitude,
      longitude,
      deviceToUpdate: device, // Simpan perangkat yang akan diupdate dalam state
    });
  };

  hideModal = () => {
    this.setState({
      showModal: false,
      name: "",
      type_device: "",
      guid_user: "",
      guid_device: "",
      latitude: "",
      longitude: "",
      deviceToUpdate: null, // Reset state perangkat yang akan diupdate
    });
  };

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });
  };

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
      customUI: ({ onClose }) => (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8">
            <h2 className="text-xl font-bold mb-4">Konfirmasi Hapus</h2>
            <p className="text-gray-700 mb-4">Apakah Anda yakin ingin menghapus device ini?</p>
            <div className="flex justify-end">
              <button
                className="px-4 py-2 mr-2 bg-blue-500 text-white rounded"
                onClick={() => {
                  onClose();
                  this.delete(data);
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
  }

  delete(data) {
    Services.DeleteDevice(data.guid)
      .then(res => {
        if (res.status) {
          AlertComponent.Succes("Device Berhasil dihapus");
          window.location.reload(false);
        } else {
          AlertComponent.Warning(res.data.message);
        }
      })
      .catch(error => {
        console.log('Error yaa ', error);
      });
  }

  editDevice() {
    const { deviceToUpdate, name, type_device, guid_user, guid_device, latitude, longitude } = this.state;
    const requestData = {
      name: name,
      type_device: type_device,
      guid_user: guid_user,
      guid_device: guid_device,
      latitude: latitude,
      longitude: longitude,
    };

    Services.UpdateDevice(deviceToUpdate.guid, requestData)
      .then((res) => {
        if (res.status) {
          AlertComponent.Succes(res.data.message);
          this.hideModal(); // Sembunyikan modal setelah berhasil mengedit perangkat
          window.location.reload(false);
        } else {
          AlertComponent.Warning(res.data.message);
        }
      })
      .catch((error) => {
        console.log("Error yaa ", error);
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
          <td className=" text-center flex flex-row justify-center">

            <button
              className="inline-block rounded bg-[#FEAE1C] hover:bg-[#eea41c] px-4 py-2 ml-3 my-1 text-xs font-medium text-white"
              onClick={() => this.showModal(list)}
            >
              Edit Device
            </button>

            <Modal
              open={this.state.showModal}
              onClose={this.hideModal}
              center
              className="overflow-hidden bg-opacity-50"
              styles={{ modal: { borderRadius: "10px" } }}
            >
              <div className="p-5 lg:mx-24 ">
                <h2 className="text-lg font-medium mb-4 text-center mx-20 lg:mx-24">Edit Device</h2>
                <form>
                  <div className="mb-2">
                    <label className="block text-gray-500">Nama Perangkat</label>
                    <input className="w-full px-3 py-2 border-2 rounded-lg"
                      type="text"
                      name="name"
                      value={this.state.name}
                      onChange={this.handleInputChange}
                    />
                  </div>

                  <div className="mb-2">
                    <label className="block text-gray-500">Tipe Device</label>
                    <select
                      type="text"
                      name="type_device"
                      value={this.state.type_device}
                      className="w-full px-3 py-2 border-2 rounded-lg"
                      onChange={this.handleInputChange}
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
                      value={this.state.guid_user}
                    />
                  </div>

                  <div className="mb-2">
                    <label className="block text-gray-500">GUID Device</label>
                    <input className="w-full px-3 py-2 border-2 rounded-lg"
                      type="text"
                      name="guid_device"
                      value={this.state.guid_device}
                      onChange={this.handleInputChange}
                    />
                  </div>

                  <div className="mb-2">
                    <label className="block text-gray-500">Latitude</label>
                    <input className="w-full px-3 py-2 border-2 rounded-lg"
                      type="text"
                      name="latitude"
                      value={this.state.latitude}
                      onChange={this.handleInputChange}
                    />
                  </div>

                  <div className="mb-2">
                    <label className="block text-gray-500">Longitude</label>
                    <input className="w-full px-3 py-2 border-2 rounded-lg"
                      type="text"
                      name="longitude"
                      value={this.state.longitude}
                      onChange={this.handleInputChange}
                    />
                  </div>

                  <button className="bg-[#FEAE1C] text-white px-3 py-2 rounded-lg mt-4"
                    type="submit"
                    onClick={() => this.editDevice(list)}
                  >
                    Edit
                  </button>

                </form>
              </div>
            </Modal>

            <button className="inline-block rounded bg-blue-700 hover:bg-blue-800 px-4 py-2 ml-3 my-1 text-xs font-medium text-white" onClick={e => this.useGuid(list)}>
              Hidupkan
            </button>

            <button className="inline-block rounded border border-blue-700 hover:bg-blue-100 px-4 py-2 ml-3 my-1 text-xs font-bold text-blue-700" onClick={e => this.turnOff(list)}>
              Matikan
            </button>

            <button className="inline-block rounded z-50 border border-red-500 hover:bg-red-100 px-4 py-2 ml-3 my-1 text-xs font-medium text-red-500" onClick={e => this.deleteGuid(list)}>
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