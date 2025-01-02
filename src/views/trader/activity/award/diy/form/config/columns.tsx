import { ref, type Ref } from "vue";
import { message } from "@/utils/message";
import type { FieldValues } from "plus-pro-components";
import { usePagination } from "@/hooks/usePagination";
import { fmtTs } from "@/utils/dateFormat";
import { useAwd } from "../../../comm/form/store";
const store = useAwd();

import { useSearch } from "./searchConfig";

export function useColumns(activeType: Ref<number>) {
  const { searchVal } = useSearch((event: string, ...args: any[]) => {
    if (event === "update:param") {
      searchParam.value = args[0];
      getList(args[0]);
    }
  }, activeType.value);
  const searchParam = ref(searchVal.value);

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

  const statusMap = {
    1: { text: "待发放", color: "text-yellow-500" },
    2: { text: "已发放", color: "text-green-500" },
    3: { text: "审核中", color: "text-blue-500" },
    4: { text: "已取消", color: "text-orange-400" },
    5: { text: "发放中", color: "text-red-500" }
  };

  const columns = [
    {
      label: "活动ID",
      prop: "activityID",
      width: 100,
      formatter: row => `${row.activityID || "--"}`
    },
    {
      label: "活动名称",
      prop: "name",
      formatter: row => `${row.name || "--"}`
    },
    {
      label: "发放会员数量",
      prop: "statistic",
      formatter: row => `${row.statistic || "--"}`
    },
    {
      label: "领取会员数量",
      prop: "sort",
      formatter: row => `${row.sort || "-暂无接口字段，需求有疑问-"}`
    },
    {
      label: "领取金额",
      prop: "rewardAmount",
      formatter: row => `${row.rewardAmount || "--"}`
    },
    {
      label: "状态",
      prop: "status",
      cellRenderer: ({ row }) => {
        const status = statusMap[row.status] || {
          text: "--",
          color: "text-gray-400"
        };
        return <span class={`${status.color} font-medium`}>{status.text}</span>;
      }
    },
    {
      label: "操作人",
      prop: "operator",
      formatter: row => `${row.operator || "--"}`
    },
    {
      label: "最后操作时间",
      prop: "updatedAt",
      sortable: true,
      formatter: row =>
        `${fmtTs(row.updatedAt, "YYYY-MM-DD HH:mm:ss.SSS") || "--"}`
    },
    {
      label: "备注",
      prop: "remark",
      formatter: row => `${row.remark || "--"}`
    },
    {
      label: "操作",
      width: 200,
      fixed: "right",
      slot: "operation"
    }
  ];

  const getList = async (params = searchParam.value) => {
    try {
      const reqPrms = {
        ...params,
        type: Number(params.type || activeType.value)
      };
      const res = await store.list(reqPrms as object);
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

  const updateType = (newType: number) => {
    searchParam.value.type = newType;
    getList(searchParam.value);
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

  const onEdit = (row: any) => {
    editData.value = row;
    shwAdd(1);
  };
  /**
   *
   * @param row 详情
   */
  const onDtls = (row: any) => {
    editData.value = row;
    shwAdd(2);
  };

  const onAddSub = async (formValues: FieldValues) => {
    if (addType.value === 0) {
      await putAdd(formValues);
    } else if (addType.value === 1) {
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

  /**
   * 自定义活动发放/取消
   */
  const onCxl = async (row: any) => {
    if (!row || !row.id) {
      message("数据异常", { type: "error" });
      return;
    }
    let str = "取消";
    let status = row.status;
    if (row.status == 1) {
      str = "发放";
      status = 5;
    }
    if (row.status == 5) {
      str = "取消";
      status = 4;
    }
    try {
      const params = { id: row.id, status: status };
      const res = await store.diyCxl(params);
      if (res?.code === 0) {
        message(`${str}成功`, { type: "success", showClose: true });
        await getList(searchParam.value);
      } else {
        message(res?.msg || `${str}失败`, { type: "error" });
      }
    } catch (error) {
      console.error(`${str}失败`, error);
      message(`${str}失败`, { type: "error" });
    }
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
    addType,
    onSzChg,
    onCurChg,
    getList,
    onPrmUp,
    shwAdd,
    onEdit,
    onAddSub,
    setData,
    onDtls,
    updateType,
    onCxl
  };
}
