import { ref } from "vue";
import type { ConditionItem } from "./types";

export interface SearchEmits {
  "update:modelValue": (param: Record<string, any>) => void;
}

export function useColumns(emit: (event: string, ...args: any[]) => void) {
  const dtLst = ref<ConditionItem[]>([]);

  const onInpChg = (value: string, row: any) => {
    dtLst.value.findIndex(item => item.id === row.id);
  };

  const onChg = () => {
    {
      const formattedData = dtLst.value.map(({ amount, ratio, vipLv }) => ({
        amount: Number(amount) || 0,
        ratio: Number(ratio) || 0,
        vipLv: Number(vipLv) || 0
      }));
      emit("update:modelValue", formattedData);
    }
  };

  const vipOptions = [
    { label: "VIP1", value: 1 },
    { label: "VIP2", value: 2 },
    { label: "VIP3", value: 3 },
    { label: "VIP4", value: 4 },
    { label: "VIP5", value: 5 },
    { label: "VIP6", value: 6 },
    { label: "VIP7", value: 7 },
    { label: "VIP8", value: 8 },
    { label: "VIP9", value: 9 },
    { label: "VIP10", value: 10 }
  ];

  const columns = [
    {
      label: "VIP等级",
      prop: "vipLv",
      cellRenderer: ({ row }) => (
        <el-select
          v-model={row.vipLv}
          placeholder="请选择VIP等级"
          onChange={value => onInpChg(value, row)}
        >
          {vipOptions.map(option => (
            <el-option
              key={option.value}
              label={option.label}
              value={option.value}
            />
          ))}
        </el-select>
      )
    },
    {
      label: "负盈利金额",
      prop: "amount",
      cellRenderer: ({ row }) => (
        <el-input
          v-model={row.amount}
          type="number"
          placeholder="请输入存款金额"
          onInput={value => onInpChg(value, row)}
        />
      )
    },
    {
      label: "返利比例(%)",
      prop: "ratio",
      cellRenderer: ({ row }) => (
        <el-input
          v-model={row.ratio}
          type="number"
          placeholder="请输入比例"
          onInput={value => onInpChg(value, row)}
        />
      )
    },
    {
      label: "操作",
      fixed: "right",
      width: 70,
      slot: "operation"
    }
  ];

  function onAdd() {
    dtLst.value.push({
      id: dtLst.value.length + 1,
      amount: null,
      ratio: null,
      vipLv: null
    });
    onChg();
  }

  function onDel(row: ConditionItem) {
    const index = dtLst.value.indexOf(row);
    if (index !== -1) {
      dtLst.value.splice(index, 1);
      onChg();
    }
  }

  return {
    columns,
    dtLst,
    onAdd,
    onDel,
    onChg
  };
}
