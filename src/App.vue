<template>
  <el-config-provider :locale="currentLocale">
    <router-view />
    <ReDialog />
    <ReFloatButton :floatBtns="floatBtns" />
  </el-config-provider>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { checkVersion } from "version-rocket";
import { ElConfigProvider } from "element-plus";
import { ReDialog } from "@/components/ReDialog";
import en from "element-plus/es/locale/lang/en";
import ja from "element-plus/es/locale/lang/ja";
import ko from "element-plus/es/locale/lang/ko";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import zhTw from "element-plus/es/locale/lang/zh-tw";
import plusEn from "plus-pro-components/es/locale/lang/en";
import plusZhCn from "plus-pro-components/es/locale/lang/zh-cn";
import ReFloatButton from "@/components/ReFloatButton";

import Service from "@iconify-icons/ri/user-heart-line";
import Book from "@iconify-icons/ri/book-open-line";
import Max from "@iconify-icons/ri/vip-diamond-line";

export default defineComponent({
  name: "app",
  components: {
    [ElConfigProvider.name]: ElConfigProvider,
    ReDialog,
    ReFloatButton
  },
  computed: {
    currentLocale() {
      switch (this.$storage.locale?.locale) {
        case "zh":
          return { ...zhCn, ...plusZhCn };
        case "en":
          return { ...en, ...plusEn };
        case "tw":
          return { ...zhTw, ...plusEn };
        case "ja":
          return { ...ja, ...plusEn };
        case "ko":
          return { ...ko, ...plusEn };
        default:
          return { ...zhCn, ...plusZhCn };
      }
    },
    floatBtns() {
      return [
        {
          tip: "会员管理",
          icon: Max,
          link: "https://google.com",
          show: false
        },
        {
          tip: "活动管理",
          link: "https://google.com",
          icon: Book,
          show: false
        },
        {
          tip: "风控管理",
          link: "https://google.com",
          icon: Service,
          show: false
        }
      ];
    }
  },
  beforeCreate() {
    const { version, name: title } = __APP_INFO__.pkg;
    const { VITE_PUBLIC_PATH, MODE } = import.meta.env;
    // https://github.com/guMcrey/version-rocket/blob/main/README.zh-CN.md#api
    if (MODE === "production") {
      // 版本实时更新检测，只作用于线上环境
      checkVersion(
        // config
        {
          // 5分钟检测一次版本
          pollingTime: 300000,
          localPackageVersion: version,
          originVersionFileUrl: `${location.origin}${VITE_PUBLIC_PATH}version.json`
        },
        // options
        {
          title,
          description: "检测到新版本",
          buttonText: "立即更新"
        }
      );
    }
  }
});
</script>
