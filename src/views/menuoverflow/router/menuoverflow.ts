// import { $t } from "@/plugins/i18n";
import { menuoverflow } from "@/router/enums";

export default {
  path: "/menuoverflow",
  redirect: "/menuoverflow/index",
  meta: {
    title: "目录超出显示 Tooltip 文字提示",
    rank: menuoverflow
  },
  children: [
    {
      path: "/menuoverflow/index",
      name: "MenuOverflow",
      component: () => import("@/views/menuoverflow/index.vue"),
      meta: {
        title: "菜单超出显示 Tooltip 文字提示",
        showParent: true
      }
    }
  ]
} satisfies RouteConfigsTable;
