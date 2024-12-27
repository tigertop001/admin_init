<script setup lang="ts">
import { watch } from "vue";
import { useImageVerify } from "./hooks";

defineOptions({
  name: "ReImageVerify"
});

interface Props {
  code?: string;
  width?: number;
  height?: number;
}

interface Emits {
  (_e: "update:code", _code: string): void;
  (_e: "refresh"): void;
}

const props = withDefaults(defineProps<Props>(), {
  code: "",
  width: 120,
  height: 40
});

const emit = defineEmits<Emits>();

const { domRef, setImgCode, getImgCode } = useImageVerify(
  props.width,
  props.height
);

watch(
  () => props.code,
  newValue => {
    setImgCode(newValue);
  },
  { immediate: true }
);

// 当点击刷新时，通知父组件
const onRef = () => {
  console.log("--当点击刷新时，通知父组件--dddd---");
  emit("refresh");
};

defineExpose({ getImgCode });
</script>

<template>
  <canvas
    ref="domRef"
    :width="width"
    :height="height"
    class="cursor-pointer"
    @click="onRef"
  />
</template>
