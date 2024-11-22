<script setup lang="ts">
import { ref, watch } from "vue";
import { useNav } from "@/layout/hooks/useNav";
import { useDark } from "@pureadmin/utils";

const screenIcon = ref();
const { toggle, isFullscreen, Fullscreen, ExitFullscreen } = useNav();
const { isDark } = useDark();

isFullscreen.value = !!(
  document.fullscreenElement ||
  document.webkitFullscreenElement ||
  document.mozFullScreenElement ||
  document.msFullscreenElement
);

watch(
  isFullscreen,
  full => {
    screenIcon.value = full ? ExitFullscreen : Fullscreen;
  },
  {
    immediate: true
  }
);
</script>

<template>
  <span
    class="fullscreen-icon navbar-bg-hover"
    :class="isDark ? 'text-gray-300' : ''"
    @click="toggle"
  >
    <IconifyIconOffline :icon="screenIcon" />
  </span>
</template>
