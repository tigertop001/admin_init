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
    充值信息：共
    {{ resDt.userInfo.totalCharge || "暂无充值---暂无接口字段" }} 次，总计
    <span class="text-orange-400"
      >{{ resDt.userInfo.totalCharge || "暂无总计" }}
    </span>
    元； 本月 {{ resDt.userInfo.monthTimes || "暂无本月充值次数" }} 次，合计
    <span class="text-orange-400">{{
      resDt.userInfo.monthCharge || "暂无本月合计"
    }}</span>
    元
  </el-col>
</template>
<style lang="scss" scoped>
@import url("../../styles/index.scss");
</style>
