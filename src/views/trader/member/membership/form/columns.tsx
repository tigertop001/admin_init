import type {
  LoadingConfig,
  AdaptiveConfig,
  PaginationProps
} from "@pureadmin/table";
import { ref, reactive } from "vue";
import { ExcelExporter } from "@/components/CgExportExcel";

/**
 * 会员列表相关配置和方法
 * @param handleTagClick - 会员标识点击处理函数
 */
export function useColumns(handleTagClick?: (tag: string) => void) {
  /**
   * 基础数据
   */
  const dataList = ref([]);
  const loading = ref(true);

  /**
   * 账号状态映射配置
   */
  const statusMap = {
    0: { text: "正常", color: "text-green-600" },
    1: { text: "资金冻结", color: "text-orange-400" },
    2: { text: "禁止登录", color: "text-orange-600" },
    3: { text: "封禁", color: "text-red-700" },
    4: { text: "黑名单", color: "text-gray-400" }
  };

  /**
   * 表格列配置
   */
  const columns = [
    {
      label: "UID/账号/会员标识",
      prop: "date",
      width: 180,
      cellRenderer: ({ row }) => (
        <div class="flex flex-col gap-2">
          {row.memberid || "--"}/{row.member || "--"}
          {row.tag ? (
            <span
              class="cursor-pointer text-blue-500 hover:text-blue-700 hover:underline transition-colors duration-300"
              onClick={() => handleTagClick?.(row.tag)}
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
      width: 180,
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
      width: 150,
      cellRenderer: ({ row }) => (
        <div>
          <span class="text-blue-500">{row.available_balance || "--"}</span>
          <span>/{row.reg_source}次</span>
        </div>
      )
    },
    {
      label: "账户钱包余额",
      prop: "available_balance",
      width: 150,
      formatter: row => `${row.available_balance || "--"}/${row.reg_source}次`
    },
    {
      label: "存款总额/次",
      prop: "subtract",
      width: 150,
      formatter: row => `${row.subtract || "--"}/${row.reg_source}次`
    },
    {
      label: "提款总额/次",
      prop: "third_money",
      width: 150,
      formatter: row => `${row.invite_memberid || "--"}/${row.reg_source}次`
    },
    {
      label: "存取款差额",
      prop: "total_recharge_amount",
      width: 150,
      formatter: row => `${row.total_recharge_amount || "--"}`
    },
    {
      label: "注册时间/ip",
      prop: "reg_time",
      width: 180,
      formatter: row => `${row.reg_time || "--"}`
    },
    {
      label: "最后登陆时间/IP",
      prop: "reg_ip",
      width: 180,
      formatter: row => `${row.reg_ip || "--"}`
    },
    {
      label: "账号状态",
      prop: "memberStatus",
      width: 180,
      cellRenderer: ({ row }) => {
        const status = statusMap[row.memberStatus] || {
          text: "--",
          color: "text-gray-400"
        };
        return <span class={`${status.color} font-medium`}>{status.text}</span>;
      }
    },
    {
      label: "会员层级",
      prop: "member_type",
      formatter: row => `${row.member_type || "--"}`
    },
    {
      label: "操作",
      width: "120",
      fixed: "right",
      slot: "operation"
    }
  ];

  /**
   * 分页配置
   */
  const pagination = reactive<PaginationProps>({
    pageSize: 10,
    currentPage: 1,
    pageSizes: [15, 30, 60],
    total: 0,
    align: "right",
    background: true
  });

  /**
   * 加载动画配置
   */
  const loadingConfig = reactive<LoadingConfig>({
    text: "正在加载第一页...",
    viewBox: "-10, -10, 50, 50",
    spinner: `
        <path class="path" d="
          M 30 15
          L 28 17
          M 25.61 25.61
          A 15 15, 0, 0, 1, 15 30
          A 15 15, 0, 1, 1, 27.99 7.5
          L 15 15
        " style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/>
      `
  });

  /**
   * 自适应高度配置
   */
  const adaptiveConfig: AdaptiveConfig = {
    offsetBottom: 110,
    fixHeader: false
  };

  /**
   * 分页方法
   */
  // 切换每页显示数量
  const onSizeChange = (val: number) => {
    pagination.pageSize = val;
    pagination.currentPage = 1;
    return {
      page: pagination.currentPage,
      pageSize: val
    };
  };

  // 切换页码
  const onCurrentChange = (val: number) => {
    pagination.currentPage = val;
    loadingConfig.text = `正在加载第${val}页...`;
    loading.value = true;
    return {
      page: val,
      pageSize: pagination.pageSize
    };
  };

  /**
   * 数据处理方法
   */
  // 导出excel表
  const exportExcel = (data: any[]) => {
    ExcelExporter.exportToExcel({
      columns,
      data,
      fileName: "会员数据报表"
    });
  };

  // 设置表格数据
  const setData = (data: any[], total: number) => {
    dataList.value = data;
    pagination.total = total;
    loading.value = false;
  };

  return {
    loading,
    columns,
    dataList,
    pagination,
    loadingConfig,
    adaptiveConfig,
    onSizeChange,
    onCurrentChange,
    exportExcel,
    setData
  };
}
