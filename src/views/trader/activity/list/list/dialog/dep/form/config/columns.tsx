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
      reset: null, // 1: 单次活动 2 每天重置 3 每周重置
      isCumulative: null,
      rechargeMode: [],
      condition: [],
      dailyLimit: null,
      redirectType: null,
      redirectMode: null,
      redirectTo: null,
      auditMultiple: null
    }
  });

  const checkBoxState = ref({
    checkAll: false,
    isIndeterminate: false
  });
  // checkbox 选项
  const options = [
    { label: "PIX1", value: 1 },
    { label: "PIX2", value: 2 },
    { label: "银行卡转账", value: 3 }
  ];

  // 全选处理函数
  const onCkAllChg = (val: boolean) => {
    state.value.extend.rechargeMode = val
      ? options.map(item => item.value)
      : [];
    checkBoxState.value.isIndeterminate = false;
  };

  // 选项变化处理函数
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
        label: "是否累计",
        labelWidth: 130,
        prop: "extend.isCumulative",
        valueType: "select",
        rules: DEPOSIT_RULES.isCumulative,
        options: [
          { label: "单笔充值", value: false },
          { label: "累计充值", value: true }
        ]
      },
      {
        label: "充值方式",
        labelWidth: 130,
        prop: "extend.rechargeMode",
        valueType: "checkbox",
        rules: DEPOSIT_RULES.isCumulative,
        // 使用自定义渲染
        renderField: () => (
          <div class="w-full">
            {/* 全选 checkbox */}
            <el-checkbox
              v-model={checkBoxState.value.checkAll}
              indeterminate={checkBoxState.value.isIndeterminate}
              onChange={onCkAllChg}
            >
              全选
            </el-checkbox>
            <div class="mt-2">
              {/* checkbox 组 */}
              <el-checkbox-group
                v-model={state.value.extend.rechargeMode}
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
        label: " 每日次数上限",
        labelWidth: 130,
        prop: "extend.dailyLimit",
        valueType: "input"
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
        valueType: "input"
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
    onReset
  };
}
