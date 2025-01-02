<script setup lang="ts">
import { ref, computed } from "vue";

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

interface Props {
  visible: boolean;

  rowDt?: Record<string, any> | null;
  title?: string;
}
const props = defineProps<Props>();
const title = props.title;

const emit = defineEmits<{
  "update:visible": [value: boolean];
}>();

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

const actNm = ref("1");

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

const onClk = (tab: any) => {
  console.log("Clicked tab:", tab);
};

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
      <template #header>
        <el-tabs v-model="actNm" class="demo-tabs" @tab-click="onClk">
          <el-tab-pane
            v-for="(tab, index) in tabs"
            :key="index"
            :label="tab.label"
            :name="tab.name"
          />
        </el-tabs>
      </template>

      <component :is="curCmp" :rowDt="props.rowDt" @shwFndLg="onShwFL" />
    </el-card>
  </PlusDialog>
</template>
<style lang="scss" scoped>
@import url("./styles/index.scss");
</style>
