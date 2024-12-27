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
const resData = props.resData;
console.log(rowData, resData);
/**
 * 父级传来的数据---end
 */
</script>
<template>
  <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
    注册信息：于
    {{ resData.userInfo?.regTime || "注册时间未知" }}
    在
    {{ resData.userInfo?.regIp || "注册IP未知" }} （{{
      resData.userInfo?.regArea || "注册地区未知"
    }}
    ）注册
  </el-col>
</template>
<style lang="scss" scoped>
@import url("../../styles/index.scss"); // 样式通过 scoped 限制
</style>
