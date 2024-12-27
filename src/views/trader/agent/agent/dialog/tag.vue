<script setup lang="ts">
import { PlusDialog } from "plus-pro-components";
import { ElDescriptions, ElDescriptionsItem } from "element-plus";
import { computed } from "vue";

/** 组件属性定义 */
interface Props {
  /** 控制弹窗显示状态 */
  visible: boolean;
  /** 当前标签信息,允许为空 */
  curTag?: Record<string, any> | null;
}

const props = defineProps<Props>();

/** 组件事件定义 */
const emit = defineEmits<{
  /** 更新弹窗显示状态 */
  "update:visible": [value: boolean];
}>();

/** 弹窗显示状态的计算属性,支持双向绑定 */
const dialogVis = computed({
  get: () => props.visible,
  set: value => emit("update:visible", value)
});

/** 保存标签处理函数 */
const saveTag = () => {
  console.log("保存标签");
};

/**
 * 弹窗底部按钮配置
 * confirm: 确认按钮
 * cancel: 取消按钮
 */
const footerButtons = {
  confirm: {
    text: "保存"
  },
  cancel: {
    text: "取消"
  }
};
</script>

<template>
  <PlusDialog
    v-model="dialogVis"
    title="会员标识详情"
    width="400px"
    :destroy-on-close="true"
    :footer-buttons="footerButtons"
    @confirm="saveTag"
  >
    <ElDescriptions :column="1" border>
      <ElDescriptionsItem label="会员标识">
        {{ props.curTag?.tag }}
      </ElDescriptionsItem>
    </ElDescriptions>
  </PlusDialog>
</template>
