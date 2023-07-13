import Http from "./server_history";
import { authHeader } from "../helper";

class Services {

  // Bagian History
  AddHistory(data) {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });
  
    return Http.post("historys/addhistory", formData, { 
      headers: {
        ...authHeader(),
        "Content-Type": "multipart/form-data",
      },
    });
    
  }
  
}
// eslint-disable-next-line import/no-anonymous-default-export
export default new Services();
