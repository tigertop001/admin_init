// import { $t } from "@/plugins/i18n";
import { form } from "@/router/enums";

export default {
  path: "/form",
  redirect: "/form/index",
  meta: {
    icon: "ri:edit-box-line",
    title: "表单",
    rank: form
  },
  children: [
    {
      path: "/form/index",
      name: "SchemaForm",
      component: () => import("@/views/schema-form/index.vue"),
      meta: {
        title: "表单",
        extraIcon: "IF-pure-iconfont-new svg"
      }
    }
  ]
} satisfies RouteConfigsTable;
