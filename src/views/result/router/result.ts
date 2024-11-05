import { $t } from "@/plugins/i18n";
import { result } from "@/router/enums";

export default {
  path: "/result",
  redirect: "/result/success",
  meta: {
    icon: "ri:checkbox-circle-line",
    title: $t("结果页面"),
    rank: result
  },
  children: [
    {
      path: "/result/success",
      name: "Success",
      component: () => import("@/views/result/success.vue"),
      meta: {
        title: $t("成功页面")
      }
    },
    {
      path: "/result/fail",
      name: "Fail",
      component: () => import("@/views/result/fail.vue"),
      meta: {
        title: $t("失败页面")
      }
    }
  ]
} satisfies RouteConfigsTable;
