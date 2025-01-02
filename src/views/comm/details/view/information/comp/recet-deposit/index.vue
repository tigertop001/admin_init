<script setup lang="ts">
import QuestionLine from "@iconify-icons/ri/question-line"; // 引入问号图标

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
    <div class="inline-flex items-center">
      <el-popover content="近期=最近30天">
        <template #reference>
          <IconifyIconOffline
            :icon="QuestionLine"
            class="text-gray-400"
            width="18"
          />
        </template>
      </el-popover>
      <span class="ml-1">
        近期充值 ：充值{{ resDt.userInfo.latelyTimes || "暂无近期充值次数" }}
        次金额
        <span class="text-orange-400">
          {{ resDt.userInfo.latelyCharge || "暂无近期充值" }}
        </span>
        元、提现
        {{ resDt.userInfo.latelyDrawTimes || "暂无近期提现次数" }} 次金额
        <span class="text-orange-400">{{
          resDt.userInfo.latelyDraw || "暂无近期提现"
        }}</span>
        元
      </span>
    </div>
  </el-col>
</template>
<style lang="scss" scoped>
@import url("../../styles/index.scss");
</style>
