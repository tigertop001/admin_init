<script setup lang="ts">
import { useColumns } from "./form/config/columns";

const { mUid, mInf, agUid, agInf, ckMem, ckAg, onCxl, onCfm } = useColumns();
</script>

<template>
  <el-card shadow="never" :body-style="{ height: 'calc(100vh - 220px)' }">
    <!-- 标题 -->
    <template #header>
      <div class="text-xl font-medium">绑定上级</div>
    </template>

    <div class="p-10 flex flex-col items-center">
      <!-- 左右布局容器 -->
      <div class="flex justify-center gap-10 max-w-5xl">
        <!-- 左侧：会员信息区域 -->
        <div class="w-[480px]">
          <div class="flex items-start mb-6">
            <label class="w-28 text-right mr-5 pt-2 text-gray-600 text-base"
              >会员UID:</label
            >
            <div class="flex-1">
              <el-input
                v-model="mUid"
                placeholder="输入会员UID，自动检索"
                class="!w-full !text-base"
                @change="ckMem"
              />
              <div class="text-gray-400 text-sm mt-3 leading-6 min-h-[48px]">
                *
                输入会员UID，自动检索。仅可绑定无上级代理且无邀请好友上级的会员。
              </div>
            </div>
          </div>

          <div class="ml-32">
            <div class="p-6 bg-gray-50 rounded-lg border border-gray-100">
              <div class="grid gap-4">
                <div class="flex items-center">
                  <span class="text-gray-500 w-20 text-base">用户名:</span>
                  <span class="text-gray-700 text-base">{{
                    mInf.username || "--"
                  }}</span>
                </div>
                <div class="flex items-center">
                  <span class="text-gray-500 w-20 text-base">状态:</span>
                  <span class="text-gray-700 text-base">{{
                    mInf.status || "--"
                  }}</span>
                </div>
                <div class="flex items-center">
                  <span class="text-gray-500 w-20 text-base">身份:</span>
                  <span class="text-gray-700 text-base">{{
                    mInf.identity || "--"
                  }}</span>
                </div>
              </div>
              <div class="text-gray-400 text-sm mt-5">* 请核对会员信息</div>
            </div>
          </div>
        </div>

        <!-- 右侧：代理信息区域 -->
        <div class="w-[480px]">
          <div class="flex items-start mb-6">
            <label class="w-28 text-right mr-5 pt-2 text-gray-600 text-base"
              >代理UID:</label
            >
            <div class="flex-1">
              <el-input
                v-model="agUid"
                placeholder="输入代理UID，自动检索"
                class="!w-full !text-base"
                @change="ckAg"
              />
              <div class="text-gray-400 text-sm mt-3 leading-6 min-h-[48px]">
                * 输入代理UID，自动检索。
              </div>
            </div>
          </div>

          <div class="ml-32">
            <div class="p-6 bg-gray-50 rounded-lg border border-gray-100">
              <div class="grid gap-4">
                <div class="flex items-center">
                  <span class="text-gray-500 w-20 text-base">用户名:</span>
                  <span class="text-gray-700 text-base">{{
                    agInf.username || "--"
                  }}</span>
                </div>
                <div class="flex items-center">
                  <span class="text-gray-500 w-20 text-base">状态:</span>
                  <span class="text-gray-700 text-base">{{
                    agInf.status || "--"
                  }}</span>
                </div>
                <div class="flex items-center">
                  <span class="text-gray-500 w-20 text-base">身份:</span>
                  <span class="text-gray-700 text-base">{{
                    agInf.identity || "--"
                  }}</span>
                </div>
              </div>
              <div class="text-gray-400 text-sm mt-5">* 请核对代理信息</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 按钮组：固定在底部 -->
      <div class="mt-8">
        <el-button class="!w-32 !h-9" @click="onCxl">取 消</el-button>
        <el-button type="primary" class="!w-32 !h-9 ml-4" @click="onCfm"
          >确认绑定</el-button
        >
      </div>
    </div>
  </el-card>
</template>
