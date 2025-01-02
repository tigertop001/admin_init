<template>
  <el-card shadow="never" :body-style="{ height: 'calc(100vh - 188px)' }">
    <template #header>
      <div>后台通用配置</div>
    </template>
    <div>
      <span class="mr-4">后台登陆验证</span>
      <span>
        <el-radio-group v-model="radio">
          <el-radio :value="3">无验证</el-radio>
          <el-radio :value="6">图形验证</el-radio>
          <el-radio :value="9">Google验证</el-radio>
        </el-radio-group></span
      >
    </div>
  </el-card>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const radio = ref(3);
</script>
