import type {
  LoadingConfig,
  AdaptiveConfig,
  PaginationProps
} from "@pureadmin/table";
import { ref, reactive } from "vue";
import { fmtTs } from "@/utils/dateFormat";

/**
 * 列表相关配置和方法
 * @param handleTagClick - 会员标识点击处理函数
 */
export function useColumns() {
  /**
   * 基础数据
   */
  const dataList = ref([]);
  const loading = ref(true);

  /**
   * 表格列配置
   */
  const columns = [
    {
      label: "ID",
      prop: "id",
      width: 100,
      formatter: row => `${row.id || "--"}`
    },
    {
      label: "活动标签",
      prop: "name",
      formatter: row => `${row.name || "--"}`
    },
    {
      label: "进行中活动数量",
      prop: "ProcessingActivityNum",
      formatter: row => `${row.ProcessingActivityNum || "--"}`
    },
    {
      label: "排序",
      prop: "order",
      formatter: row => `${row.order || "--"}`
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
      label: "状态",
      prop: "status",
      formatter: row => `${row.status || "--"}`
    },
    {
      label: "备注",
      prop: "remark",
      formatter: row => `${row.remark || "--"}`
    },
    {
      label: "操作",
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
    pageSizes: [10, 30, 60],
    total: 0,
    align: "right",
    background: true
  });

  /**
   * 加载动画配置
   */
  const lodConf = reactive<LoadingConfig>({
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
  const adapConf: AdaptiveConfig = {
    offsetBottom: 110,
    fixHeader: false
  };

  /**
   * 分页方法
   */
  // 切换每页显示数量
  const onSzChg = (val: number) => {
    pagination.pageSize = val;
    pagination.currentPage = 1;
    return {
      page: pagination.currentPage,
      pageSize: val
    };
  };

  // 切换页码
  const onCurChg = (val: number) => {
    pagination.currentPage = val;
    lodConf.text = `正在加载第${val}页...`;
    loading.value = true;
    return {
      page: val,
      pageSize: pagination.pageSize
    };
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
    lodConf,
    adapConf,
    onSzChg,
    onCurChg,
    setData
  };
}
