<script setup lang="ts">
/**
 * 导入依赖
 */
import { ref, onMounted } from "vue";

/**
 * 导入组件和工具
 */
import Search from "./form/search.vue";
import { crtDFS } from "./form/config/searchConfig";
import Add from "./dialog/add.vue";
import { useColumns } from "./form/config/columns";
import { useabelTag } from "./store";
import { message } from "@/utils/message";
import { type FieldValues } from "plus-pro-components";

/**
 * 表格相关配置和方法
 */
const {
  loading,
  columns,
  dataList,
  pagination,
  lodConf,
  adapConf,
  onSzChg,
  onCurChg,
  setData
} = useColumns();
const store = useabelTag();

const searchParam = ref(crtDFS());

/**
 * 数据处理方法
 */
// 列表
const getList = async (params = searchParam.value) => {
  try {
    const res = await store.list(params as object);
    if (res?.code === 0) {
      console.log("---11---", res.data.list);
      setData(res.data.list || [], res.data.total || 0);
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
  const pageParams = onSzChg(val);
  searchParam.value = { ...searchParam.value, ...pageParams };
  getList(searchParam.value);
};

// 页码变化
const handleCurrentChange = (val: number) => {
  const pageParams = onCurChg(val);
  searchParam.value = { ...searchParam.value, ...pageParams };
  getList(searchParam.value);
};

// 搜索参数更新
const onPrmUp = (newParam: any) => {
  searchParam.value = newParam;
  getList(newParam);
};

/**
 * 操作按扭处理
 */

const editData = ref();
// 编辑按扭
const onEdit = (row: any) => {
  console.log("修改按扭", row);
  editData.value = row;
  shwAdd(1);
};

/**
 * 新增层关处理
 */
// 新增弹窗的可见性
const addVis = ref(false);
const addType = ref(0); // 0 新增，1 编辑
// 打开新增弹窗
const shwAdd = (type: number) => {
  // 重置编辑数据
  if (type === 0) {
    editData.value = null; // 新增时清空编辑数据
  }

  // 设置类型和显示状态
  addType.value = type;
  // 确保在下一个事件循环中设置visible
  setTimeout(() => {
    addVis.value = true;
  }, 0);
};

// 处理成功后的关闭
const onSucc = async () => {
  addVis.value = false;
  // 重置相关状态
  editData.value = null;
  addType.value = 0;
  await getList(searchParam.value);
};

// 提交
const onAddSub = async (formValues: FieldValues) => {
  console.log("-onAddSub--", addType.value);
  if ((addType.value === 0, addType.value)) {
    // 新增
    await putAdd(formValues);
  } else {
    // 编辑
    await putEdit(formValues);
  }
};

// 添加
const putAdd = async params => {
  try {
    const res = await store.add(params as object);
    if (res?.code === 0) {
      message("新增成功", { type: "success", showClose: true });
      await onSucc();
    } else {
      message("未找到数据", { type: "error" });
    }
  } catch (error) {
    console.error("获取数据失败:", error);
    message("获取数据失败", { type: "error" });
  }
};

// 编辑
const putEdit = async params => {
  if (!params || !params.id) {
    message("数据异常", { type: "error" });
    return;
  }
  try {
    const res = await store.edit(params);
    if (res?.code === 0) {
      message("修改成功", { type: "success", showClose: true });
      await onSucc();
    } else {
      message(res?.msg || "修改失败", { type: "error" });
    }
  } catch (error) {
    console.error("修改失败:", error);
    message("修改失败", { type: "error" });
  }
};

// 删除
const onDel = async (row: any) => {
  if (!row || !row.id) {
    message("数据异常", { type: "error" });
    return;
  }
  try {
    const params = { id: row.id };
    const res = await store.del(params);
    if (res?.code === 0) {
      message("删除成功", { type: "success", showClose: true });
      await getList(searchParam.value);
      addVis.value = false;
    } else {
      message(res?.msg || "删除失败", { type: "error" });
    }
  } catch (error) {
    console.error("删除失败:", error);
    message("删除失败", { type: "error" });
  }
};
/**
 * 生命周期钩子
 */
onMounted(() => {
  getList();
});
</script>

<template>
  <el-card shadow="never" :body-style="{ height: 'calc(100vh - 188px)' }">
    <!-- 搜索区域 -->
    <template #header>
      <Search :exportData="dataList" @update:param="onPrmUp" @add="shwAdd(0)" />
    </template>

    <!-- 数据表格 -->
    <pure-table
      ref="tableRef"
      adaptive
      stripe
      border
      row-key="id"
      alignWhole="center"
      showOverflowTooltip
      :loading="loading"
      :loading-config="lodConf"
      :adaptiveConfig="adapConf"
      :columns="columns"
      :pagination="pagination"
      :data="dataList"
      @page-size-change="handleSizeChange"
      @page-current-change="handleCurrentChange"
    >
      <!-- 操作列 -->
      <template #operation="{ row }">
        <el-button link type="primary" size="small" @click="() => onEdit(row)">
          编辑
        </el-button>
        <el-button link type="primary" size="small" @click="() => onDel(row)">
          关闭
        </el-button>
        <el-button link type="primary" size="small" @click="() => onDel(row)">
          停用
        </el-button>
      </template>
    </pure-table>

    <!-- 添加标签弹窗 -->
    <Add
      v-model:visible="addVis"
      :editData="editData"
      :type="addType"
      @submit="onAddSub"
      @update:visible="addVis = $event"
    />
  </el-card>
</template>
