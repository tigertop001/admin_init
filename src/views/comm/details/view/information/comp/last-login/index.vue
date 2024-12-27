<script setup lang="ts">
/**
 * 导入组件和工具
 */

import type { UserRowData } from "../../types";
interface Props {
  rowData?: UserRowData;
  resData?: Result;
}
/**
 * 父级传来的数据---start
 */
const props = defineProps<Props>();
const rowData = props.rowData;
const resData = props.resData.data.data;
console.log("----rowData---", rowData);
console.log("----resData---", resData);
/**
 * 父级传来的数据---end
 */
</script>
<template>
  <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
    最后登录：于
    {{ resData.userInfo?.lastLoginTime || "最后登陆时间未知" }}
    在 {{ resData.userInfo?.loginIp || "最后登陆IP未知" }}（{{
      resData.userInfo?.area || "最后登陆地区未知"
    }}）最后登录 {{ resData.userInfo?.lastLoginDay || "未知" }}天前
  </el-col>
</template>
<style lang="scss" scoped>
@import url("../../styles/index.scss"); // 样式通过 scoped 限制
</style>
