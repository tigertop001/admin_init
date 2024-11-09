// import { $t } from "@/plugins/i18n";
import { menuoverflow } from "@/router/enums";

export default {
  path: "/menuoverflow",
  redirect: "/menuoverflow/index",
  meta: {
    title: "超出提示",
    rank: menuoverflow
  },
  children: [
    {
      path: "/menuoverflow/index",
      name: "MenuOverflow",
      component: () => import("../index.vue"),
      meta: {
        title: "超出提示",
        showParent: true
      }
    }
  ]
} satisfies RouteConfigsTable;
