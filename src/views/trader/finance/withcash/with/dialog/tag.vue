<script setup lang="ts">
import { PlusDialog } from "plus-pro-components";
import { ElDescriptions, ElDescriptionsItem } from "element-plus";
import { computed } from "vue";

interface Props {
  visible: boolean;

  curTag?: Record<string, any> | null;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  "update:visible": [value: boolean];
}>();

const dialogVis = computed({
  get: () => props.visible,
  set: value => emit("update:visible", value)
});

const saveTag = () => {
  console.log("保存标签");
};

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
