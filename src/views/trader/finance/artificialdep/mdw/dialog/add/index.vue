<script setup lang="ts">
import { computed, ref } from "vue";
import { useAddDialog } from "./form/config/addConfig";
import MDep from "./mdep/index.vue";
import SDep from "./sdep/index.vue";
const props = defineProps<{
  visible: boolean;
}>();

const emit = defineEmits<{
  (_e: "submit", _data: any): void;
  (_e: "update:visible", _visible: boolean): void;
}>();

const type = ref(1);

const { resetForm } = useAddDialog(emit);

const dlgVis = computed({
  get: () => props.visible,
  set: val => emit("update:visible", val)
});

const onCls = () => {
  resetForm();
  emit("update:visible", false);
};
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
      <el-col :span="24"> ddd </el-col>
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
  </el-dialog>
</template>

<style scoped>
.dialog-footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}
</style>
