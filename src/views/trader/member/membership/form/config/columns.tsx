import { ref } from "vue";
import { ExcelExporter } from "@/components/CgExportExcel";
import { message } from "@/utils/message";
import type { FieldValues } from "plus-pro-components";
import { useMembership } from "../store";
import { useSearch, crtDFS } from "./searchConfig";
import { usePagination } from "@/hooks/usePagination";
import { fmtTs } from "@/utils/dateFormat";

const store = useMembership();

// 初始查询参数
const searchState = ref(crtDFS);
const { searchVal } = useSearch(searchState.value);
const searchParam = ref(searchVal.value);

export function useColumns() {
  /**
   * 状态管理
   */
  const dataList = ref([]);
  // const dialogVis = ref(false);
  // const curTag = ref<Record<string, any> | null>(null);
  const addMebVis = ref(false);
  const dtlsVis = ref(false);
  const curRow = ref<Record<string, any>>({});

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
    1: { text: "正常", color: "text-green-600" },
    2: { text: "资金冻结", color: "text-orange-400" },
    3: { text: "禁止登录", color: "text-orange-600" },
    4: { text: "黑名单", color: "text-gray-400" },
    5: { text: "封禁", color: "text-red-700" }
  };

  /**
   * 事件处理
   */
  // const handleTagClick = (tag: Record<string, any>) => {
  //   curTag.value = tag;
  //   dialogVis.value = true;
  // };

  /**
   * 表格列配置
   */
  const columns = [
    {
      label: "UID/账号/会员标识",
      prop: "date",
      width: 150,
      cellRenderer: ({ row }) => (
        <div class="flex flex-col gap-2">
          {row.uid || "--"}/{row.account || "--"}
          {row.sign == 2 ? (
            <span
              class="cursor-pointer text-blue-500 hover:text-blue-700 hover:underline transition-colors duration-300"
              // onClick={() => handleTagClick(row)}
            >
              会员标识
            </span>
          ) : (
            <span class="text-gray-400">未知</span>
          )}
        </div>
      )
    },
    {
      label: "真实姓名",
      prop: "real_name",
      width: 90,
      formatter: row => `${row.real_name || "--"}`
    },
    {
      label: "上级代理UID/上级代理账号",
      prop: "address",
      width: 200,
      formatter: row => `${row.parent_id || "--"}/${row.invite_member || "--"}`
    },
    {
      label: "邀请人UID/账号",
      prop: "invite_memberid",
      width: 140,
      cellRenderer: ({ row }) => (
        <div>
          <span class="text-blue-500">{row.available_balance || "--"}</span>
          <span>/{row.reg_source || "--"}</span>
        </div>
      )
    },
    {
      label: "账户钱包余额",
      prop: "moneyLeft",
      width: 110,
      formatter: row => `${row.moneyLeft || "--"}`
    },
    {
      label: "存款总额/次",
      prop: "totalSave",
      width: 110,
      formatter: row => `${row.totalSave || "--"}/${row.totalTimes}次`
    },
    {
      label: "提款总额/次",
      prop: "drawMoney",
      width: 110,
      formatter: row => `${row.drawMoney || "--"}/${row.drawTimes}次`
    },
    {
      label: "存取款差额",
      prop: "saveDiffDraw",
      width: 100,
      formatter: row => `${row.saveDiffDraw || "--"}`
    },
    {
      label: "注册时间/ip",
      prop: "regTime",
      width: 160,
      formatter: row => `${fmtTs(row.regTime)}/${row.regIp || "--"}`
    },
    {
      label: "最后登陆时间/IP",
      prop: "lastLoginTime",
      width: 160,
      formatter: row => `${fmtTs(row.lastLoginTime)}/${row.lastLoginIp || "--"}`
    },
    {
      label: "账号状态",
      prop: "status",
      width: 90,
      cellRenderer: ({ row }) => {
        const status = statusMap[row.status] || {
          text: "--",
          color: "text-gray-400"
        };
        return <span class={`${status.color} font-medium`}>{status.text}</span>;
      }
    },
    {
      label: "会员层级",
      prop: "member_type",
      width: 100,
      formatter: row => `${row.member_type || "--"}`
    },
    {
      label: "操作",
      width: "120",
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
   * 会员管理方法
   */
  const onAdd = () => {
    addMebVis.value = true;
  };

  const onAddSub = async (formValues: FieldValues) => {
    console.log("---ee---");
    try {
      const res = await store.add(formValues as object);
      if (res?.code === 0) {
        message("添加成功", { type: "success", showClose: true });
        await getList(searchParam.value);
      } else {
        message("添加失败", { type: "error" });
      }
    } catch (error) {
      console.error("添加失败:", error);
      message("添加失败", { type: "error" });
    }
    addMebVis.value = false;
  };

  /**
   * 详情处理
   */
  const onDetail = (row: any) => {
    curRow.value = row;
    dtlsVis.value = true;
  };

  /**
   * 导出处理
   */
  const expExcel = (data: any[]) => {
    ExcelExporter.exportToExcel({
      columns,
      data,
      fileName: "会员数据报表"
    });
  };

  return {
    // 状态
    loading,
    columns,
    dataList,
    pagination,
    lodConf,
    adapConf,
    // dialogVis,
    // curTag,
    addMebVis,
    dtlsVis,
    curRow,
    // 方法
    onSzChg,
    onCurChg,
    expExcel,
    setData,
    getList,
    onPrmUp,
    onAdd,
    onAddSub,
    onDetail
  };
}
