import { ref } from "vue";
import { ExcelExporter } from "@/components/CgExportExcel";
import { message } from "@/utils/message";
import type { FieldValues } from "plus-pro-components";
import { useOpNsil } from "../store";
import { crtDFS } from "./searchConfig";
import { usePagination } from "@/hooks/usePagination";
import { fmtTs } from "@/utils/dateFormat";

const store = useOpNsil();

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

  const redirectTypeMap = {
    1: { text: "指定游戏" },
    2: { text: "内部界面" },
    3: { text: "指定活动详情" },
    4: { text: "外部链接" }
  };

  const onEd = async (row: any, value: boolean) => {
    if (value === row.status) return;
    try {
      const params = {
        id: row.id
      };
      const res = await store.ed(params);
      if (res?.code === 0) {
        message("设置成功", { type: "success" });
        getList(searchParam.value);
      } else {
        message(res?.msg || "设置失败", { type: "error" });
        row.status = !value;
      }
    } catch (error) {
      console.error("设置失败:", error);
      message("设置失败", { type: "error" });
      row.status = !value;
    }
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
      label: "缩略图",
      prop: "url",
      slot: "image",
      formatter: row => `${row.url || "--"}`
    },
    {
      label: "跳转类型",
      prop: "redirectType",
      cellRenderer: ({ row }) => {
        const redirectType = redirectTypeMap[row.redirectType] || {
          text: "--"
        };
        // return <span>{redirectType.text}</span>;
        return (
          <span>
            {row.isRedirect
              ? `${redirectType.text} ${row.redirectTo ? "-" + row.redirectTo : ""}`
              : "不跳转"}
          </span>
        );
      }
    },
    {
      label: "排序",
      prop: "sort",
      formatter: row => `${row.sort || "--"} `
    },
    {
      label: "操作人",
      prop: "operator",
      formatter: row => `${row.operator || "--"} `
    },
    {
      label: "最后操作时间 ",
      prop: "updatedAt",
      formatter: row =>
        `${fmtTs(row.updatedAt, "YYYY-MM-DD HH:mm:ss.SSS") || "--"}`
    },
    {
      label: "状态",
      width: 140,
      prop: "status",
      cellRenderer: ({ row }) => {
        if (row.status === undefined) {
          row.status = 2;
        }
        return (
          <el-switch
            modelValue={row.status}
            onChange={value => {
              if (value !== row.status) {
                onEd(row, value);
              }
            }}
            activeValue={true}
            inactiveValue={false}
            inlinePrompt
            activeText="启用"
            inactiveText="停用"
            class="ml-2"
          />
        );
      }
    },
    {
      label: "操作",
      width: "150",
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
    onPrmUp
  };
}
