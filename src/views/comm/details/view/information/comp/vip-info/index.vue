<script setup lang="ts">
import type { UserRowData } from "../../types";
interface Props {
  rowDt?: UserRowData;
  resDt?: any;
}

const props = defineProps<Props>();
const rowDt = props.rowDt;
const resDt = props.resDt.data.data;
console.log(rowDt, resDt);
</script>
<template>
  <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
    VIP信息：LV.0 荣耀VIP.0 终身VIP.0 ----- 暂无接口字段 -----
  </el-col>
</template>
<style lang="scss" scoped>
@import url("../../styles/index.scss");
</style>
