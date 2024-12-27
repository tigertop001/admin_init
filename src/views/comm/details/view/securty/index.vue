<script setup lang="ts">
import "plus-pro-components/es/components/form/style/css";
import { PlusForm } from "plus-pro-components";
import { useColumns } from "./form/config/columns";
import { useConfColumns } from "./dialog/config/columns";
import Dlg from "./dialog/index.vue";

const props = defineProps<Props>();
interface Props {
  rowData?: any;
}

const { state, columns, onSub, onSubErr, onReset } = useColumns(
  props.rowData.uid
);

const { dlgVis, actTp, onChgSub, onReLog, onRePay } = useConfColumns();

const getFormData = () => {
  return state.value;
};

defineExpose({
  getFormData
});
</script>

<template>
  <div class="pt-10">
    <PlusForm
      v-model="state"
      class="w-[380px] m-auto"
      :columns="columns"
      label-position="left"
      @submit="onSub"
      @submit-error="onSubErr"
      @reset="onReset"
    />
  </div>
  <div class="flex justify-center pt-20">
    <el-button type="danger" @click="onReLog">重置登录密码</el-button>
    <el-button type="danger" @click="onRePay">重置支付密码</el-button>
    <el-button type="danger">清除设备锁</el-button>
    <el-button type="danger">清除异常状态</el-button>
    <el-button type="danger">清除资金密码异常</el-button>
    <el-button type="danger">清除流水</el-button>
    <el-button type="danger">清除虚拟币提现限制</el-button>
    <el-button type="danger">清除NG扑克稽核限制</el-button>
  </div>
  <Dlg v-model:visible="dlgVis" :type="actTp" @submit="onChgSub" />
</template>
