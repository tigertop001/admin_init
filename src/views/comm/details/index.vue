<script setup lang="ts">
/**
 * 导入依赖
 */
import { ref, computed } from "vue";

/**
 * 导入组件和工具
 */
import { PlusDialog } from "plus-pro-components";
import Information from "./view/information/index.vue";
import Securty from "./view/securty/index.vue";
import Statistics from "./view/statistics/index.vue";
import Betting from "./view/betting/index.vue";
import Fund from "./view/fund/index.vue";
import Audit from "./view/audit/index.vue";
import Member from "./view/member/index.vue";
import Administrator from "./view/administrator/index.vue";
import SameIP from "./view/sameip/index.vue";

/** 组件属性定义 */
interface Props {
  /** 控制弹窗显示状态 */
  visible: boolean;
  /** 当前标签信息,允许为空 */
  rowData?: Record<string, any> | null;
  title?: string;
}
const props = defineProps<Props>();
const title = props.title;
/** 组件事件定义 */
const emit = defineEmits<{
  /** 更新弹窗显示状态 */
  "update:visible": [value: boolean];
}>();

/** 弹窗显示状态的计算属性,支持双向绑定 */
const dialogVis = computed({
  get: () => props.visible,
  set: value => emit("update:visible", value)
});

const onShwFL = () => {
  actNm.value = "5"; // 切换到资金日志标签
};
/**
 * 菜单切换 ------ start
 */
// 定义选中的 tab 名称
const actNm = ref("1");

// 定义 tabs 数据
const tabs = [
  { label: "常用信息", name: "1", component: Information },
  { label: "安全管理", name: "2", component: Securty },
  { label: "用户统计", name: "3", component: Statistics },
  { label: "投注记录", name: "4", component: Betting },
  { label: "资金日志", name: "5", component: Fund },
  { label: "稽核查询", name: "6", component: Audit },
  { label: "会员操作日志", name: "7", component: Member },
  { label: "管理员操作日志", name: "8", component: Administrator },
  { label: "同IP同设备同姓名", name: "9", component: SameIP }
];

// 点击 tab 时的处理函数
const onClk = (tab: any) => {
  console.log("Clicked tab:", tab);
};

// 根据选中的 tab 动态渲染对应的组件
const curCmp = computed(() => {
  const tab = tabs.find(tab => tab.name === actNm.value);
  return tab ? tab.component : null;
});
</script>

<template>
  <PlusDialog
    v-model="dialogVis"
    :title="title"
    width="1500"
    :height="98"
    :destroy-on-close="true"
    :append-to-body="true"
    :center="false"
    top="40px"
    :footer="null"
    :show-footer="false"
    :has-footer="false"
  >
    <el-card shadow="never" :body-style="{ height: 'calc(100vh - 246px)' }">
      <!-- 将 el-tabs 放到 el-card 的 header 插槽 -->
      <template #header>
        <el-tabs v-model="actNm" class="demo-tabs" @tab-click="onClk">
          <!-- 动态渲染 el-tab-pane -->
          <el-tab-pane
            v-for="(tab, index) in tabs"
            :key="index"
            :label="tab.label"
            :name="tab.name"
          />
        </el-tabs>
      </template>

      <!-- 动态渲染选项卡内容 -->
      <component :is="curCmp" :rowData="props.rowData" @shwFndLg="onShwFL" />
    </el-card>
  </PlusDialog>
</template>
<style lang="scss" scoped>
@import url("./styles/index.scss"); // 样式通过 scoped 限制
</style>
