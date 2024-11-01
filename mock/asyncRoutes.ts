// 模拟后端动态生成路由
import { defineFakeRoute } from "vite-plugin-fake-server/client";
import {
  tabs,
  frame,
  tenant,
  system,
  monitor,
  permission
} from "@/router/enums";

/**
 * roles：页面级别权限，这里模拟二种 "admin"、"common"
 * admin：管理员角色
 * common：普通角色
 */

const tenantManagementRouter = {
  path: "/tenant",
  meta: {
    icon: "ri:home-gear-line",
    title: "租户管理",
    rank: tenant,
    extraIcon: "IF-pure-iconfont-new svg"
  },
  children: [
    {
      path: "/tenant/list/index",
      name: "TenantList",
      meta: {
        icon: "ri:list-check",
        title: "租户列表",
        roles: ["admin"]
      }
    },
    {
      path: "/tenant/package/index",
      name: "TenantPackage",
      meta: {
        icon: "ri:file-paper-line",
        title: "租户套餐",
        roles: ["admin"]
      }
    }
  ]
};

const systemManagementRouter = {
  path: "/system",
  meta: {
    icon: "ri:settings-3-line",
    title: "系统管理",
    rank: system
  },
  children: [
    {
      path: "/system/user/index",
      name: "SystemUser",
      meta: {
        icon: "ri:admin-line",
        title: "用户管理",
        roles: ["admin"]
      }
    },
    {
      path: "/system/role/index",
      name: "SystemRole",
      meta: {
        icon: "ri:admin-fill",
        title: "角色管理",
        roles: ["admin"]
      }
    },
    {
      path: "/system/menu/index",
      name: "SystemMenu",
      meta: {
        icon: "ep:menu",
        title: "菜单管理",
        roles: ["admin"]
      }
    },
    {
      path: "/system/dept/index",
      name: "SystemDept",
      meta: {
        icon: "ri:git-branch-line",
        title: "部门管理",
        roles: ["admin"]
      }
    },
    {
      path: "/system/dict/index",
      name: "SystemDict",
      meta: {
        icon: "ri:book-2-line",
        extraIcon: "IF-pure-iconfont-new svg",
        title: "字典管理",
        roles: ["admin"]
      }
    }
  ]
};

const systemMonitorRouter = {
  path: "/monitor",
  meta: {
    icon: "ep:monitor",
    title: "系统监控",
    rank: monitor
  },
  children: [
    {
      path: "/monitor/online-user",
      component: "monitor/online/index",
      name: "OnlineUser",
      meta: {
        icon: "ri:user-voice-line",
        title: "在线用户",
        roles: ["admin"]
      }
    },
    {
      path: "/monitor/login-logs",
      component: "monitor/logs/login/index",
      name: "LoginLog",
      meta: {
        icon: "ri:window-line",
        title: "登录日志",
        roles: ["admin"]
      }
    },
    {
      path: "/monitor/operation-logs",
      component: "monitor/logs/operation/index",
      name: "OperationLog",
      meta: {
        icon: "ri:history-fill",
        title: "操作日志",
        roles: ["admin"]
      }
    },
    {
      path: "/monitor/system-logs",
      component: "monitor/logs/system/index",
      name: "SystemLog",
      meta: {
        icon: "ri:file-search-line",
        title: "系统日志",
        roles: ["admin"]
      }
    }
  ]
};

const permissionRouter = {
  path: "/permission",
  meta: {
    title: "权限管理",
    icon: "ep:lollipop",
    rank: permission
  },
  children: [
    {
      path: "/permission/page/index",
      name: "PermissionPage",
      meta: {
        title: "页面权限",
        roles: ["admin", "common"]
      }
    },
    {
      path: "/permission/button",
      meta: {
        title: "按钮权限",
        roles: ["admin", "common"]
      },
      children: [
        {
          path: "/permission/button/router",
          component: "permission/button/index",
          name: "PermissionButtonRouter",
          meta: {
            title: "路由返回按钮权限",
            auths: [
              "permission:btn:add",
              "permission:btn:edit",
              "permission:btn:delete"
            ]
          }
        },
        {
          path: "/permission/button/login",
          component: "permission/button/perms",
          name: "PermissionButtonLogin",
          meta: {
            title: "登录接口返回按钮权限"
          }
        }
      ]
    }
  ]
};

