import request from "@/utils/request";
const login = (data) => {
  return request({
    url: "/login",
    method: "POST",
    data,
  });
};

// 获取用户权限
const getRoles = (data) => {
  return request({
    url: "/roles",
    method: "POST",
    data,
  });
};

export { login, getRoles };
