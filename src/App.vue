<template>
  <el-config-provider :locale="currentLocale">
    <router-view />
    <ReDialog />
    <!-- <ReFloatButton :floatBtns="floatBtns" /> -->
  </el-config-provider>
</template>

<script lang="ts" setup>
import { useStorage } from "@vueuse/core";
import { ref, computed, onBeforeMount } from "vue";
import { checkVersion } from "version-rocket";
import en from "element-plus/es/locale/lang/en";
import ja from "element-plus/es/locale/lang/ja";
import ko from "element-plus/es/locale/lang/ko";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import zhTw from "element-plus/es/locale/lang/zh-tw";
import plusEn from "plus-pro-components/es/locale/lang/en";
import plusZhCn from "plus-pro-components/es/locale/lang/zh-cn";
import Service from "@iconify-icons/ri/user-heart-line";
import Book from "@iconify-icons/ri/book-open-line";
import Max from "@iconify-icons/ri/vip-diamond-line";
import { ReDialog } from "@/components/ReDialog";
// import ReFloatButton from "@/components/ReFloatButton";

// 响应式状态
const storage = useStorage<{ locale?: string }>("locale", { locale: "zh" }); // Initialize with a key and a default value
const locale = computed(() => storage.value.locale);

// 当前语言的计算属性
const currentLocale = computed(() => {
  switch (locale.value) {
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
});

// // 浮动按钮的计算属性
// const floatBtns = computed(() => [
//   {
//     tip: "引导页",
//     link: "https://google.com",
//     icon: Service,
//     show: false
//   },
//   {
//     tip: "艺术画板",
//     link: "https://google.com",
//     icon: Service,
//     show: false
//   },
//   {
//     tip: "PPT",
//     link: "https://google.com",
//     icon: Service,
//     show: false
//   },
//   {
//     tip: "思维导图",
//     link: "https://google.com",
//     icon: Service,
//     show: false
//   },
//   {
//     tip: "流程图",
//     icon: Max,
//     link: "https://google.com",
//     show: false
//   },
//   {
//     tip: "表单设计器",
//     link: "https://google.com",
//     icon: Book,
//     show: false
//   }
// ]);

// 生命周期钩子
onBeforeMount(() => {
  const { version, name: title } = __APP_INFO__.pkg;
  const { VITE_PUBLIC_PATH, MODE } = import.meta.env;

  if (MODE === "production") {
    checkVersion(
      {
        pollingTime: 300000,
        localPackageVersion: version,
        originVersionFileUrl: `${location.origin}${VITE_PUBLIC_PATH}version.json`
      },
      {
        title,
        description: "检测到新版本",
        buttonText: "立即更新"
      }
    );
  }
});
</script>
