<script setup lang="ts">
/**
 * 导入依赖
 */
import { ref, onMounted } from "vue";

/**
 * 导入组件和工具
 */
import Search from "./form/search.vue";
import MemberTagDialog from "./dialog/memberTag/MemberTagDialog.vue";
import AddMember from "./dialog/addMember/AddMember.vue";
import { useColumns } from "./form/columns";
import { useMembership } from "./store";
import { message } from "@/utils/message";
import { type FieldValues } from "plus-pro-components";

/**
 * 状态定义
 */
// 会员标识弹窗
const dialogVisible = ref(false);
const currentTag = ref("");
/**
 * 事件处理方法
 */
// 会员标识点击
const handleTagClick = (tag: string) => {
  console.log("---tag--", tag);
  currentTag.value = tag;
  dialogVisible.value = true;
};

/**
 * 表格相关配置和方法
 */
const {
  loading,
  columns,
  dataList,
  pagination,
  loadingConfig,
  adaptiveConfig,
  onSizeChange,
  onCurrentChange,
  exportExcel,
  setData
} = useColumns(handleTagClick);

// 查询参数
const defaultParams = {
  page: 1,
  pageSize: 10,
  status: 0,
  tagId: 0
};
const searchParam = ref(defaultParams);
/**
 * 数据处理方法
 */
// 获取列表数据
const fetchData = async (params = searchParam.value) => {
  const store = useMembership();
  try {
    const res = await store.fetchMembershipList(params as object);
    if (res?.data) {
      setData(res.data.list, res.data.total || 0);
    } else {
      setData([], 0);
      message("未找到数据", { type: "error" });
    }
  } catch (error) {
    console.error("获取数据失败:", error);
    message("获取数据失败", { type: "error" });
  }
};

/**
 * 分页处理方法
 */
// 分页大小变化
const handleSizeChange = (val: number) => {
  const pageParams = onSizeChange(val);
  searchParam.value = { ...searchParam.value, ...pageParams };
  fetchData(searchParam.value);
};

// 页码变化
const handleCurrentChange = (val: number) => {
  const pageParams = onCurrentChange(val);
  searchParam.value = { ...searchParam.value, ...pageParams };
  fetchData(searchParam.value);
};

// 详情按钮点击
const handleClick = (row: any) => {
  console.log("Detail clicked:", row);
};

// 搜索参数更新
const handleParamUpdate = (newParam: any) => {
  searchParam.value = newParam;
  fetchData(newParam);
};

/**
 * 添加会员相关处理
 */
// 添加会员弹窗的可见性
const addMemberVisible = ref(false);

// // 表单初始数据
// const values = ref({
//   name: "",
//   desc: ""
// });

// 打开添加会员弹窗
const handleAddMember = () => {
  addMemberVisible.value = true;
  // values.value = { name: "", desc: "" }; // 如果需要可以在这里设置初始值
};

// 处理表单提交
const handleAddMemberSubmit = (formValues: FieldValues) => {
  console.log("提交的表单数据:", formValues);
  // 调用 API 处理数据
  addMemberVisible.value = false; // 关闭弹窗
};
/**
 * 生命周期钩子
 */
onMounted(() => {
  fetchData();
});
</script>

<template>
  <el-card shadow="never" :body-style="{ height: 'calc(100vh - 188px)' }">
    <!-- 搜索区域 -->
    <template #header>
      <Search
        :exportExcel="exportExcel"
        :exportData="dataList"
        @update:param="handleParamUpdate"
        @add="handleAddMember"
      />
    </template>

    <!-- 数据表格 -->
    <pure-table
      ref="tableRef"
      adaptive
      row-key="id"
      alignWhole="center"
      showOverflowTooltip
      :loading="loading"
      :loading-config="loadingConfig"
      :adaptiveConfig="adaptiveConfig"
      :columns="columns"
      :pagination="pagination"
      :data="
        dataList.slice(
          (pagination.currentPage - 1) * pagination.pageSize,
          pagination.currentPage * pagination.pageSize
        )
      "
      @page-size-change="handleSizeChange"
      @page-current-change="handleCurrentChange"
    >
      <!-- 操作列 -->
      <template #operation="{ row }">
        <el-button link type="primary" @click="handleClick(row)">
          详情
        </el-button>
      </template>
    </pure-table>

    <!-- 会员标识详情弹窗 -->
    <MemberTagDialog v-model:visible="dialogVisible" :currentTag="currentTag" />

    <!-- 添加会员弹窗 -->
    <AddMember
      v-model:visible="addMemberVisible"
      @submit="handleAddMemberSubmit"
      @update:visible="addMemberVisible = $event"
    />
  </el-card>
</template>

<style scoped>
/* 如果需要添加样式可以在这里添加 */
</style>
