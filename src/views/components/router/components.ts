// import { $t } from "@/plugins/i18n";
import { components } from "@/router/enums";

export default {
  path: "/components",
  redirect: "/components/dialog",
  meta: {
    icon: "ep:menu",
    title: "组件",
    rank: components
  },
  children: [
    {
      path: "/components/dialog",
      name: "DialogPage",
      component: () => import("@/views/components/dialog/index.vue"),
      meta: {
        title: "函数式弹框"
      }
    },
    {
      path: "/components/message",
      name: "Message",
      component: () => import("@/views/components/message.vue"),
      meta: {
        title: "消息提示"
      }
    },
    {
      path: "/components/upload",
      name: "PureUpload",
      component: () => import("@/views/components/upload/index.vue"),
      meta: {
        title: "文件上传"
      }
    },
    {
      path: "/components/check-card",
      name: "CheckCard",
      component: () => import("@/views/components/check-card.vue"),
      meta: {
        title: "多选卡片",
        extraIcon: "IF-pure-iconfont-new svg"
      }
    },
    {
      path: "/components/date-picker",
      name: "DatePicker",
      component: () => import("@/views/components/date-picker.vue"),
      meta: {
        title: "日期选择器"
      }
    },
    {
      path: "/components/datetime-picker",
      name: "DateTimePicker",
      component: () => import("@/views/components/datetime-picker.vue"),
      meta: {
        title: "日期时间选择器"
      }
    },
    {
      path: "/components/time-picker",
      name: "TimePicker",
      component: () => import("@/views/components/time-picker.vue"),
      meta: {
        title: "时间选择器"
      }
    },
    {
      path: "/components/icon-select",
      name: "IconSelect",
      component: () => import("@/views/components/icon-select.vue"),
      meta: {
        title: "图标选择器"
      }
    },
    {
      path: "/components/animatecss",
      name: "AnimateCss",
      component: () => import("@/views/components/animatecss.vue"),
      meta: {
        title: "animate.css选择器"
      }
    },
    {
      path: "/components/cropping",
      name: "Cropping",
      component: () => import("@/views/components/cropping/index.vue"),
      meta: {
        title: "图片裁剪"
      }
    },
    {
      path: "/components/segmented",
      name: "Segmented",
      component: () => import("@/views/components/segmented.vue"),
      meta: {
        title: "分段控制器"
      }
    },
    {
      path: "/components/text",
      name: "PureText",
      component: () => import("@/views/components/text.vue"),
      meta: {
        title: "文本省略",
        extraIcon: "IF-pure-iconfont-new svg"
      }
    },
    {
      path: "/components/el-button",
      name: "PureButton",
      component: () => import("@/views/components/el-button.vue"),
      meta: {
        title: "按钮"
      }
    },
    {
      path: "/components/check-button",
      name: "CheckButton",
      component: () => import("@/views/components/check-button.vue"),
      meta: {
        title: "可选按钮",
        extraIcon: "IF-pure-iconfont-new svg"
      }
    },
    {
      path: "/components/button",
      name: "ButtonPage",
      component: () => import("@/views/components/button.vue"),
      meta: {
        title: "按钮动效"
      }
    },
    {
      path: "/components/progress",
      name: "PureProgress",
      component: () => import("@/views/components/progress.vue"),
      meta: {
        title: "进度条"
      }
    },
    {
      path: "/components/tag",
      name: "PureTag",
      component: () => import("@/views/components/tag.vue"),
      meta: {
        title: "标签"
      }
    },
    {
      path: "/components/statistic",
      name: "Statistic",
      component: () => import("@/views/components/statistic.vue"),
      meta: {
        title: "统计组件"
      }
    },
    {
      path: "/components/collapse",
      name: "Collapse",
      component: () => import("@/views/components/collapse.vue"),
      meta: {
        title: "折叠面板"
      }
    },
    {
      path: "/components/cascader",
      name: "Cascader",
      component: () => import("@/views/components/cascader.vue"),
      meta: {
        title: "区域级联选择器"
      }
    },
    {
      path: "/components/color-picker",
      name: "ColorPicker",
      component: () => import("@/views/components/color-picker.vue"),
      meta: {
        title: "颜色选择器"
      }
    },
    {
      path: "/components/selector",
      name: "Selector",
      component: () => import("@/views/components/selector.vue"),
      meta: {
        title: "范围选择器"
      }
    },
    {
      path: "/components/waterfall",
      name: "Waterfall",
      component: () => import("@/views/components/waterfall/index.vue"),
      meta: {
        title: "瀑布流无限滚动"
      }
    },
    {
      path: "/components/split-pane",
      name: "SplitPane",
      component: () => import("@/views/components/split-pane.vue"),
      meta: {
        title: "切割面板"
      }
    },
    {
      path: "/components/swiper",
      name: "Swiper",
      component: () => import("@/views/components/swiper.vue"),
      meta: {
        title: "Swiper插件"
      }
    },
    {
      path: "/components/timeline",
      name: "TimeLine",
      component: () => import("@/views/components/timeline.vue"),
      meta: {
        title: "时间线"
      }
    },
    {
      path: "/components/count-to",
      name: "CountTo",
      component: () => import("@/views/components/count-to.vue"),
      meta: {
        title: "数字动画"
      }
    },
    {
      path: "/components/contextmenu",
      name: "ContextMenu",
      component: () => import("@/views/components/contextmenu/index.vue"),
      meta: {
        title: "右键菜单"
      }
    },
    {
      path: "/components/json-editor",
      name: "JsonEditor",
      component: () => import("@/views/components/json-editor.vue"),
      meta: {
        title: "JSON编辑器"
      }
    },
    {
      path: "/components/seamless-scroll",
      name: "SeamlessScroll",
      component: () => import("@/views/components/seamless-scroll.vue"),
      meta: {
        title: "无缝滚动"
      }
    },
    {
      path: "/components/virtual-list",
      name: "VirtualList",
      component: () => import("@/views/components/virtual-list/index.vue"),
      meta: {
        title: "虚拟列表"
      }
    }
  ]
} satisfies RouteConfigsTable;
