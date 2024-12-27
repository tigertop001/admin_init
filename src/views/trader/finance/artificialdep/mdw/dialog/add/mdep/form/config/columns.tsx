import { ref, computed } from "vue";
import type { PlusColumn } from "plus-pro-components";
import { COMM_RULES } from "../../utils/rules";

export function useColumns() {
  const setFormData = (data: any) => {
    Object.assign(state.value, {
      remark: data.remark
    });
  };

  const state = ref({
    amount: null,
    account: null,
    remark: null,
    type: null
  });

  const getColumns = (): PlusColumn[] => {
    const baseColumns: PlusColumn[] = [
      {
        label: " 充值金额",
        labelWidth: 124,
        prop: "amount",
        valueType: "input",
        rules: COMM_RULES.name
      },
      {
        label: "收款账户",
        labelWidth: 124,
        prop: "account",
        valueType: "input",
        rules: COMM_RULES.name
      },
      {
        label: "支付方式",
        labelWidth: 124,
        prop: "type",
        valueType: "radio",
        rules: COMM_RULES.walletType,
        options: [
          {
            label: "PIX1",
            value: 1
          },
          {
            label: "PIX2",
            value: 2
          }
        ]
      }
    ];

    baseColumns.push({
      label: "备注",
      labelWidth: 124,
      prop: "remark",
      valueType: "textarea"
    });

    return baseColumns;
  };

  const columns = computed(() => getColumns());

  const onChg = (values, prop) => {
    if (prop.prop === "type" && values.type === 1) {
      state.value.remark = null;
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
    setFormData
  };
}
