import { ref } from "vue";
import { ExcelExporter } from "@/components/CgExportExcel";
import { message } from "@/utils/message";
import type { FieldValues } from "plus-pro-components";
import { useMemSet } from "../store";
import { crtDFS } from "./searchConfig";
import { usePagination } from "@/hooks/usePagination";

const store = useMemSet();

const searchParam = ref(crtDFS());

export function useColumns() {
  const dtLst = ref([]);
  const editData = ref();
  const addVis = ref(false);
  const addType = ref(0);

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
   * 内层/外层态映射配置
   */
  const levMap = {
    1: { text: "外层", color: "text-green-600" },
    2: { text: "内层", color: "text-red" },
    3: { text: "VIP层", color: "text-blue-400" }
  };

  /**
   * 人工分层映射配置
   */
  const peopleLevelMap = {
    1: { text: "是", color: "text-green-600" },
    2: { text: "否", color: "text-red" }
  };

  const columns = [
    {
      label: "层级名称",
      prop: "levelName",
      formatter: row => `${row.levelName || "--"}`
    },
    {
      label: "当月存款金额",
      prop: "minVal",
      formatter: row => `${row.minVal || "--"} - ${row.maxVal || "--"}  `
    },
    {
      label: "人工分层",
      prop: "peopleLevel",
      cellRenderer: ({ row }) => {
        const peopleLevel = peopleLevelMap[row.peopleLevel] || {
          text: "--",
          color: "text-gray-400"
        };
        return (
          <span class={`${peopleLevel.color} font-medium`}>
            {peopleLevel.text}
          </span>
        );
      }
    },
    {
      label: "会员人数",
      prop: "members"
    },
    {
      label: "内层/外层",
      prop: "levelSign",
      cellRenderer: ({ row }) => {
        const evelSign = levMap[row.levelSign] || {
          text: "--",
          color: "text-gray-400"
        };
        return (
          <span class={`${evelSign.color} font-medium`}>{evelSign.text}</span>
        );
      }
    },
    {
      label: "备注",
      prop: "remark",
      formatter: row => `${row.remark || "--"}`
    },
    {
      label: "操作",
      width: "180",
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

  const shwAdd = (type: number) => {
    if (type === 0) {
      editData.value = null;
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
   * CRUD操作方法
   */
  const onEdit = (row: any) => {
    editData.value = row;
    shwAdd(1);
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

  /**
   * 导出功能
   */
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
    onSzChg,
    onCurChg,
    expExcel,
    setData,
    getList,
    shwAdd,
    onEdit,
    onAddSub,
    onDel
  };
}
