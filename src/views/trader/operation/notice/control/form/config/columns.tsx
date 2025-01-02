import { ref } from "vue";
import { message } from "@/utils/message";
import { useMemCtrl } from "../store";
import { useSearch, crtDFS } from "./searchConfig";
import { usePagination } from "@/hooks/usePagination";
import { fmtTs } from "@/utils/dateFormat";
import type { FieldValues } from "plus-pro-components";

const store = useMemCtrl();

const searchState = ref(crtDFS);
const { searchVal } = useSearch(searchState.value);
const searchParam = ref(searchVal.value);

export function useColumns() {
  const dtLst = ref([]);
  const editData = ref();
  const addVis = ref(false);
  const addType = ref(0);
  const recVis = ref(false);

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

  const levMap = {
    1: { text: "外层", color: "text-green-600" },
    2: { text: "内层", color: "text-red" },
    3: { text: "VIP层", color: "text-blue-400" }
  };

  const columns = [
    {
      label: "UID/用户名",
      prop: "id",
      formatter: row => `${row.uid || "--"} / ${row.account || "--"}`
    },
    {
      label: "层级名称",
      prop: "levelName",
      formatter: row => `${row.levelName || "--"}`
    },
    {
      label: "内层/外层",
      prop: "levelSign",
      cellRenderer: ({ row }) => {
        const status = levMap[row.status] || {
          text: "--",
          color: "text-gray-400"
        };
        return <span class={`${status.color} font-medium`}>{status.text}</span>;
      }
    },
    {
      label: "当月存款金额",
      prop: "applyTime",
      formatter: row =>
        `${fmtTs(row.applyTime, "YYYY-MM-DD HH:mm:ss.SSS") || "--"}`
    },
    {
      label: "操作时间",
      prop: "totalSave",
      formatter: row =>
        `${fmtTs(row.regTime, "YYYY-MM-DD HH:mm:ss.SSS")}/${row.regIp || "--"}`
    },
    {
      label: "修改前/后",
      prop: "moneyLeft",
      formatter: row =>
        `${row.changeBefore || "--"} / ${row.changeAfter || "--"}`
    },
    {
      label: "备注",
      prop: "status",
      formatter: row =>
        `${row.changeBefore || "--"} / ${row.changeAfter || "--"}`
    },
    {
      label: "操作",
      width: "220",
      fixed: "right",
      slot: "operation"
    }
  ];

  const onPrmUp = (newParam: any) => {
    if (
      Object.keys(newParam).length === 2 &&
      newParam.page &&
      newParam.pageSize
    ) {
      return;
    }
    searchParam.value = newParam;
    getList(newParam);
  };

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

  const shwAdd = (type: number, row?: any) => {
    if (type === 0) {
      editData.value = row;
    }
    addType.value = type;
    setTimeout(() => {
      addVis.value = true;
    }, 0);
  };
  const onSucc = async () => {
    addVis.value = false;
    editData.value = null;
    addType.value = 0;
    await getList(searchParam.value);
  };

  const currUid = ref<number>();

  const showRec = (row: any) => {
    currUid.value = row.uid;
    setTimeout(() => {
      recVis.value = true;
    }, 0);
  };
  /**
   * CRUD操作方法
   */
  const onAddSub = async (formValues: FieldValues) => {
    if (addType.value === 0) {
      await putAdd(formValues);
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

  return {
    loading,
    columns,
    dtLst,
    pagination,
    lodConf,
    adapConf,
    addVis,
    editData,
    addType,
    recVis,
    currUid,
    showRec,

    onSzChg,
    onCurChg,
    setData,
    getList,
    onPrmUp,
    shwAdd,
    onAddSub
  };
}
