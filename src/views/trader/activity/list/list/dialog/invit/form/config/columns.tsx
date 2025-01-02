import { ref, computed } from "vue";
import type { PlusColumn } from "plus-pro-components";
import ConditionTable from "../../condition-table/index.vue";
import { COMM_RULES, INVIT_RULES } from "../../../comm/utils/rules";

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
      firstAmount: { min: null, max: null },
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
      },
      {
        label: "奖励金额",
        labelWidth: 130,
        prop: "extend.reward",
        valueType: "input",
        rules: INVIT_RULES.reward
      },
      {
        label: "首次旋转金额",
        labelWidth: 130,
        prop: "extend.firstAmount",
        rules: INVIT_RULES.firstAmount,
        renderField: () => (
          <div class="flex items-center gap-2">
            <el-input
              v-model={state.value.extend.firstAmount.min}
              type="number"
              class="w-[115px]"
              placeholder="最小金额"
            />
            <span>-</span>
            <el-input
              v-model={state.value.extend.firstAmount.max}
              type="number"
              class="w-[115px]"
              placeholder="最大金额"
            />
          </div>
        )
      },
      {
        label: "旋转金额配置",
        labelWidth: 130,
        prop: "extend.plaids",
        tooltip: {
          placement: "top",
          content: `根据随机金额，匹配奖励类型图标<br/>未中奖（图标1）：0-0<br/>固定金额（图标2）：0.01-0.01<br/>随机小额（图标3）：0.02-0.49<br/>固定金额（图标4）：0.50-0.50<br/>随机中额（图标5）：0.51-5.00<br/>随机大额（图标6）：5.01-9.99<br/>固定金额（图标7）：10.00-10.00<br/>直接提款（图标8）：10.01-任意大于10.01值`,
          rawContent: true
        },
        rules: INVIT_RULES.plaids,
        renderField: () => (
          <div class="w-full">
            <ConditionTable v-model={state.value.extend.plaids} />
          </div>
        )
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
      },
      {
        label: "活动规则",
        labelWidth: 130,
        prop: "extend.rule",
        valueType: "textarea",
        rules: INVIT_RULES.rule
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
