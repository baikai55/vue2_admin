import Mock from "mockjs";
// 使用Mock
// const Mock = require('mockjs')
Mock.setup({
  // timeout: "500-1000",
});

// 用户信息
const users = [
  {
    code: 200,
    username: "zhangsan",
    password: "123456",
    result: {
      id: 1,
      photo:
        "https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=2667925509,1048662418&fm=11&gp=0.jpg",
      token: "zhangsan-token",
      role: "zhangsan",
      rights: [],
      user: {
        realName: "张三",
        userType: 2,
      },
    },
  },
  {
    code: 200,
    username: "root",
    password: "123456",
    result: {
      id: 2,
      photo:
        "https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=2364244149,3298797080&fm=26&gp=0.jpg",
      token: "root-token",
      role: "root",
      rights: [],
      user: {
        userType: 0,
        realName: "超级管理员",
      },
    },
  },
];

// 权限信息 将权限信息从用户信息中抽离出来 不同身份对应不同的路由信息
// 这样方便了后期的维护 否则以后每加一个页面就需要在每个用户信息中做更改 十分的不方便 如果用户多了更是增添了不必要的麻烦
// 将用户直接分为不同身份 然后对不同身份做处理 这样比较合理
const roles = {
  zhangsan: {
    code: 200,
    data: [
      {
        id: 189,
        authName: "系统管理",
        icon: "el-icon-connection",
        path: "system",
        children: [
          {
            id: 11,
            authName: "机构管理",
            icon: "el-icon-s-grid",
            path: "dept",
            rights: ["view", "edit", "add", "delete"],
          },
        ],
      },
      {
        id: 1,
        authName: "基本页面",
        icon: "el-icon-connection",
        path: "basic",
        children: [
          {
            id: 11,
            authName: "表格页面",
            icon: "el-icon-s-grid",
            path: "table",
            rights: ["view"],
          },
          {
            id: 12,
            authName: "素材页面",
            icon: "el-icon-s-marketing",
            path: "image",
            rights: ["view"],
          },
        ],
      },
    ],
  },
  root: {
    code: 200,
    data: [
      {
        id: 1,
        authName: "系统管理",
        icon: "el-icon-connection",
        path: "system",
        children: [
          {
            id: 11,
            authName: "机构管理",
            icon: "el-icon-s-grid",
            path: "/system/dept",
            rights: ["view", "edit", "add", "delete"],
          },
          {
            id: 113,
            authName: "⽤户管理",
            icon: "el-icon-s-grid",
            path: "/system/user",
            rights: ["view", "edit", "add", "delete"],
          },
          {
            id: 112,
            authName: "权限管理",
            icon: "el-icon-s-grid",
            path: "permission",
            rights: ["view", "edit", "add", "delete"],
          },
          {
            id: 111,
            authName: "⻆⾊管理",
            icon: "el-icon-s-grid",
            path: "roles",
            rights: ["view", "edit", "add", "delete"],
          },
          {
            id: 12,
            authName: "⽩名单管理",
            icon: "el-icon-s-marketing",
            path: "white",
            rights: ["view", "edit", "add", "delete"],
          },
        ],
      },
      {
        id: 2,
        authName: "用户权限",
        icon: "el-icon-set-up",
        path: "user",
        children: [
          {
            id: 21,
            authName: "权限页面",
            icon: "el-icon-s-custom",
            path: "users",
            rights: ["view", "edit", "add", "delete"],
          },
        ],
      },
    ],
  },
};

// 表格信息
const tables = [
  {
    date: "2016-05-02",
    name: "王小虎",
    address: "上海市普陀区金沙江路 1518 弄",
  },
  {
    date: "2016-05-04",
    name: "王小虎",
    address: "上海市普陀区金沙江路 1517 弄",
  },
  {
    date: "2016-05-01",
    name: "王小虎",
    address: "上海市普陀区金沙江路 1519 弄",
  },
  {
    date: "2016-05-03",
    name: "王小虎",
    address: "上海市普陀区金沙江路 1516 弄",
  },
];

// 用户登录
Mock.mock("/login", "post", (option) => {
  const { username, password } = JSON.parse(option.body);
  const user = users.find((item) => {
    return item.username === username && item.password === password;
  });
  return user ?? { code: 402, message: "用户名或密码错误" };
});

// 用户权限信息
Mock.mock("/roles", "post", (option) => {
  return roles[option.body] ?? { code: 402, message: "用户权限不足" };
});

// 获取表格信息
Mock.mock("/tabledata", "get", () => {
  // 这里是获取session中token 然后验证token是否正确 如果不正确则不返回数据
  const token = localStorage.getItem("token");
  // 由于这里是Mock数据 所以将用户的token在这里写死了 然后验证token是否正确
  if (token === "root-token" || token === "zhangsan-token") {
    return tables;
  } else {
    // 如果将session中token更改为错误的token 则展示这个信息
    alert("无效token");
    // 关闭弹出信息后返回401 之后通过响应拦截器跳转到登录页面
    return {
      code: 401,
    };
  }
});

// 删除表格信息
Mock.mock("/tabledata", "delete", (option) => {
  console.log(option);
  return {
    message: "删除成功",
  };
});
