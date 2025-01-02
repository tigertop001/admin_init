<script setup lang="ts">
import { computed, ref } from "vue";
import { message } from "@/utils/message";
import { useFamDS } from "./form/store";
const store = useFamDS();

import MDep from "./mdep/index.vue";
import SDep from "./sdep/index.vue";
const props = defineProps<{
  visible: boolean;
  userDt: any;
  wltDt: any;
}>();

const emit = defineEmits<{
  (_e: "submit", _data: any): void;
  (_e: "update:visible", _visible: boolean): void;
}>();

const type = ref(1);

const dlgVis = computed({
  get: () => props.visible,
  set: val => emit("update:visible", val)
});

const onCls = () => {
  emit("update:visible", false);
};

const mdep = ref();
const sdep = ref();

const onConfirm = async () => {
  const formData =
    type.value === 1 ? mdep.value?.getFormData() : sdep.value?.getFormData();

  const params = {
    uid: Number(props.userDt.uid),
    wallet: props.wltDt.value?.currency || "CHY",
    account: props.userDt.account,
    amount: formData?.amount,
    collectionAccount: formData?.collectionAccount,
    payMode: formData?.payMode,
    orderNum: formData?.orderNum,
    remark: formData?.remark,
    name: props.userDt.name,
    type: String(type.value) // 1:人工充值，2:充值扣款
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
    title="人工充值"
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
    <el-row class="h-40px flex items-center mb-4">
      <el-col :span="5" class="text-right leading-40px font-bold">
        财务性质:
      </el-col>
      <el-col :span="19" class="pl-[18px]">
        <el-radio-group v-model="type" size="large">
          <el-radio-button label="帐号首充" :value="1" />
          <el-radio-button label="单笔充值" :value="2" />
        </el-radio-group>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <MDep v-if="type == 1" ref="mdep" />
        <SDep v-if="type == 2" ref="sdep" />
      </el-col>
    </el-row>

    <template #footer>
      <div class="flex justify-end gap-3">
        <el-button @click="onCls">取消</el-button>
        <el-button type="primary" @click="onConfirm">确认充值</el-button>
      </div>
    </template>
  </el-dialog>
</template>
