import { ref } from "vue";
import { ExcelExporter } from "@/components/CgExportExcel";
import { message } from "@/utils/message";
import type { FieldValues } from "plus-pro-components";
import { useFdOt } from "../store";
import { crtDFS } from "./searchConfig";
import { usePagination } from "@/hooks/usePagination";

const store = useFdOt();

const searchParam = ref(crtDFS());

export function useColumns() {
  const dtLst = ref([]);
  const editData = ref();
  const addVis = ref(false);
  const addType = ref(0);
  const marSetVis = ref(false);
  const setVis = ref(false);
  const recVis = ref(false);
  const tranVis = ref(false);

  const {
    loading,
    pagination,
    lodConf,
    adapConf,
    onSzChg,
    onCurChg,
    setLd,
    setTotal
  } = usePagination({
    onPageChange: params => {
      searchParam.value = {
        ...searchParam.value,
        ...params
      };
      getList(searchParam.value);
    }
  });

  const onEd = async (row: any, value: number) => {
    if (value === row.levelSign) return;
    try {
      const params = {
        uid: row.id,
        isThird: value
      };
      const res = await store.ed(params);
      if (res?.code === 0) {
        message("设置成功", { type: "success" });
        getList(searchParam.value);
      } else {
        message(res?.msg || "设置失败", { type: "error" });
        row.levelSign = !value;
      }
    } catch (error) {
      console.error("设置失败:", error);
      message("设置失败", { type: "error" });
      row.levelSign = !value;
    }
  };

  const columns = [
    {
      label: "支付通道ID",
      width: 120,
      prop: "levelName",
      formatter: row => `${row.levelName || "--"}`
    },
    {
      label: "支付通道名称",
      width: 120,
      prop: "minVal",
      formatter: row => `${row.minVal || "--"}`
    },
    {
      label: "支付类型",
      width: 120,
      prop: "members",
      formatter: row => `${row.minVal || "--"} `
    },
    {
      label: "是否匹配交易",
      width: 120,
      prop: "peopleLevel",
      formatter: row => `${row.minVal || "--"}`
    },
    {
      label: "收款姓名",
      width: 120,
      prop: "peopleLevel",
      formatter: row => `${row.minVal || "--"}`
    },
    {
      label: "收款账户 ",
      width: 120,
      prop: "members",
      formatter: row => `${row.minVal || "--"}`
    },
    {
      label: "银行名称 ",
      width: 120,
      prop: "members",
      formatter: row => `${row.minVal || "--"}`
    },
    {
      label: "回执邮箱",
      width: 120,
      prop: "members",
      formatter: row => `${row.minVal || "--"}`
    },
    {
      label: "回执手机号",
      width: 120,
      prop: "members",
      formatter: row => `${row.minVal || "--"}`
    },
    {
      label: "公司回执手机号",
      width: 180,
      prop: "members",
      formatter: row => `${row.minVal || "--"}`
    },
    {
      label: "转出",
      prop: "members",
      formatter: row => `${row.minVal || "--"}`
    },
    {
      label: "余额",
      prop: "members",
      formatter: row => `${row.minVal || "--"}`
    },
    {
      label: "显示状态",
      width: 140,
      prop: "levelSign",
      cellRenderer: ({ row }) => {
        if (row.levelSign === undefined) {
          row.levelSign = 2;
        }
        return (
          <el-switch
            modelValue={row.levelSign}
            onChange={value => {
              if (value !== row.levelSign) {
                onEd(row, value);
              }
            }}
            activeValue={1}
            inactiveValue={2}
            inlinePrompt
            activeText="启用"
            inactiveText="禁用"
            class="ml-2"
          />
        );
      }
    },
    {
      label: "操作",
      width: "220",
      fixed: "right",
      slot: "operation"
    }
  ];

  const setData = (data: any[], total: number) => {
    dtLst.value = data;
    setTotal(total);
    setLd(false);
  };

  const getList = async (params = searchParam.value) => {
    try {
      const res = await store.list(params as object);
      if (res?.code === 0) {
        setData(res.data.list || [], res.data.total || 0);
      } else {
        setData([], 0);
        message("未找到数据", { type: "error" });
      }
    } catch (error) {
      console.error("获取数据失败:", error);
      message("获取数据失败", { type: "error" });
    }
  };

  const onPrmUp = (newParam: any) => {
    searchParam.value = newParam;
    getList(newParam);
  };

  const shwAdd = (type: number) => {
    editData.value = null;
    addType.value = type;
    setTimeout(() => {
      addVis.value = true;
    }, 0);
  };

  const shwSet = async (type: number, row) => {
    const res = await store.info({ id: row.id });
    editData.value = res.data.list;
    editData.value = null;
    addType.value = type;
    setTimeout(() => {
      setVis.value = true;
    }, 0);
  };

  const shwMarSet = (type: number) => {
    editData.value = null;
    addType.value = type;
    setTimeout(() => {
      marSetVis.value = true;
    }, 0);
  };

  const shwRec = async (type: number, row) => {
    const res = await store.info({ id: row.id });
    editData.value = res.data.list;
    editData.value = null;
    addType.value = type;
    setTimeout(() => {
      recVis.value = true;
    }, 0);
  };

  const shwTran = async (type: number, row) => {
    const res = await store.info({ id: row.id });
    editData.value = res.data.list;
    editData.value = null;
    addType.value = type;
    setTimeout(() => {
      tranVis.value = true;
    }, 0);
  };

  const onSucc = async () => {
    addVis.value = false;
    editData.value = null;
    addType.value = 0;
    await getList(searchParam.value);
  };

  const onAddSub = async (formValues: FieldValues) => {
    if (addType.value === 0) {
      await putAdd(formValues);
    } else {
      await putEdit(formValues);
    }
  };

  const putAdd = async (params: any) => {
    try {
      const res = await store.add(params as object);
      if (res?.code === 0) {
        message("新增成功", { type: "success", showClose: true });
        await onSucc();
      } else {
        message("新增失败", { type: "error" });
      }
    } catch (error) {
      console.error("新增失败:", error);
      message("新增失败", { type: "error" });
    }
  };

  const putEdit = async (params: any) => {
    if (!params || !params.id) {
      message("数据异常", { type: "error" });
      return;
    }
    try {
      const res = await store.edit(params);
      if (res?.code === 0) {
        message("修改成功", { type: "success", showClose: true });
        await onSucc();
      } else {
        message(res?.msg || "修改失败", { type: "error" });
      }
    } catch (error) {
      console.error("修改失败:", error);
      message("修改失败", { type: "error" });
    }
  };

  const onDel = async (row: any) => {
    if (!row || !row.id) {
      message("数据异常", { type: "error" });
      return;
    }
    try {
      const params = { id: row.id };
      const res = await store.del(params);
      if (res?.code === 0) {
        message("删除成功", { type: "success", showClose: true });
        await getList(searchParam.value);
      } else {
        message(res?.msg || "删除失败", { type: "error" });
      }
    } catch (error) {
      console.error("删除失败:", error);
      message("删除失败", { type: "error" });
    }
  };

  const expExcel = (data: any[]) => {
    ExcelExporter.exportToExcel({
      columns,
      data,
      fileName: "会员数据报表"
    });
  };

  return {
    loading,
    columns,
    dtLst,
    pagination,
    lodConf,
    adapConf,
    editData,
    addVis,
    addType,
    marSetVis,
    setVis,
    recVis,
    tranVis,
    onSzChg,
    onCurChg,
    expExcel,
    setData,
    getList,
    shwAdd,
    onAddSub,
    onDel,
    onPrmUp,
    shwSet,
    shwMarSet,
    shwRec,
    shwTran
  };
}
