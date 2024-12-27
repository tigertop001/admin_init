<script setup lang="ts">
/**
 * 导入依赖
 */
import { ref, watch } from "vue";
/**
 * 导入组件和工具
 */
import { useDetailInfo } from "./store";

import LastLogin from "./comp/last-login/index.vue";
import RegInfo from "./comp/reg-info/index.vue";
import VipInfo from "./comp/vip-info/index.vue";
import AccountStatus from "./comp/account-status/index.vue";
import AccountBalance from "./comp/account-balance/index.vue";
import ActiveBalance from "./comp/active-balance/index.vue";
import Agent from "./comp/agent/index.vue";
import DutyBalance from "./comp/duty-balance/index.vue";
import Level from "./comp/level/index.vue";
import Contact from "./comp/contact/index.vue";
import WithAccount from "./comp/with-account/index.vue";
import DepositInfo from "./comp/deposit-info/index.vue";
import WithInfo from "./comp/with-info/index.vue";
import RecetDeposit from "./comp/recet-deposit/index.vue";
import Record from "./comp/record/index.vue";
import type { UserRowData } from "./types";
const store = useDetailInfo();

interface Props {
  rowData?: UserRowData | null;
}

const props = defineProps<Props>();

/**
 * 数据处理方法
 */
// 列表
const { rowData } = props;
const resData = ref();
const getData = async (data?: Record<string, any>) => {
  try {
    if (!data?.id) return;
    const params = { uid: data.id };
    const res = await store.dtls(params);
    if (res?.code === 0) {
      resData.value = res;
    }
  } catch (error) {
    console.error("获取数据失败:", error);
  }
};

watch(
  () => props.rowData,
  newVal => {
    if (newVal) {
      getData(newVal);
    }
  },
  { immediate: true }
);
</script>
<template>
  <el-scrollbar height="100%">
    <div class="content-wrapper">
      <el-row>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          {{ rowData?.account }}({{ rowData?.uid }})
        </el-col>
      </el-row>
      <el-row v-if="resData">
        <!-- 最后登录 -->
        <LastLogin :rowData="rowData" :resData="resData" />
      </el-row>
      <el-row v-if="resData">
        <!-- 注册信息 -->
        <RegInfo :rowData="rowData" :resData="resData" />
      </el-row>
      <el-row v-if="resData">
        <!-- VIP信息 -->
        <VipInfo :rowData="rowData" :resData="resData" />
      </el-row>
      <el-row v-if="resData">
        <!-- 账号状态 -->
        <AccountStatus :rowData="rowData" />
      </el-row>
      <el-row v-if="resData">
        <!-- 账户钱包余额 -->
        <AccountBalance
          :rowData="rowData"
          :resData="resData"
          @shwFndLg="$emit('shwFndLg')"
        />
      </el-row>
      <el-row v-if="resData">
        <!-- 活动钱包余额 -->
        <ActiveBalance
          :rowData="rowData"
          :resData="resData"
          @shwFndLg="$emit('shwFndLg')"
        />
      </el-row>
      <el-row v-if="resData">
        <!-- 上级代理 -->
        <Agent :rowData="rowData" :resData="resData" />
      </el-row>
      <el-row v-if="resData">
        <!-- 佣金钱包余额 -->
        <DutyBalance
          :rowData="rowData"
          :resData="resData"
          @shwFndLg="$emit('shwFndLg')"
        />
      </el-row>
      <el-row v-if="resData">
        <!-- 会员层级 -->
        <Level :rowData="rowData" :resData="resData" />
      </el-row>
      <el-row v-if="resData">
        <!-- 会员信息 -->
        <Contact :rowData="rowData" :resData="resData" />
      </el-row>
      <el-row v-if="resData">
        <!-- 提现账户 -->
        <WithAccount :rowData="rowData" :resData="resData" />
      </el-row>
      <el-row v-if="resData">
        <!-- 充值信息 -->
        <DepositInfo :rowData="rowData" :resData="resData" />
      </el-row>
      <el-row v-if="resData">
        <!-- 提现信息 -->
        <WithInfo :rowData="rowData" :resData="resData" />
      </el-row>
      <el-row v-if="resData">
        <!-- 近期充值 -->
        <RecetDeposit :rowData="rowData" :resData="resData" />
      </el-row>
      <el-row v-if="resData">
        <!-- 备注 -->
        <Record :rowData="rowData" :resData="resData" />
      </el-row>
    </div>
  </el-scrollbar>
</template>
<style lang="scss" scoped>
@import url("./styles/index.scss"); // 样式通过 scoped 限制
</style>
