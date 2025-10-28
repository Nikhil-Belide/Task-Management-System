import axios from "axios"

const BASE_URL = "http://localhost:3000/api"  // ← Changed from 5000 to 3000

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
})

export default axiosInstance