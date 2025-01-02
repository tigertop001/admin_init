import { delObjectProperty } from "@pureadmin/utils";
import { ref, computed, Fragment } from "vue";
import { message } from "@/utils/message";
import { fmtTs } from "@/utils/dateFormat";
import { IconifyIconOffline } from "@/components/ReIcon";
import Subtract from "@iconify-icons/ri/indeterminate-circle-line";
import { usePagination } from "@/hooks/usePagination";

import { crtDFS } from "./searchConfig";
const searchParam = ref(crtDFS());

interface Option<T = any> {
  value: T;
  text: string;
}

interface BaseObject {
  [key: string]: Option | string | number | boolean | null;
}

/**
 * 列表相关配置和方法
 *
 */
export function useColumns(store: any) {
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
  const infoData = ref<BaseObject>({});

  const setData = (data: any[], total: number) => {
    dtLst.value = data;
    setTotal(total);
    setLd(false);
  };

  const getList = async (params = searchParam.value) => {
    try {
      const res = await store.list(params);
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

  // 设置信息
  const getInfo = async () => {
    try {
      const res = await store.info();
      if (res?.code === 0) {
        const data = res.data;
        infoData.value = {
          ...data,
          settleCycle: data.settleCycle === 1 ? "日" : "周",
          isSettle: data.isSettle === 1 ? "否" : "是"
        };
      } else {
        setData([], 0);
        message("未找到数据", { type: "error" });
      }
    } catch (error) {
      console.error("获取数据失败:", error);
      message("获取数据失败", { type: "error" });
    }
  };

  // 刷新相关状态
  const isSpin = ref(false);

  // 刷新处理
  const refresh = () => {
    isSpin.value = true;
    setTimeout(async () => {
      await getList(searchParam.value);
      isSpin.value = false;
    }, 1000);
  };

  // 计算属性
  const refIconCls = computed(() => [
    "text-red-600 cursor-pointer transition-all duration-500 hover:opacity-60",
    { "animate-spin": isSpin.value }
  ]);

  const onEdit = (row, index) => {
    dtLst.value[index] = Object.assign({ ...row, editable: true });
  };
  interface SaveParams {
    id?: number;
    name: string;
    profitRate: string | number;
    totalPerformance: string | number;
    level: number;
  }

  const onSave = async (row, index) => {
    try {
      let res;
      const params: SaveParams = {
        name: row.name,
        profitRate: row.profitRate,
        totalPerformance: row.totalPerformance,
        level: Number(row.level)
      };

      // 如果有id则是编辑，否则是新增
      if (row.id !== undefined) {
        params.id = row.id;
        res = await store.edit(params);
      } else {
        res = await store.add(params);
      }

      if (res?.code === 0) {
        message("操作成功", { type: "success" });
        getList(searchParam.value);
      } else {
        message(res?.msg || "操作失败", { type: "error" });
      }
    } catch (error) {
      console.error("操作失败:", error);
      message("操作失败", { type: "error" });
    }
    dtLst.value[index].editable = false;
  };
  const onCxl = index => {
    dtLst.value[index].editable = false;
    dtLst.value[index] = delObjectProperty(dtLst.value[index], "editable");
  };

  const onAdd = () => {
    dtLst.value.push({
      level: null,
      name: null,
      totalPerformance: null,
      profitRate: null,
      operatorID: null
    });
  };

  const onDel = row => {
    const index = dtLst.value.indexOf(row);
    if (index !== -1) dtLst.value.splice(index, 1);
  };

  const columns = [
    {
      label: "序号",
      prop: "id",
      width: 100,
      cellRenderer: ({ index }) => <p>{index + 1}</p>
    },
    {
      label: "级别名称",
      prop: "name",
      cellRenderer: ({ row, index }) => (
        <Fragment>
          {dtLst.value[index]?.editable ? (
            <el-input v-model={row.name} />
          ) : (
            <p>{row.name || "--"}</p>
          )}
        </Fragment>
      )
    },
    {
      label: "业绩≥",
      prop: "totalPerformance",
      cellRenderer: ({ row, index }) => (
        <Fragment>
          {dtLst.value[index]?.editable ? (
            <el-input v-model={row.totalPerformance} type="number" />
          ) : (
            <p>{row.totalPerformance || "--"}</p>
          )}
        </Fragment>
      )
    },
    {
      label: "万/返佣",
      prop: "profitRate",
      cellRenderer: ({ row, index }) => (
        <Fragment>
          {dtLst.value[index]?.editable ? (
            <el-input v-model={row.profitRate} />
          ) : (
            <p>{row.profitRate || "--"}</p>
          )}
        </Fragment>
      )
    },
    {
      label: "操作人",
      prop: "operatorID",
      cellRenderer: ({ row }) => <Fragment>{row.operatorID || "--"}</Fragment>
    },
    {
      label: "最后操作时间",
      prop: "updatedAt",
      sortable: true,
      cellRenderer: ({ row }) => (
        <Fragment>
          {fmtTs(row.updatedAt, "YYYY-MM-DD HH:mm:ss.SSS") || "--"}
        </Fragment>
      ),
      minWidth: 110
    },
    {
      label: "操作",
      width: "120",
      fixed: "right",
      slot: "operation"
    },
    {
      fixed: "right",
      width: "45",
      cellRenderer: ({ row }) => (
        <IconifyIconOffline
          width={22}
          icon={Subtract}
          class="cursor-pointer hover:opacity-60"
          onClick={() => onDel(row)}
        />
      )
    }
  ];

  return {
    loading,
    columns,
    dtLst,
    pagination,
    lodConf,
    adapConf,
    onEdit,
    onSave,
    onCxl,
    onAdd,
    onDel,
    onSzChg,
    onCurChg,
    getList,
    getInfo,
    refresh,
    infoData,
    isSpin,
    refIconCls
  };
}
