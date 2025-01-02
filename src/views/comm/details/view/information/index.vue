<script setup lang="ts">
import { ref, watch } from "vue";

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
  rowDt?: UserRowData | null;
}

const props = defineProps<Props>();

/**
 * 数据处理方法
 */

const { rowDt } = props;
const resDt = ref();
const getData = async (data?: Record<string, any>) => {
  try {
    if (!data?.id) return;
    const params = { uid: data.id };
    const res = await store.dtls(params);
    if (res?.code === 0) {
      resDt.value = res;
    }
  } catch (error) {
    console.error("获取数据失败:", error);
  }
};

watch(
  () => props.rowDt,
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
          {{ rowDt?.account }}({{ rowDt?.uid }})
        </el-col>
      </el-row>
      <el-row v-if="resDt">
        <!-- 最后登录 -->
        <LastLogin :rowDt="rowDt" :resDt="resDt" />
      </el-row>
      <el-row v-if="resDt">
        <!-- 注册信息 -->
        <RegInfo :rowDt="rowDt" :resDt="resDt" />
      </el-row>
      <el-row v-if="resDt">
        <!-- VIP信息 -->
        <VipInfo :rowDt="rowDt" :resDt="resDt" />
      </el-row>
      <el-row v-if="resDt">
        <!-- 账号状态 -->
        <AccountStatus :rowDt="rowDt" />
      </el-row>
      <el-row v-if="resDt">
        <!-- 账户钱包余额 -->
        <AccountBalance
          :rowDt="rowDt"
          :resDt="resDt"
          @shwFndLg="$emit('shwFndLg')"
        />
      </el-row>
      <el-row v-if="resDt">
        <!-- 活动钱包余额 -->
        <ActiveBalance
          :rowDt="rowDt"
          :resDt="resDt"
          @shwFndLg="$emit('shwFndLg')"
        />
      </el-row>
      <el-row v-if="resDt">
        <!-- 上级代理 -->
        <Agent :rowDt="rowDt" :resDt="resDt" />
      </el-row>
      <el-row v-if="resDt">
        <!-- 佣金钱包余额 -->
        <DutyBalance
          :rowDt="rowDt"
          :resDt="resDt"
          @shwFndLg="$emit('shwFndLg')"
        />
      </el-row>
      <el-row v-if="resDt">
        <!-- 会员层级 -->
        <Level :rowDt="rowDt" :resDt="resDt" />
      </el-row>
      <el-row v-if="resDt">
        <!-- 会员信息 -->
        <Contact :rowDt="rowDt" :resDt="resDt" />
      </el-row>
      <el-row v-if="resDt">
        <!-- 提现账户 -->
        <WithAccount :rowDt="rowDt" :resDt="resDt" />
      </el-row>
      <el-row v-if="resDt">
        <!-- 充值信息 -->
        <DepositInfo :rowDt="rowDt" :resDt="resDt" />
      </el-row>
      <el-row v-if="resDt">
        <!-- 提现信息 -->
        <WithInfo :rowDt="rowDt" :resDt="resDt" />
      </el-row>
      <el-row v-if="resDt">
        <!-- 近期充值 -->
        <RecetDeposit :rowDt="rowDt" :resDt="resDt" />
      </el-row>
      <el-row v-if="resDt">
        <!-- 备注 -->
        <Record :rowDt="rowDt" :resDt="resDt" />
      </el-row>
    </div>
  </el-scrollbar>
</template>
<style lang="scss" scoped>
@import url("./styles/index.scss");
</style>
