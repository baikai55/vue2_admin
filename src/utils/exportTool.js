import { Message } from "element-ui";
import request from "./request";

// 通用下载方法
export function download(url, params, filename, config) {
  return request
    .post(url, params, {
      transformRequest: [
        (params) => {
          return tansParams(params);
        },
      ],
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      responseType: "blob",
      ...config,
    })
    .then(async (data) => {
      const isLogin = await blobValidate(data);
      if (isLogin) {
        const blob = new Blob([data]);
        saveAs(blob, filename);
      } else {
        const resText = await data.text();
        const rspObj = JSON.parse(resText);
        const message =
          errorCode[rspObj.code] || rspObj.msg || errorCode["default"];
        Message.error(message);
      }
    })
    .catch((r) => {
      console.error(r);
      Message.error("下载文件出现错误，请联系管理员！");
    });
}

// 验证是否为blob格式
export async function blobValidate(data) {
  try {
    const text = await data.text();
    JSON.parse(text);
    return false;
  } catch (error) {
    return true;
  }
}
/**
 * 参数处理
 * @param {*} params  参数
 */
export function tansParams(params) {
  let result = "";
  for (const propName of Object.keys(params)) {
    const value = params[propName];
    var part = encodeURIComponent(propName) + "=";
    if (value !== null && value !== "" && typeof value !== "undefined") {
      if (typeof value === "object") {
        for (const key of Object.keys(value)) {
          if (
            value[key] !== null &&
            value[key] !== "" &&
            typeof value[key] !== "undefined"
          ) {
            let params = propName + "[" + key + "]";
            var subPart = encodeURIComponent(params) + "=";
            result += subPart + encodeURIComponent(value[key]) + "&";
          }
        }
      } else {
        result += part + encodeURIComponent(value) + "&";
      }
    }
  }
  return result;
}
