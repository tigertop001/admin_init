import { ref, computed } from "vue";
import type { PlusColumn } from "plus-pro-components";
import { COMM_RULES } from "../../../comm/utils/rules";

export function useColumns() {
  const state = ref({
    name: null,
    startAt: null,
    endAt: null,
    showStartAt: null,
    showEndAt: null,
    walletType: null,
    extend: {
      plaids: [],
      firstAmount: null,
      reward: null,
      rule: null,
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
        label: "活动名称",
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
      }
    ];
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
    onReset
  };
}
