import { ref, computed } from "vue";
import type { PlusColumn } from "plus-pro-components";
import { COMM_RULES } from "../../utils/rules";

export function useColumns() {
  const setFormData = (data: any) => {
    Object.assign(state.value, {
      orderNum: data.orderNum,
      amount: data.amount,
      remark: data.remark
    });
  };

  const state = ref({
    orderNum: null,
    amount: null,
    remark: null
  });

  const getColumns = (): PlusColumn[] => [
    {
      label: "误操作订单号",
      labelWidth: 124,
      prop: "orderNum",
      valueType: "input",
      rules: COMM_RULES.name
    },
    {
      label: "充值金额",
      labelWidth: 124,
      prop: "amount",
      valueType: "input",
      rules: COMM_RULES.name
    },
    {
      label: " ",
      labelWidth: 124,
      prop: "quickAmount",
      valueType: "input",
      hasLabel: false,
      renderField: ({}: any) => (
        <div class="grid grid-cols-4 gap-3 [&_.el-button]:!ml-0">
          {[50, 100, 200, 500, 1000, 2000, 5000, 10000].map(amount => (
            <el-button
              key={amount}
              onClick={() => {
                state.value.amount = amount;
              }}
              class={[
                "w-20 text-center !ml-0",
                Number(state.value.amount) === amount
                  ? "!bg-orange-50 !text-orange !border-orange font-medium"
                  : "hover:text-orange hover:border-orange"
              ]}
            >
              {amount}
            </el-button>
          ))}
        </div>
      )
    },
    {
      label: "备注",
      labelWidth: 124,
      prop: "remark",
      valueType: "textarea"
    }
  ];

  const columns = computed(() => getColumns());

  const onChg = (values: any, prop: any) => {
    console.log("values:", values);
    console.log("prop:", prop);
  };

  const onSub = (values: any) => {
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
