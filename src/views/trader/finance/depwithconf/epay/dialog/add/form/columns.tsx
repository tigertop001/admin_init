import { ref, computed, watch } from "vue";
import type { PlusColumn, FieldValues } from "plus-pro-components";

export const useDialog = (
  props: {
    visible: boolean;
    editData?: FieldValues;
    type?: number;
  },
  emit: {
    (_e: "submit", _formValues: FieldValues): void;
    (_e: "update:visible", _visible: boolean): void;
  }
) => {
  const dlgConf = computed(() => ({
    title: "新增通道",
    confirmText: "提交"
  }));

  const formData = ref<FieldValues>({
    title: "",
    content: "",
    startAt: null,
    endAt: null,
    recipient: 1,
    uid: "",
    max: 11,
    min: 1
  });

  const dateRange = ref({
    sentTime: []
  });

  const columns = computed<PlusColumn[]>(() => {
    const baseColumns: PlusColumn[] = [
      {
        label: "支付通道昵称",
        labelWidth: 160,
        prop: "title",
        valueType: "input"
      },
      {
        label: "支付类型",
        labelWidth: 160,
        prop: "content",
        valueType: "input"
      },
      {
        label: "支付接口名",
        labelWidth: 160,
        prop: "sentTime",
        valueType: "input"
      },
      {
        label: "支付接口英文名",
        labelWidth: 160,
        prop: "title",
        valueType: "input"
      },
      {
        label: "支付通道名",
        labelWidth: 160,
        prop: "title",
        valueType: "input"
      },
      {
        label: "通道编号",
        labelWidth: 160,
        prop: "title",
        valueType: "input",
        tooltip: "以上配置请谨慎操作，编辑保存后不可再次编辑"
      },
      {
        label: "支付网关",
        labelWidth: 160,
        prop: "title",
        valueType: "input"
      },
      {
        label: "支付地址",
        labelWidth: 160,
        prop: "title",
        valueType: "input"
      },
      {
        label: "查询注单地址",
        labelWidth: 160,
        prop: "title",
        valueType: "input"
      },
      {
        label: "回调IP",
        labelWidth: 160,
        prop: "title",
        valueType: "input"
      },
      {
        label: "回调地址",
        labelWidth: 160,
        prop: "title",
        valueType: "input"
      },
      {
        label: "商户号",
        labelWidth: 160,
        prop: "title",
        valueType: "input"
      },
      {
        label: "单笔额度限制",
        labelWidth: 160,
        prop: "extend.firstAmount",
        renderField: () => (
          <div class="flex items-center gap-2">
            <el-input
              v-model={formData.value.min}
              type="number"
              class="w-[115px]"
              placeholder="最小金额"
              onInput={value => {
                formData.value.min = value ? Number(value) : 0;
              }}
            />
            <span>-</span>
            <el-input
              v-model={formData.value.max}
              type="number"
              class="w-[115px]"
              placeholder="最大金额"
              onInput={value => {
                formData.value.max = value ? Number(value) : 0;
              }}
            />
          </div>
        )
      },
      {
        label: "充值通道手续费率",
        labelWidth: 160,
        prop: "title",
        valueType: "input",
        tooltip: "四方充值渠道收取得充值手续费"
      },
      {
        label: "支付秘钥",
        labelWidth: 160,
        prop: "title",
        valueType: "input"
      },
      {
        label: "对层级用户是否可见",
        labelWidth: 160,
        prop: "content",
        valueType: "checkbox",
        tooltip: "可选,配置不同用户层级可见,不选默认全部可见",
        options: [
          {
            label: "未分层",
            value: 1,
            color: "red"
          },
          {
            label: "一层",
            value: 2,
            color: "blue"
          },
          {
            label: "二层",
            value: 3,
            color: "blue"
          },
          {
            label: "三层",
            value: 4,
            color: "blue"
          },
          {
            label: "四层",
            value: 5,
            color: "blue"
          },
          {
            label: "五层",
            value: 6,
            color: "blue"
          },
          {
            label: "六层",
            value: 7,
            color: "blue"
          },
          {
            label: "七层",
            value: 8,
            color: "blue"
          },
          {
            label: "八层",
            value: 9,
            color: "blue"
          },
          {
            label: "九层",
            value: 10,
            color: "blue"
          }
        ]
      },
      {
        label: "支持设备",
        labelWidth: 160,
        prop: "uid",
        valueType: "checkbox",
        options: [
          {
            label: "IOS",
            value: 1,
            color: "red"
          },
          {
            label: "Android",
            value: 2,
            color: "blue"
          },
          {
            label: "H5",
            value: 3,
            color: "blue"
          }
        ]
      }
    ];

    return baseColumns;
  });

  const crtDefVal = () => {
    const defaultValues = {
      title: "",
      content: "",
      startAt: null,
      endAt: null,
      recipient: 1,
      uid: ""
    };

    return defaultValues;
  };

  const rstFrm = () => {
    dateRange.value.sentTime = [];
    formData.value = crtDefVal();
  };

  watch(
    [() => props.type, () => props.editData],
    () => {
      rstFrm();
    },
    { immediate: true }
  );

  watch(
    () => formData.value.recipient,
    newValue => {
      if (newValue === 1) {
        formData.value.uid = "";
      }
    }
  );

  const onCfm = () => {
    delete formData.value.sentTime;
    emit("submit", formData.value);
    emit("update:visible", false);
    if (props.type === 0) {
      formData.value = crtDefVal();
    }
  };

  const onCls = () => {
    rstFrm();
    emit("update:visible", false);
  };

  const formConfig = computed(() => ({
    columns: columns.value,
    colProps: {
      xs: { span: 24 },
      sm: { span: 12 },
      md: { span: 12 },
      lg: { span: 12 },
      xl: { span: 12 }
    },
    rowProps: {
      gutter: 20
    }
  }));

  return {
    formData,
    dlgConf,
    formConfig,
    onCls,
    onCfm,
    rstFrm
  };
};
