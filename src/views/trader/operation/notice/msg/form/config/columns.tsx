import { ref } from "vue";
import { ExcelExporter } from "@/components/CgExportExcel";
import { message } from "@/utils/message";
import type { FieldValues } from "plus-pro-components";
import { useOpNmsg } from "../store";
import { crtDFS } from "./searchConfig";
import { usePagination } from "@/hooks/usePagination";
import { fmtTs } from "@/utils/dateFormat";

const store = useOpNmsg();

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

  const receiverTypeMap = {
    1: { text: "所有用户" },
    2: { text: "指定用户" }
  };

  const statusMap = {
    1: { text: "未发布", color: "text-yellow-500" },
    2: { text: "待发布", color: "text-green-600" },
    3: { text: "已发送", color: "text-blue-500" },
    4: { text: "已撤回", color: "text-red" }
  };

  const columns = [
    {
      label: "ID",
      prop: "id",
      formatter: row => `${row.id || "--"}`
    },
    {
      label: "标题",
      prop: "title",
      formatter: row => `${row.title || "--"}`
    },
    {
      label: "内容",
      prop: "content",
      formatter: row => `${row.content || "--"}`
    },
    {
      label: "收件人",
      prop: "receiverType",
      cellRenderer: ({ row }) => {
        const receiverType = receiverTypeMap[row.receiverType] || {
          text: "--"
        };
        return <span>{receiverType.text}</span>;
      }
    },
    {
      label: "发送时间",
      prop: "sendAt",
      formatter: row =>
        `${fmtTs(row.sendAt, "YYYY-MM-DD HH:mm:ss.SSS") || "--"}`
    },
    {
      label: "操作人",
      prop: "operator",
      formatter: row => `${row.operator || "--"}`
    },
    {
      label: "最后操作时间",
      prop: "updatedAt",
      formatter: row =>
        `${fmtTs(row.updatedAt, "YYYY-MM-DD HH:mm:ss.SSS") || "--"}`
    },
    {
      label: "已读/发送",
      prop: "remark",
      formatter: row => `${row.readNum || "--"} / ${row.sendNum || "--"}`
    },
    {
      label: "状态",
      prop: "publishStatus",
      cellRenderer: ({ row }) => {
        const status = statusMap[row.publishStatus] || {
          text: "--",
          color: "text-gray-400"
        };
        return <span class={`${status.color} font-medium`}>{status.text}</span>;
      }
    },
    {
      label: "操作",
      width: "250",
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

  const onPub = async (row: any) => {
    if (!row || !row.id) {
      message("数据异常", { type: "error" });
      return;
    }
    try {
      const params = { id: row.id, publishStatus: 2 };
      const res = await store.pub(params);
      if (res?.code === 0) {
        message("发布成功", { type: "success", showClose: true });
        await getList(searchParam.value);
        addVis.value = false;
      } else {
        message(res?.msg || "发布失败", { type: "error" });
      }
    } catch (error) {
      console.error("发布失败:", error);
      message("发布失败", { type: "error" });
    }
  };

  // 撤回
  const onRev = async (row: any) => {
    if (!row || !row.id) {
      message("数据异常", { type: "error" });
      return;
    }
    try {
      const params = { id: row.id, publishStatus: 1 };
      const res = await store.pub(params);
      if (res?.code === 0) {
        message("撤回成功", { type: "success", showClose: true });
        await getList(searchParam.value);
        addVis.value = false;
      } else {
        message(res?.msg || "撤回失败", { type: "error" });
      }
    } catch (error) {
      console.error("撤回失败:", error);
      message("撤回失败", { type: "error" });
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
    onDel,
    onPrmUp,
    onPub,
    onRev
  };
}
