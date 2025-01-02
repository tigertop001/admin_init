import { computed, ref } from "vue";
import type { PlusColumn } from "plus-pro-components";
import { COMM_RULES } from "../../utils/rules";

// 定义 useColumns hook
export function useColumns() {
  const state = ref({
    channel: null,
    accountID: null,
    account: "王小美 434233432433432  PIX", // 存储的是 account 的 label
    amount: null,
    remark: null,
    uid: null,
    name: null
  });

  const getColumns = (): PlusColumn[] => {
    const baseColumns: PlusColumn[] = [
      {
        label: "提现渠道",
        labelWidth: 124,
        prop: "channel",
        valueType: "select",
        rules: COMM_RULES.name,
        options: [
          { label: "银行卡", value: 1 },
          { label: "PIX", value: 2 }
        ]
      },
      {
        label: "提现账户",
        labelWidth: 124,
        prop: "accountID",
        valueType: "radio",
        options: [
          { label: "王小美 434233432433432  PIX", value: 1 },
          { label: "王小美 3293939393939939 PIX", value: 2 }
        ]
      },
      {
        label: "提现金额",
        labelWidth: 124,
        prop: "amount",
        valueType: "input"
      },
      {
        label: "备注",
        labelWidth: 124,
        prop: "remark",
        valueType: "input"
      }
    ];

    return baseColumns;
  };

  const columns = computed(() => getColumns());

  const getAccountLabel = (accountID: number | null): string | null => {
    const accountColumn = columns.value.find(col => col.prop === "accountID");
    if (accountColumn && accountColumn.options) {
      const selectedOption = (
        accountColumn.options as { label: string; value: number }[]
      ).find(option => option.value === accountID);
      return selectedOption ? selectedOption.label : null;
    }
    return null;
  };

  // 更新表单数据
  const setData = (data: any) => {
    const accountLabel = getAccountLabel(data.accountID);

    Object.assign(state.value, {
      amount: data.amount,
      account: accountLabel,
      accountID: data.accountID,
      remark: data.remark,
      channel: data.channel
    });
  };

  const onChg = (values: any, prop: any) => {
    if (prop.prop === "type" && values.type === 1) {
      state.value.remark = null;
    }
  };

  const onSub = (values: any) => {
    const accountLabel = getAccountLabel(state.value.accountID);
    console.log("Account Label:", accountLabel);
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
