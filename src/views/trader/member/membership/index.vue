<script setup lang="ts">
import Search from "./form/search.vue";
</script>
<template>
  <el-card shadow="never" :body-style="{ height: 'calc(100vh - 125px)' }">
    <Search />
  </el-card>
</template>

<style scoped lang="scss">
:deep(.el-dropdown-menu__item i) {
  margin: 0;
}

.main-content {
  margin: 24px 24px 0 !important;
}

.search-form {
  :deep(.el-form-item) {
    margin-bottom: 12px;
  }
}
</style>
