import axios from "axios";
import { Message, MessageBox } from "element-ui";
import router from "../router";
import nprogress from "nprogress";

let request = axios.create({
  // baseURL: window.global_url.baseURL,
  // baseURL: "http://192.168.97.179:18099/",
  // baseURL: "http://192.168.40.54:18099/",
  // baseURL: "http://41.244.49.125:49090/",
  // baseURL: "https://supervise.rzxhz.com:18081",
  baseURL: "/",
  timeout: 5000,
});
// request.defaults.headers.post["Content-Type"] =
//   "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8;application/octet-stream";
request.interceptors.request.use(
  (config) => {
    const isToken = (config.headers || {}).isToken === false;
    if (!isToken) {
      config.headers["Authorization"] =
        "Bearer " + localStorage.getItem("token"); // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    nprogress.start();
    if (config) {
      nprogress.done();
    }
    return config;
    /* 取到数据后 */
  },
  (err) => {
    // nprogress.done()
    Promise.reject(err);
  }
);
request.interceptors.response.use(
  (res) => {
    console.log(res);
    if (res.data.code == 401) {
      localStorage.clear();
      router.replace("/login");
      Message({
        message: "登录过期，请重新登录",
        type: "error",
      });
    }
    if (res.data.code != 401 && res.data.code != 200) {
      Message({
        message: `${res.data.message}`,
        type: "error",
      });
    }
    return res.data;
  },
  (err) => {
    Message({
      message: `${err.data.message} `,
      // : ${err.data.result}
      type: "error",
    });
    Promise.reject(err);
  }
);
export default request;
