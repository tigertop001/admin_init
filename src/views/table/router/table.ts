// import { $t } from "@/plugins/i18n";
import { table } from "@/router/enums";

export default {
  path: "/table",
  redirect: "/table/index",
  meta: {
    icon: "ri:table-line",
    title: "表格",
    rank: table
  },
  children: [
    {
      path: "/table/index",
      name: "PureTable",
      component: () => import("@/views/table/index.vue"),
      meta: {
        title: "基础用法"
      }
    },
    {
      path: "/table/high",
      name: "PureTableHigh",
      component: () => import("@/views/table/high.vue"),
      meta: {
        title: "高级用法"
      }
    },
    {
      path: "/table/edit",
      name: "PureTableEdit",
      component: () => import("@/views/table/edit.vue"),
      meta: {
        title: "可编辑用法",
        extraIcon: "IF-pure-iconfont-new svg"
      }
    },
    {
      path: "/table/virtual",
      name: "VxeTable",
      component: () => import("@/views/table/virtual.vue"),
      meta: {
        title: "虚拟滚动",
        extraIcon: "IF-pure-iconfont-new svg"
      }
    }
  ]
} satisfies RouteConfigsTable;
