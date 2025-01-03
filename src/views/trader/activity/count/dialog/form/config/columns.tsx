import { computed, ref, onMounted } from "vue";
import type { FieldValues } from "plus-pro-components";
import { useWwdpay } from "../store";

export const useColumns = (
  props: {
    visible: boolean;
    curData?: FieldValues;
  },
  emit: {
    (_e: "submit", _formValues: FieldValues): void;
    (_e: "update:visible", _visible: boolean): void;
  }
) => {
  const store = useWwdpay();
  const tableData = ref([]);
  const dialogVisible = computed({
    get: () => props.visible,
    set: val => emit("update:visible", val)
  });

  const onCls = (done: () => void) => {
    done();
  };
  const getList = async () => {
    try {
      const res = await store.list({});
      if (res?.code === 0) {
        tableData.value = res.data?.list || [];
      }
    } catch (error) {
      console.error("获取数据失败:", error);
    }
  };

  const onSubmit = async () => {
    try {
      const res = await store.send(tableData.value);
      if (res?.code === 0) {
        dialogVisible.value = false;
      }
    } catch (error) {
      console.error("提交失败:", error);
    }
  };

  onMounted(() => {
    getList();
  });

  const height = ref<number>(400);

  const columns = [
    {
      label: "代付通道",
      prop: "channel",
      valueType: "select",
      cellRenderer: ({ row }) => {
        const options = [
          { label: "通道一", value: 1 },
          { label: "通道二", value: 2 },
          { label: "通道三", value: 3 }
        ];
        return (
          <el-select
            modelValue={row.channel}
            onChange={value => {
              row.channel = value;
            }}
          >
            {options.map(opt => (
              <el-option key={opt.value} label={opt.label} value={opt.value} />
            ))}
          </el-select>
        );
      }
    },
    {
      label: "单号",
      prop: "name"
    },
    {
      label: "用户名",
      prop: "state"
    },
    {
      label: "提现账号",
      prop: "city",
      formatter: row =>
        `${row.ip || "--"}/${row.area || "--"}/${row.area || "--"}/${row.area || "--"}`
    },
    {
      label: "提现类型/打款金额",
      prop: "address",
      formatter: row => `${row.ip || "--"}/${row.area || "--"}`
    }
  ];

  return {
    dialogVisible,
    onCls,
    height,
    columns,
    tableData,
    onSubmit
  };
};
