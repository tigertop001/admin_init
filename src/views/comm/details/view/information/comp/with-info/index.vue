<script setup lang="ts">
import type { UserRowData } from "../../types";
interface Props {
  rowDt?: UserRowData;
  resDt?: Result;
}

const props = defineProps<Props>();
const rowDt = props.rowDt;
const resDt = props.resDt.data.data;
console.log(rowDt, resDt);
</script>

<template>
  <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
    提现信息：共
    {{ resDt.userInfo.totalDrawTimes || "暂无提现" }} 次，总计
    <span class="text-orange-400"
      >{{ resDt.userInfo.totalDraw || "暂无总计" }}
    </span>
    元；本月
    {{ resDt.userInfo.totalMonthDrawTimes || "暂无本月提现次数" }} 次，合计
    <span class="text-orange-400">{{
      resDt.userInfo.totalMonthDraw || "暂无本月合计"
    }}</span>
    元
  </el-col>
</template>
<style lang="scss" scoped>
@import url("../../styles/index.scss");
</style>
