import React from "react";
import axios from "axios";
import useAuth from "./useAuth";
import { useNavigate } from "react-router-dom";

const axiosSecure = axios.create({
  baseURL: `https://hostel-bite-server.vercel.app`,
});

const useAxiosSecure = () => {
  const { user, logout } = useAuth();
    const navigate = useNavigate();

  axiosSecure.interceptors.request.use(
    (config) => {
      config.headers.Authorization = `Bearer ${user.accessToken}`;
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  axiosSecure.interceptors.response.use(
    (res) => {
      return res;
    },
    (error) => {
      const status = error.status;
      // console.log(status);
      if (status === 403) {
        navigate("/forbidden");
      } else if (status === 401) {
        logout()
          .then(() => {
            navigate("/login");
          })
          .catch(() => {});
      }
      return Promise.reject(error);
    }
  );

  return axiosSecure;
};

export default useAxiosSecure;
