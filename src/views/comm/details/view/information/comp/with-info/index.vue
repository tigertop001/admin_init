<script setup lang="ts">
/**
 * 导入组件和工具
 */
import type { UserRowData } from "../../types";
interface Props {
  rowData?: UserRowData;
  resData?: any;
}
/**
 * 父级传来的数据---start
 */
const props = defineProps<Props>();
const rowData = props.rowData;
const resData = props.resData.data.data;
console.log(rowData, resData);
/**
 * 父级传来的数据---end
 */
</script>

<template>
  <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
    提现信息：共
    {{ resData.userInfo.totalDrawTimes || "暂无提现" }} 次，总计
    <span class="text-orange-400"
      >{{ resData.userInfo.totalDraw || "暂无总计" }}
    </span>
    元；本月
    {{ resData.userInfo.totalMonthDrawTimes || "暂无本月提现次数" }} 次，合计
    <span class="text-orange-400">{{
      resData.userInfo.totalMonthDraw || "暂无本月合计"
    }}</span>
    元
  </el-col>
</template>
<style lang="scss" scoped>
@import url("../../styles/index.scss"); // 样式通过 scoped 限制
</style>
