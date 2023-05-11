/* eslint-disable import/no-anonymous-default-export */
import swal from "sweetalert";

class AlertComponent {
  Succes(data) {
    swal({
      title: "Berhasil",
      text: data,
      icon: "success",
      button: true,
      timer: 10000,
    });
  }
  welcome(data) {
    swal({
      title: "Selamat Datang",
      text: data,
      icon: "success",
      button: true,
      timer: 10000,
    });
  }

  Error(data) {
    swal({
      title: "Mohon Maaf",
      text: data,
      icon: "error",
      button: true,
      dangerMode: true,
    });
  }
  Exit() {
    swal({
      title: "Apakah Anda Yakin?",
      text: "Ingin Keluar Dari Sistem !",
      icon: "warning",
      dangerMode: true,
    });
  }

  Warning(data) {
    swal({
      title: "Mohon Maaf",
      text: data,
      icon: "warning",
      button: true,
    });
  }
}
export default new AlertComponent();
