import { ref } from "vue";

import { message } from "@/utils/message";
import type { FieldValues } from "plus-pro-components";
import { usePagination } from "@/hooks/usePagination";
import { fmtTs } from "@/utils/dateFormat";
import { useActiveList } from "../store";
const store = useActiveList();

import { crtDFS } from "./searchConfig";
const searchParam = ref(crtDFS());
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
  const addType = ref(0);

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

  const shwAdd = async (type: number, value) => {
    editData.value = value;
    addType.value = type;
    const infoArr = [1, 2];
    if (infoArr.includes(type)) {
      await onInfo(value);
    }
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

  const onDlogSub = async formData => {
    const cleanedData = { ...formData };
    console.log("提交的表单数据：", cleanedData);
    await onAddSub(formData);
  };

  const onAddSub = async (formData: FieldValues) => {
    if (addType.value === 0) {
      await onAdd(formData);
    } else if (addType.value === 1) {
      await onEdit();
    } else {
      await onInfo(formData);
    }
  };

  const onAdd = async (params: any) => {
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

  const onEdit = async () => {
    if (!editData.value.id) {
      message("数据异常", { type: "error" });
      return;
    }
    try {
      const params = { id: editData.value.id };
      const res = await store.edit(params);
      if (res?.code === 0) {
        message("活动编辑成功", { type: "success", showClose: true });
        await onSucc();
      } else {
        message(res?.msg || "活动编辑失败", { type: "error" });
      }
    } catch (error) {
      console.error("活动编辑失败:", error);
      message("活动编辑失败", { type: "error" });
    }
  };

  const onInfo = async (params: any) => {
    if (!params || !params.id) {
      message("数据异常", { type: "error" });
      return;
    }
    try {
      const res = await store.info({ id: params.id });
      if (res?.code === 0) {
        editData.value = res.data;
        addVis.value = true;
        await onSucc();
      } else {
        message(res?.msg || "获取活动信息失败", { type: "error" });
      }
    } catch (error) {
      console.error("获取活动信息失败:", error);
      message("获取活动信息失败", { type: "error" });
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
        message("活动删除成功", { type: "success", showClose: true });
        await getList(searchParam.value);
        addVis.value = false;
      } else {
        message(res?.msg || "活动删除失败", { type: "error" });
      }
    } catch (error) {
      console.error("活动删除失败:", error);
      message("活动删除失败", { type: "error" });
    }
  };

  const onPub = async (row: any) => {
    if (!row || !row.id) {
      message("数据异常", { type: "error" });
      return;
    }
    try {
      const params = { id: row.id };
      const res = await store.pub(params);
      if (res?.code === 0) {
        message("活动发布成功", { type: "success", showClose: true });
        await getList(searchParam.value);
        addVis.value = false;
      } else {
        message(res?.msg || "活动发布失败", { type: "error" });
      }
    } catch (error) {
      console.error("活动发布失败:", error);
      message("活动发布失败", { type: "error" });
    }
  };

  const onEnd = async (row: any) => {
    if (!row || !row.id) {
      message("数据异常", { type: "error" });
      return;
    }
    try {
      const params = { id: row.id };
      const res = await store.end(params);
      if (res?.code === 0) {
        message("活动结束成功", { type: "success", showClose: true });
        await getList(searchParam.value);
        addVis.value = false;
      } else {
        message(res?.msg || "活动结束失败", { type: "error" });
      }
    } catch (error) {
      console.error("活动结束失败:", error);
      message("活动结束失败", { type: "error" });
    }
  };

  const statusMap = {
    1: { text: "未发布", color: "text-red" },
    2: { text: "未开始 ", color: "text-orange-400" },
    3: { text: "进行中 ", color: "text-green-600" },
    4: { text: "已过期 ", color: "text-gray-600" },
    5: { text: "手动结束 ", color: "text-amber-600" }
  };

  const columns = [
    {
      label: "活动ID",
      prop: "id",
      width: 100,
      formatter: row => `${row.id || "--"}`
    },
    {
      label: "活动名称",
      prop: "name",
      width: 140,
      formatter: row => `${row.name || "--"}`
    },
    {
      label: "活动类型",
      prop: "type",
      width: 90,
      formatter: row => `${row.type || "--"}`
    },
    {
      label: "活动标签",
      prop: "tagID",
      width: 90,
      formatter: row => `${row.tagID || "--"}`
    },
    {
      label: "参与会员",
      prop: "userType",
      width: 90,
      formatter: row => `${row.userType || "--"}`
    },
    {
      label: "排序",
      prop: "sort",
      width: 90,
      formatter: row => `${row.sort || "--"}`
    },
    {
      label: "开始时间/结束时间",
      prop: "startAt",
      width: 310,
      formatter: row =>
        `${fmtTs(row.startAt) || "--"} / ${fmtTs(row.endAt, "YYYY-MM-DD HH:mm:ss.SSS") || "--"}`
    },
    {
      label: "展示起止时间",
      prop: "showStartAt",
      width: 310,
      formatter: row =>
        `${fmtTs(row.showStartAt) || "--"} / ${fmtTs(row.showEndAt, "YYYY-MM-DD HH:mm:ss.SSS") || "--"}`
    },
    {
      label: "操作人",
      prop: "operator",
      width: 90,
      formatter: row => `${row.operator || "--"}`
    },
    {
      label: "最后操作时间",
      prop: "updatedAt",
      width: 160,
      formatter: row =>
        `${fmtTs(row.updatedAt, "YYYY-MM-DD HH:mm:ss.SSS") || "--"} `
    },
    {
      label: "状态",
      prop: "status",
      width: 80,
      cellRenderer: ({ row }) => {
        const status = statusMap[row.status] || {
          text: "--",
          color: "text-gray-400"
        };
        return <span class={`${status.color} font-medium`}>{status.text}</span>;
      }
    },
    {
      label: "操作",
      width: "160",
      fixed: "right",
      slot: "operation"
    }
  ];

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
    addType,
    searchParam,
    getList,
    onSzChg,
    onCurChg,
    onPrmUp,
    shwAdd,
    onAddSub,
    onDel,
    onPub,
    onEnd,
    setData,
    onDlogSub
  };
}
