<script setup lang="ts">
import Search from "./form/search.vue";
import { useColumns } from "./form/columns";
import { ref } from "vue";

const dialogVisible = ref(false);
const currentTag = ref("");
// 处理会员标识点击
const handleTagClick = (tag: string) => {
  currentTag.value = tag;
  dialogVisible.value = true;
};

const {
  loading,
  columns,
  dataList,
  pagination,
  loadingConfig,
  adaptiveConfig,
  onSizeChange,
  onCurrentChange,
  exportExcel
} = useColumns(handleTagClick);

const handleClick = (row: any) => {
  console.log("Detail clicked:", row);
};

const searchParam = ref({}); // 用于存储接收到的 param
// 处理子组件传递过来的 param
const handleParamUpdate = (newParam: any) => {
  searchParam.value = newParam; // 更新 param
  console.log("接收到的 param:", searchParam.value); // 打印出来检查
};
</script>

<template>
  <el-card shadow="never" :body-style="{ height: 'calc(100vh - 210px)' }">
    <template #header>
      <Search
        :exportExcel="exportExcel"
        :exportData="dataList"
        @update:param="handleParamUpdate"
      />
    </template>
    <pure-table
      ref="tableRef"
      adaptive
      :adaptiveConfig="adaptiveConfig"
      row-key="id"
      alignWhole="center"
      showOverflowTooltip
      :loading="loading"
      :loading-config="loadingConfig"
      :data="
        dataList.slice(
          (pagination.currentPage - 1) * pagination.pageSize,
          pagination.currentPage * pagination.pageSize
        )
      "
      :columns="columns"
      :pagination="pagination"
      @page-size-change="onSizeChange"
      @page-current-change="onCurrentChange"
    >
      <template #operation="{ row }">
        <el-button link type="primary" @click="handleClick(row)">
          详情
        </el-button>
      </template>
    </pure-table>

    <!-- 会员标识详情弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      title="会员标识详情"
      width="400px"
      destroy-on-close
      class="tag-dialog"
    >
      <div class="p-6">
        <div class="space-y-4">
          <div class="flex items-center">
            <span class="font-medium w-24 text-gray-600">会员标识:</span>
            <span class="text-gray-800">{{ currentTag }}</span>
          </div>
          <!-- 可以根据需要添加更多会员信息 -->
          <div class="flex items-center">
            <span class="font-medium w-24 text-gray-600">会员等级:</span>
            <span class="text-gray-800">VIP1</span>
          </div>
          <div class="flex items-center">
            <span class="font-medium w-24 text-gray-600">注册时间:</span>
            <span class="text-gray-800">2024-01-01</span>
          </div>
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end gap-2 px-6 pb-4">
          <el-button class="hover:bg-gray-100" @click="dialogVisible = false">
            关闭
          </el-button>
        </div>
      </template>
    </el-dialog>
  </el-card>
</template>
