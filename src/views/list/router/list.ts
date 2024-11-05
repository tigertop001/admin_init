// import { $t } from "@/plugins/i18n";
import { list } from "@/router/enums";

export default {
  path: "/list",
  redirect: "/list/card",
  meta: {
    icon: "ri:list-check",
    title: "列表页面",
    rank: list
  },
  children: [
    {
      path: "/list/card",
      name: "CardList",
      component: () => import("@/views/list/card/index.vue"),
      meta: {
        icon: "ri:bank-card-line",
        title: "卡片列表页",
        showParent: true
      }
    }
  ]
} satisfies RouteConfigsTable;
