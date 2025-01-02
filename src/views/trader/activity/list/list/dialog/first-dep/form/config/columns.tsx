import { ref, computed } from "vue";
import type { PlusColumn } from "plus-pro-components";
import ConditionTable from "../../condition-table/index.vue";
import { COMM_RULES, FIRST_RULES } from "../../../comm/utils/rules";

export function useColumns() {
  const initializeShowDate = (data: any) => {
    if (data.startAt && data.endAt) {
      showDate.value.activityTimeRange = [
        data.startAt * 1000,
        data.endAt * 1000
      ];
    }
    if (data.showStartAt && data.showEndAt) {
      showDate.value.showTimeRange = [
        data.showStartAt * 1000,
        data.showEndAt * 1000
      ];
    }
  };

  // 在 setData 中调用
  const setData = (data: any) => {
    Object.assign(state.value, {
      name: data.name,
      startAt: data.startAt,
      endAt: data.endAt,
      showStartAt: data.showStartAt,
      showEndAt: data.showEndAt,
      walletType: data.walletType
    });

    if (data.extend) {
      Object.assign(state.value.extend, data.extend);
    }

    // 初始化时间显示
    initializeShowDate(data);
  };

  const state = ref({
    name: null,
    startAt: null,
    endAt: null,
    showStartAt: null,
    showEndAt: null,
    walletType: null,
    extend: {
      condition: [],
      max: null,
      redirectType: 1,
      redirectMode: 1,
      redirectTo: null,
      auditMultiple: null
    }
  });

  const showDate = ref({
    activityTimeRange: [],
    showTimeRange: []
  });

  const onDateChg = (
    val: any[],
    startKey: "startAt" | "showStartAt",
    endKey: "endAt" | "showEndAt",
    rangeKey: "activityTimeRange" | "showTimeRange"
  ) => {
    if (val && Array.isArray(val)) {
      state.value[startKey] = Math.floor(val[0]);
      state.value[endKey] = Math.floor(val[1]);
      showDate.value[rangeKey] = val;
    } else {
      state.value[startKey] = null;
      state.value[endKey] = null;
      showDate.value[rangeKey] = [];
    }
  };

  const getColumns = (): PlusColumn[] => {
    const baseColumns: PlusColumn[] = [
      {
        label: " 活动名称",
        labelWidth: 130,
        prop: "name",
        valueType: "input",
        rules: COMM_RULES.name
      },
      {
        label: "活动起止时间",
        labelWidth: 130,
        prop: "activityTimeRange",
        valueType: "date-picker",
        rules: COMM_RULES.activityTimeRange,
        fieldProps: {
          type: "datetimerange",
          startPlaceholder: "请选择",
          endPlaceholder: "请选择",
          modelValue: showDate.value.activityTimeRange,
          "onUpdate:modelValue": (val: any) => {
            showDate.value.activityTimeRange = val;
            onDateChg(val, "startAt", "endAt", "activityTimeRange");
          }
        }
      },
      {
        label: "展示起止时间",
        labelWidth: 130,
        prop: "showTimeRange",
        valueType: "date-picker",
        fieldProps: {
          type: "datetimerange",
          startPlaceholder: "请选择",
          endPlaceholder: "请选择",
          modelValue: showDate.value.showTimeRange,
          "onUpdate:modelValue": (val: any) => {
            showDate.value.showTimeRange = val;
            onDateChg(val, "showStartAt", "showEndAt", "showTimeRange");
          }
        }
      },
      {
        label: "活动条件",
        labelWidth: 130,
        prop: "extend.condition",
        rules: FIRST_RULES.rule,
        renderField: () => (
          <div class="w-full">
            <ConditionTable v-model={state.value.extend.condition} />
          </div>
        )
      },
      {
        label: "奖励金额上限",
        labelWidth: 130,
        prop: "extend.max",
        valueType: "input-number"
      },
      {
        label: "派奖钱包",
        labelWidth: 130,
        prop: "walletType",
        valueType: "radio",
        rules: COMM_RULES.walletType,
        options: [
          {
            label: "活动钱包",
            value: 1
          },
          {
            label: "账户主钱包",
            value: 2
          }
        ]
      }
    ];

    if (state.value.walletType === 2) {
      baseColumns.push({
        label: "稽核倍数",
        labelWidth: 130,
        prop: "extend.auditMultiple",
        valueType: "input-number"
      });
    }

    baseColumns.push({
      label: "跳转类型",
      labelWidth: 130,
      prop: "extend.redirectType",
      valueType: "radio",
      options: [
        { label: "内部跳转", value: 1 },
        { label: "指定跳转", value: 2 }
      ]
    });

    if (state.value.extend.redirectType === 1) {
      baseColumns.push({
        labelWidth: 130,
        prop: "extend.redirectMode",
        valueType: "select",
        hasLabel: false,
        options: [
          { label: "内部跳转-充值页面", value: 1 },
          { label: "内部跳转-VIP页面", value: 2 }
        ]
      });
    } else if (state.value.extend.redirectType === 2) {
      baseColumns.push(
        {
          labelWidth: 130,
          prop: "extend.redirectMode",
          valueType: "select",
          hasLabel: false,
          options: [
            { label: "指定游戏跳转", value: 1 },
            { label: "外部链接跳转", value: 2 }
          ]
        },
        {
          labelWidth: 130,
          prop: "extend.redirectTo",
          valueType: "input",
          hasLabel: false,
          placeholder: "请输入游戏ID"
        }
      );
    }
    return baseColumns;
  };

  const columns = computed(() => getColumns());

  const onChg = (values, prop) => {
    if (prop.prop === "walletType" && values.walletType === 1) {
      state.value.extend.auditMultiple = null;
    }
  };

  const onSub = values => {
    console.log(values, "Submit");
  };

  const onSubErr = (err: any) => {
    console.log(err, "err");
  };

  const onReset = () => {
    console.log("handleReset");
  };

  return {
    state,
    columns,
    onChg,
    onSub,
    onSubErr,
    onReset,
    setData
  };
}
