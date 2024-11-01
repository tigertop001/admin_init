// import { $t } from "@/plugins/i18n";
import { guide } from "@/router/enums";

export default {
  path: "/guide",
  redirect: "/guide/index",
  meta: {
    icon: "ep:guide",
    title: "引导页",
    rank: guide
  },
  children: [
    {
      path: "/guide/index",
      name: "Guide",
      component: () => import("@/views/guide/index.vue"),
      meta: {
        title: "引导页"
      }
    }
  ]
} satisfies RouteConfigsTable;
