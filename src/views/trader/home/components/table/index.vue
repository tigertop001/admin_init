<script setup lang="ts">
import { reactive } from "vue";
import { useColumns } from "./columns";
const props = defineProps({
  dataList: {
    type: Array,
    required: true
  },
  type: {
    type: String,
    required: true
  }
});
const { rrColumns, wrColumns, pfColumns, prColumns, Empty } = useColumns();
const columnsMap = {
  rechargeRank: rrColumns,
  withdrawRank: wrColumns,
  profitRank: pfColumns,
  proxyRank: prColumns
};
const columns = reactive(columnsMap[props.type] || []);
</script>

<template>
  <pure-table :data="dataList" :columns="columns">
    <template #empty>
      <el-empty description="暂无数据" :image-size="60">
        <template #image>
          <Empty />
        </template>
      </el-empty>
    </template>
  </pure-table>
</template>

<style lang="scss">
.pure-table-filter {
  .el-table-filter__list {
    min-width: 80px;
    padding: 0;

    li {
      line-height: 28px;
    }
  }
}
</style>

<style lang="scss" scoped>
@import url("./styles/index.scss"); // 样式通过 scoped 限制
</style>
