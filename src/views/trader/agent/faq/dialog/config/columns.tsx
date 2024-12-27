import { computed, h } from "vue";
import type { PlusColumn } from "plus-pro-components";
import EditorBase from "@/views/comm/editor/editor-base.vue";
import { ElInput } from "element-plus";

export function useColumns(formData: any) {
  const columns = computed((): PlusColumn[] => [
    {
      label: "问题标题",
      labelWidth: 100,
      prop: "question",
      valueType: "input",
      tooltip: "6-20位字母和数字的组合",
      rules: [{ required: true, message: "请输入问题标题" }]
    },
    {
      label: "问题类型",
      labelWidth: 100,
      prop: "type",
      valueType: "radio",
      options: [
        { label: "富文本", value: 1 },
        { label: "图片", value: 2 }
      ],
      rules: [{ required: true, message: "请选择问题类型" }]
    },
    {
      label: "问题内容",
      labelWidth: 100,
      prop: "answer",
      valueType: "input",
      renderField: () => {
        if (formData.value.type === 1) {
          return h(EditorBase, {
            modelValue: formData.value.answer,
            "onUpdate:modelValue": (val: string) => {
              formData.value.answer = val;
            }
          });
        }
        return h(ElInput, {
          modelValue: formData.value.answer,
          "onUpdate:modelValue": (val: string) => {
            formData.value.answer = val;
          },
          placeholder: "请输入图片URL地址"
        });
      },
      rules: [{ required: true, message: "请输入问题内容" }]
    },
    {
      label: "排序",
      labelWidth: 100,
      prop: "sort",
      valueType: "input",
      fieldProps: { type: "number" }
    },
    {
      label: "状态",
      labelWidth: 100,
      prop: "isDisplay",
      valueType: "switch",
      fieldProps: {
        "active-value": 1, // 显示
        "inactive-value": 2 // 不显示
      }
    }
  ]);

  return {
    columns
  };
}
