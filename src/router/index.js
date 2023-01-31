import Vue from "vue";
import VueRouter from "vue-router";

import login from "@/views/login";
import Layout from "@/views/layout";
import asyncRouetr from "./aynsc";
import nprogress from "nprogress";
import store from "@/store";

const originalPush = VueRouter.prototype.push

VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(VueRouter);

const routes = [
  {
    path: "/login",
    name: "login",
    component: login,
  },
  {
    path: "/",
    component: Layout,
    children: [
      {
        path: "",
        component: () => import("@/views/index"),
      },
    ],
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  nprogress.start();
  if (to.path == "/login") {
    next();
  } else {
    let token = localStorage.getItem("token");
    if (!token) {
      next("/login");
    } else {
      next();
    }
  }
});
router.afterEach(() => {
  //路由跳转结束之后 进度条结束
  nprogress.done();
});
export function initAsyncRouter() {
  // 根据二级权限 对路由规则进行动态的添加
  const currentRoutes = router.options.routes;
  const rightList = store.state.userRole;
  rightList.forEach((item) => {
    if (item.path) {
      const temp = asyncRouetr[item.path];
      if (temp) {
        currentRoutes[1].children.push(temp);
      }
    }
    if (item.children && item.children.length > 0) {
      item.children.forEach((item) => {
        // item 二级权限
        const temp = asyncRouetr[item.path];
        if (temp) {
          currentRoutes[1].children.push(temp);
        }
      });
    }
  });
  router.addRoute(...currentRoutes);
}

export default router;
