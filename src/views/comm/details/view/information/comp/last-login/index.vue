<script setup lang="ts">
import type { UserRowData } from "../../types";
interface Props {
  rowDt?: UserRowData;
  resDt?: Result;
}

const props = defineProps<Props>();
const _rowDt = props.rowDt;
const resDt = props.resDt.data.data;
</script>
<template>
  <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
    最后登录：于
    {{ resDt.userInfo?.lastLoginTime || "最后登陆时间未知" }}
    在 {{ resDt.userInfo?.loginIp || "最后登陆IP未知" }}（{{
      resDt.userInfo?.area || "最后登陆地区未知"
    }}）最后登录 {{ resDt.userInfo?.lastLoginDay || "未知" }}天前
  </el-col>
</template>
<style lang="scss" scoped>
@import url("../../styles/index.scss");
</style>
