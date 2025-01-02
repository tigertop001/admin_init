import { ref } from "vue";
import { message } from "@/utils/message";
import { useMemship } from "../store";
import { useSearch, crtDFS } from "./searchConfig";
import { usePagination } from "@/hooks/usePagination";
import { fmtTs } from "@/utils/dateFormat";

const store = useMemship();

export function useColumns(uid: number) {
  const searchState = ref(crtDFS);
  const { searchVal } = useSearch(searchState.value, uid);
  const searchParam = ref(searchVal.value);

  const dtLst = ref([]);

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

  const statusMap = {
    1: { text: "成功", color: "text-green-600" },
    2: { text: "失败", color: "text-red-700" }
  };
  const opStMap = {
    login: { text: "登录", color: "text-blue-500" },
    loginout: { text: "登出", color: "text-red-500" },
    profile: { text: "签名", color: "text-green-500" },
    avatar: { text: "头像", color: "text-orange-400" },
    phone: { text: "手机号", color: "text-orange-500" },
    skinType: { text: "背景图", color: "text-orange-500" },
    nickname: { text: "昵称", color: "text-orange-500" }
  };

  const columns = [
    {
      label: "会员行为",
      prop: "oparate",
      width: 150,
      cellRenderer: ({ row }) => {
        const status = opStMap[row.status] || {
          text: "--",
          color: "text-gray-400"
        };
        return <span class={`${status.color} font-medium`}>{status.text}</span>;
      }
    },
    {
      label: "操作状态",
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
      label: "用户IP/归属地",
      prop: "address",
      width: 200,
      formatter: row => `${row.ip || "--"}/${row.area || "--"}`
    },
    {
      label: "客户端",
      prop: "client",
      width: 140,
      formatter: row => `${row.client || "--"}`
    },
    {
      label: "操作时间",
      prop: "oprateTime",
      width: 160,
      formatter: row =>
        `${fmtTs(row.oprateTime, "YYYY-MM-DD HH:mm:ss.SSS") || "--"}`
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

  return {
    loading,
    columns,
    dtLst,
    pagination,
    lodConf,
    adapConf,

    onSzChg,
    onCurChg,
    setData,
    getList,
    onPrmUp
  };
}
