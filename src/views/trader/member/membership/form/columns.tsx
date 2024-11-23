import type {
  LoadingConfig,
  AdaptiveConfig,
  PaginationProps
} from "@pureadmin/table";
import { ref, onMounted, reactive } from "vue";
import { delay } from "@pureadmin/utils";
import { message } from "@/utils/message";
import { ExcelExporter } from "@/components/CgExportExcel"; // 导入封装的组件

import { useMembership } from "../store"; // 确保这个导入是正确的

export function useColumns(handleTagClick?: (tag: string) => void) {
  const dataList = ref([]);
  const loading = ref(true);
  const columns: TableColumnList = [
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
      formatter: row => {
        return `${row.real_name || "--"}`;
      }
    },
    {
      label: "上级代理UID/上级代理账号",
      prop: "address",
      width: 200,
      formatter: row => {
        return `${row.parent_id || "--"}/${row.invite_member || "--"}`;
      }
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
      formatter: row => {
        return `${row.available_balance || "--"}/${row.reg_source}次`;
      }
    },
    {
      label: "存款总额/次",
      prop: "subtract",
      width: 150,
      formatter: row => {
        return `${row.subtract || "--"}/${row.reg_source}次`;
      }
    },
    {
      label: "提款总额/次",
      prop: "third_money",
      width: 150,
      formatter: row => {
        return `${row.invite_memberid || "--"}/${row.reg_source}次`;
      }
    },
    {
      label: "存取款差额",
      prop: "total_recharge_amount",
      width: 150,
      formatter: row => {
        return `${row.total_recharge_amount || "--"}`;
      }
    },
    {
      label: "注册时间/ip",
      prop: "reg_time",
      width: 180,
      formatter: row => {
        return `${row.reg_time || "--"}`;
      }
    },
    {
      label: "最后登陆时间/IP",
      prop: "reg_ip",
      width: 180,
      formatter: row => {
        return `${row.reg_ip || "--"}`;
      }
    },
    {
      label: "账号状态",
      prop: "memberStatus",
      width: 180,
      cellRenderer: ({ row }) => {
        // 状态映射配置
        const statusMap = {
          0: { text: "正常", color: "text-green-600" },
          1: { text: "资金冻结", color: "text-orange-400" },
          2: { text: "禁止登录", color: "text-orange-600" },
          3: { text: "封禁", color: "text-red-700" },
          4: { text: "黑名单", color: "text-gray-400" }
        };
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
      formatter: row => {
        return `${row.member_type || "--"}`;
      }
    },
    {
      label: "操作",
      width: "120",
      fixed: "right",
      slot: "operation"
    }
  ];

  /** 分页配置 */
  const pagination = reactive<PaginationProps>({
    pageSize: 10,
    currentPage: 1,
    pageSizes: [15, 30, 60],
    total: 0,
    align: "right",
    background: true
  });

  /** 加载动画配置 */
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
    // svg: "",
    // background: rgba(220, 190, 29, 0.6)
  });

  /** 撑满内容区自适应高度相关配置 */
  const adaptiveConfig: AdaptiveConfig = {
    /** 表格距离页面底部的偏移量，默认值为 `96` */
    offsetBottom: 110,
    /** 是否固定表头，默认值为 `true`（如果不想固定表头，fixHeader设置为false并且表格要设置table-layout="auto"） */
    fixHeader: false
    /** 页面 `resize` 时的防抖时间，默认值为 `60` ms */
    // timeout: 60
    /** 表头的 `z-index`，默认值为 `100` */
    // zIndex: 100
  };

  function onSizeChange(val) {
    console.log("onSizeChange", val);
  }

  function onCurrentChange(val) {
    loadingConfig.text = `正在加载第${val}页...`;
    loading.value = true;
    delay(600).then(() => {
      loading.value = false;
    });
  }

  // 导出excel表
  const exportExcel = (data: any[]) => {
    ExcelExporter.exportToExcel({
      columns,
      data,
      fileName: "会员数据报表"
    });
  };

  onMounted(async () => {
    const store = useMembership(); // 获取 store 实例
    const param = {}; // 你可以在这里传入需要的参数
    // 使用 await 获取数据并进行处理
    const res = await store.fetchMembershipList(param);
    // 确保 res 是 ResultTable 类型，并从中提取 data 数组
    if (res && res.data) {
      dataList.value = res.data; // 提取 res.data 数组并赋值给 dataList
      pagination.total = res.total || 0; // 确保 total 存在
    } else {
      dataList.value = []; // 如果没有数据，赋空数组
      pagination.total = 0; // 如果没有数据，总数为 0
      message("未找到数据", { type: "error" });
    }
    // 停止加载动画
    loading.value = false;
  });

  return {
    loading,
    columns,
    dataList,
    pagination,
    loadingConfig,
    adaptiveConfig,
    onSizeChange,
    onCurrentChange,
    exportExcel
  };
}