const frameRouter = {
  path: "/iframe",
  meta: {
    icon: "ri:links-fill",
    title: "外部页面",
    rank: frame
  },
  children: [
    {
      path: "/iframe/embedded",
      meta: {
        title: "文档内嵌"
      },
      children: [
        {
          path: "/iframe/colorhunt",
          name: "FrameColorHunt",
          meta: {
            title: "调色板",
            frameSrc: "https://colorhunt.co/",
            keepAlive: true,
            roles: ["admin", "common"]
          }
        },
        {
          path: "/iframe/uigradients",
          name: "FrameUiGradients",
          meta: {
            title: "渐变色",
            frameSrc: "https://uigradients.com/",
            keepAlive: true,
            roles: ["admin", "common"]
          }
        },
        {
          path: "/iframe/ep",
          name: "FrameEp",
          meta: {
            title: "element-plus",
            frameSrc: "https://element-plus.org/zh-CN/",
            keepAlive: true,
            roles: ["admin", "common"]
          }
        },
        {
          path: "/iframe/tailwindcss",
          name: "FrameTailwindcss",
          meta: {
            title: "tailwindcss",
            frameSrc: "https://tailwindcss.com/docs/installation",
            keepAlive: true,
            roles: ["admin", "common"]
          }
        },
        {
          path: "/iframe/vue3",
          name: "FrameVue",
          meta: {
            title: "vue3",
            frameSrc: "https://cn.vuejs.org/",
            keepAlive: true,
            roles: ["admin", "common"]
          }
        },
        {
          path: "/iframe/vite",
          name: "FrameVite",
          meta: {
            title: "vite",
            frameSrc: "https://cn.vitejs.dev/",
            keepAlive: true,
            roles: ["admin", "common"]
          }
        },
        {
          path: "/iframe/pinia",
          name: "FramePinia",
          meta: {
            title: "pinia",
            frameSrc: "https://pinia.vuejs.org/zh/index.html",
            keepAlive: true,
            roles: ["admin", "common"]
          }
        },
        {
          path: "/iframe/vue-router",
          name: "FrameRouter",
          meta: {
            title: "vue-router",
            frameSrc: "https://router.vuejs.org/zh/",
            keepAlive: true,
            roles: ["admin", "common"]
          }
        }
      ]
    },
    {
      path: "/iframe/external",
      meta: {
        title: "文档外链"
      },
      children: [
        {
          path: "/external",
          name: "https://pure-admin.github.io/pure-admin-doc",
          meta: {
            title: "vue-pure-admin",
            roles: ["admin", "common"]
          }
        },
        {
          path: "/pureUtilsLink",
          name: "https://pure-admin-utils.netlify.app/",
          meta: {
            title: "pure-admin-utils",
            roles: ["admin", "common"]
          }
        }
      ]
    }
  ]
};

const tabsRouter = {
  path: "/tabs",
  meta: {
    icon: "ri:bookmark-2-line",
    title: "标签页操作",
    rank: tabs
  },
  children: [
    {
      path: "/tabs/index",
      name: "Tabs",
      meta: {
        title: "标签页操作",
        roles: ["admin", "common"]
      }
    },
    // query 传参模式
    {
      path: "/tabs/query-detail",
      name: "TabQueryDetail",
      meta: {
        // 不在menu菜单中显示
        showLink: false,
        activePath: "/tabs/index",
        roles: ["admin", "common"]
      }
    },
    // params 传参模式
    {
      path: "/tabs/params-detail/:id",
      component: "params-detail",
      name: "TabParamsDetail",
      meta: {
        // 不在menu菜单中显示
        showLink: false,
        activePath: "/tabs/index",
        roles: ["admin", "common"]
      }
    }
  ]
};

export default defineFakeRoute([
  {
    url: "/get-async-routes",
    method: "get",
    response: () => {
      return {
        success: true,
        data: [
          tenantManagementRouter,
          systemManagementRouter,
          systemMonitorRouter,
          permissionRouter,
          frameRouter,
          tabsRouter
        ]
      };
    }
  }
]);
