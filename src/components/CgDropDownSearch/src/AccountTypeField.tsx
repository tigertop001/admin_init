import { defineComponent, reactive, computed, watch } from "vue";
import { ElSelect, ElOption, ElInput } from "element-plus";
import type { SearchField, Option } from "./types";

export interface FieldConfig {
  typeKey?: string; // 输出的类型字段名，默认 'stype'
  contentKey?: string; // 输出的内容字段名，默认 'scontent'
  mapping?: {
    // 可选的传统字段映射
    [key: string]: string;
  };
  isStype?: boolean; // 是否使用独立传值格式，默认 true
}

export default defineComponent({
  name: "CgDropDownSearch",
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
    },
    config: {
      type: Object as PropType<FieldConfig>,
      default: () => ({
        typeKey: "stype",
        contentKey: "scontent",
        isStype: true
      })
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

    const onValChg = (type: string, content: string | number | null) => {
      const {
        typeKey = "stype",
        contentKey = "scontent",
        mapping = {},
        isStype = true
      } = props.config;
      const selectedOption = props.options.find(opt => opt.value === type);

      let stypeVal: any = {
        content,
        type,
        label: selectedOption?.label || ""
      };

      if (isStype) {
        // 新格式
        stypeVal[typeKey] = type;
        stypeVal[contentKey] = content;
      }

      if (!isStype && mapping && mapping[type]) {
        // 传统格式
        stypeVal[mapping[type]] = content;
      }

      return stypeVal;
    };

    watch(
      () => localSearchContent.type,
      newType => {
        const stypeVal = onValChg(newType, null);
        emit("update:modelValue", stypeVal);
      }
    );

    const updateSearchContent = (val: string) => {
      localSearchContent.content = val;
      const stypeVal = onValChg(localSearchContent.type, val);
      emit("update:modelValue", stypeVal);
    };

    watch(
      () => props.modelValue,
      stypeVal => Object.assign(localSearchContent, stypeVal),
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
