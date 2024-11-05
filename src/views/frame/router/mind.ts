// import { $t } from "@/plugins/i18n";
import { mind } from "@/router/enums";
const IFrame = () => import("@/views/frame/frame.vue");

export default {
  path: "/mind-map",
  redirect: "/mind-map/index",
  meta: {
    icon: "ri:mind-map",
    title: "思维导图",
    rank: mind
  },
  children: [
    {
      path: "/mind-map/index",
      name: "FrameMindMap",
      component: IFrame,
      meta: {
        title: "思维导图",
        keepAlive: true,
        frameSrc: "https://wanglin2.github.io/mind-map/#/"
      }
    }
  ]
} satisfies RouteConfigsTable;
