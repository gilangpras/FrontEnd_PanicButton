import Http from "./server";
import { authHeader, authHeaderStatic, } from "../helper";

class Service {
  // Bagian Users
  Login(data) {
    return Http.post("users/signin", data, { headers: authHeaderStatic() });
  }
  Register(data) {
    return Http.post("users/signup", data, { headers: authHeaderStatic() });
  }
  GetProfile(data) {
    return Http.post("users/profile", data, { headers: authHeader() });
  }
  UpdateProfile(data) {
    return Http.post("users/update", data, { headers: authHeader() });
  }
  GetUserByGuid(data) {
    return Http.post("users/getuserbyid", data, {headers: authHeaderStatic ()});
  }

  // Bagian Devices
  RegisterDevice(data) {
    return Http.post("devices/add", data, { headers: authHeader() });
  }
  GetDevice(data) {
    return Http.post("devices/user-device", data, { headers: authHeader() });
  }
  DeleteDevice(guid) {
    return Http.delete("devices/delete/"+guid, { headers: authHeader() });
  }
  OnPanicButton(data) {
    return Http.post("devices/control", data, { headers: authHeader() });
  }
  GetAllDevice(data) {
    return Http.post("devices/getalldevice", data, { headers: authHeader() });
  }
  UpdateDevice(guid, data) {
    return Http.post("devices/updatedevice/"+guid, data, { headers: authHeader() });
  }

  // Bagian History
  AddHistory(data) {
    return Http.post("historys/addhistory", data, { headers: authHeader() });
  }
  GetAllHistory(data) {
    return Http.post("historys/getallhistory", data, { headers: authHeader() });
  }
  UpdateHistory(guid, data) {
    return Http.post("historys/updatehistory/"+guid, data, { headers: authHeader() });
  }
}
// eslint-disable-next-line import/no-anonymous-default-export
export default new Service();
