import { defineComponent, reactive, computed, watch } from "vue";
import { ElSelect, ElOption, ElInput } from "element-plus";
import type { SearchField, Option } from "./types";

export default defineComponent({
  name: "AccountTypeField",
  props: {
    modelValue: {
      type: Object as PropType<SearchField>,
      required: true
    },
    options: {
      type: Array as PropType<Option[]>,
      required: true
    },
    selectWidth: {
      type: String,
      default: "120px"
    }
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const localSearchContent = reactive<SearchField>(props.modelValue);

    const placeholderText = computed(() => {
      const selectedOption = props.options.find(
        option => option.value === localSearchContent.type
      );
      return selectedOption
        ? `请输入${selectedOption.typename}${selectedOption.label}`
        : `请输入${localSearchContent.type}`;
    });

    const updateSearchContent = (val: string) => {
      localSearchContent.content = val;
      const selectedOption = props.options.find(
        option => option.value === localSearchContent.type
      );
      emit("update:modelValue", {
        content: val,
        type: localSearchContent.type,
        label: selectedOption?.label || ""
      });
    };

    watch(
      () => props.modelValue,
      newValue => Object.assign(localSearchContent, newValue),
      { deep: true }
    );

    return () => (
      <div style="display: flex; align-items: center; margin-left: 0">
        <ElSelect
          v-model={localSearchContent.type}
          style={{ width: props.selectWidth, marginRight: "8px" }}
        >
          {props.options.map(option => (
            <ElOption
              key={option.value}
              label={option.label}
              value={option.value}
            />
          ))}
        </ElSelect>
        <ElInput
          v-model={localSearchContent.content}
          placeholder={placeholderText.value}
          style="width: 178px"
          onInput={updateSearchContent}
        />
      </div>
    );
  }
});
