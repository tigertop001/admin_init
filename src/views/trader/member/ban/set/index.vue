<script setup lang="ts">
import { useColumns } from "./form/config/columns";

const {
  formData,
  timeOptions,
  loginTimeUnit,
  orderTimeUnit,
  displayLoginTime,
  displayOrderTime,
  saveConfig
} = useColumns();
</script>

<template>
  <div class="text-16px font-medium mb-[24px]">条件设置</div>

  <!-- 登录密码错误设置 -->
  <el-row class="mb-[24px]">
    <el-col :span="5">
      <div class="flex items-center text-14px">
        <el-checkbox
          v-model="formData.loginPwdChecked"
          class="mr-12px w-120px"
          @change="val => val === false && (formData.loginPwdChecked = true)"
        >
          登录密码错误:
        </el-checkbox>
        <el-input
          v-model="formData.loginPwdCounts"
          class="w-80px mr-8px"
          style="width: 80px"
        />
        <span>次</span>
      </div>
    </el-col>
    <el-col :span="3">
      <div class="flex items-center text-14px">
        <span class="mr-12px">自动解封</span>
        <el-switch
          v-model="formData.loginPwdAuto"
          :active-value="1"
          :inactive-value="2"
        />
      </div>
    </el-col>
    <el-col :span="6">
      <div>
        <div class="flex items-center text-14px">
          <span class="mr-12px w-60px">封禁时间:</span>
          <el-input
            v-model="displayLoginTime"
            class="mr-12px"
            style="width: 80px"
          />
          <el-select v-model="loginTimeUnit" style="width: 140px">
            <el-option
              v-for="item in timeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <div class="text-gray-400 text-12px mt-8px">
          *达到封禁时间，自动解封。如果不需要开启，可选择关闭
        </div>
      </div>
    </el-col>
    <el-col :span="6">
      <div class="flex items-center text-14px">
        <span class="mr-12px whitespace-nowrap">用户端提示:</span>
        <el-input v-model="formData.loginPwdNotice" style="width: 240px" />
      </div>
    </el-col>
  </el-row>

  <!-- 连续取消订单设置 -->
  <el-row class="mb-[24px]">
    <el-col :span="5">
      <div class="flex items-center text-14px">
        <el-checkbox
          v-model="formData.orderCancelChecked"
          class="mr-12px w-120px"
          @change="val => val === false && (formData.orderCancelChecked = true)"
        >
          连续生成:
        </el-checkbox>
        <el-input
          v-model="formData.orderCancelCounts"
          class="w-100px mr-8px"
          style="width: 80px"
        />
        <span>次取消订单</span>
      </div>
    </el-col>
    <el-col :span="3">
      <div class="flex items-center text-14px">
        <span class="mr-12px">自动解封</span>
        <el-switch
          v-model="formData.orderCancelAuto"
          :active-value="1"
          :inactive-value="2"
        />
      </div>
    </el-col>
    <el-col :span="6">
      <div>
        <div class="flex items-center text-14px">
          <span class="mr-12px w-60px">封禁时间:</span>
          <el-input
            v-model="displayOrderTime"
            class="mr-12px"
            style="width: 80px"
          />
          <el-select v-model="orderTimeUnit" style="width: 140px">
            <el-option
              v-for="item in timeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <div class="text-gray-400 text-12px mt-8px">
          *达到封禁时间，自动解封。如果不需要开启，可选择关闭
        </div>
      </div>
    </el-col>
    <el-col :span="6">
      <div class="flex items-center text-14px">
        <span class="mr-12px whitespace-nowrap">用户端提示:</span>
        <el-input v-model="formData.orderCancelNotice" style="width: 240px" />
      </div>
    </el-col>
  </el-row>

  <!-- 保存按钮 -->
  <el-row>
    <el-col :span="10" />
    <el-col :span="4">
      <el-button type="primary" size="small" @click="saveConfig">
        保存
      </el-button>
    </el-col>
  </el-row>
</template>
