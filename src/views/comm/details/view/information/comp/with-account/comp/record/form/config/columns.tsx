import { ref } from "vue";
import { message } from "@/utils/message";
import { usePagination } from "@/hooks/usePagination";
import { useInfoWithAcct } from "../store";
const store = useInfoWithAcct();

const searchParam = ref();

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

  const columns = [
    {
      label: "姓名",
      prop: "id",
      formatter: row => `${row.id || "--"}`
    },
    {
      label: "卡号",
      prop: "uid",
      cellRenderer: ({ row }) => (
        <div class="flex flex-col gap-2">
          {row.uid || "--"}/{row.account || "--"}
        </div>
      )
    },
    {
      label: "银行",
      prop: "walletBalance",
      formatter: row => `${row.walletBalance || "--"}`
    },
    {
      label: "开户行",
      prop: "convertAmount",
      formatter: row => `${row.convertAmount || "--"}`
    },
    {
      label: "删除",
      width: "120",
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

  /**
   * 通过处理
   */
  const onPass = async (params = searchParam.value) => {
    try {
      const res = await store.pass(params as object);
      if (res?.code === 0) {
        params.states == 1 ? "通过" : "取消";
        message("操作成功", { type: "success" });
        getList(searchParam.value);
      } else {
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
    onPass,
    onSzChg,
    onCurChg,
    setData,
    getList
  };
}
