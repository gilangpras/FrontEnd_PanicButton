import React, {Component} from "react";
import Services from "../service/services"
import AlertComponent from "../components/alert"
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css"
import { getGuid } from "../helper/index";

export default class TableDevice extends Component {
  constructor() {
    super();
    this.state = {
      lists: [],
      items: [],
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
    Services.GetDevice(data)
      .then(res => {
        const lists = res.data.device;
        this.setState({ lists });
      })
      .catch(error => {
        console.log('Error yaa ', error);
      });
  }

  useGuid(data) {
    this.setState({ guid: data.guid_device });
    localStorage.setItem('guid_device', data.guid_device);
    localStorage.setItem('name_device', data.name);

    const requestData = {
      guid_device: data.guid_device,
      status: '1',
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

  render() {
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
      </div>
      </div>
    );
  }

  renderTable() {
    return this.state.lists.map((list, index) => {
      const { _id, guid_device, name, type_device, longitude, latitude } = list;
      return (
        <tr key={_id}>
          <td className=" whitespace-nowrap px-4 py-3 text-center font-medium text-gray-900">{index + 1}</td>
          <td className=" whitespace-nowrap px-4 py-3 text-gray-700">{guid_device}</td>
          <td className=" whitespace-nowrap px-4 py-3 text-gray-700">{name}</td>
          <td className=" whitespace-nowrap px-4 py-3 text-gray-700">{type_device}</td>
          <td className=" whitespace-nowrap px-4 py-3 text-gray-700">{latitude}</td>
          <td className=" whitespace-nowrap px-4 py-3 text-gray-700">{longitude}</td>
          <td className=" text-center">
            
            <button className="inline-block rounded bg-yellow-400 hover:bg-yellow-500 px-4 py-2 my-1 text-xs font-medium text-white" onClick={e => this.useGuid(list)}>
              Hidupkan
            </button>

            <button className="inline-block rounded z-50 bg-red-500 hover:bg-red-600 px-4 py-2 ml-3 my-1 text-xs font-medium text-white" onClick={e => this.deleteGuid(list)}>
              Hapus
            </button>
          </td>
        </tr>
      );
    });
  }
}