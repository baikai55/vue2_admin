//系统管理
const dept = {
  path: "/system/dept",
  component: () => import("@/views/system/dept"),
  meta: { title: "机构管理", father: "系统管理" },
};
const user = {
  path: "/system/user",
  component: () => import("@/views/system/user"),
  meta: { title: "用户管理", father: "系统管理" },
};
const asyncRouetr = {
  "/system/dept": dept,
  "/system/user": user,
};

export default asyncRouetr;
