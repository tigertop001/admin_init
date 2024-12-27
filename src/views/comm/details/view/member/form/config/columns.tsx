import { ref } from "vue";
import { message } from "@/utils/message";
import { useMemship } from "../store";
import { useSearch, crtDFS } from "./searchConfig";
import { usePagination } from "@/hooks/usePagination";
import { fmtTs } from "@/utils/dateFormat";

const store = useMemship();

export function useColumns(uid: number) {
  // 初始查询参数
  const searchState = ref(crtDFS);
  const { searchVal } = useSearch(searchState.value, uid);
  const searchParam = ref(searchVal.value);
  /**
   * 状态管理
   */
  const dataList = ref([]);

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

  /**
   * 表格列配置
   */
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

  return {
    // 状态
    loading,
    columns,
    dataList,
    pagination,
    lodConf,
    adapConf,
    // 方法
    onSzChg,
    onCurChg,
    setData,
    getList,
    onPrmUp
  };
}
