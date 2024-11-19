const Layout = () => import("@/layout/index.vue");

export default [
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/comm/login/index.vue"),
    meta: {
      title: "登录",
      showLink: false,
      rank: 101
    }
  },
  {
    path: "/redirect",
    component: Layout,
    meta: {
      title: "加载中...",
      showLink: false,
      rank: 102
    },
    children: [
      {
        path: "/redirect/:path(.*)",
        name: "Redirect",
        component: () => import("@/layout/redirect.vue")
      }
    ]
  },
  {
    path: "/empty",
    name: "Empty",
    component: () => import("@/views/comm/empty/index.vue"),
    meta: {
      title: "暂无搜索结果",
      showLink: false,
      rank: 103
    }
  },
  {
    path: "/account-settings",
    name: "AccountSettings",
    component: Layout,
    meta: {
      icon: "ep:home-filled",
      title: "账户设置",
      rank: 104
    },
    children: [
      {
        path: "index",
        name: "AccountSettingsIndex",
        component: () => import("@/views/comm/account-settings/index.vue"),
        meta: {
          title: "账户设置",
          showLink: false
        }
      }
    ]
  }
] satisfies Array<RouteConfigsTable>;
