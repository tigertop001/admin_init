<script setup lang="ts">
import { defineProps, ref, computed, defineEmits } from "vue";
import { ElSelect, ElOption, ElInput } from "element-plus";

// 定义接收的 props，明确 options 的类型
interface Option {
  label: string;
  value: string;
}

// 定义接收的 props
const props = defineProps({
  modelValue: {
    type: Object as () => { content: string; type: string; label: string },
    required: true
  },
  searchType: String,
  options: {
    type: Array as () => Option[],
    required: true
  }
});

// 通过 defineEmits 定义 emit 函数
const emit = defineEmits<{
  (
    _e: "update:modelValue",
    _value: { content: string; type: string; label: string }
  ): void;
}>();

// 本地状态：存储 searchType 和 searchContent
const localSearchType = ref(props.searchType);
const localSearchContent = ref<{
  content: string;
  type: string;
  label: string;
}>(props.modelValue);

const placeholderText = computed(() => {
  const selectedOption = props.options.find(
    option => option.value === localSearchType.value
  );
  return selectedOption
    ? `请输入${selectedOption.label}搜索`
    : `请输入${localSearchType.value}搜索`;
});

// 当本地内容变化时，触发更新
const updateSearchContent = (val: string) => {
  localSearchContent.value.content = val; // 更新 content
  const selectedOption = props.options.find(
    option => option.value === localSearchType.value
  );
  const obj = {
    content: val,
    type: localSearchType.value,
    label: selectedOption ? selectedOption.label : ""
  };
  // 触发父组件的 onUpdate:modelValue
  emit("update:modelValue", obj);
};
</script>

<template>
  <div style="display: flex; align-items: center; margin-left: 0">
    <el-select
      v-model="localSearchType"
      style="width: 120px; margin-right: 8px"
    >
      <el-option
        v-for="option in props.options"
        :key="option.value"
        :label="option.label"
        :value="option.value"
      />
    </el-select>

    <el-input
      v-model="localSearchContent.content"
      :placeholder="placeholderText"
      style="width: 178px"
      @input="updateSearchContent"
    />
  </div>
</template>
