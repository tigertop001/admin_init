import { ref } from "vue";
import { message } from "@/utils/message";
import { useMemCtrl } from "../store";
import { useSearch, crtDFS } from "./searchConfig";
import { usePagination } from "@/hooks/usePagination";
import { fmtTs } from "@/utils/dateFormat";
import type { FieldValues } from "plus-pro-components";

const store = useMemCtrl();

// 初始查询参数
const searchState = ref(crtDFS);
const { searchVal } = useSearch(searchState.value);
const searchParam = ref(searchVal.value);

export function useColumns() {
  /**
   * 基础数据和状态
   */
  const dataList = ref([]);
  const editData = ref();
  const addVis = ref(false);
  const addType = ref(0);
  const recVis = ref(false);

  // 使用分页 hook
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

  /**
   * 状态映射配置
   */
  const levMap = {
    1: { text: "外层", color: "text-green-600" },
    2: { text: "内层", color: "text-red" },
    3: { text: "VIP层", color: "text-blue-400" }
  };
  /**
   * 表格列配置
   */
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

  // 搜索参数更新
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

  /**
   * 设置数据
   */
  const setData = (data: any[], total: number) => {
    dataList.value = data;
    setTotal(total);
    setLd(false);
  };

  /**
   * 列表
   */
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

  /**
   * 弹窗相关方法
   */
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

  /**
   * 弹窗相关方法
   */
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
    // 状态
    loading,
    columns,
    dataList,
    pagination,
    lodConf,
    adapConf,
    addVis,
    editData,
    addType,
    recVis,
    currUid,
    showRec,
    // 方法
    onSzChg,
    onCurChg,
    setData,
    getList,
    onPrmUp,
    shwAdd,
    onAddSub
  };
}
