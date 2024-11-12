<script setup lang="ts">
import { useRoute } from "vue-router";
import { ref, watch, onMounted, nextTick } from "vue";

defineOptions({
  name: "LayFrame"
});

const props = defineProps<{
  frameInfo?: {
    frameSrc?: string;
    fullPath?: string;
  };
}>();

const loading = ref(true);
const frameSrc = ref<string>(props.frameInfo?.frameSrc || "");
const frameRef = ref<HTMLElement | null>(null);

// 初始加载时，如果路由 meta 有 frameSrc 设置 frameSrc
const currentRoute = useRoute();
if (currentRoute.meta?.frameSrc) {
  frameSrc.value = currentRoute.meta.frameSrc as string;
}

// 根据路由变化更新 iframe 的 src
watch(
  () => currentRoute.fullPath,
  path => {
    if (
      currentRoute.name === "Redirect" &&
      path.includes(props.frameInfo?.fullPath || "")
    ) {
      frameSrc.value = path; // redirect时，置换成任意值，待重定向后重新赋值
      loading.value = true;
    } else if (props.frameInfo?.fullPath === path) {
      frameSrc.value = props.frameInfo.frameSrc || "";
    }
  }
);

// 初始化 iframe 加载监听
onMounted(() => {
  nextTick(() => {
    const iframe = frameRef.value;
    if (iframe) {
      iframe.onload = () => hideLoading();
    }
  });
});

// 隐藏加载状态
function hideLoading() {
  loading.value = false;
}
</script>

<template>
  <div v-loading="loading" class="frame" element-loading-text="加载中...">
    <iframe
      ref="frameRef"
      sandbox="allow-scripts allow-same-origin"
      :src="frameSrc"
      class="frame-iframe"
    />
  </div>
</template>

<style lang="scss" scoped>
.frame {
  position: absolute;
  inset: 0;

  .frame-iframe {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    overflow: hidden;
    border: 0;
  }
}

.main-content {
  margin: 2px 0 0 !important;
}
</style>
