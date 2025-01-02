<script setup lang="ts">
import { computed, ref } from "vue";
import { message } from "@/utils/message";
import { useFamDW } from "./form/store";
const store = useFamDW();

import MDep from "./mdep/index.vue";
const props = defineProps<{
  visible: boolean;
  userDt: any;
  wltDt: any;
}>();

const emit = defineEmits<{
  (_e: "submit", _data: any): void;
  (_e: "update:visible", _visible: boolean): void;
}>();

const dlgVis = computed({
  get: () => props.visible,
  set: val => emit("update:visible", val)
});

const onCls = () => {
  emit("update:visible", false);
};

const mwith = ref();

const onConfirm = async () => {
  // 获取表单数据
  const formData = mwith.value?.getFormData();

  // 组装请求参数
  const params = {
    channel: formData?.channel,
    accountID: formData?.accountID,
    remark: formData?.remark,
    amount: formData?.amount,
    name: props.userDt.name,
    account: formData?.account,
    uid: Number(props.userDt.uid)
  };

  try {
    const res = await store.cfm(params);
    if (res?.code === 0) {
      message("充值成功", { type: "success" });
      emit("submit", params);
      onCls();
    } else {
      message(res?.msg || "充值失败", { type: "error" });
    }
  } catch (error) {
    console.error("充值失败:", error);
    message("充值失败", { type: "error" });
  }
};

const userInfo = computed(() => {
  const { uid, account } = props.userDt;
  const walletType = props.wltDt?.walletType || "";
  const balance = props.wltDt?.amount || "0";

  return {
    uid: uid || "--",
    account: account || "--",
    walletType,
    balance
  };
});
</script>

<template>
  <el-dialog
    v-model="dlgVis"
    title="人工提现"
    width="600px"
    :close-on-click-modal="false"
    @close="onCls"
  >
    <el-row>
      <el-col :span="24">
        <div class="flex flex-col p-2 bg-gray-50 mb-4 rounded">
          <div class="flex justify-center gap-8 mb-3">
            <div class="text-gray-600 font-medium">
              UID：<span class="text-orange">{{ userInfo.uid }}</span>
            </div>
            <div class="text-gray-600 font-medium">
              用户名：<span class="text-orange">{{ userInfo.account }}</span>
            </div>
          </div>
          <div class="flex justify-center gap-8">
            <div class="text-gray-600 font-medium">
              钱包类型：<span class="text-orange">{{
                userInfo.walletType
              }}</span>
            </div>
            <div class="text-gray-600 font-medium">
              余额：<span class="text-orange">{{ userInfo.balance }}</span>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <MDep ref="mwith" />
      </el-col>
    </el-row>

    <template #footer>
      <div class="flex justify-end gap-3">
        <el-button @click="onCls">取消</el-button>
        <el-button type="primary" @click="onConfirm">保存</el-button>
      </div>
    </template>
  </el-dialog>
</template>
