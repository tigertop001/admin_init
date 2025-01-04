import { ref } from "vue";
import { ExcelExporter } from "@/components/CgExportExcel";
import { message } from "@/utils/message";
import type { FieldValues } from "plus-pro-components";
import { useOpNmar } from "../store";
import { crtDFS } from "./searchConfig";
import { usePagination } from "@/hooks/usePagination";
import { fmtTs } from "@/utils/dateFormat";

const store = useOpNmar();

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

  const onEd = async (row: any, value: number) => {
    if (value === row.publishStatus) return;
    try {
      const params = {
        id: row.id,
        openStatus: row.openStatus == 1 ? 2 : 1
      };
      const res = await store.ed(params);
      if (res?.code === 0) {
        message("设置成功", { type: "success" });
        getList(searchParam.value);
      } else {
        message(res?.msg || "设置失败", { type: "error" });
        row.publishStatus = !value;
      }
    } catch (error) {
      console.error("设置失败:", error);
      message("设置失败", { type: "error" });
      row.publishStatus = !value;
    }
  };

  const columns = [
    {
      label: "ID",
      prop: "id",
      formatter: row => `${row.id || "--"}`
    },
    {
      label: "内容",
      prop: "content",
      formatter: row => `${row.content || "--"}`
    },
    {
      label: "收件人",
      prop: "receiverType",
      // formatter: row => `${row.receiverType || "--"}`
      cellRenderer: ({ row }) => {
        const receiverType = receiverTypeMap[row.receiverType] || {
          text: "--"
        };
        return <span>{receiverType.text}</span>;
      }
    },
    {
      label: "开始时间",
      prop: "sendAt",
      formatter: row =>
        `${fmtTs(row.sendAt, "YYYY-MM-DD HH:mm:ss.SSS") || "--"}`
    },
    {
      label: "结束时间",
      prop: "endAt",
      formatter: row => `${fmtTs(row.endAt, "YYYY-MM-DD HH:mm:ss.SSS") || "--"}`
    },
    {
      label: "排序",
      prop: "sort",
      formatter: row => `${row.sort || "--"}`
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
      label: "启/停用",
      width: 140,
      prop: "openStatus",
      cellRenderer: ({ row }) => {
        if (row.openStatus === undefined) {
          row.openStatus = 2;
        }
        return (
          <el-switch
            modelValue={row.openStatus}
            onChange={value => {
              if (value !== row.openStatus) {
                console.log(value, "---", row.openStatus);
                onEd(row, value);
              }
            }}
            activeValue={1}
            inactiveValue={2}
            inlinePrompt
            activeText="启用"
            inactiveText="停用"
            class="ml-2"
          />
        );
      }
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
      width: "200",
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

  const onEdit = async (row: any) => {
    // const res = await store.info({ id: row.id });
    // editData.value = res.data.list;
    // shwAdd(1);
    editData.value = row;
    shwAdd(1);
  };

  // 详情
  const onDet = (row: any) => {
    editData.value = row;
    shwAdd(3);
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
        message("跑马灯发布成功", { type: "success", showClose: true });
        await getList(searchParam.value);
        addVis.value = false;
      } else {
        message(res?.msg || "跑马灯发布失败", { type: "error" });
      }
    } catch (error) {
      console.error("跑马灯发布失败:", error);
      message("跑马灯发布失败", { type: "error" });
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
    onDet
  };
}
