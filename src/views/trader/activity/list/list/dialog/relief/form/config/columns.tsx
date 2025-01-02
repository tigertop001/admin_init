import { ref, computed } from "vue";
import type { PlusColumn } from "plus-pro-components";
import ConditionTable from "../../condition-table/index.vue";
import {
  COMM_RULES,
  DEPOSIT_RULES,
  FIRST_RULES
} from "../../../comm/utils/rules";

export function useColumns() {
  const state = ref({
    name: null,
    startAt: null,
    endAt: null,
    showStartAt: null,
    showEndAt: null,
    walletType: null,
    extend: {
      reset: null,
      games: [],
      condition: [],
      receiveTime: null,
      perMax: null,
      auditMultiple: null
    }
  });

  const checkBoxState = ref({
    checkAll: false,
    isIndeterminate: false
  });
  const options = [
    { label: "XX棋牌", value: 1 },
    { label: "XX视讯", value: 2 },
    { label: "XX体育", value: 3 }
  ];

  const onCkAllChg = (val: boolean) => {
    state.value.extend.games = val ? options.map(item => item.value) : [];
    checkBoxState.value.isIndeterminate = false;
  };

  const onCkChg = (value: any[]) => {
    const checkedCount = value.length;
    checkBoxState.value.checkAll = checkedCount === options.length;
    checkBoxState.value.isIndeterminate =
      checkedCount > 0 && checkedCount < options.length;
  };

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
        label: "重置方式",
        labelWidth: 130,
        prop: "extend.reset",
        valueType: "select",
        rules: DEPOSIT_RULES.reset,
        options: [
          {
            label: "单次活动(活动时间范围内不重置活动条件)",
            value: 1
          },
          {
            label: "每日重置(每日0点重置活动条件)",
            value: 2
          },
          {
            label: "每周重置(每周一0点重置活动条件)",
            value: 3
          }
        ]
      },
      {
        label: "选择游戏",
        labelWidth: 130,
        prop: "extend.games",
        valueType: "checkbox",
        renderField: () => (
          <div class="w-full">
            <el-checkbox
              v-model={checkBoxState.value.checkAll}
              indeterminate={checkBoxState.value.isIndeterminate}
              onChange={onCkAllChg}
            >
              全选
            </el-checkbox>
            <div class="mt-2">
              <el-checkbox-group
                v-model={state.value.extend.games}
                onChange={onCkChg}
              >
                {options.map(item => (
                  <el-checkbox key={item.value} value={item.value}>
                    {item.label}
                  </el-checkbox>
                ))}
              </el-checkbox-group>
            </div>
          </div>
        )
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
        label: "领奖时间间隔",
        labelWidth: 130,
        prop: "extend.receiveTime",
        valueType: "input-number",
        fieldProps: {
          style: { width: "220px" },
          type: "number"
        },
        renderField: () => (
          <div class="flex items-center">
            <el-input
              v-model={state.value.extend.receiveTime}
              style="width: 100px"
              type="number"
              placeholder="请输入"
              onInput={value => {
                state.value.extend.receiveTime = value ? Number(value) : 0;
              }}
            />
            <span class="ml-2">小时</span>
          </div>
        )
      },
      {
        label: " 每次奖励上限",
        labelWidth: 130,
        prop: "extend.perMax",
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
