// import { $t } from "@/plugins/i18n";
import { formdesign } from "@/router/enums";
const IFrame = () => import("@/views/frame/frame.vue");

export default {
  path: "/form-design",
  redirect: "/form-design/index",
  meta: {
    icon: "ri:terminal-window-line",
    title: "表单设计器",
    rank: formdesign
  },
  children: [
    {
      path: "/form-design/index",
      name: "FormDesign",
      component: IFrame,
      meta: {
        title: "表单设计器",
        keepAlive: true,
        frameSrc:
          "https://haixin-fang.github.io/vue-form-design/playground/index.html",
        frameLoading: false
      }
    }
  ]
} satisfies RouteConfigsTable;