import { ref } from "vue";
import { message } from "@/utils/message";
import type { FieldValues } from "plus-pro-components";
import { usePagination } from "@/hooks/usePagination";
import { fmtTs } from "@/utils/dateFormat";
import { useMemBlack } from "../store";
const store = useMemBlack();

import { useSearch, crtDFS } from "./searchConfig";
const searchState = ref(crtDFS);
const { searchVal } = useSearch(searchState.value);
const searchParam = ref(searchVal.value);

export function useColumns() {
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

  const dtLst = ref([]);
  const editData = ref();
  const addVis = ref(false);

  const columns = [
    {
      label: "序号",
      prop: "id",
      width: 100,
      cellRenderer: ({ index }) => <p>{index + 1}</p>
    },
    {
      label: "UID/用户名",
      prop: "id",
      formatter: row => `${row.uid || "--"}/${row.account || "--"}`
    },
    {
      label: "真实姓名",
      prop: "uname",
      formatter: row => `${row.uname || "--"}`
    },
    {
      label: "备注",
      prop: "rmark",
      formatter: row => `${row.rmark || "--"}`
    },
    {
      label: "时间",
      prop: "addTime",
      sortable: true,
      formatter: row =>
        `${fmtTs(row.addTime, "YYYY-MM-DD HH:mm:ss.SSS") || "--"}`
    },
    {
      label: "操作人",
      prop: "operator",
      formatter: row => `${row.operator || "--"}`
    },
    {
      label: "操作",
      fixed: "right",
      slot: "operation"
    }
  ];

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

  const shwAdd = () => {
    editData.value = null;
    setTimeout(() => {
      addVis.value = true;
    }, 0);
  };

  const onSucc = async () => {
    addVis.value = false;
    editData.value = null;
    await getList(searchParam.value);
  };

  const onAddSub = async formValues => {
    try {
      const uid = Number(formValues.uids);
      const data = { uid: uid, remark: formValues.remark };
      const res = await store.add(data);
      if (res?.code === 0) {
        message("操作成功", { type: "success", showClose: true });
        await onSucc();
      } else {
        message(res?.msg || "操作失败", { type: "error" });
      }
    } catch (error) {
      console.error("操作失败:", error);
      message("操作失败", { type: "error" });
    }
  };
  const onFrzn = async (formValues: FieldValues) => {
    try {
      const params = {
        id: formValues.id
      };
      let res;
      res = await store.frzn(params);

      if (res?.code === 0) {
        message("操作成功", { type: "success", showClose: true });
        await getList(searchParam.value);
      } else {
        message("操作失败", { type: "error" });
      }
    } catch (error) {
      console.error("操作失败:", error);
      message("操作失败", { type: "error" });
    }
    addVis.value = false;
  };

  const setData = (data: any[], total: number) => {
    dtLst.value = data;
    setTotal(total);
    setLd(false);
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
    onSzChg,
    onCurChg,
    getList,
    onPrmUp,
    shwAdd,
    onAddSub,
    setData,
    onFrzn
  };
}
