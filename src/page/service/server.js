import axios from "axios";
import { API_URL_SERVER } from "../service/endpoint"

export default axios.create({
    baseURL: API_URL_SERVER,
    headers: {
        "Content-type": "application/json",
    }
});

export const API_URL = API_URL_SERVER;