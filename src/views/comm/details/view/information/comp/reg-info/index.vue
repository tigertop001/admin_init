<script setup lang="ts">
import type { UserRowData } from "../../types";
interface Props {
  rowDt?: UserRowData;
  resDt?: any;
}

const props = defineProps<Props>();
const rowDt = props.rowDt;
const resDt = props.resDt;
console.log(rowDt, resDt);
</script>
<template>
  <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
    注册信息：于
    {{ resDt.userInfo?.regTime || "注册时间未知" }}
    在
    {{ resDt.userInfo?.regIp || "注册IP未知" }} （{{
      resDt.userInfo?.regArea || "注册地区未知"
    }}
    ）注册
  </el-col>
</template>
<style lang="scss" scoped>
@import url("../../styles/index.scss");
</style>
