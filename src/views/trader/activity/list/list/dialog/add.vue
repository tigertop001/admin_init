<script setup lang="ts">
import { ref, watch, nextTick } from "vue";
import FirstDep from "./first-dep/index.vue";
import Dep from "./dep/index.vue";
import Invit from "./invit/index.vue";
import Relief from "./relief/index.vue";
import Diy from "./diy/index.vue";
import ComForm from "./comm/index.vue";

const props = defineProps<{
  modelValue: boolean;
  editData?: any;
  editType?: number;
}>();

const emit = defineEmits<{
  (_e: "update:modelValue", _value: boolean): void;
  (_e: "submit", _value: any): void;
}>();

const type = ref(1);
const firstDepRef = ref();
const depRef = ref();
const invitRef = ref();
const reliefRef = ref();
const diyRef = ref();
const comFormRef = ref();

const close = () => {
  emit("update:modelValue", false);
};

const getActivityData = () => {
  switch (type.value) {
    case 1:
      return firstDepRef.value?.getFormData();
    case 2:
      return depRef.value?.getFormData();
    case 3:
      return invitRef.value?.getFormData();
    case 4:
      return reliefRef.value?.getFormData();
    case 5:
      return diyRef.value?.getFormData();
    default:
      return null;
  }
};

const onSubmit = async () => {
  try {
    const activityData = getActivityData();
    delete activityData.activityTimeRange;
    delete activityData.showTimeRange;
    const commonData = comFormRef.value?.getFormData();

    const userLevel = Array.isArray(commonData.userLevel)
      ? commonData.userLevel.join(",")
      : commonData.userLevel;

    const sort = Number(commonData.sort);
    const extend = JSON.stringify(activityData.extend);
    const subData = {
      tagID: type.value,
      type: type.value,
      ...activityData,
      ...commonData,
      userLevel,
      sort,
      extend
    };
    emit("submit", subData);
    close();
  } catch (error) {
    console.error("表单验证失败", error);
  }
};

watch(
  () => props.editData,
  async val => {
    if (val) {
      type.value = val.type;

      await nextTick();

      if (comFormRef.value) {
        const commonFormData = {
          issueMode: val.issueMode,
          userType: val.userType,
          userLevel: val.userLevel?.split(",").map(Number),
          ipBlacklist: val.ipBlacklist,
          uidBlacklist: val.uidBlacklist,
          tagID: val.tagID,
          sort: val.sort,
          publicityPicture: val.publicityPicture,
          details: val.details
        };
        comFormRef.value.setFormData(commonFormData);
      }

      // 设置活动表单数据
      if (firstDepRef.value) {
        const activityFormData = {
          name: val.name,
          startAt: val.startAt,
          endAt: val.endAt,
          showStartAt: val.showStartAt,
          showEndAt: val.showEndAt,
          walletType: val.walletType,
          extend: val.extend ? JSON.parse(val.extend) : {}
        };
        firstDepRef.value.setFormData(activityFormData);
      }
    }
  },
  { immediate: true }
);
</script>

<template>
  <el-dialog
    :model-value="modelValue"
    :title="
      editType === 0 ? '新增活动' : editType === 1 ? '编辑活动' : '活动详情'
    "
    width="1400"
    @update:modelValue="emit('update:modelValue', $event)"
  >
    <el-row>
      <el-col :span="12">
        <el-row class="h-40px flex items-center mb-4">
          <el-col :span="4" class="text-right leading-40px font-bold"
            >活动类型:</el-col
          >
          <el-col :span="20" class="pl-[18px]">
            <el-radio-group
              v-model="type"
              size="large"
              :disabled="editType !== 0"
            >
              <el-radio-button
                label="帐号首充"
                :value="1"
                :disabled="editType !== 0"
              />
              <el-radio-button label="单笔充值" :value="2" />
              <el-radio-button label="邀请转盘" :value="3" />
              <el-radio-button label="救济金" :value="4" />
              <el-radio-button label="自定义" :value="5" />
            </el-radio-group>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <FirstDep
              v-if="type == 1"
              ref="firstDepRef"
              :disabled="editType === 2"
            />
            <Dep v-if="type == 2" ref="depRef" :disabled="editType === 2" />
            <Invit v-if="type == 3" ref="invitRef" :disabled="editType === 2" />
            <Relief v-if="type == 4" ref="reliefRef" />
            <Diy v-if="type == 5" ref="diyRef" :disabled="editType === 2" />
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="12">
        <ComForm ref="comFormRef" :disabled="editType === 2" />
      </el-col>
    </el-row>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="onSubmit">保存</el-button>
      </div>
    </template>
  </el-dialog>
</template>
