<template>
  <el-form :model="form" label-width="180px" class="w-full min-w-1200px p-20px">
    <!-- 风控审核开关 -->
    <el-form-item label="风控审核开关" required>
      <el-radio-group v-model="form.riskSwitch">
        <el-radio :label="1">启用</el-radio>
        <el-radio :label="0">关闭</el-radio>
      </el-radio-group>
    </el-form-item>

    <!-- 特殊入账提款 -->
    <el-form-item>
      <div class="flex items-center">
        <div class="w-120px">
          <el-checkbox v-model="form.specialDeposit">特殊入账提款</el-checkbox>
        </div>
        <div class="flex items-center ml-20px">
          <span class="mr-10px whitespace-nowrap">单笔入账金额:</span>
          <el-input
            v-model="form.singleAmount"
            placeholder="请输入金额"
            class="w-300px"
          />
        </div>
      </div>
    </el-form-item>
    <div class="text-12px text-red ml-180px -mt-16px mb-16px">
      上一次提现至当前提现有非存款入账金额，并且超过配置金额触发风控
    </div>

    <!-- 新用户 -->
    <el-form-item>
      <div class="flex items-center">
        <div class="w-120px">
          <el-checkbox v-model="form.newUser">新用户</el-checkbox>
        </div>
        <div class="flex items-center ml-20px">
          <span class="mr-10px whitespace-nowrap">2个月前x次提款:</span>
          <el-input
            v-model="form.withdrawTimes"
            placeholder="请输入次数"
            class="w-300px"
          />
        </div>
      </div>
    </el-form-item>
    <div class="text-12px text-red ml-180px -mt-16px mb-16px">
      新用户注册2个月之内前X次提款触发风控
    </div>

    <!-- 首次大额提款 -->
    <el-form-item>
      <div class="flex items-center">
        <div class="w-120px">
          <el-checkbox v-model="form.firstLarge">首次大额提款</el-checkbox>
        </div>
        <div class="flex items-center ml-20px">
          <span class="mr-10px whitespace-nowrap">提款金额≥:</span>
          <el-input
            v-model="form.largeAmount"
            placeholder="请输入金额"
            class="w-300px"
          />
        </div>
      </div>
    </el-form-item>
    <div class="text-12px text-red ml-180px -mt-16px mb-16px">
      用户首次提款超过上述金额触发风控
    </div>

    <!-- 高盈利倍数 -->
    <el-form-item>
      <div class="flex items-center">
        <div class="w-120px">
          <el-checkbox v-model="form.highProfit">高盈利倍数</el-checkbox>
        </div>
        <div class="flex items-center ml-20px">
          <span class="mr-10px whitespace-nowrap">盈利倍数:</span>
          <el-input
            v-model="form.profitRatio"
            placeholder="请输入倍数"
            class="w-300px"
          />
        </div>
      </div>
    </el-form-item>
    <div class="text-12px text-red ml-180px -mt-16px mb-16px">
      用户提款触发盈利倍数大于上述的值，触发风控。盈利倍数 =
      两次提款之间的游戏输赢 / 投注总数
    </div>

    <!-- 提款频繁 -->
    <el-form-item>
      <div class="flex items-center">
        <div class="w-120px">
          <el-checkbox v-model="form.frequentWithdraw">提款频繁</el-checkbox>
        </div>
        <div class="flex items-center ml-20px">
          <span class="mr-10px whitespace-nowrap">24小时提款次数:</span>
          <el-input
            v-model="form.withdrawFrequency"
            placeholder="请输入次数"
            class="w-300px"
          />
        </div>
      </div>
    </el-form-item>
    <div class="text-12px text-red ml-180px -mt-16px mb-16px">
      24小时提款次数超过上述值则会触发风控
    </div>

    <!-- 异常设备 -->
    <el-form-item>
      <div class="flex items-center">
        <div class="w-120px">
          <el-checkbox v-model="form.abnormalDevice">异常设备</el-checkbox>
        </div>
      </div>
    </el-form-item>
    <div class="text-12px text-red ml-180px -mt-16px mb-16px">
      当前提现和上一次提现的设备号不一致则触发风控，如果查询不到上一次提现的记录，对比注册设备号不一致则触发风控
    </div>

    <!-- 流水不达标 -->
    <el-form-item>
      <div class="flex items-center">
        <div class="w-120px">
          <el-checkbox v-model="form.insufficientTurnover"
            >流水不达标</el-checkbox
          >
        </div>
      </div>
    </el-form-item>
    <div class="text-12px text-red ml-180px -mt-16px mb-16px">
      两次提现之间所有上分人金流水核算中至少有一笔不达标则触发风控
    </div>

    <!-- 大额提款 -->
    <el-form-item>
      <div class="flex items-center">
        <div class="w-120px">
          <el-checkbox v-model="form.largeWithdraw">大额提款</el-checkbox>
        </div>
        <div class="flex items-center ml-20px">
          <span class="mr-10px whitespace-nowrap">单笔提款金额≥:</span>
          <el-input
            v-model="form.singleWithdrawAmount"
            placeholder="请输入金额"
            class="w-300px"
          />
        </div>
      </div>
    </el-form-item>
    <div class="text-12px text-red ml-180px -mt-16px mb-16px">
      24小时提款次数超过上述值则会触发风控
    </div>

    <!-- 按钮组 -->
    <el-form-item>
      <el-button type="primary" @click="onSubmit">保存</el-button>
      <el-button @click="onCancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import {
  ElForm,
  ElFormItem,
  ElRadioGroup,
  ElRadio,
  ElCheckbox,
  ElInput,
  ElButton
} from "element-plus";

interface FormState {
  riskSwitch: number;
  specialDeposit: boolean;
  singleAmount: string | number;
  newUser: boolean;
  withdrawTimes: string | number;
  firstLarge: boolean;
  largeAmount: string | number;
  highProfit: boolean;
  profitRatio: string | number;
  frequentWithdraw: boolean;
  withdrawFrequency: string | number;
  abnormalDevice: boolean;
  insufficientTurnover: boolean;
  largeWithdraw: boolean;
  singleWithdrawAmount: string | number;
}

const form = reactive<FormState>({
  riskSwitch: 1,
  specialDeposit: false,
  singleAmount: "",
  newUser: false,
  withdrawTimes: "",
  firstLarge: false,
  largeAmount: "",
  highProfit: false,
  profitRatio: "",
  frequentWithdraw: false,
  withdrawFrequency: "",
  abnormalDevice: false,
  insufficientTurnover: false,
  largeWithdraw: false,
  singleWithdrawAmount: ""
});

const onSubmit = () => {
  console.log("form submitted:", form);
};

const onCancel = () => {
  Object.assign(form, {
    riskSwitch: 1,
    specialDeposit: false,
    singleAmount: "",
    newUser: false,
    withdrawTimes: "",
    firstLarge: false,
    largeAmount: "",
    highProfit: false,
    profitRatio: "",
    frequentWithdraw: false,
    withdrawFrequency: "",
    abnormalDevice: false,
    insufficientTurnover: false,
    largeWithdraw: false,
    singleWithdrawAmount: ""
  });
};
</script>

<style>
:deep(.el-form-item) {
  @apply mb-24px;
}
</style>
