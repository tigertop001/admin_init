import { ref } from "vue";
// import { message } from "@/utils/message";
// import { useActiveList } from "../../../form/store";

export interface SearchEmits {
  "update:modelValue": (param: Record<string, any>) => void;
}

export function useColumns(emit: (event: string, ...args: any[]) => void) {
  const dtLst = ref([
    {
      icon: "icon1",
      amount: { min: null, max: null },
      weight: null,
      title: "未中奖",
      type: 1
    },
    {
      icon: "icon2",
      amount: { min: null, max: null },
      weight: null,
      title: "奖金1",
      type: 2
    },
    {
      icon: "icon3",
      amount: { min: null, max: null },
      weight: null,
      title: "随机金额",
      type: 2
    },
    {
      icon: "icon4",
      amount: { min: null, max: null },
      weight: null,
      title: "奖金50",
      type: 2
    },
    {
      icon: "icon5",
      amount: { min: null, max: null },
      weight: null,
      title: "随机金额",
      type: 2
    },
    {
      icon: "icon6",
      amount: { min: null, max: null },
      weight: null,
      title: "奖金",
      type: 2
    },
    {
      icon: "icon7",
      amount: { min: null, max: null },
      weight: null,
      title: "奖金1000",
      type: 2
    },
    {
      icon: "icon8",
      amount: { min: null, max: null },
      weight: null,
      title: "立即提现",
      type: 2
    }
  ]);

  const onInpChg = (value: string, row: any, field?: string) => {
    const index = dtLst.value.indexOf(row);
    if (index !== -1) {
      if (field === "amount.min" || field === "amount.max") {
        const [parent, child] = field.split(".");
        dtLst.value[index][parent][child] = value;
      } else {
        dtLst.value[index][field] = value;
      }
      onChg(row);
    }
  };

  const onChg = (row: any) => {
    const index = dtLst.value.indexOf(row);
    if (index !== -1) {
      const formattedData = dtLst.value.map(
        ({ amount, icon, weight, title, type }) => ({
          icon: icon,
          amount: {
            min: Number(amount.min) || 0,
            max: Number(amount.max) || 0
          },
          weight: Number(weight) || 0,
          title: title,
          type: type
        })
      );
      emit("update:modelValue", formattedData);
    }
  };

  const columns = [
    {
      label: "图标",
      prop: "icon",
      width: 80,
      cellRenderer: ({ row }) => (
        <div class="flex items-center justify-center">
          <el-input modelValue={row.icon} class="w-[115px]" readonly disabled />
        </div>
      )
    },
    {
      label: "随机金额范围",
      prop: "amount",
      width: 230,
      cellRenderer: ({ row }) => (
        <div class="flex items-center gap-2">
          <el-input
            v-model={row.amount.min}
            type="number"
            class="w-[115px]"
            placeholder="最小金额"
            onInput={value => onInpChg(value, row, "amount.min")}
          />
          <span>-</span>
          <el-input
            v-model={row.amount.max}
            type="number"
            class="w-[115px]"
            placeholder="最大金额"
            onInput={value => onInpChg(value, row, "amount.max")}
          />
        </div>
      )
    },
    {
      label: "权重",
      prop: "weight",
      width: 75,
      cellRenderer: ({ row }) => (
        <el-input
          v-model={row.weight}
          type="copy"
          placeholder="权重"
          onInput={value => onInpChg(value, row)}
        />
      )
    },
    {
      label: "标题",
      prop: "title",
      width: 110,
      cellRenderer: ({ row }) => (
        <el-input
          v-model={row.title}
          type="input"
          placeholder="权重"
          onInput={value => onInpChg(value, row)}
        />
      )
    },
    {
      label: "类型",
      prop: "type",
      width: 54
    }
  ];

  return {
    columns,
    dtLst,
    onChg
  };
}
