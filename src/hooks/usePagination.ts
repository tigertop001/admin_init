import type {
  LoadingConfig,
  AdaptiveConfig,
  PaginationProps
} from "@pureadmin/table";
import { ref, reactive } from "vue";

export interface UsePaginationOptions {
  onPageChange: (params: Record<string, any>) => void;
}

export function usePagination({ onPageChange }: UsePaginationOptions) {
  const loading = ref(true);

  /**
   * 分页配置
   */
  const pagination = reactive<PaginationProps>({
    pageSize: 10,
    currentPage: 1,
    pageSizes: [1, 2, 3, 4, 5, 10, 20, 30, 60, 100],
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

  const adapConf: AdaptiveConfig = {
    offsetBottom: 110,
    fixHeader: false
  };

  /**
   * 更新搜索参数
   */
  const updateSearchParams = (currentPage: number, pageSize: number) => {
    return {
      start: pageSize * (currentPage - 1),
      limit: pageSize
    };
  };

  /**
   * 分页大小变化处理
   */
  const onSzChg = (val: number) => {
    pagination.pageSize = val;
    pagination.currentPage = 1;
    const params = updateSearchParams(pagination.currentPage, val);
    onPageChange(params);
  };

  /**
   * 页码变化处理
   */
  const onCurChg = (val: number) => {
    pagination.currentPage = val;
    lodConf.text = `正在加载第${val}页...`;
    loading.value = true;
    const params = updateSearchParams(val, pagination.pageSize);
    onPageChange(params);
  };

  /**
   * 设置加载状态
   */
  const setLd = (isLoading: boolean) => {
    loading.value = isLoading;
  };

  /**
   * 设置总数
   */
  const setTotal = (total: number) => {
    pagination.total = total;
  };

  return {
    loading,
    pagination,
    lodConf,
    adapConf,
    onSzChg,
    onCurChg,
    setLd,
    setTotal
  };
}
